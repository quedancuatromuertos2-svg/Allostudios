'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    n: '01',
    title: 'Configura en minutos',
    desc: 'Regístrate, personaliza tu IA con los datos de tu negocio, horarios y respuestas frecuentes. Te guiamos paso a paso en menos de 10 minutos.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
      </svg>
    ),
  },
  {
    n: '02',
    title: 'Activa tu IA',
    desc: 'Redirige tu número de negocio y tu recepcionista IA empieza a atender llamadas, gestionar reservas y responder clientes de forma inmediata.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
  {
    n: '03',
    title: 'Crece sin límites',
    desc: 'Recibe informes semanales con IA, controla reservas e ingresos, y escala tu negocio sin contratar personal. Funciona aunque tú no estés.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
  },
]

export default function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="como" ref={ref} className="py-section bg-white">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }} className="eyebrow block mb-4"
          >Cómo funciona</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }} className="text-headline font-semibold text-ink"
          >
            En marcha en menos<br />de 10 minutos.
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-[52px] left-[calc(16.6%+24px)] right-[calc(16.6%+24px)] h-px bg-border" />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative mb-8">
                <div className="w-[104px] h-[104px] rounded-full bg-accent-light flex items-center justify-center text-accent shadow-glow">
                  {s.icon}
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </div>
              </div>

              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted mb-2">{s.n}</div>
              <h3 className="text-[18px] font-semibold text-ink mb-3 tracking-[-0.01em]">{s.title}</h3>
              <p className="text-sm text-dim font-light leading-relaxed max-w-[260px]">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex justify-center mt-14"
        >
          <button
            onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-accent px-8 py-3.5"
          >
            Empieza hoy
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
