import { useRef } from 'react'
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import Button from '../components/Button'
import WorkCard from '../components/WorkCard'
import SectionEyebrow from '../components/SectionEyebrow'
import { images } from '../assets/images'
import './Portfolio.css'

// Real project data recovered from the SSR HTML (the "Home" page chunk only
// carries the CMS query, not resolved records — this is the actual live
// content from the captured page load, "Photograhy" typo included verbatim).
const projects = [
  { rollNo: '(01)', title: 'Vellfire Calibration', category: 'Art Direction', slug: 'vellfire-calibration', image: images.bgImageJqzov1 },
  { rollNo: '(02)', title: 'Dunwill Lanson', category: 'Photograhy', slug: 'dunwill-lanson', image: images.bgImageRmeblx },
  { rollNo: '(03)', title: 'Noara Willis', category: 'Strategy', slug: 'noara-willis', image: images.bgImageJt7zqg },
  { rollNo: '(04)', title: 'Nike Studios', category: 'Art Direction', slug: 'nike-studios', image: images.bgImageYiiumx },
]

// Recovered exactly by measuring the live source: each card slot but the
// last is plain `position: sticky`, with `top` increasing by 40px per card
// (50px, 90px, 130px, ...) — NOT a framer-motion scale/y transform. Because
// later cards sit later in the DOM (same z-index, ties broken by DOM order)
// each newly-pinned card paints over the lower portion of the one before
// it, while that earlier card's own `top` offset keeps a fixed ~40px sliver
// of its own top edge peeking out above — the "photo album" cascade. The
// final card is left in normal flow (no sticky) so it settles as the resting
// full-size image once the stack finishes, with nothing left to cover it.
const STACK_BASE_TOP = 50
const STACK_STEP = 20

// Once the *next* card starts covering a card, that card should slowly
// shrink and drift upward — slowly enough that by the time the last card has
// settled, the first one is still a visible sliver (not scrolled fully out
// of view), and slowly enough that its caption shrinks/clears out of the way
// before the next card's own caption arrives on top of it. Every card drifts
// at the same rate (px / unit of overall scroll progress through the whole
// stack); they only end up shrunk by different amounts because they start
// at different progress thresholds — card i starts once card i+1 begins
// arriving, i.e. at progress (i+1)/total.
const COVER_DRIFT_Y = 46
const COVER_SHRINK = 0.18

// The caption fades out fast once its card starts being covered (same
// `startAt` trigger as the shrink/drift above) — otherwise, since the
// cards overlap so closely, the covered card's caption stays legible right
// through the one covering it. Reaches 0 after just 12% of the overall
// scroll progress past startAt, well before COVER_SHRINK/COVER_DRIFT_Y
// finish their own much slower transitions — and reverses the same way on
// scroll-up, since it's driven by the same continuous `progress` value.
// Never applied to the last card (see isLast below): nothing ever covers it.
const CAPTION_FADE_RANGE = 0.12

function PortfolioCard({
  project,
  index,
  isLast,
  total,
  progress,
}: {
  project: (typeof projects)[number]
  index: number
  isLast: boolean
  total: number
  progress: MotionValue<number>
}) {
  const startAt = (index + 1) / total
  const y = useTransform(progress, (p) => -COVER_DRIFT_Y * Math.max(0, p - startAt))
  const scale = useTransform(progress, (p) => 1 - COVER_SHRINK * Math.max(0, p - startAt))
  const captionOpacity = useTransform(progress, (p) =>
    Math.max(0, 1 - Math.max(0, p - startAt) / CAPTION_FADE_RANGE),
  )

  const style = isLast
    ? undefined
    : {
        position: 'sticky' as const,
        top: STACK_BASE_TOP + index * STACK_STEP,
        transformOrigin: 'top center',
        y,
        scale,
      }

  return (
    <motion.div className="portfolio__card-slot" style={style}>
      <WorkCard
        title={project.title}
        category={project.category}
        rollNo={project.rollNo}
        href={`/work/portfolio/${project.slug}`}
        image={project.image}
        captionOpacity={isLast ? undefined : captionOpacity}
      />
    </motion.div>
  )
}

export default function Portfolio() {
  const middleRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: middleRef, offset: ['start start', 'end end'] })
  const yearSuffix = new Date().getFullYear() % 100

  return (
    <section className="portfolio">
      <SectionEyebrow index="02" title="Portfolio" />

      <div className="portfolio__bottom">
        <div className="portfolio__sidebar portfolio__sidebar--left">
          <h4 className="text-preset-kxvc54 portfolio__sidebar-title">FX-{yearSuffix}'</h4>
          <div className="portfolio__sidebar-line" />
          <Button title="Join Us Now" href="/contact" variant="dark" />
        </div>

        <div className="portfolio__middle" ref={middleRef}>
          {projects.map((p, i) => (
            <PortfolioCard
              key={p.slug}
              project={p}
              index={i}
              isLast={i === projects.length - 1}
              total={projects.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <div className="portfolio__sidebar portfolio__sidebar--right">
          <a href="/portfolio" className="portfolio__see-all">
            <img src={images.assetXfjtzm.src} alt="" className="portfolio__see-all-thumb" />
            <span className="text-preset-q70fzl">See all (07)</span>
          </a>
        </div>
      </div>
    </section>
  )
}
