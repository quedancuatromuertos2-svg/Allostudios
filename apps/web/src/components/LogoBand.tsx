'use client'

import { motion } from 'framer-motion'

const stats = [
  { value: '+200', label: 'negocios activos' },
  { value: '98%', label: 'mensajes atendidos' },
  { value: '99+', label: 'PageSpeed web' },
  { value: '7 días', label: 'entrega web' },
]

export default function LogoBand() {
  return (
    <section className="py-10 border-y border-border bg-white overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-[11px] font-semibold tracking-[0.22em] uppercase text-muted mb-8"
        >
          Con la confianza de negocios en toda España
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-border">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-center text-center px-4 py-2"
            >
              <span className="text-[32px] font-semibold text-ink tracking-[-0.03em] leading-none mb-1">
                {s.value}
              </span>
              <span className="text-[12px] text-muted font-light">{s.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
