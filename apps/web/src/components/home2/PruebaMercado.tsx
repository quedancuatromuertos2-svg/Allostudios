'use client'

import { motion } from 'framer-motion'

/*  Prueba antes de vender: números del mercado, no nuestros (todavía no hay clientes
    con nombre). Salen del Captador (data/leads.json, 18/09/2026): 2.965 negocios de
    Valencia analizados, 692 sin web, y de las webs revisadas más de la mitad no deja
    pedir cita. Cuando haya un caso real, este bloque se cambia por él.                 */

const DATOS = [
  { n: '2.965', t: 'negocios de Valencia analizados', d: 'peluquerías, clínicas, talleres, restaurantes, ópticas, gimnasios…' },
  { n: '1 de 4', t: 'no tiene web', d: '692 negocios. Cuando alguien los busca, acaba en la competencia.' },
  { n: '1 de 2', t: 'no deja pedir cita', d: 'de las webs revisadas. El que escribe a las 22:00 se va a otro.' },
]

export default function PruebaMercado() {
  return (
    <section className="papel relative py-section overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <motion.p
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="eyebrow text-center mb-12"
        >
          Lo hemos medido en Valencia, negocio a negocio
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
          {DATOS.map((x, i) => (
            <motion.div
              key={x.n}
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="text-center md:text-left"
            >
              <div className="font-display text-[clamp(3.2rem,7vw,5.6rem)] leading-none font-semibold text-ink tracking-[-0.04em]">{x.n}</div>
              <div className="mt-3 text-[17px] font-semibold text-ink">{x.t}</div>
              <p className="mt-1.5 text-[14px] text-dim font-light leading-relaxed max-w-xs mx-auto md:mx-0">{x.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
