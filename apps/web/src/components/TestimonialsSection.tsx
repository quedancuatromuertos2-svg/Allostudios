'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'No teníamos web y la competencia salía primero en Google. AlloStudios nos hizo una que enamora, nos la enseñaron antes de pagar y ahora nos escriben cada semana. En una semana estaba online.',
    name: 'Javier R.',
    role: 'Barbería · Valencia',
    initials: 'JR',
    color: 'bg-violet-50 text-violet-600',
    stars: 5,
  },
  {
    quote: 'Trabajo sola y no llegaba a publicar. Ahora tengo un Instagram profesional y el asistente me responde los DMs y me manda los leads ya cualificados al WhatsApp.',
    name: 'Lucía F.',
    role: 'Peluquería · Valencia',
    initials: 'LF',
    color: 'bg-blue-50 text-blue-600',
    stars: 5,
  },
  {
    quote: 'Los clientes nos escriben a todas horas por Instagram. Ahora se atienden y filtran solos, y llego a la consulta con los leads ya cualificados y las citas puestas.',
    name: 'Marco D.',
    role: 'Clínica dental · Málaga',
    initials: 'MD',
    color: 'bg-emerald-50 text-emerald-600',
    stars: 5,
  },
  {
    quote: 'El asistente responde a cualquier hora, hasta en inglés. Ha sido un antes y un después: cero mensajes sin contestar y cero reservas que se escapan.',
    name: 'Elena P.',
    role: 'Restaurante · Alicante',
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
    <section className="py-section overflow-hidden">
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
            className="font-display text-headline font-semibold text-ink text-balance"
          >
            Negocios que no pierden un lead.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Los primeros negocios ya captan y cualifican cada contacto con AlloStudios.
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
              className="lg rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300"
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
