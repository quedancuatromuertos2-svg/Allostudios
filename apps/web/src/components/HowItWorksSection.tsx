'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const steps = [
  {
    n: '01',
    title: 'Configura en 10 minutos',
    desc: 'Regístrate, personaliza tu IA con los datos de tu negocio, horarios y preguntas frecuentes. Te guiamos paso a paso.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
    detail: 'Sin código. Sin técnicos. Solo configuración guiada.',
  },
  {
    n: '02',
    title: 'Activa tu recepcionista IA',
    desc: 'Redirige tu número de negocio en segundos. Tu IA empieza a atender llamadas, gestionar reservas y capturar leads de forma inmediata.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
    detail: 'Activa en cualquier momento. Pausa cuando quieras.',
  },
  {
    n: '03',
    title: 'Crece sin límites',
    desc: 'Recibe informes semanales con IA, controla reservas e ingresos en tiempo real, y escala sin contratar personal.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
      </svg>
    ),
    detail: 'Tu negocio crece incluso mientras duermes.',
  },
]

export default function HowItWorksSection() {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <section id="como" ref={ref} className="py-section bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6 }} className="eyebrow block mb-4"
          >
            Cómo funciona
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-headline font-semibold text-ink text-balance"
          >
            En marcha en menos<br />de 10 minutos.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Sin equipos técnicos. Sin instalaciones. Funciona desde el primer día.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">

          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-[52px] left-[calc(16.6%+28px)] right-[calc(16.6%+28px)] h-px"
            style={{ background: 'linear-gradient(90deg, transparent, #E8E6E3 20%, #E8E6E3 80%, transparent)' }} />

          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
              {/* Step icon + number */}
              <div className="relative mb-8">
                {/* Glow ring */}
                <div className="absolute inset-[-6px] rounded-full bg-accent-light opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="relative w-[104px] h-[104px] rounded-full bg-canvas border border-border flex items-center justify-center text-dim shadow-sm">
                  {s.icon}
                </div>

                {/* Step number pill */}
                <div className="absolute -top-1 -right-1 min-w-[26px] h-[26px] px-1.5 rounded-full bg-accent text-white text-[11px] font-bold flex items-center justify-center shadow-glow">
                  {i + 1}
                </div>
              </div>

              {/* Step label */}
              <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-muted mb-2">{s.n}</div>
              <h3 className="text-[18px] font-semibold text-ink mb-3 tracking-[-0.015em]">{s.title}</h3>
              <p className="text-[13.5px] text-dim font-light leading-relaxed max-w-[260px] mb-4">{s.desc}</p>

              {/* Detail chip */}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface border border-border text-[11.5px] font-medium text-dim">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <circle cx="5" cy="5" r="4" stroke="#5B5BD6" strokeWidth="1.2"/>
                  <path d="M5 3v2l1.2 1.2" stroke="#5B5BD6" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {s.detail}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="flex justify-center mt-14"
        >
          <button
            onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-accent px-8 py-3.5"
          >
            Empieza hoy — gratis
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
