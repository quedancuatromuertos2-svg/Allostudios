'use client'

import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'Antes perdíamos al menos el 30% de las llamadas. Desde que tenemos AlloStudios respondemos absolutamente todas, incluso a medianoche. Las reservas subieron un 40% en el primer mes.',
    name: 'Carlos Martínez',
    role: 'Clínica Dental Plus · Madrid',
    initials: 'CM',
    color: 'bg-violet-50 text-violet-600',
    stars: 5,
  },
  {
    quote: 'Configurarlo me llevó menos de 10 minutos. Ahora la IA gestiona todas las llamadas de citas y el calendario se llena solo. Por fin puedo centrarme en mis pacientes.',
    name: 'Ana García',
    role: 'Fisioterapeuta · Barcelona',
    initials: 'AG',
    color: 'bg-blue-50 text-blue-600',
    stars: 5,
  },
  {
    quote: 'Los informes semanales son como tener un asistente que me dice exactamente qué funciona. Nunca había tenido tanta visibilidad sobre mi restaurante.',
    name: 'Miguel Torres',
    role: 'Restaurante Roma · Valencia',
    initials: 'MT',
    color: 'bg-emerald-50 text-emerald-600',
    stars: 5,
  },
  {
    quote: 'El organizador de facturas por sí solo me ahorra horas cada semana. Combinado con las llamadas IA, es como tener un empleado que nunca duerme.',
    name: 'Sara Jiménez',
    role: 'Salón de Belleza · Sevilla',
    initials: 'SJ',
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
            Clientes reales
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink text-balance"
          >
            Negocios que eligieron crecer.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-md mx-auto"
          >
            Más de 200 negocios confían en AlloStudios para automatizar su atención al cliente.
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
            { n: '200+', l: 'negocios activos' },
            { n: '4.9/5', l: 'valoración media' },
            { n: '98%', l: 'satisfacción' },
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
