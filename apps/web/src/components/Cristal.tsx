'use client'

import { useEffect, useRef } from 'react'

/*
  Cristal estriado en vivo. Un solo motor para los dos momentos de cristal de la web:
    · cabecera  (modo="marca"):  la luz de la marca (violeta → magenta → naranja → crema) con
                                 las letras «allo.» detrás del vidrio, siempre a la derecha
                                 del texto y a escala del viewport, sin imagen fija.
    · páginas web (modo="vivo"): grafito casi sin color; la luz aparece donde pasa el ratón.
  Cómo: en `luz` se pinta el campo de luz (y las letras); `vidrio` lo muestra a través de
  estrías verticales, cada una enseñando una franja K veces más ancha comprimida (lente
  cilíndrica); `relieve` es el brillo/sombra fijo de cada estría; encima, grano.
*/
const K = 2.6
const ESTRIA = 22
const VIDA = 1400

type Destello = { x: number; y: number; t: number; r: number; tono: number }
type Props = { modo: 'marca' | 'vivo' }

export default function Cristal({ modo }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raiz = ref.current!
    const luz = raiz.querySelector<HTMLCanvasElement>('.cv-luz')!, vidrio = raiz.querySelector<HTMLCanvasElement>('.cv-vidrio')!, relieve = raiz.querySelector<HTMLCanvasElement>('.cv-relieve')!
    const lx = luz.getContext('2d')!, vx = vidrio.getContext('2d')!, rx = relieve.getContext('2d')!
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, raf = 0, visible = false, fuentes = false, t0 = performance.now()
    const raton = { x: -9999, y: -9999, sx: -9999, sy: -9999, dentro: false }
    const destellos: Destello[] = []
    document.fonts.load('700 100px Outfit').then(() => { fuentes = true; if (!raf) pintar(performance.now()) })

    function medir() {
      const r = raiz.getBoundingClientRect(); W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
      for (const c of [luz, vidrio, relieve]) { c.width = W; c.height = H }
      rx.clearRect(0, 0, W, H)
      const n = Math.ceil(W / ESTRIA), fuerte = modo === 'marca'
      for (let i = 0; i < n; i++) {
        const x0 = i * ESTRIA, g = rx.createLinearGradient(x0, 0, x0 + ESTRIA, 0)
        g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(.18, 'rgba(0,0,0,.08)'); g.addColorStop(.55, `rgba(255,255,255,${fuerte ? .2 : .12})`); g.addColorStop(.8, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.5)')
        rx.fillStyle = g; rx.fillRect(x0, 0, ESTRIA, H)
      }
      pintar(performance.now())
    }

    function campoMarca(seg: number) {
      // fondo grafito violáceo; la luz cálida vive a la derecha, la izquierda queda para el texto
      lx.fillStyle = '#0E0B14'; lx.fillRect(0, 0, W, H)
      const dx = Math.sin(seg / 31) * W * 0.012, dy = Math.cos(seg / 37) * H * 0.02
      let g = lx.createRadialGradient(W * 0.86 + dx, H * 0.3 + dy, 0, W * 0.86 + dx, H * 0.3 + dy, Math.max(W, H) * 0.55)
      g.addColorStop(0, '#FFE2B0'); g.addColorStop(.22, '#FF7A2A'); g.addColorStop(.5, '#FF4FA3'); g.addColorStop(.78, 'rgba(91,91,214,0)')
      lx.fillStyle = g; lx.fillRect(0, 0, W, H)
      g = lx.createRadialGradient(W * 0.3 - dx, H * 0.45, 0, W * 0.3 - dx, H * 0.45, Math.max(W, H) * 0.5)
      g.addColorStop(0, 'rgba(255,79,163,.55)'); g.addColorStop(.45, 'rgba(91,91,214,.55)'); g.addColorStop(1, 'rgba(91,91,214,0)')
      lx.fillStyle = g; lx.fillRect(0, 0, W, H)
      g = lx.createRadialGradient(W * 0.05, H * 0.95, 0, W * 0.05, H * 0.95, Math.max(W, H) * 0.5)
      g.addColorStop(0, 'rgba(91,91,214,.6)'); g.addColorStop(1, 'rgba(91,91,214,0)')
      lx.fillStyle = g; lx.fillRect(0, 0, W, H)
      // velo: izquierda (texto) y abajo, más oscuros
      g = lx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'rgba(14,11,20,.62)'); g.addColorStop(.4, 'rgba(14,11,20,.3)'); g.addColorStop(.62, 'rgba(14,11,20,0)')
      lx.fillStyle = g; lx.fillRect(0, 0, W, H)
      g = lx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, 'rgba(14,11,20,.35)'); g.addColorStop(.3, 'rgba(14,11,20,0)'); g.addColorStop(.62, 'rgba(14,11,20,0)'); g.addColorStop(1, 'rgba(14,11,20,.8)')
      lx.fillStyle = g; lx.fillRect(0, 0, W, H)
      // letras «allo.»: centradas en el 76 % del ancho, a escala del viewport (nunca pisan el texto)
      if (fuentes) {
        const movil = W < 768
        const tam = movil ? Math.min(W * 0.34, H * 0.22) : Math.min(W * 0.2, H * 0.48)
        lx.font = `700 ${tam}px Outfit, sans-serif`; lx.textAlign = 'center'; lx.textBaseline = 'middle'
        lx.fillStyle = 'rgba(10,8,6,.86)'
        lx.fillText('allo.', movil ? W * 0.5 : W * 0.76, movil ? H * 0.17 : H * 0.52)
      }
    }
    function campoVivo(ahora: number, seg: number) {
      lx.fillStyle = '#100F16'; lx.fillRect(0, 0, W, H)
      const ax = W * (0.5 + 0.18 * Math.sin(seg / 19)), ay = H * (0.45 + 0.12 * Math.cos(seg / 23))
      let g = lx.createRadialGradient(ax, ay, 0, ax, ay, Math.max(W, H) * 0.55)
      g.addColorStop(0, 'rgba(91,91,214,.22)'); g.addColorStop(.5, 'rgba(59,108,255,.08)'); g.addColorStop(1, 'rgba(0,0,0,0)')
      lx.fillStyle = g; lx.fillRect(0, 0, W, H)
      raton.sx += (raton.x - raton.sx) * 0.12; raton.sy += (raton.y - raton.sy) * 0.12
      if (raton.dentro) {
        const r = Math.min(W, H) * 0.34
        g = lx.createRadialGradient(raton.sx, raton.sy, 0, raton.sx, raton.sy, r)
        g.addColorStop(0, 'rgba(255,226,176,.34)'); g.addColorStop(.35, 'rgba(255,122,42,.16)'); g.addColorStop(.7, 'rgba(255,79,163,.06)'); g.addColorStop(1, 'rgba(0,0,0,0)')
        lx.fillStyle = g; lx.fillRect(raton.sx - r, raton.sy - r, r * 2, r * 2)
      }
      for (let i = destellos.length - 1; i >= 0; i--) {
        const d = destellos[i], v = (ahora - d.t) / VIDA
        if (v >= 1) { destellos.splice(i, 1); continue }
        const a = (1 - v) * (1 - v) * 0.55, r = d.r * (0.6 + v * 0.8), c = d.tono < 0.5 ? '255,241,184' : '255,139,200'
        g = lx.createRadialGradient(d.x, d.y, 0, d.x, d.y, r)
        g.addColorStop(0, `rgba(${c},${a})`); g.addColorStop(.4, `rgba(${c},${a * 0.35})`); g.addColorStop(1, `rgba(${c},0)`)
        lx.fillStyle = g; lx.fillRect(d.x - r, d.y - r, r * 2, r * 2)
      }
    }

    function pintar(ahora: number) {
      const seg = (ahora - t0) / 1000
      if (modo === 'marca') campoMarca(seg); else campoVivo(ahora, seg)
      const n = Math.ceil(W / ESTRIA), srcW = ESTRIA * K
      for (let i = 0; i < n; i++) {
        const cx = i * ESTRIA + ESTRIA / 2, sx = Math.max(0, Math.min(W - srcW, cx - srcW / 2))
        vx.drawImage(luz, sx, 0, srcW, H, i * ESTRIA, 0, ESTRIA, H)
      }
    }
    function bucle(ahora: number) { if (visible && !quieto) { pintar(ahora); raf = requestAnimationFrame(bucle) } else raf = 0 }
    const arrancar = () => { if (!raf && visible && !quieto) raf = requestAnimationFrame(bucle) }

    let ultimo = 0
    function mover(x: number, y: number) {
      const r = raiz.getBoundingClientRect(); raton.x = x - r.left; raton.y = y - r.top; raton.dentro = true
      const ahora = performance.now()
      if (ahora - ultimo > 90) { ultimo = ahora; destellos.push({ x: raton.x + (Math.random() - .5) * 60, y: raton.y + (Math.random() - .5) * 60, t: ahora, r: 18 + Math.random() * 30, tono: Math.random() }); if (destellos.length > 24) destellos.shift() }
    }
    const onMove = (e: MouseEvent) => mover(e.clientX, e.clientY)
    const onLeave = () => { raton.dentro = false; raton.x = -9999; raton.y = -9999 }
    const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) mover(t.clientX, t.clientY) }
    const sec = raiz.parentElement!
    if (modo === 'vivo') { sec.addEventListener('mousemove', onMove); sec.addEventListener('mouseleave', onLeave); sec.addEventListener('touchmove', onTouch, { passive: true }); sec.addEventListener('touchend', onLeave) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; arrancar() }, { rootMargin: '80px' }); io.observe(raiz)
    const ro = new ResizeObserver(medir); ro.observe(raiz)
    medir()
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); sec.removeEventListener('mousemove', onMove); sec.removeEventListener('mouseleave', onLeave); sec.removeEventListener('touchmove', onTouch); sec.removeEventListener('touchend', onLeave) }
  }, [modo])

  return (
    <div ref={ref} className={`cristal cristal-${modo} absolute inset-0 pointer-events-none`} aria-hidden>
      <canvas className="cv-luz" />
      <canvas className="cv-vidrio" />
      <canvas className="cv-relieve" />
      <span className="cv-grano" />
    </div>
  )
}
