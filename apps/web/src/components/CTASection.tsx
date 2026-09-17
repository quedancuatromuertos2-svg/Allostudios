'use client'

import { motion } from 'framer-motion'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-6 md:px-12">

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Eyebrow badge */}
        <motion.div variants={item} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-accent/20 shadow-sm text-[11px] font-semibold tracking-[0.12em] uppercase text-accent">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Plazas limitadas este mes
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2 variants={item}
          className="text-headline font-semibold text-ink leading-[1.1] tracking-[-0.03em] text-balance"
        >
          Tu negocio, captando clientes solo.
        </motion.h2>

        {/* Sub */}
        <motion.p variants={item}
          className="mt-5 text-lg text-dim font-light max-w-xl mx-auto leading-relaxed text-pretty"
        >
          Únete a los negocios que usan AlloStudios para llenar sus redes de contenido,
          captar interesados y responder cada DM con IA — sin perder un solo lead.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <button
            onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2"
          >
            Empieza ahora
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <a
            href="https://wa.me/34695868793?text=Hola%2C%20quiero%20hablar%20con%20un%20experto%20de%20AlloStudios"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-full border border-ink/15 text-ink/70 hover:text-ink hover:border-ink/30 hover:bg-white/60 text-sm font-medium transition-all duration-300 backdrop-blur-sm"
          >
            Hablar con un experto
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p variants={item} className="mt-6 text-[12px] text-muted">
          Sin permanencia · En marcha en una semana · Cancela cuando quieras
        </motion.p>
      </motion.div>
    </section>
  )
}
