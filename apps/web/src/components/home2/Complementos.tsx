'use client'

import { motion } from 'framer-motion'
import { porClave, eur, luzDe } from '@/lib/precios'

/*  Complementos: como los accesorios de Apple. Dos, no seis. Se añaden a cualquier pack. */

const ITEMS = [
  {
    clave: 'AEO',
    dolor: '«Mi hija le pregunta a ChatGPT dónde ir y recomienda a otro.»',
    que: 'Cuando alguien le pregunta a ChatGPT, Perplexity o Google por un negocio como el tuyo en tu zona, que salga el tuyo. Cada mes te enseñamos las preguntas reales y si sales o no.',
  },
  {
    clave: 'ADS',
    dolor: '«Tengo semanas flojas y no sé de dónde sacar gente.»',
    que: 'Campañas en Meta y Google que traen clientes de tu zona, con informe de qué entró y qué costó. Tú decides la inversión; nosotros la gestión.',
  },
]

export default function Complementos() {
  return (
    <section id="complementos" className="relative py-section overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow mb-4">Complementos</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-headline font-semibold text-ink text-balance"
          >
            Se añaden a cualquier pack.<br />Sin permanencia.
          </motion.h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {ITEMS.map((x, i) => {
            const a = porClave(x.clave)!
            return (
              <motion.a
                key={x.clave}
                href={`/contratar/${x.clave.toLowerCase()}`}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="lg rounded-2xl p-2 pb-7 flex flex-col hover:-translate-y-1 transition-transform duration-500 group"
              >
                <div className="h-44 rounded-[14px] mb-6 relative overflow-hidden" style={{ backgroundImage: `url(/marca/luces/${luzDe(x.clave)}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,0) 30%, rgba(11,11,16,.7) 100%)' }} />
                  <p className="absolute left-5 right-5 bottom-4 text-[15px] font-medium text-white leading-snug text-balance">{x.dolor}</p>
                </div>
                <div className="px-5 flex-1 flex flex-col">
                  <h3 className="font-display text-[22px] font-semibold text-ink tracking-[-0.02em]">{a.nombre}</h3>
                  <p className="mt-2 text-[14px] text-dim font-light leading-relaxed flex-1">{x.que}</p>
                  <div className="mt-5 flex items-baseline justify-between">
                    <span className="font-display text-[26px] font-semibold text-ink tracking-[-0.03em]">{eur(a.eur)}<span className="text-[13px] text-muted font-normal tracking-normal">/mes{x.clave === 'ADS' ? ' + inversión' : ''}</span></span>
                    <span className="text-[13px] font-semibold text-accent group-hover:underline underline-offset-4">Añadir →</span>
                  </div>
                </div>
              </motion.a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
