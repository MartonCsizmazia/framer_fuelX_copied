import { useEffect, useRef } from 'react'
import './LiquidHover.css'

export interface LiquidHoverProps {
  image: { src: string; alt?: string }
  /** Simulation grid density. Framer control range ~1-10; Hero uses 4. */
  resolution?: number
  /** Radius of the cursor's velocity splat. Framer control 0-1; Hero uses 0.5. */
  cursorSize?: number
  /** Strength of the velocity splat. Framer control 0-1; Hero uses 1. */
  cursorPower?: number
  /** How far the fluid velocity displaces the image UVs. Framer control 0-1; Hero uses 0.8. */
  distortionPower?: number
}

// Fullscreen-quad vertex shader shared by every pass.
const VERTEX_SHADER = `
precision highp float;

varying vec2 vUv;
attribute vec2 a_position;

varying vec2 vL;
varying vec2 vR;
varying vec2 vT;
varying vec2 vB;
uniform vec2 u_texel;

void main () {
  vUv = .5 * (a_position + 1.);
  vL = vUv - vec2(u_texel.x, 0.);
  vR = vUv + vec2(u_texel.x, 0.);
  vT = vUv + vec2(0., u_texel.y);
  vB = vUv - vec2(0., u_texel.y);
  gl_Position = vec4(a_position, 0., 1.);
}
`

// Injects a velocity/dye impulse at the cursor point.
const SPLAT_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D u_input_texture;
uniform float u_ratio;
uniform float u_img_ratio;
uniform vec3 u_point_value;
uniform vec2 u_point;
uniform float u_point_size;

void main () {
  vec2 p = vUv - u_point.xy;
  p.x *= u_ratio;
  vec3 splat = .6 * pow(2., -dot(p, p) / u_point_size) * u_point_value;
  vec3 base = texture2D(u_input_texture, vUv).xyz;
  gl_FragColor = vec4(base + splat, 1.);
}
`

const DIVERGENCE_SHADER = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_velocity_texture;

void main () {
  float L = texture2D(u_velocity_texture, vL).x;
  float R = texture2D(u_velocity_texture, vR).x;
  float T = texture2D(u_velocity_texture, vT).y;
  float B = texture2D(u_velocity_texture, vB).y;
  float div = .25 * (R - L + T - B);
  gl_FragColor = vec4(div, 0., 0., 1.);
}
`

const PRESSURE_SHADER = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_pressure_texture;
uniform sampler2D u_divergence_texture;

void main () {
  float L = texture2D(u_pressure_texture, vL).x;
  float R = texture2D(u_pressure_texture, vR).x;
  float T = texture2D(u_pressure_texture, vT).x;
  float B = texture2D(u_pressure_texture, vB).x;
  float divergence = texture2D(u_divergence_texture, vUv).x;
  float pressure = (L + R + B + T - divergence) * .25;
  gl_FragColor = vec4(pressure, 0., 0., 1.);
}
`

const GRADIENT_SUBTRACT_SHADER = `
precision highp float;
precision highp sampler2D;

varying highp vec2 vUv;
varying highp vec2 vL;
varying highp vec2 vR;
varying highp vec2 vT;
varying highp vec2 vB;
uniform sampler2D u_pressure_texture;
uniform sampler2D u_velocity_texture;

