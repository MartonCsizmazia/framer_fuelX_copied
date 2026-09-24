import { motion, useScroll, useTransform } from 'framer-motion'
import Button from '../components/Button'
import Navbar from '../components/Navbar'
import LiquidHover from '../components/LiquidHover'
import { images } from '../assets/images'
import './Hero.css'

// Every transition below is copied verbatim from __framer__appearAnimationsContent
// (ids in comments) — not approximated.
const springSlow = { type: 'spring', damping: 60, mass: 1, stiffness: 300 } as const
const tweenA = [0.44, 0, 0.34, 0.98] as const // used by the description lines
const tweenB = [0.76, 0.02, 0.13, 1.01] as const // used by the services list

const bgAppear = {
  // id: 1emrrf1
  initial: { opacity: 0.001, scale: 1.2 },
  animate: { opacity: 1, scale: 1, transition: { duration: 1, ease: tweenA } },
}

const descLine = (delay: number) => ({
  // ids: 1kj30u2 / 1sey6sg / kct57c
  initial: { opacity: 0.001, y: 10 },
  animate: { opacity: 1, y: 0, transition: { type: 'tween', ease: tweenA, duration: 0.5, delay } },
})

const ctaAppear = {
  // id: sg0uxd
  initial: { opacity: 0.001 },
  animate: { opacity: 1, transition: { ...springSlow, delay: 0.6 } },
}

const serviceLine = (delay: number, y: number) => ({
  // ids: ymtnev / 1500qjj / 10p4pga
  initial: { opacity: 0.001, y },
  animate: { opacity: 1, y: 0, transition: { type: 'tween', ease: tweenB, duration: 0.5, delay } },
})

const yearDetailsAppear = {
  // id: 1jqz5fp
  initial: { opacity: 0.001 },
  animate: { opacity: 1, transition: { ...springSlow, delay: 0.5 } },
}

const logoBannerAppear = {
  // id: 40utpw
  initial: { opacity: 0.001, y: 170 },
  animate: { opacity: 1, y: 0, transition: { ...springSlow, delay: 0.1 } },
}

// Corner plus-marks — ids 1bna2y5 / 7cb90 / 1mc9omt / rz2mbh, all delay 0.8.
// They don't share one resting line: measured directly against the mirror,
// marks 1/3 and 2/4 sit on two different levels, 106px apart (a zigzag),
// not a single shared `bottom`.
const CORNER_MARK_BOTTOM_LOW = 323
const CORNER_MARK_BOTTOM_HIGH = 323 + 106
const cornerMarks = [
  { right: 889, bottom: CORNER_MARK_BOTTOM_LOW, from: -100, visibleAt: 'desktop' as const },
  { right: 653, bottom: CORNER_MARK_BOTTOM_HIGH, from: 100, visibleAt: 'desktop' as const },
  { right: 417, bottom: CORNER_MARK_BOTTOM_LOW, from: -100, visibleAt: 'desktop-tablet' as const },
  { right: 181, bottom: CORNER_MARK_BOTTOM_HIGH, from: 100, visibleAt: 'desktop-tablet' as const },
]

// 11 decorative ticks between "© 2025" and "19'" — all 10px tall except the
// 6th (40px), recovered from .framer-1vt0l42 / .framer-u6rpdz.
const lineHeights = [10, 10, 10, 10, 10, 40, 10, 10, 10, 10, 10]

function PlusMark({ right, bottom, from, visibleAt }: (typeof cornerMarks)[number]) {
  return (
    <motion.div
      className={`hero__corner-mark hero__corner-mark--${visibleAt}`}
      style={{ right, bottom }}
      initial={{ opacity: 0.001, y: from }}
      animate={{ opacity: 1, y: 0, transition: { ...springSlow, delay: 0.8 } }}
    >
      <span className="hero__plus-bar hero__plus-bar--h" />
      <span className="hero__plus-bar hero__plus-bar--v" />
    </motion.div>
  )
}

export interface HeroProps {
  /** Defaults to the original hero photo, so the main page's <Hero /> call
   * needs no changes. Used for both the visible background and the
   * LiquidHover distortion layer, which samples the same image. */
  backgroundImage?: { src: string; alt?: string }
  /** Whether the background darkens as the hero scrolls out of view — an
   * overlay fading in from transparent to ~65% black over the same scroll
   * distance the hero itself fades out over. On by default (the main page
   * wants this); sub-pages reusing Hero with a different background can
   * turn it off. */
  darkenOnScroll?: boolean
}

