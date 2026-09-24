import { useState } from 'react'
import { motion } from 'framer-motion'
import { images } from '../assets/images'
import './Navbar.css'

export interface NavLink {
  title: string
  rollNo: string
  href: string
}

export interface NavbarProps {
  /**
   * Recovered from the captured site's link resolution, the nav items point
   * at separate Framer pages (webPageIds PBuuJgmj0 / mrmcWhPiV / JuVhtOdyT)
   * that weren't part of this single-page capture, so their real slugs
   * couldn't be recovered from static analysis. These are inferred,
   * conventional slugs — update them once the real destinations are known.
   */
  links?: NavLink[]
  ctaHref?: string
}

const DEFAULT_LINKS: NavLink[] = [
  { title: 'Home', rollNo: '01', href: '/' },
  { title: 'Portfolio', rollNo: '02', href: '/portfolio' },
  { title: 'About', rollNo: '03', href: '/about' },
  { title: 'Contact', rollNo: '04', href: '/contact' },
]

// Recovered from __framer__appearAnimationsContent id "93osxn" (the navbar's
// own entrance) and the per-item entries used inside "Menu Items" (staggered
// 0.4s/0.5s/0.6s/0.7s delays, tween ease [.44,0,.34,.98], duration .5).
const barAppear = {
  initial: { opacity: 0.001, y: -100, scale: 1 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', damping: 60, delay: 0.3, mass: 1, stiffness: 300 },
  },
} as const

const itemAppear = (delay: number) => ({
  initial: { opacity: 0.001, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', ease: [0.44, 0, 0.34, 0.98], duration: 0.5, delay },
  },
})

function MenuIcon() {
  // Recovered inline SVG (viewBox 0 0 14 14), duplicated so the hover state
  // can slide the visible icon from the top copy to the bottom copy inside
  // a 14px-tall clipped track (see .navbar__cta-icon-track:hover in CSS).
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width={14} height={14}>
      <g transform="translate(0.092 1.048) rotate(-10 6.25 6)">
        <path d="M 5.455 0.917 C 5.455 0.41 5.865 0 6.371 0 L 11.538 0 C 12.044 0 12.455 0.41 12.455 0.917 L 12.455 6.083 C 12.455 6.59 12.044 7 11.538 7 L 6.371 7 C 5.865 7 5.455 6.59 5.455 6.083 Z" fill="currentColor" />
        <path d="M 0 7.483 C 0 6.931 0.448 6.483 1 6.483 L 4.455 6.483 C 5.007 6.483 5.455 6.931 5.455 7.483 L 5.455 10.938 C 5.455 11.49 5.007 11.938 4.455 11.938 L 1 11.938 C 0.448 11.938 0 11.49 0 10.938 Z" fill="currentColor" />
      </g>
    </svg>
  )
}

function MenuItem({ title, rollNo, href, delay }: NavLink & { delay: number }) {
  return (
    <motion.a
      className="navbar__menu-item"
      href={href}
      {...itemAppear(delay)}
    >
      <span className="navbar__menu-item-page">
        <span className="navbar__menu-item-title text-preset-152twjm">{title}</span>
        <span className="navbar__menu-item-underline" />
      </span>
      <span className="navbar__menu-item-roll text-preset-zhd8ta">{rollNo}</span>
    </motion.a>
  )
}

export default function Navbar({ links = DEFAULT_LINKS, ctaHref = '/about' }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <motion.header
      className="navbar"
      data-framer-name="Primary"
      {...barAppear}
    >
      <div className={`navbar__bar${mobileOpen ? ' navbar__bar--open' : ''}`}>
        <div className="navbar__logo-group">
          <button
            type="button"
            className="navbar__hamburger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="navbar__hamburger-line" />
            <span className="navbar__hamburger-line" />
          </button>
          <a href="/" className="navbar__logo-link">
            <img src={images.logoIgv5zp.src} alt={images.logoIgv5zp.alt || 'Logo'} className="navbar__logo-img" />
          </a>
        </div>

        <nav className="navbar__menu" aria-label="Primary">
          {links.map((link, i) => (
            <MenuItem key={link.title} {...link} delay={0.4 + i * 0.1} />
          ))}
        </nav>

        <a href={ctaHref} className="navbar__cta">
          <span className="navbar__cta-avatar">
            <img src={images.ctaAvatarWfrjn1.src} alt={images.ctaAvatarWfrjn1.alt || 'CEO'} />
          </span>
          <span className="navbar__cta-content">
            <span className="navbar__cta-heading-row">
              <span className="navbar__cta-heading text-preset-q70fzl">Meet the CEO</span>
              <span className="navbar__cta-icon-track">
                <MenuIcon />
                <MenuIcon />
              </span>
            </span>
            <span className="navbar__cta-name-position">
              <span className="text-preset-152twjm navbar__cta-name">Lousiana KD6</span>
              <span className="text-preset-152twjm navbar__cta-position">CEO</span>
            </span>
          </span>
        </a>
      </div>
    </motion.header>
  )
}
