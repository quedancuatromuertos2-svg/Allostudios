'use client'

import { motion } from 'framer-motion'
import { LogoMark } from './Logo'

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
    <section className="relative overflow-hidden bg-ink py-[clamp(5rem,12vw,10rem)] px-6 md:px-12">

      {/* Ambient orbs */}
      <div className="absolute w-[700px] h-[700px] rounded-full blur-[100px] top-[-30%] left-[-20%] opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 70%)' }} />
      <div className="absolute w-[500px] h-[500px] rounded-full blur-[80px] bottom-[-20%] right-[-15%] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7C7CE8 0%, transparent 70%)' }} />
      <div className="absolute w-[300px] h-[300px] rounded-full blur-[60px] top-[40%] right-[30%] opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5B5BD6 0%, transparent 70%)' }} />

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      {/* Content */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        {/* Logo mark */}
        <motion.div variants={item} className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 bg-white/5">
            <LogoMark size={34} color="white" />
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h2 variants={item}
          className="text-headline font-semibold text-white leading-[1.1] tracking-[-0.03em] text-balance"
        >
          Gestionar tu negocio nunca<br />fue tan fácil.
        </motion.h2>

        {/* Sub */}
        <motion.p variants={item}
          className="mt-5 text-lg text-white/50 font-light max-w-xl mx-auto leading-relaxed text-pretty"
        >
          Únete a cientos de negocios que usan AlloStudios para automatizar la atención al cliente,
          llenar su agenda y crecer sin esfuerzo.
        </motion.p>

        {/* CTAs */}
        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
          <button
            onClick={() => document.querySelector('#precios')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 rounded-full bg-accent hover:bg-accent-dark text-white text-sm font-semibold transition-all duration-300 hover:shadow-glow hover:-translate-y-0.5 active:scale-[0.98] flex items-center gap-2"
          >
            Empieza gratis — 7 días
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <a
            href="mailto:hola@allostudios.com"
            className="px-8 py-4 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 hover:bg-white/5 text-sm font-medium transition-all duration-300"
          >
            Hablar con ventas
          </a>
        </motion.div>

        {/* Trust line */}
        <motion.p variants={item} className="mt-6 text-[12px] text-white/25">
          Sin permanencia · Configuración en 10 minutos · Cancela cuando quieras
        </motion.p>

        {/* Divider dots */}
        <motion.div variants={item} className="flex items-center justify-center gap-2 mt-12">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="rounded-full bg-white/20"
              style={{ width: i === 2 ? 20 : 6, height: 6, opacity: i === 2 ? 1 : 0.4 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
