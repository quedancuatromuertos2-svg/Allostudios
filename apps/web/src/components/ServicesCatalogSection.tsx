'use client'

import { motion } from 'framer-motion'

// `url`: la ficha real de contratación (antes el botón solo hacía scroll a un #contratar que no existe en /servicios)
const URL_DE: Record<string, string> = {
  'Anuncios Meta y Google': '/contratar/ads',
  'Asistente IA 24/7': '/contratar/asistente_ia',
  'Web profesional': '/webs',
  'Que la IA te recomiende': '/contratar/aeo',
  'SEO local en Google': '/contratar/seo_local',
  'Reseñas 5★ en Google': '/contratar/resenas',
}

const services = [
  { key: 'Anuncios Meta y Google', d: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>', desc: 'Tienes semanas flojas y no sabes de dónde sacar clientes. Campañas en Meta y Google que traen gente de tu zona, con informe de qué entró y qué costó. Tú pones la inversión, nosotros la gestión.', price: '199 €/mes + inversión · o en el Pack Max' },
  { key: 'Asistente IA 24/7', d: '<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/>', desc: 'Te escriben a las 22:00, contestas al día siguiente y ya han reservado en otro sitio. Un asistente responde tu WhatsApp al momento: horarios, precios, dudas y citas. Te avisa solo cuando hace falta una persona.', price: '149 €/mes · o en el Pack Pro' },
  { key: 'Web profesional', d: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>', desc: 'Te buscan en Google, entran en tu web (o no la tienes) y se van. Una web a medida, rápida y pensada para que te escriban. 0 € de entrada, lista en 7 días.', price: 'Desde 99 €/mes' },
  { key: 'Que la IA te recomiende', d: '<path d="M12 3a6 6 0 0 0-6 6c0 2.5 1.5 4 2.5 5.5S10 17 10 18h4c0-1 .5-2 1.5-3.5S18 11.5 18 9a6 6 0 0 0-6-6z"/><path d="M10 21h4"/>', desc: 'Cada vez más gente pregunta a ChatGPT "¿qué dentista me recomiendas en Benimaclet?". Hoy sale otro. Hacemos que salgas tú y te lo demostramos cada mes con las preguntas reales.', price: '99 €/mes · se añade a cualquier pack' },
  { key: 'SEO local en Google', d: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>', desc: 'Buscan tu servicio en tu barrio y en la primera pantalla sale la competencia. Trabajo mensual en tu ficha de Google y tu web para que salgas tú.', price: '99 €/mes · o en cualquier pack' },
  { key: 'Reseñas 5★ en Google', d: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>', desc: 'Tienes 12 reseñas y el de al lado 140: la gente elige al de 140. Un sistema que pide la reseña a cada cliente contento sin que tengas que perseguir a nadie.', price: '79 €/mes · o en cualquier pack' },
]

function pick(servicio: string) {
  window.dispatchEvent(new CustomEvent('selectService', { detail: servicio }))
  // El formulario vive en #contratar (home) o #contacto; si no está en esta página, se va a la home
  const destino = document.querySelector('#contratar') || document.querySelector('#contacto')
  if (destino) destino.scrollIntoView({ behavior: 'smooth' })
  else window.location.href = '/#contratar'
}

export default function ServicesCatalogSection({ titular = 'h2' }: { titular?: 'h1' | 'h2' }) {
  const H = titular === 'h1' ? motion.h1 : motion.h2
  return (
    <section id="catalogo" className="papel relative py-section overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="eyebrow block mb-4"
          >
            Lo que te está costando clientes
          </motion.span>
          <H
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.08 }}
            className="font-display text-headline font-semibold text-ink text-balance"
          >
            Cada semana pierdes clientes<br />por cosas que <span className="acento">se arreglan</span>.
          </H>
          <motion.p
            initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.16 }}
            className="mt-4 text-dim font-light max-w-xl mx-auto"
          >
            No te vendemos "IA". Te quitamos cada uno de estos agujeros. Elige el tuyo; lo montamos y lo llevamos nosotros.
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
                <a
                  href={URL_DE[s.key] || '/contratar'}
                  className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-accent hover:text-accent-dark transition-colors"
                >
                  {s.key === 'Web profesional' ? 'Ver webs' : 'Contratar'}
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
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
