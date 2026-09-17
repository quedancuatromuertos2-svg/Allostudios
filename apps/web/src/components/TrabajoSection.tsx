'use client'

import { motion } from 'framer-motion'

/*
  Trabajo reciente: las tres webs de concepto (reales, publicadas, etiquetadas como concepto).
  Sustituye a los testimonios inventados: para una agencia de webs, la prueba es la web.
*/
const trabajos = [
  { slug: 'navaja', nombre: 'Navaja', tipo: 'Barbería · Ruzafa', url: 'https://concepto-navaja.vercel.app', nota: 'Verde botella, latón y una carta de precios como la de un barbero de verdad.' },
  { slug: 'serra', nombre: 'Clínica Serra', tipo: 'Dental · Benimaclet', url: 'https://concepto-serra.vercel.app', nota: 'Madera, salvia y la primera visita gratis como gancho para pedir cita.' },
  { slug: 'sequer', nombre: 'Sequer', tipo: 'Arrocería · El Palmar', url: 'https://concepto-sequer.vercel.app', nota: 'Carbón y brasa: la paella al fuego a pantalla completa y reserva en un toque.' },
]
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
  show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

export default function TrabajoSection() {
  return (
    <section id="trabajo" className="py-section overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
            <div>
              <motion.span variants={fadeUp} className="eyebrow block mb-4">Trabajo reciente</motion.span>
              <motion.h2 variants={fadeUp} className="font-display text-headline font-semibold text-ink text-balance">
                Cada negocio, su propia web.<br />Ninguna se parece a otra.
              </motion.h2>
            </div>
            <motion.p variants={fadeUp} className="text-dim font-light max-w-sm md:text-right">
              Tres conceptos publicados para tres sectores distintos. Entra, tócalas: son webs de verdad.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {trabajos.map(t => (
              <motion.a key={t.slug} variants={fadeUp} href={t.url} target="_blank" rel="noopener noreferrer"
                className="trabajo group block rounded-[1.6rem] p-1.5 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-1">
                <div className="relative rounded-[calc(1.6rem-0.375rem)] overflow-hidden aspect-[4/3]">
                  <img src={`/marca/trabajo/${t.slug}.jpg`} alt={`Web de concepto ${t.nombre}`} loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]" />
                  <img src={`/marca/trabajo/${t.slug}-m.jpg`} alt="" aria-hidden loading="lazy"
                    className="absolute right-4 bottom-0 w-[22%] rounded-t-[10px] shadow-[0_20px_40px_-16px_rgba(0,0,0,.6)] translate-y-3 transition-transform duration-[1200ms] ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-y-1" />
                  <span className="absolute left-4 top-4 text-[10px] font-semibold tracking-[0.2em] uppercase px-2.5 py-1 rounded-full bg-black/40 text-white/85 backdrop-blur-md">Concepto</span>
                </div>
                <div className="px-3 pt-4 pb-2.5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-[17px] font-semibold text-ink">{t.nombre}</h3>
                    <span className="text-[11px] tracking-[0.12em] uppercase text-muted whitespace-nowrap">{t.tipo}</span>
                  </div>
                  <p className="mt-1.5 text-[13.5px] text-dim font-light leading-relaxed">{t.nota}</p>
                </div>
              </motion.a>
            ))}
          </div>

          <motion.p variants={fadeUp} className="mt-10 text-[13px] text-muted text-center">
            Negocios y datos ficticios, diseño real. La tuya la ves gratis en{' '}
            <a href="#tu-web" className="text-ink underline underline-offset-4 hover:text-accent transition-colors">20 segundos</a>.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
