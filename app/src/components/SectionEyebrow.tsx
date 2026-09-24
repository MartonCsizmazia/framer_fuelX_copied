import './SectionEyebrow.css'

export interface SectionEyebrowProps {
  index: string
  title: string
  dark?: boolean
}

/**
 * Recovered by measuring the live source: every section opens with a thin
 * 1px divider (ink/paper @ 16%, matching the section's own light/dark
 * background) directly above a 3-column row — "(0X)" far left, the title,
 * and "© <year>" far right — set in the 12px/16.2px text-preset-152twjm
 * preset at full opacity (solid ink or paper), not the larger, half-opacity
 * text-preset-q70fzl the sections used before.
 */
export default function SectionEyebrow({ index, title, dark = false }: SectionEyebrowProps) {
  const year = new Date().getFullYear()

  return (
    <div className={`section-eyebrow text-preset-152twjm${dark ? ' section-eyebrow--dark' : ''}`}>
      <span>({index})</span>
      <span>{title}</span>
      <span>&copy; {year}</span>
    </div>
  )
}
