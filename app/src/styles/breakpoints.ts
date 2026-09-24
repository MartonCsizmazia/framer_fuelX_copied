// Recovered from __framer__breakpoints in the captured site HTML.
// Keep these in sync with the @media queries in tokens.css / typography.css.

export const breakpoints = {
  tablet: 810,
  desktop: 1200,
} as const

export const mediaQueries = {
  desktop: '(min-width: 1200px)',
  tablet: '(min-width: 810px) and (max-width: 1199.98px)',
  phone: '(max-width: 809.98px)',
} as const
