'use client'

import { motion } from 'framer-motion'
import { LogoMark } from './Logo'

export default function CTASection() {
  return (
    <section className="py-section px-6 md:px-12 bg-canvas relative overflow-hidden">
      <div className="absolute w-[600px] h-[600px] rounded-full bg-accent-light blur-[120px] top-[-30%] left-[-20%] opacity-70" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[#e8e8ff] blur-[80px] bottom-[-20%] right-[-10%] opacity-60" />

      <div className="relative z-10 max-w-3xl mx-auto text-center">

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent-light border border-accent/20 mb-8 text-accent"
        >
          <LogoMark size={32} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-headline font-semibold text-ink"
        >
          Gestionar tu negocio nunca<br />fue tan fácil.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-lg text-dim font-light max-w-xl mx-auto"
        >
          Únete a cientos de negocios que usan AlloStudios para automatizar la atención al cliente, llenar su agenda y crecer sin esfuerzo.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        >
          <button
            onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 flex items-center gap-2"
          >
            Empieza gratis — 7 días
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <a
            href="mailto:hola@allostudios.com"
            className="px-8 py-4 rounded-full border border-border text-dim hover:text-ink hover:border-ink/40 hover:bg-surface text-sm font-medium transition-all duration-300"
          >
            Hablar con ventas
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="mt-6 text-[12px] text-muted"
        >
          Sin permanencia · Configuración en 10 minutos · Cancela cuando quieras
        </motion.p>
      </div>
    </section>
  )
}
