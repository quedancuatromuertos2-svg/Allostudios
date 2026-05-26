'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: '¿Cuánto tiempo tarda en estar activo?',
    a: 'Puedes estar en marcha en menos de 10 minutos. Regístrate, configura tu IA con los datos de tu negocio, redirige tu número de teléfono y tu asistente empieza a atender llamadas de inmediato.',
  },
  {
    q: '¿Necesito cambiar mi número de teléfono actual?',
    a: 'No. Simplemente redirigis tu número de negocio actual a AlloStudios. Tu número sigue siendo el mismo — los clientes llaman igual que siempre y tu IA responde.',
  },
  {
    q: '¿Puede la IA sonar como mi marca?',
    a: 'Sí. Eliges la voz, el nombre, el estilo de saludo y la personalidad. La IA puede ser cálida, profesional, cercana o formal — lo que mejor se adapte a tu negocio.',
  },
  {
    q: '¿Qué pasa con las llamadas que la IA no puede resolver?',
    a: 'Cualquier llamada que la IA no pueda resolver queda marcada para ti con transcripción completa y resumen. También puedes configurarla para transferir llamadas complejas directamente a tu móvil.',
  },
  {
    q: '¿Están seguros mis datos?',
    a: 'Absolutamente. Todos los datos están cifrados en tránsito y en reposo. Somos compatibles con el RGPD y nunca compartimos ni vendemos tus datos. Tú eres el propietario de toda tu información.',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, siempre. Sin contratos, sin permanencia. Cancela desde tu panel cuando lo desees y mantendrás el acceso hasta el final de tu período de facturación.',
  },
]

function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border last:border-none">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <span className={`text-[15px] font-medium transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-ink group-hover:text-accent'}`}>
          {faq.q}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 w-6 h-6 rounded-full bg-surface flex items-center justify-center"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke={isOpen ? '#5B5BD6' : '#706D69'} strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-sm text-dim font-light leading-relaxed pb-5 max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="py-section bg-canvas">
      <div className="max-w-3xl mx-auto px-6 md:px-12">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="eyebrow block mb-4"
          >Preguntas frecuentes</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink"
          >
            ¿Tienes dudas? Resueltas.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.16 }}
          className="bg-white rounded-2xl border border-border shadow-sm px-8"
        >
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={open === i}
              onClick={() => setOpen(open === i ? null : i)}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
