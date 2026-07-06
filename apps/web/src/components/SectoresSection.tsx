'use client'

import { motion } from 'framer-motion'

const I = (d: string) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: d }} />
)

const sectores = [
  { name: 'Peluquerías y estética', color: 'text-pink-600', d: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.12 15.88"/><path d="M14.47 14.48 20 20"/><path d="M8.12 8.12 12 12"/>' },
  { name: 'Clínicas y dentistas', color: 'text-blue-600', d: '<path d="M7 3C4.5 3 3 5 3 7.5c0 2 .8 3 1.5 5S5.5 21 7.5 21c1.8 0 1.4-4 2.5-6 .5-1 1.5-1 2 0 1.1 2 .7 6 2.5 6 2 0 2.3-6.5 3-8.5S21 9.5 21 7.5C21 5 19.5 3 17 3c-2 0-3 1-5 1s-3-1-5-1z"/>' },
  { name: 'Restaurantes y bares', color: 'text-orange-600', d: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>' },
  { name: 'Gimnasios', color: 'text-teal-600', d: '<path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18 22 4-4"/><path d="m2 6 4-4"/><path d="m3 10 7-7"/><path d="m14 21 7-7"/>' },
  { name: 'Talleres y reformas', color: 'text-yellow-700', d: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>' },
  { name: 'Veterinarios', color: 'text-purple-600', d: '<circle cx="11" cy="4" r="2"/><circle cx="18" cy="8" r="2"/><circle cx="20" cy="16" r="2"/><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"/>' },
  { name: 'Inmobiliarias', color: 'text-emerald-600', d: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { name: 'Comercios locales', color: 'text-red-600', d: '<path d="M2 3h19l-1 9H4z" transform="translate(0 2)"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/><path d="M2 5h3l1 9"/>' },
]

export default function SectoresSection() {
  return (
    <section id="sectores" className="py-16">
      <div className="max-w-5xl mx-auto px-6 md:px-12">

        <div className="text-center mb-10">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="eyebrow block mb-3"
          >Hecho para negocios locales</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="font-display text-[clamp(1.6rem,3vw,2.1rem)] font-semibold text-ink"
          >
            Pensado para cómo trabajas tú.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.14 }}
            className="mt-3 text-dim font-light text-sm max-w-sm mx-auto"
          >
            Si vives de captar y atender clientes, AlloStudios trabaja para tu negocio.
          </motion.p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {sectores.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.045, ease: [0.16, 1, 0.3, 1] }}
              className="lg flex items-center gap-2 rounded-full px-4 py-2.5 hover:-translate-y-0.5 transition-all duration-200 cursor-default"
            >
              <span className={`leading-none ${s.color}`}>{I(s.d)}</span>
              <span className="text-[13px] font-medium text-ink">{s.name}</span>
            </motion.div>
          ))}

          <motion.a
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: sectores.length * 0.045 }}
            href="https://wa.me/34695868793?text=Hola%2C%20tengo%20un%20negocio%20y%20quiero%20saber%20c%C3%B3mo%20AlloStudios%20puede%20ayudarme"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-accent/8 rounded-full border border-accent/20 px-4 py-2.5 hover:bg-accent/12 transition-all duration-200"
          >
            <span className="text-[13px] font-semibold text-accent">+ Cuéntame tu caso</span>
          </motion.a>
        </div>
      </div>
    </section>
  )
}
