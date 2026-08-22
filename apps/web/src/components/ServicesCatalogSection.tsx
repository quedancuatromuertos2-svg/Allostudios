'use client'

import { motion } from 'framer-motion'

const services = [
  { key: 'Gestión de Instagram', d: '<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>', desc: 'Creamos y publicamos tu contenido cada semana con tu marca: carruseles, reels y textos que captan clientes.', price: 'Desde 199 €/mes' },
  { key: 'Anuncios Meta y Google', d: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', desc: 'Campañas para llenar tu agenda de interesados de tu zona. Tú pones la inversión, nosotros la gestión.', price: '199 €/mes + inversión' },
  { key: 'Asistente IA 24/7', d: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>', desc: 'Un asistente que responde, cualifica y agenda citas 24/7 en tus mensajes de Instagram y WhatsApp.', price: 'Desde 49 €/mes' },
  { key: 'Web profesional', d: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', desc: 'Web premium a medida, rapidísima y optimizada para convertir visitas en clientes.', price: '499 € + 49 €/mes' },
  { key: 'SEO local en Google', d: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', desc: 'Aparece el primero en Google cuando alguien busca tu servicio en tu zona.', price: '199 € + 99 €/mes' },
  { key: 'Reseñas 5★ en Google', d: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', desc: 'Un sistema para conseguir más reseñas de 5 estrellas y subir en el mapa de Google.', price: '79 €/mes' },
]

function pick(servicio: string) {
  window.dispatchEvent(new CustomEvent('selectService', { detail: servicio }))
  document.querySelector('#contratar')?.scrollIntoView({ behavior: 'smooth' })
}

export default function ServicesCatalogSection() {
  return (
    <section id="catalogo" className="py-section overflow-hidden">
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
            className="font-display text-headline font-semibold text-ink text-balance"
          >
            Todo lo que tu negocio<br />necesita para crecer online.
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
              className="lg flex flex-col rounded-2xl p-6 hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-accent-light flex items-center justify-center text-accent mb-4">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: s.d }} />
              </div>
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
