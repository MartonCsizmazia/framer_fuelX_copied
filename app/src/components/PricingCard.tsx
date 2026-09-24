import Button from './Button'
import './PricingCard.css'

export interface PricingCardProps {
  title: string
  description: string
  price: string
  href?: string
  dark?: boolean
  features: string[]
}

/**
 * Recovered from the "Pricing Card" component (.framer-izV8Q). Feature
 * order matches the source's point1..point8 mapping exactly.
 */
export default function PricingCard({ title, description, price, href = '/contact', dark = false, features }: PricingCardProps) {
  return (
    <div className={`pricing-card${dark ? ' pricing-card--dark' : ''}`}>
      <div className="pricing-card__title-block">
        <p className="text-preset-q70fzl pricing-card__title">{title}</p>
        <p className="text-preset-152twjm pricing-card__description">{description}</p>
      </div>

      <div className="pricing-card__pring">
        <div className="pricing-card__price-row">
          <span className="text-preset-152twjm pricing-card__currency">$</span>
          <h4 className="text-preset-kxvc54 pricing-card__price">{price}</h4>
        </div>
        <div className="pricing-card__duration">
          <span className="text-preset-q70fzl">/ Month</span>
        </div>
      </div>

      <Button title="Join Us Now" href={href} variant={dark ? 'light' : 'dark'} />

      <div className="pricing-card__points">
        <p className="text-preset-q70fzl pricing-card__points-heading">What&rsquo;s included</p>
        {features.map((f, i) => (
          <div className="pricing-card__point" key={i}>
            <span className="pricing-card__point-icon" aria-hidden="true">
              <span />
              <span />
            </span>
            <span className="text-preset-152twjm pricing-card__point-text">{f}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
