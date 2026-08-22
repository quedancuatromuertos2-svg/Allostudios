'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ComisionCalculadora from '@/components/afiliados/ComisionCalculadora'

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 22, filter: 'blur(6px)' },
  show: {
    opacity: 1, y: 0, filter: 'blur(0px)',
    transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

const puntos = [
  'Te damos los negocios ya filtrados y su web de muestra hecha',
  'Guion de llamada, objeciones resueltas y correo de empresa',
  'Nosotros producimos, entregamos y cobramos. Tú solo llamas',
]

export default function ComercialesSection() {
  return (
    <section id="comerciales" className="relative overflow-hidden py-section">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(170deg, #FAFAF9 0%, #F3F3FE 50%, #EDEDFB 100%)',
      }} />
      <div className="absolute w-[600px] h-[600px] rounded-full blur-[130px] opacity-35 -bottom-40 -left-32 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,124,232,0.45) 0%, transparent 65%)' }} />
      <div className="absolute inset-0 line-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-[1fr_1.05fr] gap-12 lg:gap-16 items-center">

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <motion.span variants={fadeUp} className="eyebrow inline-flex items-center gap-2 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Trabaja con nosotros
            </motion.span>

            <motion.h2 variants={fadeUp} className="text-headline font-semibold text-ink text-balance">
              ¿Sabes vender?<br />Llévate el 30 %.
            </motion.h2>

            <motion.p variants={fadeUp} className="mt-5 text-[1.05rem] text-dim font-light leading-relaxed max-w-md text-pretty">
              No buscamos empleados: buscamos gente que coja el teléfono. Comisión pura,
              100 % remoto y sin invertir un euro. Mueve las barras y mira lo que se gana.
            </motion.p>

            <motion.ul variants={fadeUp} className="mt-7 space-y-3">
              {puntos.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[14px] text-dim font-light">
                  <span className="mt-[3px] w-4 h-4 shrink-0 rounded-full bg-accent-light text-accent flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 12 5 5L20 7" />
                    </svg>
                  </span>
                  {p}
                </li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link href="/afiliados#solicitud" className="btn-accent px-7 py-3.5 rounded-full">
                Quiero entrar
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link href="/afiliados" className="btn-secondary rounded-full justify-center">
                Cómo funciona
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <ComisionCalculadora />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
