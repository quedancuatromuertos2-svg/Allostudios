'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { PACKS, WEBS, porClave, eur } from '@/lib/precios'
import { VisualChat, VisualInforme, VisualWeb } from './Visuales'

/*  "Elige tu pack" — la tienda de Apple ("Comprar un iPhone"): título grande, una línea de
    pestañas y tres tarjetas iguales con etiqueta, nombre, el producto y precio. Cada
    tarjeta lleva a su capítulo (más información) o directo a contratar.               */

const TARJETAS = [
  { clave: 'PACK_ESTANDAR', etiqueta: 'Que te encuentren', color: 'text-emerald-600', nombre: 'Estándar', dolor: 'Trabajo bien y no me encuentran.', visual: <VisualWeb compacto />, cap: '#estandar' },
  { clave: 'PACK_PRO', etiqueta: 'El más elegido', color: 'text-[#FF7A2A]', nombre: 'Pro', dolor: 'Contesto tarde y se van a otro.', visual: <VisualChat compacto />, cap: '#pro' },
  { clave: 'PACK_MAX', etiqueta: 'Que te lleguen clientes', color: 'text-accent', nombre: 'Max', dolor: 'Quiero llenar la agenda, no solo estar.', visual: <VisualInforme compacto />, cap: '#max' },
]

const PESTANAS = ['Todos los packs', 'Solo la web', 'Complementos']

export default function ElegirPack() {
  const [tab, setTab] = useState(0)
  const aeo = porClave('AEO')!
  const ads = porClave('ADS')!

  return (
    <section id="elegir" className="papel relative py-section overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-ink max-w-2xl"
        >
          Elige<br />tu pack.
        </motion.h2>

        {/* Pestañas */}
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-b border-ink/10 pb-3 text-[14.5px]">
          {PESTANAS.map((p, i) => (
            <button key={p} type="button" onClick={() => setTab(i)}
              className={`pb-1 transition-colors ${tab === i ? 'text-ink font-semibold border-b-2 border-ink -mb-[14px] pb-3' : 'text-dim hover:text-ink'}`}>
              {p}
            </button>
          ))}
        </div>

        <p className="mt-8 text-[clamp(1.2rem,2vw,1.5rem)] font-semibold text-ink tracking-[-0.02em]">
          {tab === 0 && <>Todos los packs. <span className="text-muted font-medium">Elige el tuyo.</span></>}
          {tab === 1 && <>Solo la web. <span className="text-muted font-medium">Todo incluido, 0 € de entrada.</span></>}
          {tab === 2 && <>Complementos. <span className="text-muted font-medium">Se añaden a cualquier pack.</span></>}
        </p>

        {/* Packs */}
        {tab === 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {TARJETAS.map((t, i) => {
              const p = porClave(t.clave)!
              return (
                <motion.div
                  key={t.clave}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="rounded-[22px] flex flex-col overflow-hidden"
                  style={{ background: '#fff', boxShadow: '0 1px 0 rgba(24,24,27,.04), 0 24px 50px -30px rgba(24,24,27,.25)' }}
                >
                  <div className="px-7 pt-7">
                    <p className={`text-[11px] font-bold tracking-[0.08em] uppercase ${t.color}`}>{t.etiqueta}</p>
                    <h3 className="mt-2 font-display text-[clamp(1.7rem,2.6vw,2.1rem)] leading-tight font-semibold tracking-[-0.03em] text-ink">Pack {t.nombre}</h3>
                    <p className="mt-1 text-[13.5px] text-dim">«{t.dolor}»</p>
                  </div>
                  <div className="h-[300px] relative overflow-hidden flex items-start justify-center mt-4">
                    <div className="absolute inset-x-0 bottom-0 h-24 z-10" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0), #fff)' }} />
                    {t.visual}
                  </div>
                  <div className="px-7 pb-7 mt-auto">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-display text-[1.7rem] leading-none font-semibold text-ink tracking-[-0.03em]">{eur(p.eur)}</span>
                      <span className="text-[13px] text-muted">/mes · 0 € de entrada</span>
                    </div>
                    <p className="text-[12px] text-muted mt-1">o {eur(p.eur * 10)}/año pagando por adelantado</p>
                    <div className="mt-5 flex items-center gap-4">
                      <a href={`/contratar/${t.clave.toLowerCase()}`} className="rounded-full bg-accent text-white text-[13.5px] font-semibold px-5 py-2.5 hover:-translate-y-0.5 transition-transform">Contratar</a>
                      <a href={t.cap} className="text-[13.5px] font-medium text-accent hover:underline underline-offset-4">Más información ›</a>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Solo la web */}
        {tab === 1 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {WEBS.map((w, i) => (
              <motion.div key={w.clave} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-[22px] p-7 flex flex-col" style={{ background: '#fff', boxShadow: '0 24px 50px -30px rgba(24,24,27,.25)' }}>
                <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-muted">Solo web</p>
                <h3 className="mt-2 font-display text-[1.8rem] leading-tight font-semibold tracking-[-0.03em] text-ink">{w.nombre}</h3>
                <p className="mt-2 text-[13.5px] text-dim flex-1">{w.desc}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[1.7rem] leading-none font-semibold text-ink tracking-[-0.03em]">{eur(w.eur)}</span>
                  <span className="text-[13px] text-muted">/mes</span>
                </div>
                <a href={`/contratar/${w.clave.toLowerCase()}`} className="mt-5 self-start rounded-full bg-accent text-white text-[13.5px] font-semibold px-5 py-2.5">Contratar</a>
              </motion.div>
            ))}
            <p className="md:col-span-3 text-[13px] text-muted">En cualquier pack puedes cambiar la web por la Cinematográfica por +100 €/mes.</p>
          </div>
        )}

        {/* Complementos */}
        {tab === 2 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[aeo, ads].map((a, i) => (
              <motion.div key={a.clave} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-[22px] p-7 flex flex-col" style={{ background: '#fff', boxShadow: '0 24px 50px -30px rgba(24,24,27,.25)' }}>
                <p className="text-[11px] font-bold tracking-[0.08em] uppercase text-muted">Complemento · sin permanencia</p>
                <h3 className="mt-2 font-display text-[1.8rem] leading-tight font-semibold tracking-[-0.03em] text-ink">{a.nombre}</h3>
                <p className="mt-2 text-[13.5px] text-dim flex-1">{a.desc}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[1.7rem] leading-none font-semibold text-ink tracking-[-0.03em]">{eur(a.eur)}</span>
                  <span className="text-[13px] text-muted">/mes{a.clave === 'ADS' ? ' + inversión' : ''}</span>
                </div>
                <a href={`/contratar/${a.clave.toLowerCase()}`} className="mt-5 self-start rounded-full bg-accent text-white text-[13.5px] font-semibold px-5 py-2.5">Añadir</a>
              </motion.div>
            ))}
          </div>
        )}

        <p className="mt-8 text-[13px] text-muted">
          ¿No sabes cuál? <a href="#compara" className="underline underline-offset-4 text-ink">Compara los tres</a> o <a href="#tu-web" className="underline underline-offset-4 text-ink">mira tu web gratis</a> antes de decidir.
        </p>
        <span className="hidden">{PACKS.length}</span>
      </div>
    </section>
  )
}
