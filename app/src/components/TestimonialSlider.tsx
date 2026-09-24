import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { images } from '../assets/images'
import './TestimonialSlider.css'

interface Testimonial {
  quote: string
  name: string
  position: string
  image: { src: string; alt?: string }
  /** true if this is the one client photo actually captured; the others
   * are honest stand-ins since their real photos weren't fetched during
   * the crawl (lazy-loaded, inactive tabs). */
  realPhoto?: boolean
}

// Recovered from the "Testimonial Slider" component. 4 client tabs exist in
// the source; 3 are confidently reconstructed here (name/position/quote all
// verified) — the 4th tab's text couldn't be reliably paired with a name
// from the minified source, so it's left out rather than guessed.
const testimonials: Testimonial[] = [
  {
    quote:
      'Fuel delivered with clarity. Their structured workflow and fast turnaround made our redesign launch seamless. They’ve become our trusted partner for every major creative push.',
    name: 'Adrian Velasco',
    position: 'NovaLabs / Creative Lead',
    image: images.manHoodie9kkvud,
    realPhoto: true,
  },
  {
    quote:
      'The team understood our vision instantly. Clean communication, flexible timelines, and consistently refined work. Fuel gave our brand the modern edge we were missing.',
    name: 'Kasandra, Leon, Miles',
    position: 'Miro One / Team Lead Members',
    image: images.womenOnTheSofaYw1gcz,
  },
  {
    quote:
      'Professional, thoughtful, and incredibly detail-driven. Fuel supported us through multiple product rollouts with steady direction and polished execution. Highly dependable every time.',
    name: 'Gracia Michelle',
    position: 'Apple Co. / Senior Lead Engineer',
    image: images.curlyWomanWq7hn1,
  },
]

const stats = [
  { value: '122+ / 257+ / 315+', title: 'Success Rate', subtitle: 'Reliable execution' },
  { value: '99%', title: 'Client Satisfaction', subtitle: 'Seamless delivery' },
]

export default function TestimonialSlider() {
  const [index, setIndex] = useState(0)
  const current = testimonials[index]

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + testimonials.length) % testimonials.length)

  return (
    <div className="testimonial-slider">
      <div className="testimonial-slider__left">
        <div className="testimonial-slider__photo">
          <AnimatePresence mode="wait">
            <motion.img
              key={current.name}
              src={current.image.src}
              alt={current.image.alt || current.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
          <img src={images.assetAl0gg5.src} alt="" className="testimonial-slider__logo" aria-hidden="true" />
        </div>
        <div className="testimonial-slider__buttons">
          <button type="button" aria-label="Previous testimonial" onClick={() => go(-1)}>
            <svg viewBox="0 0 8.004 14.003" width={8} height={14}>
              <path d="M 7.733 12.442 C 8.094 12.799 8.094 13.378 7.733 13.735 C 7.372 14.092 6.786 14.092 6.425 13.735 L 0.271 7.648 C 0.098 7.477 0 7.244 0 7.002 C 0 6.759 0.098 6.526 0.271 6.355 L 6.425 0.268 C 6.786 -0.089 7.372 -0.089 7.733 0.268 C 8.094 0.625 8.094 1.204 7.733 1.561 L 2.234 7.001 Z" fill="currentColor" />
            </svg>
          </button>
          <button type="button" aria-label="Next testimonial" onClick={() => go(1)}>
            <svg viewBox="0 0 8.004 14.003" width={8} height={14}>
              <path d="M 0.271 12.442 C -0.09 12.799 -0.09 13.378 0.271 13.735 C 0.632 14.092 1.217 14.092 1.579 13.735 L 7.732 7.648 C 7.906 7.477 8.004 7.244 8.004 7.002 C 8.004 6.759 7.906 6.526 7.732 6.355 L 1.579 0.268 C 1.217 -0.089 0.632 -0.089 0.271 0.268 C -0.09 0.625 -0.09 1.204 0.271 1.561 L 5.77 7.001 Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <div className="testimonial-slider__right">
        <div className="testimonial-slider__text">
          <AnimatePresence mode="wait">
            <motion.p
              key={current.quote}
              className="testimonial-slider__quote"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              &ldquo;{current.quote}&rdquo;
            </motion.p>
          </AnimatePresence>
          <div className="testimonial-slider__name-position">
            <span className="text-preset-q70fzl">{current.name}</span>
            <span className="text-preset-152twjm testimonial-slider__position">{current.position}</span>
          </div>
        </div>

        <span className="testimonial-slider__divider" />

        <div className="testimonial-slider__stats">
          {stats.map((s) => (
            <div className="testimonial-slider__stat" key={s.title}>
              <h6 className="text-preset-gftg2f">{s.value}</h6>
              <div className="testimonial-slider__stat-details">
                <span className="text-preset-152twjm">{s.title}</span>
                <span className="text-preset-152twjm testimonial-slider__stat-subtitle">{s.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
