'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: '¿Qué hacéis exactamente con el Instagram de mi negocio?',
    a: 'Lo llevamos entero: creamos el contenido (carruseles, posts educativos, reels), escribimos los textos, lo diseñamos con tu marca y lo publicamos cada semana. Tú solo nos pasas las fotos de tu negocio y das el visto bueno.',
    tag: 'Instagram',
  },
  {
    q: '¿En cuánto tiempo veo resultados?',
    a: 'Empezamos a publicar la primera semana. El alcance y la imagen profesional mejoran desde el primer mes, y los clientes van llegando a medida que tu cuenta gana constancia y autoridad. Si quieres acelerarlo, lo combinamos con campañas de anuncios.',
    tag: 'Instagram',
  },
  {
    q: '¿Cómo funciona el asistente de IA en los DMs?',
    a: 'Un asistente de IA responde tus mensajes directos de Instagram y WhatsApp 24/7: contesta dudas de tus productos o servicios, cualifica al interesado, capta su contacto y agenda la cita. Cuando hace falta, te avisa para que entres tú.',
    tag: 'Asistente IA',
  },
  {
    q: '¿Hacéis también campañas de anuncios (Meta Ads)?',
    a: 'Sí. Gestionamos tus campañas en Instagram y Facebook para captar más clientes. La inversión en anuncios la pones tú desde tu propia cuenta; nosotros nos encargamos de las creatividades, la segmentación y la optimización para que cada euro rinda.',
    tag: 'Anuncios',
  },
  {
    q: '¿Cuánto cuesta una web y qué incluye?',
    a: 'Tenemos tres niveles: Arranque (499 € + 49 €/mes) con diseño a medida, móvil, SEO local y todo incluido; Premium (790 €) con animaciones y tus reseñas de Google; y Cinematográfica (desde 1.490 €) con el efecto de scroll estilo Apple. Todos sin permanencia. Y lo mejor: te enseñamos una demo real de tu web ANTES de que pagues nada.',
    tag: 'Webs',
  },
  {
    q: '¿Puedo juntar varios servicios en un solo plan?',
    a: 'Sí, y es lo más rentable. El Pack Completo reúne la web, la gestión de Instagram, los anuncios y el asistente de IA en los DMs — todo con un único partner y un solo interlocutor.',
    tag: 'Pack Completo',
  },
  {
    q: '¿Tengo que daros acceso a mis cuentas?',
    a: 'Para publicar y responder necesitamos acceso a tu Instagram (y a tu cuenta publicitaria si haces anuncios). Te guiamos en cada paso y tú mantienes siempre la propiedad de tus cuentas.',
    tag: 'General',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Sí, siempre. Sin contratos, sin permanencia. Nos avisas y dejamos de facturarte al final del período en curso.',
    tag: 'General',
  },
]

const tagColors: Record<string, string> = {
  'Instagram': 'bg-blue-50 text-blue-600',
  'Asistente IA': 'bg-accent/8 text-accent',
  'Anuncios': 'bg-orange-50 text-orange-600',
  'Webs': 'bg-emerald-50 text-emerald-600',
  'Pack Completo': 'bg-accent/8 text-accent',
  'General': 'bg-surface text-muted',
}

function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border last:border-none">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className={`hidden sm:inline-flex shrink-0 text-[10px] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 rounded-full ${tagColors[faq.tag]}`}>
            {faq.tag}
          </span>
          <span className={`text-[15px] font-medium transition-colors duration-200 ${isOpen ? 'text-accent' : 'text-ink group-hover:text-accent'}`}>
            {faq.q}
          </span>
        </div>
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
            <p className="text-sm text-dim font-light leading-relaxed pb-5 max-w-2xl pl-0 sm:pl-[88px]">
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
    <section id="faq" className="py-section">
      <div className="max-w-3xl mx-auto px-6 md:px-12">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} className="eyebrow block mb-4"
          >Preguntas frecuentes</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="font-display text-headline font-semibold text-ink"
          >
            ¿Tienes dudas? Resueltas.
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.16 }}
          className="lg rounded-2xl px-8"
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

        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ delay: 0.3 }}
          className="text-center mt-8 text-[13px] text-muted"
        >
          ¿No encuentras tu respuesta?{' '}
          <a
            href="https://wa.me/34695868793?text=Hola%2C%20tengo%20una%20pregunta%20sobre%20AlloStudios"
            target="_blank" rel="noopener noreferrer"
            className="text-accent font-medium hover:underline"
          >
            Escríbenos por WhatsApp
          </a>
        </motion.p>
      </div>
    </section>
  )
}
