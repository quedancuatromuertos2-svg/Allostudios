'use client'

import { motion } from 'framer-motion'

/*  Una sola línea de prueba, entre el hero y la tienda de packs. Números del Captador
    (data/leads.json, 18/09/2026): 2.965 negocios de Valencia, 692 sin web, y de las webs
    revisadas más de la mitad no deja pedir cita. Cuando haya un caso real, va aquí.     */

const DATOS = [
  ['2.965', 'negocios de Valencia analizados'],
  ['1 de 4', 'no tiene web'],
  ['1 de 2', 'no deja pedir cita'],
]

export default function PruebaMercado() {
  return (
    <section className="papel relative py-7 md:py-8 overflow-hidden border-y border-ink/[.06]">
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-center"
        >
          <span className="text-[11.5px] font-mono tracking-[0.14em] uppercase text-muted">Medido en Valencia</span>
          {DATOS.map(([n, t]) => (
            <span key={n} className="flex items-baseline gap-2">
              <span className="font-display text-[1.6rem] md:text-[1.9rem] leading-none font-semibold text-ink tracking-[-0.03em]">{n}</span>
              <span className="text-[13.5px] text-dim">{t}</span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
