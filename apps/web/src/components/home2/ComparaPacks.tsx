'use client'

import { motion } from 'framer-motion'
import { PACKS, WEBS, eur } from '@/lib/precios'

/*  "¿Qué pack es para ti?" — tabla de comparación sobre la luz de la marca (sección
    transparente), en cristal oscuro con doble bisel. La columna Pro va iluminada y
    ligeramente elevada, como el producto destacado de una vitrina.                    */

const FILAS: [string, (boolean | string)[]][] = [
  ['Web profesional, lista en 7 días', ['Arranque', 'Premium', 'Premium']],
  ['Hosting, dominio, cambios y soporte', [true, true, true]],
  ['Salir en Google en tu zona (SEO local)', [true, true, true]],
  ['Reseñas 5★ que se piden solas', [true, true, true]],
  ['Asistente que contesta tu WhatsApp 24/7', [false, true, true]],
  ['Citas directas en tu Google Calendar', [false, true, true]],
  ['Anuncios en Meta y Google, gestionados', [false, false, true]],
  ['Informe el día 28: qué entró y qué costó', [true, true, true]],
  ['Un WhatsApp directo con Ángel', [true, true, true]],
]
const NOMBRES = ['Estándar', 'Pro', 'Max']
const PARA = ['Que te encuentren', 'Que te contesten', 'Que te lleguen clientes']
const EASE = [0.32, 0.72, 0, 1] as const

function Celda({ v, i }: { v: boolean | string; i: number }) {
  if (v === false) return <span className="text-white/20 text-[15px]">—</span>
  if (v === true)
    return (
      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${i === 2 ? 'bg-[#FF7A2A]/20 text-[#FF9A5C]' : 'bg-accent/20 text-[#9B9BFF]'}`}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7" /></svg>
      </span>
    )
  return <span className="text-[13px] font-medium text-white">{v}</span>
}

export default function ComparaPacks() {
  return (
    <section id="compara" className="relative py-28 md:py-40 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.5) 0%, rgba(11,11,16,0) 30%, rgba(11,11,16,0) 70%, rgba(11,11,16,.6) 100%)' }} />
      <div className="relative max-w-6xl mx-auto px-4 md:px-12">
        <div className="text-center mb-14">
          <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-white/[.06] ring-1 ring-white/10 text-white/70">Compara</motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true }} transition={{ duration: 0.9, ease: EASE }}
            className="mt-6 font-display text-[clamp(2.4rem,5vw,4rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-white text-balance"
          >
            ¿Qué pack es para ti?
          </motion.h2>
          <p className="mt-4 text-[15px] text-white/55 max-w-md mx-auto">Cada uno arregla una cosa. Todos con 0 € de entrada, 12 meses y después mes a mes.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32, filter: 'blur(8px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 1, ease: EASE }}
          className="rounded-[2rem] p-1.5 bg-white/[.04] ring-1 ring-white/10"
        >
          <div className="relative rounded-[calc(2rem-0.375rem)] overflow-hidden bg-[rgba(16,15,22,.72)] shadow-[inset_0_1px_1px_rgba(255,255,255,.12)] backdrop-blur-2xl">
            {/* columna Pro iluminada */}
            <div className="absolute inset-y-0 pointer-events-none hidden md:block" style={{ left: 'calc(1.8fr)', width: 0 }} />
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] md:grid-cols-[1.8fr_1fr_1fr_1fr]">
              {/* cabecera */}
              <div className="p-4 md:p-7" />
              {PACKS.map((p, i) => (
                <div key={p.clave} className={`relative p-4 md:p-7 text-center ${i === 1 ? 'bg-white/[.05]' : ''}`}>
                  {i === 1 && <div className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #9B9BFF, transparent)' }} />}
                  {i === 1 && <div className="absolute inset-x-6 -top-10 h-24 pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(91,91,214,.55), transparent)', filter: 'blur(18px)' }} />}
                  <div className={`relative font-display text-[clamp(1.4rem,2.6vw,2rem)] font-semibold tracking-[-0.03em] ${i === 2 ? 'text-[#FFB07A]' : 'text-white'}`}>{NOMBRES[i]}</div>
                  <div className="relative text-[11.5px] mt-1 text-white/55">{PARA[i]}</div>
                  {i === 1 && <span className="relative mt-2 inline-block text-[10px] uppercase tracking-[0.16em] font-semibold px-2.5 py-1 rounded-full bg-accent text-white">Recomendado</span>}
                </div>
              ))}
              {/* filas */}
              {FILAS.map(([k, vs]) => (
                <div key={k} className="contents">
                  <div className="p-3.5 md:px-7 md:py-4 text-[13px] md:text-[14px] text-white/75 border-t border-white/[.06]">{k}</div>
                  {vs.map((v, i) => (
                    <div key={i} className={`p-3.5 md:py-4 text-center flex items-center justify-center border-t border-white/[.06] ${i === 1 ? 'bg-white/[.05]' : ''}`}>
                      <Celda v={v} i={i} />
                    </div>
                  ))}
                </div>
              ))}
              {/* precio */}
              <div className="p-4 md:p-7 border-t border-white/10 text-[12.5px] text-white/50 self-center">
                0 € de entrada · año por adelantado: 2 meses gratis
              </div>
              {PACKS.map((p, i) => (
                <div key={p.clave} className={`p-4 md:p-7 text-center border-t border-white/10 ${i === 1 ? 'bg-white/[.05]' : ''}`}>
                  <div className={`font-display text-[clamp(1.5rem,3vw,2.3rem)] font-semibold tracking-[-0.035em] ${i === 2 ? 'text-[#FFB07A]' : 'text-white'}`}>{eur(p.eur)}<span className="text-[12px] text-white/45 font-normal tracking-normal">/mes</span></div>
                  <a href={`/contratar/${p.clave.toLowerCase()}`}
                    className="mt-3 inline-flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5 text-[13px] font-semibold text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5"
                    style={i === 2 ? { background: 'linear-gradient(90deg,#FF7A2A,#FF4FA3)' } : i === 1 ? { background: '#5B5BD6' } : { background: 'rgba(255,255,255,.12)' }}>
                    Contratar
                    <span className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center"><svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <p className="text-center text-[13px] text-white/50 mt-8">
          ¿Solo quieres la web? {WEBS.map((w, i) => <span key={w.clave}>{i ? ' · ' : ''}<a href={`/contratar/${w.clave.toLowerCase()}`} className="underline underline-offset-4 text-white/80">{w.nombre.replace('Web ', '')} {eur(w.eur)}/mes</a></span>)}.
          En cualquier pack, la Cinematográfica por +100 €/mes.
        </p>
      </div>
    </section>
  )
}
