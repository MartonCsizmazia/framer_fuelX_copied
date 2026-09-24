import { motion } from 'framer-motion'
import StatCard from '../components/StatCard'
import SectionEyebrow from '../components/SectionEyebrow'
import './Stats.css'

// Real content recovered from the 4 "Stat Card" instances in the Home page chunk.
const stats = [
  {
    number: '2.06M',
    title: 'Global Impressions',
    bodyText: 'Fuel moves beyond simple authenticity, creating refined systems that shape digital presence.',
  },
  {
    number: '160K',
    title: 'Community Reach',
    bodyText: 'Elevating identity with structured clarity. Fuel crafts experiences that extend far beyond visual form.',
  },
  {
    number: '750+',
    title: 'Creative Hours Logged',
    bodyText: 'Through precision and intention, Fuel transforms ideas into cohesive narratives that define brands.',
  },
  {
    number: '257+',
    title: 'Projects Completed',
    bodyText: 'Blending modern aesthetics with functional design, Fuel delivers refined solutions that push brands.',
  },
]

export default function Stats() {
  return (
    <section className="stats">
      <SectionEyebrow index="07" title="Stats" />

      <div className="stats__container">
        <span className="stats__top-line" />
        <div className="stats__cards">
          {stats.map((s, i) => (
            // Source alternates two distinct transition refs across the 4
            // cards (a checkerboard-style stagger); exact per-card delay
            // values weren't recoverable, so this uses a reasonable
            // approximation of the same effect rather than a flat instant.
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: (i % 2) * 0.15, ease: [0.44, 0, 0.34, 0.98] } }}
              viewport={{ once: true, amount: 0.01 }}
            >
              <StatCard {...s} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
