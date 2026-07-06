'use client'

import { motion } from 'framer-motion'

const chips = [
  { label: 'Instagram gestionado', dot: '#5b6bff' },
  { label: 'Webs profesionales', dot: '#2bb673' },
  { label: 'Anuncios · IA 24/7', dot: '#b45bff' },
]
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const item = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
}
const wa = 'https://wa.me/34695868793?text=' + encodeURIComponent('Hola, quiero mi demo gratis. Mi negocio es: ')

export default function HeroGlass() {
  return (
    <section className="relative min-h-[100dvh] flex flex-col items-center justify-center text-center px-6 pt-40 pb-24 overflow-hidden">
      <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-[2] max-w-3xl">
        <motion.div variants={item} className="lg inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] tracking-[0.22em] uppercase font-semibold text-[#3f3a52] mb-9">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#2bb673', boxShadow: '0 0 8px #2bb673' }} />
          Agencia digital · Valencia
        </motion.div>

        <motion.h1 variants={item} className="lg-h" style={{ fontSize: 'clamp(3rem,7.6vw,6rem)' }}>
          Más clientes.
          <span className="lg-grad block">Sin tocar el marketing.</span>
        </motion.h1>

        <motion.p variants={item} className="mt-7 max-w-xl mx-auto text-[#453f56]" style={{ fontSize: 'clamp(1rem,1.7vw,1.18rem)', lineHeight: 1.65 }}>
          Webs, Instagram, anuncios y un asistente de IA que responde 24/7 —
          para negocios locales de Valencia. Tú solo cierras.
        </motion.p>

        <motion.div variants={item} className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-9">
          <a href={wa} target="_blank" rel="noopener noreferrer"
            className="group inline-flex items-center gap-2.5 pl-7 pr-2.5 py-3.5 rounded-full font-semibold text-[14px] text-white transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
            style={{ background: 'linear-gradient(100deg,#6a5bff,#a05bff)', boxShadow: '0 16px 40px -14px rgba(140,91,255,.6),inset 0 1px 0 rgba(255,255,255,.4)' }}>
            Pide tu demo gratis
            <span className="w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-px" style={{ background: 'rgba(255,255,255,.22)', transitionTimingFunction: 'cubic-bezier(.32,.72,0,1)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.5"><path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </a>
          <a href="#precios" className="lg px-7 py-4 rounded-full font-semibold text-[14px] text-[#1e1a2b]">Ver planes</a>
        </motion.div>

        <motion.div variants={item} className="flex flex-wrap justify-center gap-2.5 mt-11">
          {chips.map(c => (
            <span key={c.label} className="lg inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[12px] font-medium text-[#2a2536]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
              {c.label}
            </span>
          ))}
        </motion.div>
      </motion.div>
    </section>
  )
}
