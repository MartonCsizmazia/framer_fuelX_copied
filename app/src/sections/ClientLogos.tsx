import { useRef, useState } from 'react'
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion'
import { images } from '../assets/images'
import './ClientLogos.css'

/**
 * Recovered from the "Client Section" component (.framer-9weVr) — the
 * client-logo strip between About and Portfolio. Each logo sits in its own
 * 224x168px tile (background rgb(247,247,247), no gap between tiles) with
 * the logo image uniformly boxed to 104x16px — measured directly against
 * the mirror. The real source renders two different widgets depending on
 * breakpoint: this continuous marquee on desktop/tablet, and a
 * single-item auto-rotating carousel with dots on phone (not reproduced;
 * the marquee is reused across all breakpoints as a simpler stand-in).
 */
const logos = [
  images.assetFpupna,
  images.assetPtmk11,
  images.assetSji9he,
  images.asset4zx7dv,
  images.asset4wrdli,
]

// A 2x-duplicated track only tiles seamlessly while the viewport is narrower
// than one full set (5 tiles). Any wider than that — most desktop screens —
// and the loop's instantaneous reset back to 0% becomes visible as a
// pop/skip once the far edge of the duplicated content runs out mid-viewport.
// The source itself renders a very generously over-duplicated track for
// exactly this reason; mirroring that here with 8 copies keeps the reset
// point far outside the viewport on any realistic screen width, while
// translating by exactly one set's width (-12.5% of the 8x total) keeps the
// visual speed identical to the previous 2x/-50% version.
const SET_REPEAT = 8
const track = Array.from({ length: SET_REPEAT }, () => logos).flat()

// Seconds to travel exactly one set's width at normal speed — matches the
// previous fixed 25s keyframe duration. Driven by useAnimationFrame instead
// of a keyframe `animate` tween so hovering can smoothly ease the speed down
// (rather than restart/jump the tween, which a transition-prop swap would
// cause) and so it keeps working regardless of the actual tile width at any
// given breakpoint (recomputed from the live DOM each frame).
const SECONDS_PER_SET = 25
const HOVER_SPEED_FACTOR = 0.35

export default function ClientLogos() {
  const trackRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [hovered, setHovered] = useState(false)

  useAnimationFrame((_t, delta) => {
    const track = trackRef.current
    if (!track) return
    const setWidth = track.scrollWidth / SET_REPEAT
    const speed = (setWidth / SECONDS_PER_SET) * (hovered ? HOVER_SPEED_FACTOR : 1)
    let next = x.get() - (speed * delta) / 1000
    if (next <= -setWidth) next += setWidth
    x.set(next)
  })

  return (
    <section className="client-logos">
      <div
        className="client-logos__track"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <motion.div ref={trackRef} className="client-logos__marquee" style={{ x }}>
          {track.map((logo, i) => (
            <div key={i} className="client-logos__tile">
              <img src={logo.src} alt={logo.alt || ''} className="client-logos__logo" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
