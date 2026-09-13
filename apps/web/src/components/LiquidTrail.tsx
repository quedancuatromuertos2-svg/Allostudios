'use client'

/**
 * Rastro de color fluido, confinado al cristal.
 *
 * Antes este canvas pintaba el rastro sobre TODA la página: el cursor iba
 * dejando un arcoíris por encima del fondo y competía con el texto. Ahora el
 * rastro se sigue calculando igual, pero se recorta contra las superficies
 * translúcidas (.lg, .glass, .liquid-glass y los paneles con backdrop-filter
 * en línea). Fuera de ellas no se ve nada; cuando el cursor pasa por detrás de
 * un panel de cristal, este lo refracta con su propio blur.
 *
 * Dos exclusiones a propósito, porque enmascarar contra ellas es lo mismo que
 * no enmascarar: las capas decorativas a pantalla completa (pointer-events:none)
 * y cualquier panel que ocupe casi todo el viewport.
 *
 * También actualiza --mx/--my en cada .lg para su aura al hover — eso sí es un
 * efecto del propio panel translúcido, así que se queda.
 */
import { useEffect } from 'react'

/** Candidatos a cristal. Acotado a propósito: recorrer todo el DOM con
 *  getComputedStyle sería carísimo. `[style*="ackdrop"]` pilla los paneles que
 *  llevan el backdrop-filter en línea (React lo escribe en el atributo style). */
const CRISTAL = '.lg, [class*="glass"], [class*="backdrop-blur"], [style*="ackdrop"]'
const MAX_PANELES = 120

type Radio = { v: number; pct: boolean }
type Panel = { el: HTMLElement; rad: Radio[] }
/** Capa decorativa con backdrop-filter (p. ej. el lavado del hero). No es un
 *  panel, pero su blur desenfoca el rastro ya recortado y lo saca del cristal:
 *  hay que recortar ese margen más adentro en los paneles que cubre. */
type Lavado = { el: HTMLElement; blur: number }

const leerRadio = (s: string): Radio => ({ v: parseFloat(s) || 0, pct: s.trim().endsWith('%') })

