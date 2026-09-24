import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Button from './Button'
import { images } from '../assets/images'
import './CtaBanner.css'

// Same technique as About's portrait: the container stays put, the
// (deliberately oversized, `height:145%`) background photo pans linearly
// inside it — a direct, spring-free function of scroll progress. Safe range
// is [-360, 0] (45% of the 800px container = 360px of overflow); -250 is
// -192 sped up another 30%, still inside the safe bound with margin.
const CTA_BG_PARALLAX_START = -300

/**
 * Recovered from the "CTA" component (.framer-LkKYy): a full-bleed dark
 * banner with a parallax background photo and a left-to-right scrolling
 * marquee headline. The accent photo and "Contact Now" button are NOT a
 * bottom row — measured directly against the mirror, the photo sits dead
 * center (both axes) over the marquee text, and the button sits ~23px
 * below it, left-aligned to the photo's left edge. Four plus-mark corner
 * decorations (same motif as the Hero) frame the photo at roughly
 * calc(22% - 1.5rem)/calc(79% - 1.5rem) of the content width and 32%/62%
 * of its height — tuned by feel after the photo's own vertical center
 * (measured ~46%) read too low and
 * too far left. The marquee is clipped and edge-masked to exactly this
 * same rectangle (kept in sync with CtaBanner.css), so it's only ever
 * visible between the four plus-marks, fading in/out fast as it scrolls
 * across the rectangle's left/right edges.
 */
export default function CtaBanner() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: bgScrollProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })
  const bgY = useTransform(bgScrollProgress, [0, 1], [CTA_BG_PARALLAX_START, 0])

  return (
    <section className="cta-banner">
      <div className="cta-banner__container" ref={containerRef}>
        <motion.img
          src={images.villaG891sp.src}
          alt=""
          className="cta-banner__bg"
          aria-hidden="true"
          style={{ y: bgY }}
        />

        <div className="cta-banner__content">
          <div className="cta-banner__marquee-track" aria-hidden="true">
            <motion.div
              className="cta-banner__marquee"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, repeatType: 'loop', duration: 80, ease: 'linear' }}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="cta-banner__marquee-text">
                  We Are Faster, Better And Cheaper&rdquo;&nbsp;
                </span>
              ))}
            </motion.div>
          </div>

          {[
            { top: '32%', left: 'calc(22% - 1.2rem)' },
            { top: '32%', left: 'calc(79% - 1.5rem)' },
            { top: '62%', left: 'calc(22% - 1.2rem)' },
            { top: '62%', left: 'calc(79% - 1.5rem)' },
          ].map((pos, i) => (
            <span key={i} className="cta-banner__plus-mark" style={pos} aria-hidden="true">
              <span className="cta-banner__plus-bar cta-banner__plus-bar--h" />
              <span className="cta-banner__plus-bar cta-banner__plus-bar--v" />
            </span>
          ))}

          <div className="cta-banner__focal">
            <img
              src={images.womenOrangeBgAvoxaw.src}
              alt=""
              className="cta-banner__accent-photo"
            />
            <Button title="Contact Now" href="/contact" variant="light" />
          </div>
        </div>
      </div>
    </section>
  )
}
