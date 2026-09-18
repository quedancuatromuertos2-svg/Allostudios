'use client'

import { motion } from 'framer-motion'
import { PACKS, WEBS, eur } from '@/lib/precios'

/*  "¿Qué pack es para ti?" — la tabla de comparación de Apple: tres columnas, una fila
    por pieza, tick o nada, precio y botón. Debajo, en pequeño, la web sola.            */

const FILAS: [string, (boolean | string)[]][] = [
  ['Web profesional, lista en 7 días', ['Arranque', 'Premium', 'Premium']],
  ['Hosting, cambios y soporte', [true, true, true]],
  ['Salir en Google en tu zona (SEO local)', [true, true, true]],
  ['Reseñas 5★ que se piden solas', [true, true, true]],
  ['Asistente que contesta tu WhatsApp 24/7', [false, true, true]],
  ['Anuncios en Meta y Google, gestionados', [false, false, true]],
  ['Informe el día 28: qué entró y qué costó', [true, true, true]],
  ['Un WhatsApp directo con nosotros', [true, true, true]],
]

function Celda({ v, oscuro }: { v: boolean | string; oscuro?: boolean }) {
  if (v === false) return <span className={`text-[16px] ${oscuro ? 'text-white/20' : 'text-ink/15'}`}>—</span>
  if (v === true)
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="text-accent inline-block">
        <path d="m5 12 5 5L20 7" />
      </svg>
    )
  return <span className={`text-[13px] font-medium ${oscuro ? 'text-white' : 'text-ink'}`}>{v}</span>
}

export default function ComparaPacks() {
  const NOMBRES = ['Estándar', 'Pro', 'Max']
  const PARA = ['Que te encuentren', 'Que te contesten', 'Que te lleguen clientes']
  return (
    <section id="compara" className="papel papel-violeta relative py-section overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="eyebrow mb-4">Compara</motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="font-display text-headline font-semibold text-ink text-balance"
          >
            ¿Qué pack es <span className="acento">para ti</span>?
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="lg rounded-2xl overflow-hidden"
        >
          {/* Cabecera */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] md:grid-cols-[1.8fr_1fr_1fr_1fr] border-b border-ink/10">
            <div className="p-4 md:p-6" />
            {PACKS.map((p, i) => (
              <div key={p.clave} className={`p-4 md:p-6 text-center ${i === 1 ? 'bg-ink text-white' : ''}`}>
                <div className={`font-display text-[clamp(1.3rem,2.4vw,1.8rem)] font-semibold tracking-[-0.02em] ${i === 1 ? 'text-white' : 'text-ink'}`}>{NOMBRES[i]}</div>
                <div className={`text-[11.5px] mt-0.5 ${i === 1 ? 'text-white/60' : 'text-muted'}`}>{PARA[i]}</div>
              </div>
            ))}
          </div>
          {/* Filas */}
          {FILAS.map(([k, vs]) => (
            <div key={k} className="grid grid-cols-[1.4fr_1fr_1fr_1fr] md:grid-cols-[1.8fr_1fr_1fr_1fr] border-b border-ink/[.06] last:border-0">
              <div className="p-3.5 md:p-4 md:px-6 text-[13px] md:text-[14px] text-dim">{k}</div>
              {vs.map((v, i) => (
                <div key={i} className={`p-3.5 md:p-4 text-center flex items-center justify-center ${i === 1 ? 'bg-ink/[.04]' : ''}`}>
                  <Celda v={v} />
                </div>
              ))}
            </div>
          ))}
          {/* Precio */}
          <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] md:grid-cols-[1.8fr_1fr_1fr_1fr] border-t border-ink/10">
            <div className="p-4 md:p-6 text-[13px] text-muted self-center">0 € de entrada · 12 meses, luego mes a mes</div>
            {PACKS.map((p, i) => (
              <div key={p.clave} className={`p-4 md:p-6 text-center ${i === 1 ? 'bg-ink/[.04]' : ''}`}>
                <div className="font-display text-[clamp(1.5rem,3vw,2.2rem)] font-semibold text-ink tracking-[-0.03em]">{eur(p.eur)}<span className="text-[13px] text-muted font-normal tracking-normal">/mes</span></div>
                <a href={`/contratar/${p.clave.toLowerCase()}`} className={`mt-3 inline-flex justify-center rounded-full px-5 py-2.5 text-[13px] font-semibold transition-all hover:-translate-y-0.5 ${i === 1 ? 'bg-accent text-white' : 'bg-ink text-white'}`}>
                  Contratar
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="text-center text-[13px] text-muted mt-8">
          ¿Solo quieres la web? {WEBS.map((w, i) => <span key={w.clave}>{i ? ' · ' : ''}<a href={`/contratar/${w.clave.toLowerCase()}`} className="underline underline-offset-4 text-ink">{w.nombre.replace('Web ', '')} {eur(w.eur)}/mes</a></span>)}.
          En cualquier pack, la Cinematográfica por +100 €/mes.
        </p>
      </div>
    </section>
  )
}
