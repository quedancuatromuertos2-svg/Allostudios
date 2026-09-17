'use client'

import { useEffect, useRef } from 'react'

/*
  El cartel de la cabecera dibujado en vivo, con la misma receta que MARCA-ALLOSTUDIOS/_motor/web-cristal.js
  (misma luz, mismos velos, mismas letras, estrías K=2.2 y relieve 0.8). La única diferencia: los tres focos
  de luz derivan muy despacio, como la luz de fondo del resto de la web, y las letras no se mueven.
  La imagen fija (hero-cristal.jpg) queda debajo como respaldo hasta que este canvas pinta su primer fotograma.
*/
export type PaletaCristal = { fondo: string; c1: string; c2: string; c3: string; c4: string }
export const PALETA_MARCA: PaletaCristal = { fondo: '#0E0B14', c1: '#5B5BD6', c2: '#FF4FA3', c3: '#FF7A2A', c4: '#FFE2B0' }
const K = 2.2, RELIEVE = 0.8, GRANO = 26

// texto: lo que va detrás del vidrio («allo.» en la web; el nombre del negocio en las demos cinematográficas).
// Si es más largo que «allo.», se reduce para ocupar el mismo ancho. paleta: colores de la luz.
export default function CristalHero({ texto = 'allo.', paleta = PALETA_MARCA }: { texto?: string; paleta?: PaletaCristal }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const P = paleta

  useEffect(() => {
    const vidrio = ref.current!, vx = vidrio.getContext('2d')!
    const luz = document.createElement('canvas'), lx = luz.getContext('2d')!        // campo de luz a baja resolución
    const letras = document.createElement('canvas'), tx = letras.getContext('2d')!  // letras a resolución completa
    const relieve = document.createElement('canvas'), rx = relieve.getContext('2d')!
    const grano = document.createElement('canvas'), gx = grano.getContext('2d')!
    const quieto = matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, N = 84, movil = false, raf = 0, visible = false, listo = false, t0 = performance.now(), ultimo = 0
    // Next carga Outfit con un nombre interno (__Outfit_xxxx); se lee de la variable CSS, no vale escribir «Outfit»
    const familia = (getComputedStyle(document.body).getPropertyValue('--font-outfit').trim() || 'Outfit') + ', sans-serif'

    const hex = (h: string, a = 1) => { const n = parseInt(h.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})` }
    // elipse radial (canvas solo tiene círculos: se escala el contexto)
    function elipse(x: CanvasRenderingContext2D, cx: number, cy: number, rx_: number, ry: number, paradas: [number, string][]) {
      x.save(); x.translate(cx, cy); x.scale(1, ry / rx_)
      const g = x.createRadialGradient(0, 0, 0, 0, 0, rx_); for (const [p, c] of paradas) g.addColorStop(p, c)
      x.fillStyle = g; x.fillRect(-rx_, -rx_, rx_ * 2, rx_ * 2); x.restore()
    }

    function medir() {
      const r = vidrio.getBoundingClientRect(); W = Math.max(1, Math.round(r.width)); H = Math.max(1, Math.round(r.height))
      movil = W < H; N = movil ? 44 : 84
      vidrio.width = W; vidrio.height = H; letras.width = W; letras.height = H; relieve.width = W; relieve.height = H; grano.width = W; grano.height = H
      luz.width = Math.round(W / 6); luz.height = Math.round(H / 6)
      // letras «allo.» (Outfit 700, tamaño 370/2560 del ancho en escritorio; 220/1080 en móvil)
      tx.clearRect(0, 0, W, H)
      let tam = movil ? W * 220 / 1080 : W * 370 / 2560
      const fuente = () => { tx.font = `700 ${tam}px ${familia}`; try { (tx as unknown as { letterSpacing: string }).letterSpacing = `${-0.05 * tam}px` } catch {} }
      fuente(); tx.textAlign = 'center'; tx.textBaseline = 'middle'
      // textos más largos que «allo.» se encogen para ocupar el mismo ancho (nunca pisan el panel)
      const anchoRef = tx.measureText('allo.').width, ancho = tx.measureText(texto).width
      if (ancho > anchoRef) { tam = tam * anchoRef / ancho; fuente() }
      // el cartel centra la caja de línea (line-height 1); el 'middle' del canvas queda ~0.08 em más arriba: se corrige
      tx.fillStyle = 'rgba(10,8,6,.86)'; tx.fillText(texto, movil ? W * .5 : W * .75, (movil ? H * .14 : H * .52) + tam * .08)
      // relieve de las estrías (fijo)
      rx.clearRect(0, 0, W, H); const sw = W / N
      for (let i = 0; i < N; i++) {
        const g = rx.createLinearGradient(i * sw, 0, (i + 1) * sw, 0)
        g.addColorStop(0, `rgba(0,0,0,${.55 * RELIEVE})`); g.addColorStop(.18, `rgba(0,0,0,${.08 * RELIEVE})`); g.addColorStop(.55, `rgba(255,255,255,${.22 * RELIEVE})`); g.addColorStop(.8, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(0,0,0,${.5 * RELIEVE})`)
        rx.fillStyle = g; rx.fillRect(i * sw, 0, sw, H)
      }
      // grano (fijo): ruido gris centrado, se mezcla en overlay
      const id = gx.createImageData(W, H), d = id.data
      for (let p = 0; p < d.length; p += 4) { const n = 128 + (Math.random() - .5) * GRANO * 2; d[p] = d[p + 1] = d[p + 2] = n; d[p + 3] = 255 }
      gx.putImageData(id, 0, 0)
      pintar(performance.now())
    }

    function campo(seg: number) {
      const w = luz.width, h = luz.height, veloIzq = movil ? 0 : .55, veloArr = movil ? .3 : .35
      // deriva lenta e independiente de cada foco (fracción del ancho)
      const d = (i: number, a: number) => Math.sin(seg / (5.5 + i * 1.7) + i * 1.7) * a * 3.2   // un 25 % más rápido que la primera versión
      lx.filter = `blur(${Math.round(w * .05)}px)`
      lx.fillStyle = P.fondo; lx.fillRect(0, 0, w, h)
      // mismos degradados que el cartel: lienzo al -20 % (por eso las medidas van sobre 1.4·w)
      const ox = -w * .2, oy = -h * .2, gw = w * 1.4, gh = h * 1.4
      lx.save(); lx.translate(ox, oy)
      const lin = lx.createLinearGradient(0, 0, gw * .26, gh); lin.addColorStop(0, P.c2); lin.addColorStop(.7, P.fondo); lx.fillStyle = lin; lx.fillRect(0, 0, gw, gh)
      elipse(lx, gw * (.05 + d(2, .035)), gh * (.95 + d(5, .03)), gw * .6, gh * .5, [[0, P.c1], [.6, hex(P.c1, 0)]])
      elipse(lx, gw * (.30 + d(1, .05)), gh * (.40 + d(4, .045)), gw * .5, gh * .6, [[0, P.c2], [.45, P.c1], [.76, hex(P.c1, 0)]])
      elipse(lx, gw * (.82 + d(0, .04)), gh * (.30 + d(3, .05)), gw * .45, gh * .55, [[0, P.c4], [.24, P.c3], [.52, P.c2], [.74, hex(P.c2, 0)]])
      lx.restore(); lx.filter = 'none'
      // velos (fijos): izquierda para el texto, arriba y abajo
      let v = lx.createLinearGradient(0, 0, w, 0); v.addColorStop(0, `rgba(11,11,16,${veloIzq})`); v.addColorStop(.34, `rgba(11,11,16,${veloIzq * .6})`); v.addColorStop(.58, 'rgba(11,11,16,0)'); lx.fillStyle = v; lx.fillRect(0, 0, w, h)
      v = lx.createLinearGradient(0, 0, 0, h); v.addColorStop(0, `rgba(11,11,16,${veloArr})`); v.addColorStop(.3, 'rgba(11,11,16,0)'); v.addColorStop(.6, 'rgba(11,11,16,0)'); v.addColorStop(1, 'rgba(11,11,16,.75)'); lx.fillStyle = v; lx.fillRect(0, 0, w, h)
    }

    function pintar(ahora: number) {
      campo((ahora - t0) / 1000)
      // base = luz (ampliada) + letras; después, cada estría enseña una franja K veces más ancha, comprimida
      const sw = W / N, srcW = sw * K
      vx.imageSmoothingEnabled = true; vx.imageSmoothingQuality = 'high'
      for (let i = 0; i < N; i++) {
        const cx = i * sw + sw / 2, sx = Math.max(0, Math.min(W - srcW, cx - srcW / 2)), fx = luz.width / W
        vx.drawImage(luz, sx * fx, 0, srcW * fx, luz.height, i * sw, 0, sw, H)
        vx.drawImage(letras, sx, 0, srcW, H, i * sw, 0, sw, H)
      }
      vx.drawImage(relieve, 0, 0)
      vx.globalCompositeOperation = 'overlay'; vx.globalAlpha = .5; vx.drawImage(grano, 0, 0); vx.globalAlpha = 1; vx.globalCompositeOperation = 'source-over'
      if (!listo) { listo = true; vidrio.classList.add('listo') }
    }
    function bucle(ahora: number) {
      if (!visible || quieto) { raf = 0; return }
      if (ahora - ultimo > 40) { ultimo = ahora; pintar(ahora) }  // ~25 fps: la deriva es lentísima, no hace falta más
      raf = requestAnimationFrame(bucle)
    }
    const arrancar = () => { if (!raf && visible && !quieto) raf = requestAnimationFrame(bucle) }
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; arrancar() }); io.observe(vidrio)
    const ro = new ResizeObserver(medir); ro.observe(vidrio)
    document.fonts.load(`700 100px ${familia}`).then(medir, medir)
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect() }
  }, [texto, paleta])

  return <canvas ref={ref} className="hero-vivo absolute inset-0 w-full h-full pointer-events-none" aria-hidden />
}