export default function LiquidTrail() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // Sin ratón no hay rastro: en táctil el canvas solo gastaría batería.
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const cv = document.createElement('canvas')
    cv.id = 'lg-trail'
    document.body.prepend(cv)
    const ctx = cv.getContext('2d')!
    const DPR = Math.min(2, window.devicePixelRatio || 1)
    let W = 0, H = 0
    const resize = () => {
      W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR
      cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px'
    }
    resize(); addEventListener('resize', resize)

    // ── Inventario de cristal ────────────────────────────────────────────
    let paneles: Panel[] = []
    let lavados: Lavado[] = []
    const inventariar = () => {
      const out: Panel[] = []
      const lav: Lavado[] = []
      for (const el of Array.from(document.querySelectorAll<HTMLElement>(CRISTAL))) {
        if (out.length >= MAX_PANELES) break
        const s = getComputedStyle(el)
        const bf = s.backdropFilter || (s as unknown as { webkitBackdropFilter?: string }).webkitBackdropFilter || 'none'
        if (bf === 'none' || s.display === 'none' || s.visibility === 'hidden') continue
        if (s.pointerEvents === 'none') { // capa decorativa, no panel
          const m = /blur\((\d+(?:\.\d+)?)px\)/.exec(bf)
          if (m) lav.push({ el, blur: parseFloat(m[1]) })
          continue
        }
        out.push({
          el,
          rad: [s.borderTopLeftRadius, s.borderTopRightRadius, s.borderBottomRightRadius, s.borderBottomLeftRadius].map(leerRadio),
        })
      }
      paneles = out
      lavados = lav
    }
    inventariar()

    // El contenido se monta por trozos (framer-motion, rutas). Se reinventaría
    // en diferido: sin 'style' en el filtro, que el aura reescribe --mx/--my
    // en cada mousemove y dispararía el observer sin parar.
    let reinv = 0
    const mo = new MutationObserver(() => {
      clearTimeout(reinv); reinv = window.setTimeout(inventariar, 250)
    })
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] })

    /** Dibuja la silueta del cristal visible. Devuelve false si no hay ninguno
     *  a la vista: entonces no hace falta ni pintar el rastro. */
    const siluetaCristal = () => {
      let hay = false
      ctx.beginPath()
      for (const p of paneles) {
        const r = p.el.getBoundingClientRect()
        if (r.width < 2 || r.height < 2) continue
        if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) continue
        if (r.width >= innerWidth * 0.92 && r.height >= innerHeight * 0.85) continue // lavado a pantalla completa
        // Bajo un lavado, el blur del lavado sacaría el rastro ~1,8×blur fuera
        // del borde: se recorta ese margen más adentro.
        let inset = 0
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2
        for (const l of lavados) {
          const q = l.el.getBoundingClientRect()
          if (cx >= q.left && cx <= q.right && cy >= q.top && cy <= q.bottom) inset = Math.max(inset, l.blur * 1.8)
        }
        const w0 = r.width - 2 * inset, h0 = r.height - 2 * inset
        if (w0 < 2 || h0 < 2) continue
        hay = true
        const base = Math.min(r.width, r.height)
        const rr = p.rad.map((x) => Math.max(0, (x.pct ? (x.v / 100) * base : x.v) - inset) * DPR)
        const x = (r.left + inset) * DPR, y = (r.top + inset) * DPR, w = w0 * DPR, h = h0 * DPR
        if (ctx.roundRect) ctx.roundRect(x, y, w, h, rr)
        else ctx.rect(x, y, w, h)
      }
      return hay
    }

    // ── Rastro ───────────────────────────────────────────────────────────
    // Radio e intensidad son los del diseño aprobado (2026-07-06), calibrados
    // para .lg (12 % de blanco): a través de su blur(20px) el hilo de 7 px se
    // convierte en un halo suave. Subirlos vuelve la barra de navegación neón.
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
      raf = requestAnimationFrame(loop)

      hx += (tx - hx) * 0.22; hy += (ty - hy) * 0.22
      hue = (hue + 0.35) % 360
      const dx = hx - ph.x, dy = hy - ph.y, dist = Math.hypot(dx, dy)
      const steps = Math.max(1, Math.floor(dist / (R * 0.4)))
      for (let i = 0; i < steps; i++) {
        const t = i / steps
        pts.push({ x: ph.x + dx * t, y: ph.y + dy * t, h: (hue + t * 7) % 360, born: now })
      }
      ph.x = hx; ph.y = hy
      for (let i = pts.length - 1; i >= 0; i--) if (now - pts[i].born >= LIFE) pts.splice(i, 1)

      ctx.globalCompositeOperation = 'source-over'
      ctx.clearRect(0, 0, W, H)
      if (!siluetaCristal()) return // nada de cristal en pantalla: lienzo limpio

      ctx.save()
      ctx.clip()
      ctx.globalCompositeOperation = 'lighter'
      for (const p of pts) blob(p, Math.pow(1 - (now - p.born) / LIFE, 1.8))
      ctx.restore()
    }
    raf = requestAnimationFrame(loop)

    // Aura persistente: cada panel .lg sigue al cursor (efecto del propio panel)
    const auraMove = (e: MouseEvent) => {
      const el = (e.target as HTMLElement)?.closest('.lg') as HTMLElement | null
      if (!el) return
      const r = el.getBoundingClientRect()
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%')
      el.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%')
    }
    document.addEventListener('mousemove', auraMove, { passive: true })

    return () => {
      cancelAnimationFrame(raf); clearTimeout(reinv); mo.disconnect()
      removeEventListener('mousemove', onMove); removeEventListener('resize', resize)
      document.removeEventListener('mousemove', auraMove)
      cv.remove()
    }
  }, [])
  return null
}