export default function Hero({ backgroundImage, darkenOnScroll = true }: HeroProps = {}) {
  const bgImage = backgroundImage ?? images.bgImageHshvii
  // Framer's built-in Parallax effect, recovered exactly from the runtime:
  // y = -scrollY * (speed/100 - 1), using raw page scroll. Traced from the
  // shared-lib chunk's `Sl`/`Cl` functions. Hero's own root:
  // __framer__speed:110 -> factor 0.1 (scrolls at 10% of page speed).
  // Bottom block: __framer__speed:107 -> factor 0.07, replacing the earlier
  // unverified "-40" approximation now that the exact formula is known.
  //
  // .hero is position:fixed (not sticky) — verified against the mirror:
  // with a plain 100vh spacer the next section's top sits at exactly
  // scroll=0 -> 100vh with zero extra padding, and it slides up at full
  // scroll speed starting immediately, while .hero stays visually anchored
  // (only the 10% parallax drift) underneath it the whole time. A sticky
  // element in a same-height wrapper has zero "spare" scroll distance to
  // hold a pin at all, so it can't produce this — confirmed empirically.
  const { scrollY: pageScrollY } = useScroll()
  const heroParallaxY = useTransform(pageScrollY, (v) => -v * 0.1)
  const bottomY = useTransform(pageScrollY, (v) => -v * 0.07)

  // Recovered behavior: the whole Hero fades opacity 1 -> 0 as it scrolls
  // out (__framer__transformTrigger: "onScrollTarget"). The exact trigger
  // distance is approximated from direct measurement against the mirror
  // (~1100px of raw scroll at a ~873px-tall viewport, i.e. roughly 1.25x
  // viewport height) rather than read from a source constant.
  const heroOpacity = useTransform(pageScrollY, [0, 1100], [1, 0])

  // Darkens the background as the hero scrolls out — same 1100px range as
  // heroOpacity, so it's noticeably dimmer well before the whole hero has
  // faded away. Only rendered when darkenOnScroll is true.
  const darkenOpacity = useTransform(pageScrollY, [0, 1100], [0, 0.65])

  return (
    <div className="hero-wrapper">
    <motion.section className="hero" style={{ opacity: heroOpacity, y: heroParallaxY }}>
      <Navbar />
      <motion.div className="hero__bg" {...bgAppear}>
        <img src={bgImage.src} alt={bgImage.alt || 'Hero background'} />
      </motion.div>

      {/* Desktop-only. Real-time WebGL fluid-sim distortion, recovered
          verbatim (shaders included) from the production bundle — see
          LiquidHover.tsx. Props match the exact instance values captured
          from source (cursorPower:1, cursorSize:.5, distortionPower:.8,
          resolution:4). */}
      <div className="hero__distortion-layer">
        <LiquidHover
          image={bgImage}
          cursorPower={1}
          cursorSize={0.5}
          distortionPower={0.8}
          resolution={4}
        />
      </div>

      {darkenOnScroll && <motion.div className="hero__darken-overlay" style={{ opacity: darkenOpacity }} aria-hidden="true" />}

      <div className="hero__spacer" />

      <div className="hero__top">
        <div className="hero__description">
          <p className="text-preset-q70fzl hero__line" {...descLine(0.4)}>
            Pick a plan, submit a job request,
          </p>
          <motion.p className="text-preset-q70fzl hero__line" {...descLine(0.6)}>
            and your image{' '}
            <span className="hero__dim">will kickoff</span>
          </motion.p>
          <motion.p className="text-preset-q70fzl hero__line hero__dim" {...descLine(0.8)}>
            within 24 hours.
          </motion.p>
        </div>
        <motion.div {...ctaAppear}>
          <Button title="Explore Now" href="/about" variant="light" />
        </motion.div>
      </div>

      <motion.div className="hero__bottom" style={{ y: bottomY }}>
        <div className="hero__services">
          <motion.p className="text-preset-q70fzl" {...serviceLine(0.9, 10)}>
            <span className="hero__dim">01/</span> Strategy
          </motion.p>
          <motion.p className="text-preset-q70fzl" {...serviceLine(1.1, 8)}>
            Videography
          </motion.p>
          <motion.p className="text-preset-q70fzl" {...serviceLine(1.3, 6)}>
            Branding
          </motion.p>
        </div>

        <div className="hero__details-logo">
          <motion.div className="hero__year-details" {...yearDetailsAppear}>
            <span className="text-preset-q70fzl">&copy; 2025</span>
            <div className="hero__lines">
              {lineHeights.map((h, i) => (
                <span key={i} className="hero__line-tick" style={{ height: h }} />
              ))}
            </div>
            <span className="text-preset-q70fzl">19'</span>
          </motion.div>

          <motion.div className="hero__logo-banner" {...logoBannerAppear}>
            <img src={images.placeYourLogoHere71ydgb.src} alt={images.placeYourLogoHere71ydgb.alt || ''} />
          </motion.div>
        </div>
      </motion.div>

      {cornerMarks.map((mark, i) => (
        <PlusMark key={i} {...mark} />
      ))}
    </motion.section>
    </div>
  )
}
