import './StatCard.css'

export interface StatCardProps {
  number: string
  title: string
  bodyText: string
}

/** Recovered from the "Stat Card" component (.framer-b4dJ4). */
export default function StatCard({ number, title, bodyText }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-card__title-row">
        <h2 className="text-preset-1gc7217 stat-card__number">{number}</h2>
        <span className="stat-card__arrow" aria-hidden="true" />
      </div>
      <div className="stat-card__description">
        <span className="stat-card__line" />
        <div className="stat-card__content">
          <p className="text-preset-q70fzl stat-card__heading">{title}</p>
          <p className="text-preset-152twjm stat-card__body">{bodyText}</p>
        </div>
      </div>
    </div>
  )
}
