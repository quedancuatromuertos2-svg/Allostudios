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
    <section className="cierre relative overflow-hidden py-[clamp(5rem,10vw,9rem)] px-6 md:px-12">

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
          <span className="lg inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-semibold tracking-[0.22em] uppercase text-dim">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Plazas limitadas este mes
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2 variants={item}
          className="text-headline font-semibold text-ink leading-[1.1] tracking-[-0.03em] text-balance"
        >
          Los clientes que hoy se te escapan, mañana te llaman.
        </motion.h2>

        {/* Sub */}
        <motion.p variants={item}
          className="mt-5 text-lg text-dim font-light max-w-xl mx-auto leading-relaxed text-pretty"
        >
          Que te encuentren, que te contesten y que te lleguen. 0 € de entrada, una cuota al mes.
          Empieza viendo tu web gratis: sin registro, sin tarjeta.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <a href="#tu-web" className="btn-primario group inline-flex items-center gap-2.5 pl-7 pr-2.5 py-3.5 rounded-full text-[14px] font-semibold">
            Mira tu web gratis
            <span className="w-8 h-8 rounded-full flex items-center justify-center bg-white/20 transition-transform duration-500 group-hover:translate-x-1"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          </a>
          <a
            href="https://wa.me/34695868793?text=Hola%2C%20quiero%20hablar%20con%20un%20experto%20de%20AlloStudios"
            target="_blank"
            rel="noopener noreferrer"
            className="lg px-7 py-4 rounded-full text-[14px] font-semibold text-ink"
          >
            Hablar por WhatsApp
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p variants={item} className="mt-6 text-[12px] text-muted">
          0 € de entrada · En marcha en una semana · Precio cerrado
        </motion.p>
      </motion.div>
    </section>
  )
}
