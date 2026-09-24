import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Button from '../components/Button'
import OverlapFiller from '../components/OverlapFiller'
import SectionEyebrow from '../components/SectionEyebrow'
import { images } from '../assets/images'
import './About.css'

// The portrait's own container stays put; scrolling instead pans the
// (deliberately oversized, `height:150%`) image linearly inside it — no
// spring, a direct 1:1 function of scroll progress, slower than the page's
// own scroll speed since it only covers this many px against a full
// viewport-heights-tall scroll range. Range must stay within the safe
// [-220, 0] window (220px = the 150%-height image's total overflow inside
// its 440px-tall container) or the container would show empty space at an
// edge. -170 shows more of the subject's legs at entry; push further toward
// -220 for even more, or back toward 0 for less.
const ABOUT_IMAGE_PARALLAX_START = -170

// Recovered inline transitions (local consts in the "Home" page chunk, not
// the global appear-animations table): simple opacity fades triggered
// on-scroll-into-view (threshold 0, animate once).
const fadeIn = (duration: number) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1, transition: { duration, ease: [0.44, 0, 0.34, 0.98] } },
  viewport: { once: false, amount: 0.01 },
})

const stats = [
  { label: 'New clients', value: '15' },
  { label: 'Success rate', value: '100%' },
]

export default function About() {
  const imageRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: imageScrollProgress } = useScroll({
    target: imageRef,
    offset: ['start end', 'end start'],
  })
  const imageY = useTransform(imageScrollProgress, [0, 1], [ABOUT_IMAGE_PARALLAX_START, 0])

  return (
    <section className="about">
      <OverlapFiller color="paper" />

      <div className="about__top">
        <SectionEyebrow index="01" title="About Us" />
        <motion.p
          className="about__heading"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }}
          viewport={{ once: true, amount: 0.01 }}
        >
          Design-forward impressive agency crafting bold visuals, structured layouts, and
          high-impact digital 3D Swiss inspired by modern aesthetics&reg;.
        </motion.p>
      </div>

      <div className="about__bottom">
        <motion.div className="about__image" ref={imageRef} {...fadeIn(0.6)}>
          <motion.img src={images.assetMrongf.src} alt="Men Red BG" style={{ y: imageY }} />
        </motion.div>

        <motion.div className="about__columns" {...fadeIn(1.2)}>
          <div className="about__column">
            <span className="about__column-heading text-preset-q70fzl">(Pre)</span>
            <p className="about__column-text text-preset-q70fzl">
              Igniting ideas with precision and intentional design. Fuel transforms raw
              creativity into structured visual systems that shape brands and elevate digital
              experiences.
            </p>
          </div>
          <div className="about__column">
            <span className="about__column-heading text-preset-q70fzl">(+Post)</span>
            <p className="about__column-text text-preset-q70fzl">
              Driven by bold aesthetics and functional simplicity. Fuel blends modern form with
              purposeful detail, delivering refined experiences that push brands forward.
            </p>
          </div>
          <div className="about__column">
            <span className="about__column-heading text-preset-q70fzl">(=Results)</span>
            <div className="about__results-content">
              <div className="about__stats">
                {stats.map((s) => (
                  <div className="about__stat" key={s.label}>
                    <div className="about__stat-row">
                      <span className="text-preset-q70fzl">{s.label}</span>
                      <span className="text-preset-q70fzl about__stat-value">{s.value}</span>
                    </div>
                    <span className="about__stat-line" />
                  </div>
                ))}
              </div>
              <Button title="Explore Now" href="/about" variant="dark" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
