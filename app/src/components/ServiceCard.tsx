import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import './ServiceCard.css'

export interface ServiceCardProps {
  rollNo: string
  category: string
  heading: string
  bodyText: string
  image: { src: string; alt?: string }
}

/**
 * Recovered from the "Service Card" component (.framer-nTbcD): a giant roll
 * number on the left, a scroll-zoom image + title/heading/body on the
 * right, both on a near-black background.
 */
export default function ServiceCard({ rollNo, category, heading, bodyText, image }: ServiceCardProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  // Continuously scroll-linked (not a whileInView-triggered tween): the
  // zoom should track scroll position itself, starting the instant the
  // image's top edge enters the bottom of the viewport and finishing right
  // as it reaches viewport center — not fire all at once the moment any
  // sliver becomes visible.
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'start center'] })
  const rawScale = useTransform(scrollYProgress, [0, 1], [1.25, 1])
  const scale = useSpring(rawScale, { damping: 60, stiffness: 400, mass: 1 })

  return (
    <div className="service-card">
      <div className="service-card__row">
        <div className="service-card__left">
          <span className="text-preset-6fpyuh service-card__roll">{rollNo}</span>
        </div>
        <div className="service-card__right">
          <div className="service-card__image">
            <motion.img
              ref={imgRef}
              src={image.src}
              alt={image.alt || ''}
              style={{ scale }}
            />
          </div>
          <div className="service-card__content">
            <h4 className="text-preset-kxvc54 service-card__title">{category}</h4>
            <div className="service-card__description">
              <p className="text-preset-q70fzl service-card__heading">{heading}</p>
              <p className="text-preset-q70fzl service-card__body">{bodyText}</p>
            </div>
          </div>
        </div>
      </div>
      <span className="service-card__line" />
    </div>
  )
}
