'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { eur } from '@/lib/precios'

/*  Un capítulo por pack, como una página de producto de Apple: el nombre enorme, la
    frase del dolor debajo, un solo visual, tres fichas con un número cada una y el
    precio al final. Una idea por pantalla. Alterna papel (claro) y grafito (oscuro)
    con la luz de la marca de cada pack.                                              */

export type Ficha = { n: string; t: string; d: string }

export default function CapituloPack({
  id, numero, nombre, dolor, quien, luz, oscuro, visual, fichas, precio, incluye, url, destacado,
}: {
  id: string
  numero: string
  nombre: string
  dolor: string
  quien: string
  luz: string
  oscuro?: boolean
  visual: ReactNode
  fichas: Ficha[]
  precio: number
  incluye: string[]
  url: string
  destacado?: boolean
}) {
  const fondo = oscuro ? 'relative overflow-hidden' : 'papel papel-orbe relative overflow-hidden'
  const tInk = oscuro ? 'text-white' : 'text-ink'
  const tDim = oscuro ? 'text-white/60' : 'text-dim'
  const tMuted = oscuro ? 'text-white/40' : 'text-muted'
  const ficha = oscuro ? 'bg-white/[.06] border border-white/10' : 'lg'

  return (
    <section id={id} className={`${fondo} py-section`}>
      {oscuro && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 opacity-[.55]" style={{ backgroundImage: `url(/marca/luces/${luz}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.85) 0%, rgba(11,11,16,.35) 40%, rgba(11,11,16,.9) 100%)' }} />
        </div>
      )}

      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        {/* Nombre + dolor */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className={`text-[11.5px] font-semibold tracking-[0.16em] uppercase ${tMuted} mb-6 font-mono`}
          >
            Pack {numero}{destacado ? ' · El más elegido' : ''}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display text-[clamp(3.4rem,9vw,7.5rem)] leading-[.95] font-semibold tracking-[-0.045em] ${tInk}`}
          >
            {nombre}<span className="acento">.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.8 }}
            className={`mt-7 text-[clamp(1.35rem,2.6vw,1.9rem)] leading-snug font-medium tracking-[-0.02em] ${tInk} text-balance`}
          >
            «{dolor}»
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
            className={`mt-3 text-[15px] ${tDim} font-light`}
          >
            {quien}
          </motion.p>
        </div>

        {/* Visual */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: .97 }} whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 md:mt-20 flex justify-center"
        >
          {visual}
        </motion.div>

        {/* Fichas: un número, una idea */}
        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-4">
          {fichas.map((f, i) => (
            <motion.div
              key={f.t}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={`${ficha} rounded-2xl p-7 md:p-8`}
            >
              <div className={`font-display text-[clamp(2.4rem,4.5vw,3.6rem)] leading-none font-semibold tracking-[-0.04em] ${tInk}`}>{f.n}</div>
              <div className={`mt-4 text-[16px] font-semibold ${tInk}`}>{f.t}</div>
              <p className={`mt-1.5 text-[13.5px] ${tDim} font-light leading-relaxed`}>{f.d}</p>
            </motion.div>
          ))}
        </div>

        {/* Precio + qué lleva + botones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className={`mt-10 rounded-2xl ${oscuro ? 'bg-white/[.06] border border-white/10' : 'lg'} p-7 md:p-9 grid md:grid-cols-[1fr_auto] gap-8 items-center`}
        >
          <div>
            <div className="flex items-end gap-2">
              <span className={`font-display text-[clamp(2.6rem,5vw,4rem)] leading-none font-semibold tracking-[-0.04em] ${tInk}`}>{eur(precio)}</span>
              <span className={`pb-2 text-[15px] ${tDim}`}>/mes · 0 € de entrada</span>
            </div>
            <ul className={`mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] ${tDim}`}>
              {incluye.map((x) => (
                <li key={x} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />{x}
                </li>
              ))}
            </ul>
            <p className={`mt-4 text-[12px] ${tMuted}`}>12 meses y después mes a mes · si pagas el año por adelantado, dos meses gratis</p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <a href={url} className="btn-accent justify-center rounded-full px-8 py-4 text-[15px]">Contratar {nombre}</a>
            <a href="#tu-web" className={`text-center text-[13.5px] font-medium underline underline-offset-4 ${tDim} hover:${tInk}`}>Ver mi web gratis antes</a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
