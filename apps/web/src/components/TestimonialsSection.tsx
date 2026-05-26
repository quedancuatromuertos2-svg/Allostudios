'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    quote: 'Antes perdíamos al menos el 30% de las llamadas. Desde que tenemos AlloStudios, respondemos absolutamente todas, incluso a medianoche. Las reservas subieron un 40% en el primer mes.',
    name: 'Carlos Martínez',
    role: 'Propietario, Clínica Dental Plus · Madrid',
    stars: 5,
  },
  {
    quote: 'Configurarlo me llevó menos de 10 minutos. Ahora la IA gestiona todas las llamadas de citas y el calendario se llena solo. Por fin puedo centrarme en mis pacientes.',
    name: 'Ana García',
    role: 'Fisioterapeuta · Barcelona',
    stars: 5,
  },
  {
    quote: 'Los informes semanales son como tener un asistente que me dice exactamente qué funciona. Nunca había tenido tanta visibilidad sobre mi restaurante.',
    name: 'Miguel Torres',
    role: 'Director, Restaurante Roma · Valencia',
    stars: 5,
  },
  {
    quote: 'El organizador de facturas por sí solo me ahorra horas cada semana. Combinado con las llamadas IA, es como tener un empleado que nunca duerme.',
    name: 'Sara Jiménez',
    role: 'Propietaria, Salón de Belleza · Sevilla',
    stars: 5,
  },
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="#F59E0B">
          <path d="M7 1l1.545 3.09L12 4.636l-2.5 2.454.59 3.456L7 8.909 3.91 10.546l.59-3.456L2 4.636l3.455-.546L7 1z"/>
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  const t = testimonials[current]

  return (
    <section className="py-section bg-white overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">

        <motion.span
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} className="eyebrow block mb-4"
        >Clientes reales</motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.08 }}
          className="text-headline font-semibold text-ink mb-16"
        >
          Negocios que eligieron crecer.
        </motion.h2>

        <div className="relative min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <Stars n={t.stars} />
              </div>
              <blockquote className="text-xl md:text-2xl font-light text-ink leading-relaxed max-w-2xl mx-auto tracking-[-0.01em] mb-8">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div>
                <div className="font-semibold text-ink text-sm">{t.name}</div>
                <div className="text-[12px] text-muted mt-0.5">{t.role}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? 'w-6 h-2 bg-accent' : 'w-2 h-2 bg-border hover:bg-muted'}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
