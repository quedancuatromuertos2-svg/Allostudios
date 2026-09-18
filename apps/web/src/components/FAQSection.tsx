'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: '¿Cómo funciona el asistente de IA en WhatsApp?',
    a: 'Un asistente de IA responde los mensajes de WhatsApp de tu negocio 24/7: contesta dudas de tus productos o servicios, cualifica al interesado, capta su contacto y agenda la cita. Cuando hace falta, te avisa para que entres tú.',
    tag: 'Asistente IA',
  },
  {
    q: '¿Hacéis también campañas de anuncios (Meta Ads)?',
    a: 'Sí. Gestionamos tus campañas en Meta (Instagram y Facebook) y Google para captar clientes de tu zona. La inversión en anuncios la pones tú desde tu propia cuenta; nosotros nos encargamos de las creatividades, la segmentación y la optimización para que cada euro rinda. Va incluido en el Pack Todo o suelto por 199 €/mes.',
    tag: 'Anuncios',
  },
  {
    q: '¿Cuánto cuesta y qué incluye?',
    a: 'Funcionamos por suscripción: 0 € de entrada y una cuota mensual con 12 meses de permanencia. Tres packs: Presencia (199 €/mes: web + SEO local + reseñas), Crecimiento (349 €/mes: web premium + SEO + reseñas + asistente de IA en WhatsApp) y Todo (499 €/mes: lo anterior más campañas de Meta y Google Ads). Si solo quieres la web, desde 99 €/mes con hosting, cambios y soporte incluidos. Y la demo real de tu web la ves ANTES de pagar nada.',
    tag: 'Webs',
  },
  {
    q: '¿Por qué hay permanencia de 12 meses?',
    a: 'Porque no te cobramos nada por adelantado: la web, el SEO y la configuración del asistente los hacemos nosotros el primer mes y los recuperamos con la cuota. A cambio, sin sorpresas: el precio es cerrado y a los 12 meses sigues mes a mes, sin compromiso. Si prefieres pagar el año por adelantado, te regalamos dos meses.',
    tag: 'Packs',
  },
  {
    q: '¿Tengo que daros acceso a mis cuentas?',
    a: 'Solo lo imprescindible: tu ficha de Google para el SEO y las reseñas, el WhatsApp del negocio para el asistente y tu cuenta publicitaria si haces anuncios. Te guiamos en cada paso y tú mantienes siempre la propiedad de tus cuentas.',
    tag: 'General',
  },
  {
    q: '¿Puedo cancelar cuando quiera?',
    a: 'Los servicios sueltos, sí: nos avisas y dejamos de facturarte al final del mes en curso. Los packs y las webs tienen 12 meses de permanencia porque la entrada es 0 €; pasado el año, cancelas cuando quieras.',
    tag: 'General',
  },
]

const tagColors: Record<string, string> = {
  'Asistente IA': 'bg-accent/8 text-accent',
  'Anuncios': 'bg-orange-50 text-orange-600',
  'Webs': 'bg-emerald-50 text-emerald-600',
  'Packs': 'bg-accent/8 text-accent',
  'General': 'bg-surface text-muted',
}

function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="px-6">
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
          className="faq-colores space-y-3"
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
