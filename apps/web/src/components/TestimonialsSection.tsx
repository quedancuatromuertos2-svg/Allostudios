'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'Antes no teníamos tiempo para redes y la competencia nos comía terreno. Ahora AlloStudios nos lleva todo el Instagram y nos llegan contactos cada semana sin que toquemos nada.',
    name: 'Javier R.',
    role: 'Agencia inmobiliaria · Madrid',
    initials: 'JR',
    color: 'bg-violet-50 text-violet-600',
    stars: 5,
  },
  {
    quote: 'Trabajo sola y no llegaba a publicar. Ahora tengo un Instagram profesional y el asistente me responde los DMs y me manda los leads ya cualificados al WhatsApp.',
    name: 'Lucía F.',
    role: 'Agente independiente · Valencia',
    initials: 'LF',
    color: 'bg-blue-50 text-blue-600',
    stars: 5,
  },
  {
    quote: 'Los interesados nos escriben a todas horas por Instagram. Ahora se atienden y filtran solos: compra o alquiler, presupuesto y zona. Llego a la oficina con los leads ya cualificados.',
    name: 'Marco D.',
    role: 'Inmobiliaria · Málaga',
    initials: 'MD',
    color: 'bg-emerald-50 text-emerald-600',
    stars: 5,
  },
  {
    quote: 'El asistente responde en español e inglés a cualquier hora. Para el alquiler vacacional ha sido un antes y un después: cero mensajes sin contestar, cero reservas que se escapan.',
    name: 'Elena P.',
    role: 'Alquiler vacacional · Alicante',
    initials: 'EP',
    color: 'bg-rose-50 text-rose-600',
    stars: 5,
  },
]

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 14 14" fill="#F59E0B">
          <path d="M7 1l1.545 3.09L12 4.636l-2.5 2.454.59 3.456L7 8.909 3.91 10.546l.59-3.456L2 4.636l3.455-.546L7 1z"/>
        </svg>
      ))}
    </div>
  )
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  }),
}

export default function TestimonialsSection() {
  return (
    <section className="py-section bg-canvas overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="eyebrow block mb-4"
          >
            Primeros clientes
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink text-balance"
          >
            Inmobiliarias que no pierden un lead.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Las primeras agencias ya captan y cualifican cada contacto con AlloStudios.
          </motion.p>
        </div>

        {/* 2×2 grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-border p-7 flex flex-col gap-5 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <Stars />

              <blockquote className="text-[14.5px] text-dim font-light leading-[1.75] flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0 ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink leading-none">{t.name}</div>
                  <div className="text-[11px] text-muted mt-0.5">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10 text-center"
        >
          {[
            { n: '24/7', l: 'atención en DMs' },
            { n: '<2s', l: 'respuesta del asistente' },
            { n: '+3×', l: 'alcance en redes' },
          ].map(s => (
            <div key={s.l} className="flex flex-col items-center gap-0.5">
              <span className="text-[1.5rem] font-semibold text-ink tracking-[-0.03em]">{s.n}</span>
              <span className="text-[11px] text-muted font-medium">{s.l}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