void main () {
  float L = texture2D(u_pressure_texture, vL).x;
  float R = texture2D(u_pressure_texture, vR).x;
  float T = texture2D(u_pressure_texture, vT).x;
  float B = texture2D(u_pressure_texture, vB).x;
  vec2 velocity = texture2D(u_velocity_texture, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  gl_FragColor = vec4(velocity, 0., 1.);
}
`

const ADVECTION_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform sampler2D u_velocity_texture;
uniform sampler2D u_input_texture;
uniform vec2 u_texel;
uniform vec2 u_output_textel;
uniform float u_dt;
uniform float u_dissipation;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
  vec2 coord = vUv - u_dt * bilerp(u_velocity_texture, vUv, u_texel).xy * u_texel;
  vec4 velocity = bilerp(u_input_texture, coord, u_output_textel);
  gl_FragColor = u_dissipation * velocity;
}
`

// Final pass: samples the source image through the accumulated velocity
// field as a UV offset, producing the liquid ripple/distortion.
const DISPLAY_SHADER = `
precision highp float;
precision highp sampler2D;

varying vec2 vUv;
uniform float u_ratio;
uniform float u_img_ratio;
uniform float u_disturb_power;
uniform sampler2D u_output_texture;
uniform sampler2D u_velocity_texture;
uniform sampler2D u_text_texture;
uniform vec2 u_point;
uniform float u_canvas_scale;
uniform float u_inner_scale;

vec2 get_img_uv() {
  vec2 uv = vUv - 0.5;
  uv *= u_canvas_scale;
  uv /= u_inner_scale;
  float containerAspect = u_ratio;
  float imageAspect = u_img_ratio;
  vec2 scale = vec2(1.0);
  if (containerAspect > imageAspect) {
    scale.y = imageAspect / containerAspect;
  } else {
    scale.x = containerAspect / imageAspect;
  }
  uv *= scale;
  return uv + 0.5;
}

vec2 get_frame_uv() {
  vec2 uv = vUv - 0.5;
  uv *= u_canvas_scale;
  uv /= u_inner_scale;
  return uv + 0.5;
}

float get_img_frame_alpha(vec2 uv, float img_frame_width) {
  float img_frame_alpha = smoothstep(0., img_frame_width, uv.x) * smoothstep(1., 1. - img_frame_width, uv.x);
  img_frame_alpha *= smoothstep(0., img_frame_width, uv.y) * smoothstep(1., 1. - img_frame_width, uv.y);
  return img_frame_alpha;
}

vec3 sample_image_smooth(vec2 uv) {
  vec2 uvc = clamp(uv, 0.0, 1.0);
  vec3 base = texture2D(u_text_texture, vec2(uvc.x, 1.0 - uvc.y)).rgb;

  float yBelow = step(uv.y, 0.0);
  float yAbove = step(1.0, uv.y);
  float xLeft = step(uv.x, 0.0);
  float xRight = step(1.0, uv.x);
  float outOfBounds = max(max(yBelow, yAbove), max(xLeft, xRight));

  if (outOfBounds > 0.0) {
    float d = 0.002;
    vec3 sum = vec3(0.0);
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y - d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x - d, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;
    sum += texture2D(u_text_texture, vec2(clamp(uvc.x + d, 0.0, 1.0), 1.0 - clamp(uvc.y + d, 0.0, 1.0))).rgb;
    base = sum / 9.0;
  }
  return base;
}

void main () {
  float offset = texture2D(u_output_texture, vUv).r;

  vec2 velocity = texture2D(u_velocity_texture, vUv).xy;
  velocity += .001;

  vec2 img_uv = get_img_uv();
  img_uv -= u_disturb_power * normalize(velocity) * offset;
  img_uv -= u_disturb_power * normalize(velocity) * offset;

  vec2 frame_uv = get_frame_uv();
  frame_uv -= u_disturb_power * normalize(velocity) * offset;

  vec3 img = sample_image_smooth(img_uv);
  float opacity = get_img_frame_alpha(frame_uv, .002);
  gl_FragColor = vec4(img * opacity, opacity);
}
`

interface FBO {
  fbo: WebGLFramebuffer
  width: number
  height: number
  attach(unit: number): number
}
interface DoubleFBO {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: () => FBO
  write: () => FBO
  swap: () => void
}
interface GLProgram {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation | null>
}

/**
 * Ported from Framer's "Liquid Hover" component — recovered verbatim
 * (shaders included) from the captured production bundle. It's a small
 * real-time GPU fluid simulation (velocity splat -> divergence -> pressure
 * solve -> gradient subtract -> advection) whose resulting velocity field
 * is used to displace the image's UVs, producing the ripple/distortion
 * that follows the cursor. Constants (dissipation rates, iteration count,
 * splat scale, canvas overscan) are copied as-is from source, not re-tuned.
 */
export default function LiquidHover({
  image,
  resolution = 5,
  cursorSize = 0.5,
  cursorPower = 0.5,
  distortionPower = 0.4,
}: LiquidHoverProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const gl = canvas.getContext('webgl', { alpha: true })
    if (!gl) return

    gl.getExtension('OES_texture_float')
    gl.getExtension('OES_texture_float_linear')
    // Not required by source, but some WebGL1 implementations need this to
    // allow rendering (not just sampling) float textures — requesting it is
    // a no-op where unsupported/unnecessary.
    gl.getExtension('WEBGL_color_buffer_float') || gl.getExtension('EXT_color_buffer_float')
    gl.clearColor(0, 0, 0, 0)

    // Framer's control ranges (0.1-1) remapped to the simulation's own units.
    const params = {
      cursorSize: 0.5 + (cursorSize - 0.1) * 4.5 / 0.9,
      cursorPower: 5 + (cursorPower - 0.1) * 45 / 0.9,
      distortionPower,
    }

    const CANVAS_OVERSCAN = 1.2 // canvas is rendered 120% of the container, offset -10%/-10%
    const pointer = { x: 0.65 * wrapper.clientWidth, y: 0.5 * wrapper.clientHeight, dx: 0, dy: 0, moved: false }
    const simSize = { w: 0, h: 0 }
    let velocity: DoubleFBO
    let dye: DoubleFBO
    let divergence: FBO
    let pressure: DoubleFBO
    let imageTexture: WebGLTexture | null = null
    let imageAspect = 1
    let isActive = false

    function compileShader(source: string, type: number): WebGLShader {
      const shader = gl!.createShader(type)!
      gl!.shaderSource(shader, source)
      gl!.compileShader(shader)
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        const info = gl!.getShaderInfoLog(shader) || 'Shader compile error'
        gl!.deleteShader(shader)
        throw new Error(info)
      }
      return shader
    }

    function createProgram(vertSrc: string, fragSrc: string): GLProgram {
      const program = gl!.createProgram()!
      const vert = compileShader(vertSrc, gl!.VERTEX_SHADER)
      const frag = compileShader(fragSrc, gl!.FRAGMENT_SHADER)
      gl!.attachShader(program, vert)
      gl!.attachShader(program, frag)
      gl!.bindAttribLocation(program, 0, 'a_position')
      gl!.linkProgram(program)
      if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
        throw new Error(gl!.getProgramInfoLog(program) || 'Program link error')
      }
      const uniforms: Record<string, WebGLUniformLocation | null> = {}
      const count = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS)
      for (let i = 0; i < count; i++) {
        const info = gl!.getActiveUniform(program, i)
        if (info) uniforms[info.name] = gl!.getUniformLocation(program, info.name)
      }
      return { program, uniforms }
    }

    function drawQuad(target: FBO | null = null) {
      const posBuf = gl!.createBuffer()
      gl!.bindBuffer(gl!.ARRAY_BUFFER, posBuf)
      gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl!.STATIC_DRAW)
      const idxBuf = gl!.createBuffer()
      gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, idxBuf)
      gl!.bufferData(gl!.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl!.STATIC_DRAW)
      gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0)
      gl!.enableVertexAttribArray(0)
      if (target == null) {
        gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
      } else {
        gl!.viewport(0, 0, target.width, target.height)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
      }
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0)
    }

    function createFBO(width: number, height: number): FBO {
      gl!.activeTexture(gl!.TEXTURE0)
      const texture = gl!.createTexture()!
      gl!.bindTexture(gl!.TEXTURE_2D, texture)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
      gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGB, width, height, 0, gl!.RGB, gl!.FLOAT, null)
      const fbo = gl!.createFramebuffer()!
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
      gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0)
      const fbStatus = gl!.checkFramebufferStatus(gl!.FRAMEBUFFER)
      if (fbStatus !== gl!.FRAMEBUFFER_COMPLETE) {
        console.warn('[LiquidHover] incomplete framebuffer', fbStatus.toString(16), gl!.getError())
      }
      gl!.viewport(0, 0, width, height)
      gl!.clear(gl!.COLOR_BUFFER_BIT)
      return {
        fbo,
        width,
        height,
        attach(unit: number) {
          gl!.activeTexture(gl!.TEXTURE0 + unit)
          gl!.bindTexture(gl!.TEXTURE_2D, texture)
          return unit
        },
      }
    }

    function createDoubleFBO(width: number, height: number): DoubleFBO {
      let a = createFBO(width, height)
      let b = createFBO(width, height)
      return {
        width,
        height,
        texelSizeX: 1 / width,
        texelSizeY: 1 / height,
        read: () => a,
        write: () => b,
        swap() {
          const tmp = a
          a = b
          b = tmp
        },
      }
    }

    const splatProgram = createProgram(VERTEX_SHADER, SPLAT_SHADER)
    const divergenceProgram = createProgram(VERTEX_SHADER, DIVERGENCE_SHADER)
    const pressureProgram = createProgram(VERTEX_SHADER, PRESSURE_SHADER)
    const gradientSubtractProgram = createProgram(VERTEX_SHADER, GRADIENT_SUBTRACT_SHADER)
    const advectionProgram = createProgram(VERTEX_SHADER, ADVECTION_SHADER)
    const displayProgram = createProgram(VERTEX_SHADER, DISPLAY_SHADER)

    function resizeCanvas() {
      const cw = wrapper!.clientWidth
      const ch = wrapper!.clientHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas!.width = Math.max(2, Math.round(cw * CANVAS_OVERSCAN * dpr))
      canvas!.height = Math.max(2, Math.round(ch * CANVAS_OVERSCAN * dpr))
      const cssW = cw * CANVAS_OVERSCAN
      const cssH = ch * CANVAS_OVERSCAN
      canvas!.style.width = `${cssW}px`
      canvas!.style.height = `${cssH}px`
      const aspect = cssW / cssH
      const simBase = 128 + (resolution - 1) * 384 / 9
      simSize.w = Math.round(simBase * aspect)
      simSize.h = Math.round(simBase)
    }

    function allocateBuffers() {
      velocity = createDoubleFBO(simSize.w, simSize.h)
      dye = createDoubleFBO(simSize.w, simSize.h)
      divergence = createFBO(simSize.w, simSize.h)
      pressure = createDoubleFBO(simSize.w, simSize.h)
    }

    function pushPointer(x: number, y: number) {
      pointer.moved = true
      pointer.dx = 6 * (x - pointer.x)
      pointer.dy = 6 * (y - pointer.y)
      pointer.x = x
      pointer.y = y
    }

    function pointerUV() {
      const w = wrapper!.clientWidth * CANVAS_OVERSCAN
      const h = wrapper!.clientHeight * CANVAS_OVERSCAN
      const offsetX = 0.5 * (w - wrapper!.clientWidth)
      const offsetY = 0.5 * (h - wrapper!.clientHeight)
      return { u: (pointer.x + offsetX) / w, v: 1 - (pointer.y + offsetY) / h }
    }

    function loadImageTexture(src: string) {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = src
      img.onload = () => {
        imageAspect = img.naturalWidth / Math.max(1, img.naturalHeight)
        imageTexture = gl!.createTexture()
        gl!.bindTexture(gl!.TEXTURE_2D, imageTexture)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
        gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
        gl!.activeTexture(gl!.TEXTURE0)
        gl!.bindTexture(gl!.TEXTURE_2D, imageTexture)
        gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, img)
      }
    }

    function setupEvents() {
      const onEnter = () => { isActive = true }
      const onLeave = () => { isActive = false; pointer.moved = false }
      const onPointerMove = (e: MouseEvent) => {
        if (!isActive) return
        const rect = wrapper!.getBoundingClientRect()
        pushPointer(e.clientX - rect.left, e.clientY - rect.top)
      }
      const onTouchStart = () => { isActive = true }
      const onTouchEnd = () => { isActive = false; pointer.moved = false }
      const onTouchMove = (e: TouchEvent) => {
        isActive = true
        e.preventDefault()
        const touch = e.targetTouches[0]
        const rect = wrapper!.getBoundingClientRect()
        pushPointer(touch.clientX - rect.left, touch.clientY - rect.top)
      }
      const onResize = () => {
        resizeCanvas()
        allocateBuffers()
        if (imageTexture) gl!.bindTexture(gl!.TEXTURE_2D, imageTexture)
      }

      canvas!.addEventListener('mouseenter', onEnter)
      canvas!.addEventListener('mouseleave', onLeave)
      canvas!.addEventListener('click', onPointerMove)
      canvas!.addEventListener('mousemove', onPointerMove)
      canvas!.addEventListener('touchstart', onTouchStart, { passive: true })
      canvas!.addEventListener('touchend', onTouchEnd, { passive: true })
      canvas!.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('resize', onResize)
      const observer = new ResizeObserver(() => onResize())
      observer.observe(wrapper!)

      return () => {
        canvas!.removeEventListener('mouseenter', onEnter)
        canvas!.removeEventListener('mouseleave', onLeave)
        canvas!.removeEventListener('click', onPointerMove)
        canvas!.removeEventListener('mousemove', onPointerMove)
        canvas!.removeEventListener('touchstart', onTouchStart)
        canvas!.removeEventListener('touchend', onTouchEnd)
        canvas!.removeEventListener('touchmove', onTouchMove)
        window.removeEventListener('resize', onResize)
        observer.disconnect()
      }
    }

    function render() {
      const dt = 1 / 60

      if (pointer.moved) {
        pointer.moved = false
        gl!.useProgram(splatProgram.program)
        gl!.uniform1i(splatProgram.uniforms.u_input_texture, dye.read().attach(1))
        gl!.uniform1f(splatProgram.uniforms.u_ratio, wrapper!.clientWidth / Math.max(1, wrapper!.clientHeight))
        const uv = pointerUV()
        gl!.uniform2f(splatProgram.uniforms.u_point, uv.u, uv.v)
        gl!.uniform3f(splatProgram.uniforms.u_point_value, pointer.dx, -pointer.dy, 0)
        gl!.uniform1f(splatProgram.uniforms.u_point_size, params.cursorSize * 0.001)
        drawQuad(dye.write())
        dye.swap()

        gl!.uniform1i(splatProgram.uniforms.u_input_texture, velocity.read().attach(1))
        gl!.uniform3f(splatProgram.uniforms.u_point_value, params.cursorPower * 0.001, 0, 0)
        drawQuad(velocity.write())
        velocity.swap()
      }

      gl!.useProgram(divergenceProgram.program)
      gl!.uniform2f(divergenceProgram.uniforms.u_texel, dye.texelSizeX, dye.texelSizeY)
      gl!.uniform1i(divergenceProgram.uniforms.u_velocity_texture, dye.read().attach(1))
      drawQuad(divergence)

      gl!.useProgram(pressureProgram.program)
      gl!.uniform2f(pressureProgram.uniforms.u_texel, dye.texelSizeX, dye.texelSizeY)
      gl!.uniform1i(pressureProgram.uniforms.u_divergence_texture, divergence.attach(1))
      for (let i = 0; i < 16; i++) {
        gl!.uniform1i(pressureProgram.uniforms.u_pressure_texture, pressure.read().attach(2))
        drawQuad(pressure.write())
        pressure.swap()
      }

      gl!.useProgram(gradientSubtractProgram.program)
      gl!.uniform2f(gradientSubtractProgram.uniforms.u_texel, dye.texelSizeX, dye.texelSizeY)
      gl!.uniform1i(gradientSubtractProgram.uniforms.u_pressure_texture, pressure.read().attach(1))
      gl!.uniform1i(gradientSubtractProgram.uniforms.u_velocity_texture, dye.read().attach(2))
      drawQuad(dye.write())
      dye.swap()

      gl!.useProgram(advectionProgram.program)
      gl!.uniform2f(advectionProgram.uniforms.u_texel, dye.texelSizeX, dye.texelSizeY)
      gl!.uniform2f(advectionProgram.uniforms.u_output_textel, dye.texelSizeX, dye.texelSizeY)
      gl!.uniform1i(advectionProgram.uniforms.u_velocity_texture, dye.read().attach(1))
      gl!.uniform1i(advectionProgram.uniforms.u_input_texture, dye.read().attach(1))
      gl!.uniform1f(advectionProgram.uniforms.u_dt, dt)
      gl!.uniform1f(advectionProgram.uniforms.u_dissipation, 0.97)
      drawQuad(dye.write())
      dye.swap()

      gl!.useProgram(advectionProgram.program)
      gl!.uniform2f(advectionProgram.uniforms.u_output_textel, velocity.texelSizeX, velocity.texelSizeY)
      gl!.uniform1i(advectionProgram.uniforms.u_input_texture, velocity.read().attach(2))
      gl!.uniform1f(advectionProgram.uniforms.u_dt, 8 * dt)
      gl!.uniform1f(advectionProgram.uniforms.u_dissipation, 0.98)
      drawQuad(velocity.write())
      velocity.swap()

      gl!.useProgram(displayProgram.program)
      const uv = pointerUV()
      gl!.uniform2f(displayProgram.uniforms.u_point, uv.u, uv.v)
      gl!.uniform1i(displayProgram.uniforms.u_velocity_texture, dye.read().attach(2))
      gl!.uniform1f(displayProgram.uniforms.u_ratio, wrapper!.clientWidth / Math.max(1, wrapper!.clientHeight))
      gl!.uniform1f(displayProgram.uniforms.u_img_ratio, imageAspect)
      gl!.uniform1f(displayProgram.uniforms.u_disturb_power, params.distortionPower)
      gl!.uniform1i(displayProgram.uniforms.u_output_texture, velocity.read().attach(1))
      gl!.uniform1f(displayProgram.uniforms.u_canvas_scale, 1)
      gl!.uniform1f(displayProgram.uniforms.u_inner_scale, 0.8333333333333334)
      if (imageTexture) {
        gl!.activeTexture(gl!.TEXTURE0)
        gl!.bindTexture(gl!.TEXTURE_2D, imageTexture)
        gl!.uniform1i(displayProgram.uniforms.u_text_texture, 0)
      }
      drawQuad()
      gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight)
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
      gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0)

      rafRef.current = requestAnimationFrame(render)
    }

    resizeCanvas()
    allocateBuffers()
    const cleanupEvents = setupEvents()
    rafRef.current = requestAnimationFrame(render)
    loadImageTexture(image?.src || '')

    return () => {
      cancelAnimationFrame(rafRef.current)
      cleanupEvents()
    }
  }, [image?.src, resolution, cursorSize, cursorPower, distortionPower])

  return (
    <div ref={wrapperRef} className="liquid-hover">
      <canvas ref={canvasRef} className="liquid-hover__canvas" />
    </div>
  )
}
