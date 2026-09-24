import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import './OverlapFiller.css'

export interface OverlapFillerProps {
  color?: 'paper' | 'ink'
}

/**
 * Recovered from the "Overlap Detailing" / "Filler" component (recurs in
 * About, Services, Pricing): a Framer native scroll-linked transform effect
 * (__framer__styleTransformEffectEnabled + __framer__transformTargets),
 * NOT a fire-once whileInView animation — confirmed by tracing the runtime's
 * `zl` handler, which drives it with `offset: ["start end", "end end"]`
 * (the element's own scroll-through range) rather than a fixed-duration
 * tween. It has to keep tracking scroll position continuously, reversing
 * smoothly on scroll-up, not just play once when first triggered.
 *
 * Exact recovered keyframes: skewY 0 -> -7, y 0 -> -220. Height is the
 * source's own explicit 834px (.framer-38ndun etc.) — not shrunk, since the
 * old "cap to 220" hack was only needed to route around the fire-once
 * animation never re-covering the content on scroll-up.
 */
export default function OverlapFiller({ color = 'paper' }: OverlapFillerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, -220])
  const skewY = useTransform(scrollYProgress, [0, 1], [0, -7])

  return (
    <motion.div
      ref={ref}
      className={`overlap-filler overlap-filler--${color}`}
      style={{ y, skewY }}
      aria-hidden="true"
    />
  )
}
