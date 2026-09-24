import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Framer-published sites run Lenis for smooth scrolling (confirmed live:
 * the mirror's <html> carries a "lenis" class and window.lenisVersion is
 * set). Without it, native wheel scrolling feels comparatively "weightless"
 * — no inertia glide once the wheel stops. Framer's own baked-in defaults
 * are duration 1.2s with an easeOutExpo-style curve; bumped to 1.8s here
 * per explicit feedback that the default felt too quick/light — a longer
 * duration is what makes the post-scroll glide read as heavier ("walking
 * on ice") rather than just slower-but-still-snappy.
 */
export function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])
}
