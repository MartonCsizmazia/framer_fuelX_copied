import './Button.css'

export interface ButtonProps {
  title?: string
  href?: string
  variant?: 'light' | 'dark'
  newTab?: boolean
}

/**
 * Recovered from the "Button" component in rOGldfam3.BqEDOnzk.mjs
 * (framer-cVr5E). Text on the left, a 45deg-rotated arrow icon + underline
 * on the right; on hover the icon slides from top to bottom within its
 * clipped 8px track.
 */
export default function Button({ title = 'Explore Now', href = '#', variant = 'light', newTab = false }: ButtonProps) {
  return (
    <a
      href={href}
      target={newTab ? '_blank' : undefined}
      rel={newTab ? 'noopener noreferrer' : undefined}
      className={`button button--${variant}`}
    >
      <span className="button__content">
        <span className="button__text text-preset-q70fzl">{title}</span>
        <span className="button__icon-track">
          <span className="button__arrow" />
          <span className="button__arrow" />
        </span>
      </span>
      <span className="button__line" />
    </a>
  )
}
