import { motion } from 'framer-motion'
import Button from './Button'
import { images } from '../assets/images'
import './CtaBanner.css'

/**
 * Recovered from the "CTA" component (.framer-LkKYy): a full-bleed dark
 * banner with a parallax background photo and a left-to-right scrolling
 * marquee headline. The accent photo and "Contact Now" button are NOT a
 * bottom row — measured directly against the mirror, the photo sits dead
 * center (both axes) over the marquee text, and the button sits ~23px
 * below it, left-aligned to the photo's left edge. Four plus-mark corner
 * decorations (same motif as the Hero) frame the photo at roughly
 * 19%/76% of the content width and 28%/58% of its height.
 */
export default function CtaBanner() {
  return (
    <section className="cta-banner">
      <div className="cta-banner__container">
        <img src={images.villaG891sp.src} alt="" className="cta-banner__bg" aria-hidden="true" />

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
            { top: '28%', left: '19%' },
            { top: '28%', left: '76%' },
            { top: '58%', left: '19%' },
            { top: '58%', left: '76%' },
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
