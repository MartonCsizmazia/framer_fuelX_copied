import { motion } from 'framer-motion'
import './ArchiveRow.css'

export interface ArchiveRowProps {
  title: string
  year: string
  image?: { src: string; alt?: string }
}

/**
 * Recovered from the "Experience Card" component (.framer-eRGcA). Source
 * has each row fade in on scroll (__framer__enter/exit, threshold 0,
 * animateOnce false) — reversible, not a fire-once reveal.
 */
export default function ArchiveRow({ title, year, image }: ArchiveRowProps) {
  return (
    <motion.div
      className="archive-row"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1, transition: { duration: 0.6, ease: [0.44, 0, 0.34, 0.98] } }}
      viewport={{ once: false, amount: 0.01 }}
    >
      <span className="archive-row__line" />
      <div className="archive-row__content">
        <div className="archive-row__left">
          <span className="text-preset-q70fzl archive-row__year">{year}</span>
          <h5 className="text-preset-wppu5t archive-row__title">{title}</h5>
        </div>
        {image && (
          <div className="archive-row__right">
            <img src={image.src} alt={image.alt || title} />
          </div>
        )}
      </div>
    </motion.div>
  )
}
