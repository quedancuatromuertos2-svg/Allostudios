'use client'

import { motion } from 'framer-motion'

const services = [
  { key: 'Gestión de Instagram', emoji: '📸', desc: 'Creamos y publicamos tu contenido cada semana con tu marca: carruseles de propiedades, reels y captions que captan.', price: 'Desde 199 €/mes' },
  { key: 'Anuncios Meta', emoji: '🎯', desc: 'Campañas en Instagram y Facebook para llenar tu agenda de interesados. Tú pones la inversión, nosotros la gestión.', price: '199 €/mes + inversión' },
  { key: 'Asistente IA en DMs', emoji: '🤖', desc: 'Un asistente que responde, cualifica y agenda visitas 24/7 en tus mensajes de Instagram y WhatsApp.', price: 'Desde 49 €/mes' },
  { key: 'Web Inmobiliaria', emoji: '🌐', desc: 'Web premium a medida con buscador de inmuebles, rapidísima y optimizada para convertir visitas en leads.', price: 'Desde 790 €' },
  { key: 'SEO', emoji: '🔎', desc: 'Aparece el primero en Google cuando alguien busca «inmobiliaria en tu zona».', price: '199 € + 99 €/mes' },
  { key: 'Reseñas Google', emoji: '⭐', desc: 'Un sistema para conseguir más reseñas de 5★ y subir en el mapa de Google.', price: '79 €/mes' },
]

function pick(servicio: string) {
  window.dispatchEvent(new CustomEvent('selectService', { detail: servicio }))
  document.querySelector('#contratar')?.scrollIntoView({ behavior: 'smooth' })
}

export default function ServicesCatalogSection() {
  return (
    <section id="catalogo" className="py-section bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="eyebrow block mb-4"
          >
            Servicios
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="text-headline font-semibold text-ink text-balance"
          >
            Todo lo que tu inmobiliaria<br />necesita para crecer online.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-xl mx-auto"
          >
            Elige lo que necesitas. Lo montamos y lo gestionamos por ti — tú solo cierras ventas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col bg-canvas rounded-2xl border border-border p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-[22px] mb-4">{s.emoji}</div>
              <h3 className="text-[17px] font-semibold text-ink mb-2">{s.key}</h3>
              <p className="text-[13.5px] text-dim font-light leading-relaxed flex-1 mb-5">{s.desc}</p>
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-[14px] font-semibold text-ink">{s.price}</span>
                <button
                  onClick={() => pick(s.key)}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:text-accent-dark transition-colors"
                >
                  Contratar
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button onClick={() => pick('No estoy seguro')} className="btn-accent px-8 py-4 rounded-full">
            ¿No sabes cuál te conviene? Te asesoramos gratis
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}
