'use client'

import { useEffect } from 'react'

/*
  La luz de los apartados de papel se mueve con el scroll, igual que la del tema oscuro:
  cada sección .papel recibe --p (0 → 1) según cruza la pantalla, y su orbe (::before)
  recorre el apartado en diagonal con esa variable, con inercia. La deriva por tiempo
  (animación CSS) se suma encima.
*/
export default function LuzPapel() {
  useEffect(() => {
    const secs = () => Array.from(document.querySelectorAll<HTMLElement>('.papel'))
    const actual = new Map<HTMLElement, number>()
    let raf = 0, objetivo = new Map<HTMLElement, number>()
    const medir = () => {
      const vh = window.innerHeight
      for (const s of secs()) {
        const r = s.getBoundingClientRect()
        // 0 cuando el apartado asoma por abajo, 1 cuando sale por arriba
        objetivo.set(s, Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height))))
      }
      if (!raf) raf = requestAnimationFrame(paso)
    }
    const paso = () => {
      let vivo = false
      objetivo.forEach((o, s) => {
        const a = actual.get(s) ?? o, n = a + (o - a) * 0.08
        if (Math.abs(n - a) > 0.0005) vivo = true
        actual.set(s, n); s.style.setProperty('--p', n.toFixed(4))
      })
      raf = vivo ? requestAnimationFrame(paso) : 0
    }
    medir()
    window.addEventListener('scroll', medir, { passive: true }); window.addEventListener('resize', medir)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', medir); window.removeEventListener('resize', medir) }
  }, [])
  return null
}
