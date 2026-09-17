'use client'

import { useEffect, useRef } from 'react'

/*
  Cristal estriado vivo (solo en «Páginas web»).
  Dos canvas: en `luz` se pinta un campo de luz casi apagado (grafito con un aura fría
  muy tenue) y los destellos cálidos que deja el ratón; `vidrio` lo muestra a través de N
  estrías verticales: cada estría enseña una franja K veces más ancha de la luz, comprimida
  (lente cilíndrica), con su brillo y su sombra fijos. Sin ratón solo queda el aura,
  respirando despacio. En táctil, el toque hace de ratón. Con reduced-motion, un fotograma.
*/
const K = 2.6          // compresión por estría
const ANCHO_ESTRIA = 22 // px CSS
const VIDA = 1400      // ms que dura un destello

type Destello = { x: number; y: number; t: number; r: number; tono: number }

export default function CristalVivo() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raiz = ref.current!
    const luz = raiz.querySelector<HTMLCanvasElement>('.cv-luz')!, vidrio = raiz.querySelector<HTMLCanvasElement>('.cv-vidrio')!, relieve = raiz.querySelector<HTMLCanvasElement>('.cv-relieve')!
    const lx = luz.getContext('2d')!, vx = vidrio.getContext('2d')!, rx = relieve.getContext('2d')!
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, raf = 0, visible = false, t0 = performance.now()
    const raton = { x: -9999, y: -9999, sx: -9999, sy: -9999, dentro: false }
    const destellos: Destello[] = []

    function medir() {
      const r = raiz.getBoundingClientRect(); W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
      for (const c of [luz, vidrio, relieve]) { c.width = W; c.height = H }
      // relieve de las estrías: se pinta una vez
      rx.clearRect(0, 0, W, H)
      const n = Math.ceil(W / ANCHO_ESTRIA)
      for (let i = 0; i < n; i++) {
        const x0 = i * ANCHO_ESTRIA, g = rx.createLinearGradient(x0, 0, x0 + ANCHO_ESTRIA, 0)
        g.addColorStop(0, 'rgba(0,0,0,.5)'); g.addColorStop(.18, 'rgba(0,0,0,.06)'); g.addColorStop(.55, 'rgba(255,255,255,.13)'); g.addColorStop(.8, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.45)')
        rx.fillStyle = g; rx.fillRect(x0, 0, ANCHO_ESTRIA, H)
      }
      pintar(performance.now())
    }

    function pintar(ahora: number) {
      const seg = (ahora - t0) / 1000
      // 1) campo de luz
      lx.fillStyle = '#100F16'; lx.fillRect(0, 0, W, H)
      // aura fría que respira (muy tenue: el apartado descansa)
      const ax = W * (0.5 + 0.18 * Math.sin(seg / 19)), ay = H * (0.45 + 0.12 * Math.cos(seg / 23))
      let g = lx.createRadialGradient(ax, ay, 0, ax, ay, Math.max(W, H) * 0.55)
      g.addColorStop(0, 'rgba(91,91,214,.22)'); g.addColorStop(.5, 'rgba(59,108,255,.08)'); g.addColorStop(1, 'rgba(0,0,0,0)')
      lx.fillStyle = g; lx.fillRect(0, 0, W, H)
      // el ratón sigue con retraso (inercia)
      raton.sx += (raton.x - raton.sx) * 0.12; raton.sy += (raton.y - raton.sy) * 0.12
      if (raton.dentro) {
        const r = Math.min(W, H) * 0.34
        g = lx.createRadialGradient(raton.sx, raton.sy, 0, raton.sx, raton.sy, r)
        g.addColorStop(0, 'rgba(255,226,176,.34)'); g.addColorStop(.35, 'rgba(255,122,42,.16)'); g.addColorStop(.7, 'rgba(255,79,163,.06)'); g.addColorStop(1, 'rgba(0,0,0,0)')
        lx.fillStyle = g; lx.fillRect(raton.sx - r, raton.sy - r, r * 2, r * 2)
      }
      // destellos: chispas que deja el movimiento y se apagan
      for (let i = destellos.length - 1; i >= 0; i--) {
        const d = destellos[i], v = (ahora - d.t) / VIDA
        if (v >= 1) { destellos.splice(i, 1); continue }
        const a = (1 - v) * (1 - v) * 0.55, r = d.r * (0.6 + v * 0.8)
        g = lx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r)
        const c = d.tono < 0.5 ? '255,241,184' : '255,139,200'
        g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(.4, `rgba(${c},${a * 0.35})`); g.addColorStop(1, `rgba(${c},0)`)
        lx.fillStyle = g; lx.fillRect(d.x - r, d.y - r, r * 2, r * 2)
      }
      // 2) a través de las estrías
      const n = Math.ceil(W / ANCHO_ESTRIA), srcW = ANCHO_ESTRIA * K
      for (let i = 0; i < n; i++) {
        const cx = i * ANCHO_ESTRIA + ANCHO_ESTRIA / 2, sx = Math.max(0, Math.min(W - srcW, cx - srcW / 2))
        vx.drawImage(luz, sx, 0, srcW, H, i * ANCHO_ESTRIA, 0, ANCHO_ESTRIA, H)
      }
    }

    function bucle(ahora: number) {
      if (visible && !quieto) { pintar(ahora); raf = requestAnimationFrame(bucle) } else raf = 0
    }
    const arrancar = () => { if (!raf && visible && !quieto) raf = requestAnimationFrame(bucle) }

    let ultimo = 0
    function mover(x: number, y: number) {
      const r = raiz.getBoundingClientRect(); raton.x = x - r.left; raton.y = y - r.top; raton.dentro = true
      const ahora = performance.now()
      if (ahora - ultimo > 90) {  // una chispa cada ~90 ms, cerca del cursor, pequeña
        ultimo = ahora
        destellos.push({ x: raton.x + (Math.random() - .5) * 60, y: raton.y + (Math.random() - .5) * 60, t: ahora, r: 18 + Math.random() * 30, tono: Math.random() })
        if (destellos.length > 24) destellos.shift()
      }
    }
    const onMove = (e: MouseEvent) => mover(e.clientX, e.clientY)
    const onLeave = () => { raton.dentro = false; raton.x = -9999; raton.y = -9999 }
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) mover(t.clientX, t.clientY) }
    const sec = raiz.parentElement!
    sec.addEventListener('mousemove', onMove); sec.addEventListener('mouseleave', onLeave)
    sec.addEventListener('touchmove', onTouch, { passive: true }); sec.addEventListener('touchend', onLeave)
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; arrancar() }, { rootMargin: '80px' })
    io.observe(raiz)
    const ro = new ResizeObserver(medir); ro.observe(raiz)
    medir()
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); sec.removeEventListener('mousemove', onMove); sec.removeEventListener('mouseleave', onLeave); sec.removeEventListener('touchmove', onTouch); sec.removeEventListener('touchend', onLeave) }
  }, [])

  return (
    <div ref={ref} className="cristal-vivo absolute inset-0 pointer-events-none" aria-hidden>
      <canvas className="cv-luz" />
      <canvas className="cv-vidrio" />
      <canvas className="cv-relieve" />
      <span className="cv-grano" />
    </div>
  )
}
