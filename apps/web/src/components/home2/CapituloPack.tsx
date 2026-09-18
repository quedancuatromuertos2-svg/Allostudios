'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { eur } from '@/lib/precios'
import { Timeline } from './Piezas'
import { BusquedaEnVivo, ChatEnVivo } from './Animadas'
import { FondoEstandar, FondoPro, FondoMax } from './Fondos'

/*  Un capítulo por pack, como una página de producto de Apple:
      1. el nombre enorme y la frase del dolor (en boca del dueño),
      2. un solo visual grande con parallax,
      3. un mosaico de piezas de producto (ficha de Google, notificación, agenda, anuncio…):
         cada pieza cuenta UNA cosa y el dueño se ve dentro,
      4. la caja de compra: precio, qué lleva, qué pasa en los 7 días siguientes y el botón.
    Alterna papel (claro) y grafito (oscuro) con la luz de la marca de cada pack.       */

export type Pieza = { titulo: string; sub?: string; nodo: ReactNode; ancho?: 1 | 2; alto?: 'normal' | 'alto' }

export default function CapituloPack({
  id, numero, nombre, dolor, quien, luz, oscuro, visual, efecto, mosaico, precio, incluye, timeline, url, destacado, notaVisual, nivel = 1,
}: {
  id: string
  numero: string
  nombre: string
  dolor: string
  quien: string
  luz: string
  oscuro?: boolean
  visual?: ReactNode
  /** Visual animado con el scroll de la sección (sustituye a `visual`): la búsqueda de Google o el chat */
  efecto?: 'busqueda' | 'chat'
  notaVisual?: string
  mosaico: Pieza[]
  precio: number
  incluye: string[]
  timeline: [string, string][]
  url: string
  destacado?: boolean
  /** 1 papel · 2 cristal oscuro · 3 cinematográfico (luz a toda pantalla, nombre en degradado, brillo) */
  nivel?: 1 | 2 | 3
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const escala = useTransform(scrollYProgress, [0, 0.35], [0.9, 1])
  const subida = useTransform(scrollYProgress, [0, 0.35], [60, 0])

  const fondo = oscuro ? 'relative overflow-clip' : 'papel relative overflow-clip'
  const tInk = oscuro ? 'text-white' : 'text-ink'
  const tDim = oscuro ? 'text-white/60' : 'text-dim'
  const tMuted = oscuro ? 'text-white/40' : 'text-muted'
  const tile = nivel === 3 ? 'border border-white/10 backdrop-blur-xl bg-[rgba(14,12,18,.72)]' : oscuro ? 'bg-white/[.06] border border-white/10' : 'lg'

  return (
    <section id={id} ref={ref} className={`${fondo} py-section`}>
      {/* Fondo propio de cada pack */}
      {nivel === 3 ? <FondoMax progreso={scrollYProgress} palabra={nombre.toUpperCase()} /> : oscuro ? <FondoPro progreso={scrollYProgress} /> : <FondoEstandar progreso={scrollYProgress} />}

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* 1 · Nombre + dolor */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className={`text-[11.5px] font-semibold tracking-[0.16em] uppercase ${tMuted} mb-6 font-mono`}>
            Pack {numero}{destacado ? ' · El más elegido' : ''}{nivel === 3 ? ' · Todo incluido' : ''}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display text-[clamp(3.6rem,10vw,8.5rem)] leading-[.92] font-semibold tracking-[-0.05em] ${tInk}`}
          >
            {nivel === 3 ? <span style={{ background: 'linear-gradient(90deg,#fff 0%,#FFC2A0 50%,#FF7A2A 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>{nombre}.</span> : <>{nombre}<span className="acento">.</span></>}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15, duration: 0.8 }}
            className={`mt-7 text-[clamp(1.4rem,2.8vw,2.1rem)] leading-snug font-medium tracking-[-0.025em] ${tInk} text-balance`}
          >
            «{dolor}»
          </motion.p>
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className={`mt-3 text-[15px] ${tDim} font-light`}>
            {quien}
          </motion.p>
        </div>

        {/* 2 · Visual grande con parallax */}
        <motion.div style={{ scale: escala, y: subida }} className={`${nivel === 3 ? 'mt-[34vh] md:mt-[40vh]' : 'mt-14 md:mt-20'} flex flex-col items-center relative`}>
          {nivel === 3 && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] h-[420px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(255,122,42,.35), rgba(91,91,214,.15) 60%, transparent)', filter: 'blur(40px)' }} />}
          {efecto === 'busqueda' ? <BusquedaEnVivo progreso={scrollYProgress} /> : efecto === 'chat' ? <ChatEnVivo progreso={scrollYProgress} /> : visual}
          {notaVisual && <p className={`mt-6 text-[12px] ${tMuted} text-center`}>{notaVisual}</p>}
        </motion.div>

        {/* 3 · Mosaico de piezas */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4">
          {mosaico.map((p, i) => (
            <motion.div
              key={p.titulo}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.1 }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
              className={`${tile} rounded-[22px] p-6 md:p-8 flex flex-col ${p.ancho === 2 ? 'md:col-span-2' : ''} ${p.alto === 'alto' ? 'md:row-span-2' : ''}`}
            >
              <div className="mb-6">
                <h3 className={`font-display text-[clamp(1.35rem,2.2vw,1.7rem)] leading-tight font-semibold tracking-[-0.025em] ${tInk} text-balance`}>{p.titulo}</h3>
                {p.sub && <p className={`mt-2 text-[14px] ${tDim} font-light leading-relaxed max-w-md`}>{p.sub}</p>}
              </div>
              <div className="mt-auto flex justify-center md:justify-start">{p.nodo}</div>
            </motion.div>
          ))}
        </div>

        {/* 4 · Caja de compra */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className={`mt-6 rounded-[22px] ${tile} overflow-hidden`}
        >
          <div className="grid lg:grid-cols-[1.1fr_1fr]">
            <div className="p-7 md:p-10">
              <p className={`text-[11.5px] font-semibold tracking-[0.16em] uppercase ${tMuted} font-mono`}>Pack {nombre}</p>
              <div className="mt-3 flex items-end gap-2 flex-wrap">
                <span className={`font-display text-[clamp(3rem,6vw,4.8rem)] leading-none font-semibold tracking-[-0.045em] ${tInk}`}>{eur(precio)}</span>
                <span className={`pb-2 text-[15px] ${tDim}`}>/mes</span>
                <span className={`pb-2 ml-2 text-[13px] font-semibold px-3 py-1 rounded-full ${oscuro ? 'bg-white/10 text-white' : 'bg-accent-light text-accent'}`}>0 € de entrada</span>
              </div>
              <ul className={`mt-6 grid sm:grid-cols-2 gap-x-6 gap-y-2.5 text-[14px] ${tDim}`}>
                {incluye.map((x) => (
                  <li key={x} className="flex items-start gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0 mt-[3px]"><path d="m5 12 5 5L20 7" /></svg>
                    {x}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href={url} className={`justify-center rounded-full px-8 py-4 text-[15px] font-semibold inline-flex items-center gap-2 transition-transform hover:-translate-y-0.5 ${nivel === 3 ? 'text-white' : 'btn-accent'}`} style={nivel === 3 ? { background: 'linear-gradient(90deg,#FF7A2A,#FF4FA3)', boxShadow: '0 12px 30px -10px rgba(255,122,42,.7)' } : undefined}>Contratar {nombre}</a>
                <a href="#tu-web" className={`inline-flex items-center justify-center rounded-full px-6 py-4 text-[14px] font-semibold border ${oscuro ? 'border-white/20 text-white hover:bg-white/10' : 'border-ink/15 text-ink hover:bg-ink/5'} transition-colors`}>Ver mi web gratis antes</a>
              </div>
              <p className={`mt-4 text-[12px] ${tMuted}`}>12 meses y después mes a mes · año por adelantado: dos meses gratis · contrato claro, lo lees antes de pagar</p>
            </div>
            <div className={`p-7 md:p-10 ${oscuro ? 'bg-white/[.04] border-l border-white/10' : 'bg-ink/[.03] border-l border-ink/[.06]'}`}>
              <p className={`text-[11.5px] font-semibold tracking-[0.16em] uppercase ${tMuted} font-mono mb-6`}>Qué pasa cuando contratas</p>
              <Timeline oscuro={oscuro} pasos={timeline} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
