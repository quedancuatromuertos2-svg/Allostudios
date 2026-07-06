'use client'

/**
 * Rastro de color fluido global (Liquid Glass). Canvas fijo detrás del contenido:
 * el cursor deja un rastro de color que aguanta ~2,6 s y cambia de tono muy
 * despacio (fluido). Los paneles .lg lo refractan por su backdrop-filter.
 * Además actualiza --mx/--my en cada .lg para su aura persistente al hover.
 */
import { useEffect } from 'react'

export default function LiquidTrail() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cv = document.createElement('canvas')
    cv.id = 'lg-trail'
    document.body.prepend(cv)
    const ctx = cv.getContext('2d')!
    const DPR = Math.min(2, window.devicePixelRatio || 1)
    let W = 0, H = 0
    const resize = () => { W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR; cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px' }
    resize(); addEventListener('resize', resize)

    const R = 7 * DPR, LIFE = 2600
    const pts: { x: number; y: number; h: number; born: number }[] = []
    let hue = 250
    let hx = innerWidth / 2 * DPR, hy = innerHeight / 2 * DPR, tx = hx, ty = hy
    const ph = { x: hx, y: hy }
    const onMove = (e: MouseEvent) => { tx = e.clientX * DPR; ty = e.clientY * DPR }
    addEventListener('mousemove', onMove, { passive: true })

    const blob = (p: { x: number; y: number; h: number }, a: number) => {
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, R)
      g.addColorStop(0, `hsla(${p.h},92%,58%,${0.7 * a})`)
      g.addColorStop(0.55, `hsla(${p.h + 35},92%,56%,${0.34 * a})`)
      g.addColorStop(1, `hsla(${p.h + 70},92%,56%,0)`)
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x, p.y, R, 0, 6.2832); ctx.fill()
    }
    let raf = 0
    const loop = (now: number) => {
      ctx.clearRect(0, 0, W, H)
      hx += (tx - hx) * 0.22; hy += (ty - hy) * 0.22
      hue = (hue + 0.35) % 360
      const dx = hx - ph.x, dy = hy - ph.y, dist = Math.hypot(dx, dy), steps = Math.max(1, Math.floor(dist / (R * 0.4)))
      for (let i = 0; i < steps; i++) { const t = i / steps; pts.push({ x: ph.x + dx * t, y: ph.y + dy * t, h: (hue + t * 7) % 360, born: now }) }
      ph.x = hx; ph.y = hy
      ctx.globalCompositeOperation = 'lighter'
      for (let i = pts.length - 1; i >= 0; i--) {
        const age = (now - pts[i].born) / LIFE
        if (age >= 1) { pts.splice(i, 1); continue }
        blob(pts[i], Math.pow(1 - age, 1.8))
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    // Aura persistente: cada panel .lg sigue al cursor
    const auraMove = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('.lg') as HTMLElement | null
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%')
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%')
    }
    document.addEventListener('mousemove', auraMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('mousemove', onMove); removeEventListener('resize', resize)
      document.removeEventListener('mousemove', auraMove)
      cv.remove()
    }
  }, [])
  return null
}
