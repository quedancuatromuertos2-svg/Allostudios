'use client'

import { motion } from 'framer-motion'

const brands = [
  'Restaurante Roma', 'Clínica Dental Plus', 'Beauty by Sara',
  'AutoMóvil Ruiz', 'Hotel Cala Nova', 'Peluquería Madrid',
  'Fisioterapia Core', 'Gestoría Pérez', 'Restaurante Roma',
  'Clínica Dental Plus', 'Beauty by Sara', 'AutoMóvil Ruiz',
]

export default function LogoBand() {
  return (
    <section className="py-12 border-y border-border bg-white overflow-hidden">
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-muted mb-8"
      >
        Con la confianza de negocios en toda España
      </motion.p>
      <div className="flex">
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {brands.map((b, i) => (
            <span key={i} className="text-sm font-medium text-muted/60 shrink-0 px-2">{b}</span>
          ))}
        </div>
        <div className="flex gap-12 animate-marquee whitespace-nowrap" aria-hidden>
          {brands.map((b, i) => (
            <span key={i} className="text-sm font-medium text-muted/60 shrink-0 px-2">{b}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
