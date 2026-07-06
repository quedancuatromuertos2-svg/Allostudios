'use client'

/**
 * Hero cinematográfico con fondo de vídeo controlado por SCROLL.
 * 121 fotogramas (public/hero-seq) pintados en un canvas: al hacer scroll por el
 * hero, la red 3D se ensambla fotograma a fotograma. En móvil se reproduce como
 * bucle ambiente (el scrubbing táctil no es fiable). Técnica estilo Apple.
 */
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

const FRAMES = 121
const src = (i: number) => `/hero-seq/f_${String(i + 1).padStart(3, '0')}.jpg`

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] } },
}

const chips = [
  { label: 'Instagram gestionado', dot: '#5B5BD6' },
  { label: 'Webs profesionales', dot: '#3fb950' },
  { label: 'Anuncios · IA 24/7', dot: '#f59e0b' },
]

export default function ScrollSequenceHero() {
  const wrapRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const framesRef = useRef<HTMLImageElement[]>([])
  const curRef = useRef(0)

  useEffect(() => {
    const imgs: HTMLImageElement[] = new Array(FRAMES)
    let loaded = 0
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const dpr = Math.min(2, window.devicePixelRatio || 1)

    const nearest = (i: number) => {
      if (imgs[i]?.complete) return imgs[i]
      for (let d = 1; d < FRAMES; d++) {
        if (imgs[i - d]?.complete) return imgs[i - d]
        if (imgs[i + d]?.complete) return imgs[i + d]
      }
      return null
    }
    const draw = () => {
      const im = nearest(Math.round(curRef.current))
      if (!im) return
      const cw = canvas.width, ch = canvas.height
      const ir = im.width / im.height, cr = cw / ch
      let dw, dh, dx, dy
      if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0 }
      else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2 }
      ctx.drawImage(im, dx, dy, dw, dh)
    }
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      draw()
    }

    // Carga progresiva: 1 de cada 4 primero (arranque rápido), luego el resto.
    const order = Array.from({ length: FRAMES }, (_, i) => i).sort((a, b) => (a % 4) - (b % 4))
    order.forEach((i) => {
      const im = new Image()
      im.onload = im.onerror = () => {
        loaded++
        if (loaded >= 24 && !ready) { setReady(true); resize() }
        if (loaded === FRAMES) draw()
      }
      im.src = src(i)
      imgs[i] = im
    })
    framesRef.current = imgs

    let target = 0, raf = 0
    const loop = () => {
      const wrap = wrapRef.current
      if (wrap) {
        const rect = wrap.getBoundingClientRect()
        const total = wrap.offsetHeight - window.innerHeight
        const p = Math.max(0, Math.min(1, -rect.top / total))
        target = p * (FRAMES - 1)
      }
      curRef.current += (target - curRef.current) * 0.18
      if (Math.abs(target - curRef.current) > 0.04) draw()
      raf = requestAnimationFrame(loop)
    }

    if (isTouch) {
      // Móvil: ciclo ambiente lento
      let dir = 1
      const tick = () => {
        curRef.current += dir * 0.5
        if (curRef.current >= FRAMES - 1) dir = -1
        if (curRef.current <= 0) dir = 1
        draw()
        raf = requestAnimationFrame(tick)
      }
      resize(); raf = requestAnimationFrame(tick)
    } else {
      resize(); raf = requestAnimationFrame(loop)
    }

    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

  return (
    <section ref={wrapRef} className="relative" style={{ height: '260vh', background: '#08090c' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Canvas de fondo (secuencia scrubada) */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: ready ? 1 : 0, transition: 'opacity .6s ease' }} />

        {/* Veladuras de legibilidad + viñeta */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(120% 90% at 50% 45%, transparent 40%, rgba(5,7,10,0.55) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(8,9,12,0.55) 0%, transparent 30%, transparent 60%, rgba(8,9,12,0.9) 100%)' }} />

        {/* Contenido */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
            <motion.div variants={item} className="flex flex-wrap justify-center gap-2 mb-8">
              {chips.map(c => (
                <span key={c.label} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold text-white/85"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.14)', backdropFilter: 'blur(10px)' }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
                  {c.label}
                </span>
              ))}
            </motion.div>

            <motion.h1 variants={item} className="text-white font-semibold leading-[1.04] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(2.6rem, 6.5vw, 5rem)' }}>
              Más clientes.
              <span className="block" style={{ background: 'linear-gradient(90deg,#7C9CFF,#5B5BD6)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                Sin tocar el marketing.
              </span>
            </motion.h1>

            <motion.p variants={item} className="mt-7 text-white/60 font-light max-w-xl mx-auto" style={{ fontSize: 'clamp(1rem,2vw,1.25rem)', lineHeight: 1.7 }}>
              Webs, Instagram, anuncios y un asistente de IA que responde 24/7 �
              para negocios locales de Valencia. Tú solo cierras.
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
              <a href={wa} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-[14px] text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ background: '#5B5BD6', boxShadow: '0 14px 40px -12px rgba(91,91,214,0.7)' }}>
                Pide tu demo gratis
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
              <button onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 rounded-full font-medium text-[14px] text-white/80 border border-white/20 hover:border-white/40 hover:text-white transition-colors duration-200">
                Ver planes
              </button>
            </motion.div>

            <motion.p variants={item} className="mt-5 text-white/35 text-[11.5px]">
              La demo siempre es gratis · Sin permanencia
            </motion.p>
          </motion.div>

          {/* Indicador de scroll */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: ready ? 1 : 0 }} transition={{ delay: 1.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-white/40 text-[10px] tracking-[0.2em] uppercase">Desliza</span>
            <div className="w-px h-9 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
