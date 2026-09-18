'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { eur } from '@/lib/precios'
import { Timeline } from './Piezas'

/*  Un capítulo por pack, como una página de producto de Apple:
      1. el nombre enorme y la frase del dolor (en boca del dueño),
      2. un solo visual grande con parallax,
      3. un mosaico de piezas de producto (ficha de Google, notificación, agenda, anuncio…):
         cada pieza cuenta UNA cosa y el dueño se ve dentro,
      4. la caja de compra: precio, qué lleva, qué pasa en los 7 días siguientes y el botón.
    Alterna papel (claro) y grafito (oscuro) con la luz de la marca de cada pack.       */

export type Pieza = { titulo: string; sub?: string; nodo: ReactNode; ancho?: 1 | 2; alto?: 'normal' | 'alto' }

export default function CapituloPack({
  id, numero, nombre, dolor, quien, luz, oscuro, visual, mosaico, precio, incluye, timeline, url, destacado, notaVisual,
}: {
  id: string
  numero: string
  nombre: string
  dolor: string
  quien: string
  luz: string
  oscuro?: boolean
  visual: ReactNode
  notaVisual?: string
  mosaico: Pieza[]
  precio: number
  incluye: string[]
  timeline: [string, string][]
  url: string
  destacado?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const escala = useTransform(scrollYProgress, [0, 0.35], [0.9, 1])
  const subida = useTransform(scrollYProgress, [0, 0.35], [60, 0])
  const luzY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  const fondo = oscuro ? 'relative overflow-hidden' : 'papel papel-orbe relative overflow-hidden'
  const tInk = oscuro ? 'text-white' : 'text-ink'
  const tDim = oscuro ? 'text-white/60' : 'text-dim'
  const tMuted = oscuro ? 'text-white/40' : 'text-muted'
  const tile = oscuro ? 'bg-white/[.06] border border-white/10' : 'lg'

  return (
    <section id={id} ref={ref} className={`${fondo} py-section`}>
      {oscuro && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <motion.div style={{ y: luzY, backgroundImage: `url(/marca/luces/${luz}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }} className="absolute -inset-[10%] opacity-[.6]" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.88) 0%, rgba(11,11,16,.3) 38%, rgba(11,11,16,.55) 70%, rgba(11,11,16,.94) 100%)' }} />
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        {/* 1 · Nombre + dolor */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className={`text-[11.5px] font-semibold tracking-[0.16em] uppercase ${tMuted} mb-6 font-mono`}>
            Pack {numero}{destacado ? ' · El más elegido' : ''}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display text-[clamp(3.6rem,10vw,8.5rem)] leading-[.92] font-semibold tracking-[-0.05em] ${tInk}`}
          >
            {nombre}<span className="acento">.</span>
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
        <motion.div style={{ scale: escala, y: subida }} className="mt-14 md:mt-20 flex flex-col items-center">
          {visual}
          {notaVisual && <p className={`mt-6 text-[12px] ${tMuted} text-center`}>{notaVisual}</p>}
        </motion.div>

        {/* 3 · Mosaico de piezas */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-3 gap-4">
          {mosaico.map((p, i) => (
            <motion.div
              key={p.titulo}
              initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}
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
                <a href={url} className="btn-accent justify-center rounded-full px-8 py-4 text-[15px]">Contratar {nombre}</a>
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
