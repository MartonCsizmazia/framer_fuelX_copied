import './WorkCard.css'

export interface WorkCardProps {
  title: string
  category: string
  rollNo: string
  year?: string
  href: string
  image: { src: string; alt?: string }
  /** Article's grid uses a plain full-bleed crop, not the Portfolio blur-frame treatment. */
  flat?: boolean
}

/**
 * Recovered from the "Work Card" component (.framer-MRFEw) — a blurred,
 * oversized copy of the image sits behind a sharp centered crop, giving a
 * soft glow/vignette around the card art. The mirror's Article grid reuses
 * this card's caption layout but with a plain full-bleed image (`flat`) —
 * verified directly against the mirror, which shows no blur halo there.
 */
export default function WorkCard({ title, category, rollNo, year = '© 2025', href, image, flat = false }: WorkCardProps) {
  return (
    <a href={href} className="work-card">
      <div className="work-card__art">
        {flat ? (
          <img src={image.src} alt={image.alt || title} className="work-card__art-flat" />
        ) : (
          <>
            <img src={image.src} alt={image.alt || ''} className="work-card__art-bg" aria-hidden="true" />
            <div className="work-card__art-inner">
              <img src={image.src} alt={image.alt || title} />
            </div>
          </>
        )}
      </div>
      <div className="work-card__bottom">
        <span className="work-card__roll text-preset-152twjm">{rollNo}</span>
        <div className="work-card__text-year">
          <div className="work-card__title-category">
            <span className="text-preset-152twjm work-card__title">{title}</span>
            <span className="text-preset-152twjm work-card__category">{category}</span>
          </div>
          <span className="text-preset-152twjm work-card__year">{year}</span>
        </div>
      </div>
    </a>
  )
}
