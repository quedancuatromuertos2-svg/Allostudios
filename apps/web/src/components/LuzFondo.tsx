'use client'

/**
 * La luz de fondo de la marca: tres focos difusos, fijos detrás de todo, que se
 * transforman despacio según se baja por la página. Cada sección de <main> tiene
 * un estado (posición, tamaño y color de los tres focos); el scroll marca el
 * objetivo y los focos van hacia él con inercia, y además respiran solos muy
 * lentamente para que nunca esté quieta del todo (como un fondo vivo).
 *
 * Pintado con CSS: tres divs con radial-gradient y blur, movidos por transform.
 * Nada de canvas ni WebGL: barato y no compite con LiquidTrail.
 */
import { useEffect, useRef } from 'react'

type Foco = [x: number, y: number, tam: number, rol: string] // vw, vh, vw, rol de color
// Paletas: los mismos estados, otros colores. Se elige con la prop `paleta` (o ?paleta= en la URL, para previsualizar).
export const PALETAS: Record<string, Record<string, string>> = {
  marca:     { a: '#FF7A2A', b: '#FF4FA3', c: '#5B5BD6', d: '#3B6CFF', e: '#FFF1B8', o: '#121216' }, // naranja · magenta · violeta · azul
  atardecer: { a: '#FF5A1F', b: '#FF3D5A', c: '#FF8A5C', d: '#FFB86B', e: '#FFF0C2', o: '#121216' }, // naranja · rojo · melocotón (el cartel)
  brasa:     { a: '#FF2E12', b: '#FF7A2A', c: '#FFD23F', d: '#FF4FA3', e: '#FFF6D6', o: '#121216' }, // rojo · naranja · amarillo
  noche:     { a: '#3B6CFF', b: '#5B5BD6', c: '#8A5BFF', d: '#FF4FA3', e: '#EAE6FF', o: '#121216' }, // azul · violeta · lila · un toque magenta
  ceniza:    { a: '#FF7A2A', b: '#2A2A34', c: '#3A3A46', d: '#5B5BD6', e: '#FFE3C2', o: '#121216' }, // grafito con una sola brasa
}
const ESTADOS: Foco[][] = [
  [[50, 112, 74, 'a'], [50, 92, 96, 'b'], [50, -14, 110, 'c']],   // hero: la luz sube
  [[82, 60, 58, 'c'], [8, 84, 54, 'd'], [50, -30, 60, 'c']],     // datos
  [[80, 44, 64, 'b'], [84, 62, 42, 'a'], [-12, 22, 72, 'c']],    // generador
  [[50, 42, 96, 'c'], [50, 42, 54, 'o'], [50, 42, 76, 'b']],     // servicios: aura
  [[18, 30, 72, 'd'], [72, 56, 72, 'b'], [36, 82, 62, 'a']],     // sectores
  [[26, 42, 62, 'a'], [74, 64, 68, 'b'], [50, 104, 72, 'b']],    // webs: esferas cálidas
  [[50, 40, 88, 'b'], [50, 40, 50, 'o'], [50, 40, 70, 'a']],     // servicios detalle
  [[14, 20, 62, 'd'], [86, 82, 62, 'c'], [50, 50, 30, 'o']],     // cómo
  [[84, 22, 52, 'c'], [16, 90, 52, 'b'], [50, 50, 24, 'o']],     // testimonios
  [[50, 106, 84, 'a'], [50, 90, 104, 'b'], [50, 0, 60, 'c']],    // precios: cálida abajo
  [[86, 18, 52, 'c'], [14, 92, 52, 'd'], [50, 50, 20, 'o']],     // faq
  [[50, 50, 62, 'b'], [50, 50, 92, 'c'], [50, 50, 30, 'a']],     // contacto
  [[20, 70, 70, 'd'], [80, 30, 70, 'b'], [50, 100, 50, 'a']],    // comerciales
  [[50, 110, 74, 'e'], [50, 96, 96, 'a'], [50, 62, 112, 'b']],   // cta: el faro entero
]
const hex = (h: string) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const suave = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export default function LuzFondo({ paleta = 'marca' }: { paleta?: keyof typeof PALETAS }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const raiz = ref.current
    if (!raiz) return
    // Previsualización: ?paleta=brasa y ?tema=claro cambian paleta y tema sin tocar código
    const q = new URLSearchParams(window.location.search)
    const nombre = (q.get('paleta') && PALETAS[q.get('paleta')!]) ? q.get('paleta')! : paleta
    const P = PALETAS[nombre] || PALETAS.marca
    const col = (rol: string) => P[rol] || P.o
    const envoltorio = raiz.parentElement
    if (q.get('tema') === 'claro' && envoltorio) { envoltorio.classList.remove('tema-oscuro'); envoltorio.classList.add('tema-claro') }
    const focos = Array.from(raiz.querySelectorAll<HTMLElement>('i'))
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // estado actual de cada foco (x, y, tamaño, r, g, b) — arranca en el del hero
    const actual = ESTADOS[0].map(([x, y, s, c]) => [x, y, s, ...hex(col(c))])
    let objetivo = actual.map((f) => [...f])
    let raf = 0
    const t0 = performance.now()

    const secciones = () => Array.from(document.querySelectorAll<HTMLElement>('main > section, main > div'))

    const calcularObjetivo = () => {
      const secs = secciones()
      if (!secs.length) return
      const y = window.scrollY + window.innerHeight * 0.45
      let i = 0
      while (i < secs.length - 1 && secs[i + 1].offsetTop < y) i++
      const a = secs[i], b = secs[Math.min(i + 1, secs.length - 1)]
      const t = a === b ? 0 : suave(Math.max(0, Math.min(1, (y - a.offsetTop) / Math.max(1, b.offsetTop - a.offsetTop))))
      const A = ESTADOS[Math.min(i, ESTADOS.length - 1)], B = ESTADOS[Math.min(i + 1, ESTADOS.length - 1)]
      objetivo = A.map((fa, k) => {
        const fb = B[k], ca = hex(col(fa[3])), cb = hex(col(fb[3]))
        return [mix(fa[0], fb[0], t), mix(fa[1], fb[1], t), mix(fa[2], fb[2], t), mix(ca[0], cb[0], t), mix(ca[1], cb[1], t), mix(ca[2], cb[2], t)]
      })
    }

    const pintar = (now: number) => {
      const seg = (now - t0) / 1000
      // Inercia: cada foco se acerca un 3,5 % por fotograma a su objetivo (≈ 1,5 s para asentarse)
      const k = quieto ? 1 : 0.035
      focos.forEach((el, i) => {
        const o = objetivo[i], c = actual[i]
        for (let j = 0; j < 6; j++) c[j] += (o[j] - c[j]) * k
        // respiración: deriva lenta (periodos de 23–37 s) para que nunca esté quieta
        const dx = quieto ? 0 : Math.sin(seg / (23 + i * 7)) * 3, dy = quieto ? 0 : Math.cos(seg / (29 + i * 5)) * 3
        el.style.transform = `translate(calc(${(c[0] + dx).toFixed(2)}vw - 50%), calc(${(c[1] + dy).toFixed(2)}vh - 50%))`
        el.style.width = el.style.height = `${c[2].toFixed(1)}vw`
        el.style.background = `radial-gradient(circle, rgb(${c[3] | 0},${c[4] | 0},${c[5] | 0}) 0%, transparent 62%)`
      })
      raf = requestAnimationFrame(pintar)
    }

    calcularObjetivo()
    const onScroll = () => calcularObjetivo()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    raf = requestAnimationFrame(pintar)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll) }
  }, [])

  return (
    <div ref={ref} className="luz-fondo" aria-hidden>
      <i /><i /><i />
      <span className="luz-velo" />
      <span className="luz-grano" />
    </div>
  )
}
