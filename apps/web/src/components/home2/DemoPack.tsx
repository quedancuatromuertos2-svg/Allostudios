'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

/*  Panel a la derecha de cada capítulo: la demo de ese nivel (una web de concepto real, cargada
    en vivo en un móvil) y el generador con el nivel ya elegido: el visitante escribe su negocio
    y ve SU web tal y como quedaría con ese pack.                                                */

export type NivelDemo = 'arranque' | 'premium' | 'cine'

const DEMOS: Record<NivelDemo, { url: string; nombre: string; sector: string; nota: string }> = {
  arranque: { url: 'https://concepto-navaja.vercel.app', nombre: 'Navaja', sector: 'Barbería · Ruzafa', nota: 'Web Arranque: una página, tu marca, tus precios y el botón de WhatsApp. Lo esencial, bien hecho.' },
  premium: { url: 'https://concepto-serra.vercel.app', nombre: 'Clínica Serra', sector: 'Dental · Benimaclet', nota: 'Web Premium: luz de fondo, cristal, animaciones y tus reseñas de Google integradas. Acabado de agencia cara.' },
  cine: { url: 'https://concepto-sequer.vercel.app', nombre: 'Sequer', sector: 'Arrocería · El Palmar', nota: 'Web Cinematográfica: la cabecera a pantalla completa, dirección de arte y scroll de cine.' },
}

export default function DemoPack({ nivel, pack, oscuro, nivel3 }: { nivel: NivelDemo; pack: string; oscuro?: boolean; nivel3?: boolean }) {
  const d = DEMOS[nivel]
  const [negocio, setNegocio] = useState('')
  const ink = oscuro ? 'text-white' : 'text-ink'
  const dim = oscuro ? 'text-white/60' : 'text-dim'
  const muted = oscuro ? 'text-white/40' : 'text-muted'

  return (
    <motion.div
      initial={{ opacity: 0, x: 32, filter: 'blur(8px)' }} whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.3 }} transition={{ duration: 1, delay: 0.15, ease: [0.32, 0.72, 0, 1] }}
      className={`w-full max-w-[420px] rounded-[2rem] p-1.5 ${oscuro ? 'bg-white/[.04] ring-1 ring-white/10' : 'bg-black/[.04] ring-1 ring-black/5'}`}
    >
      <div className={`rounded-[calc(2rem-0.375rem)] overflow-hidden ${oscuro ? 'bg-[rgba(18,17,24,.82)] shadow-[inset_0_1px_1px_rgba(255,255,255,.12)]' : 'bg-white/[.85] shadow-[inset_0_1px_1px_rgba(255,255,255,1)]'} ${nivel3 ? 'backdrop-blur-xl' : ''}`}>
        {/* La demo en un móvil, recortada */}
        <div className="relative h-[300px] overflow-hidden flex items-start justify-center pt-6" style={{ background: oscuro ? 'radial-gradient(80% 60% at 50% 0%, rgba(91,91,214,.25), transparent 70%)' : 'radial-gradient(80% 60% at 50% 0%, rgba(91,91,214,.12), transparent 70%)' }}>
          <div className="relative w-[240px] h-[500px] rounded-[36px] p-[8px] bg-[#18181B] origin-top" style={{ boxShadow: '0 30px 60px -24px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.12)' }}>
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[72px] h-[20px] rounded-full bg-black z-10" />
            <div className="w-full h-full rounded-[28px] overflow-hidden bg-white">
              <iframe src={d.url} title={`Demo ${d.nombre}`} className="w-[390px] h-[800px] origin-top-left border-0" style={{ transform: 'scale(0.574)' }} loading="lazy" />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-20" style={{ background: oscuro ? 'linear-gradient(180deg, rgba(18,17,24,0), rgba(18,17,24,1))' : 'linear-gradient(180deg, rgba(255,255,255,0), #fff)' }} />
          <span className={`absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] font-medium ${muted}`}>Concepto · {d.sector}</span>
          <a href={d.url} target="_blank" rel="noopener noreferrer" className={`absolute top-3.5 right-4 text-[11px] font-medium underline underline-offset-4 ${dim}`}>Abrir →</a>
        </div>

        <div className="p-6">
          <p className={`text-[13px] ${dim} leading-relaxed`}>{d.nota}</p>
          <form
            className="mt-5"
            onSubmit={(e) => { e.preventDefault(); window.location.href = `/tu-web?negocio=${encodeURIComponent(negocio)}&nivel=${nivel}` }}
          >
            <label className={`block text-[10px] uppercase tracking-[0.2em] font-medium ${muted} mb-2`}>Y la tuya, con el Pack {pack}</label>
            <div className={`flex items-center gap-2 rounded-full p-1.5 pl-4 ${oscuro ? 'bg-white/[.06] ring-1 ring-white/10' : 'bg-white ring-1 ring-black/10'}`}>
              <input
                value={negocio} onChange={(e) => setNegocio(e.target.value)} required maxLength={120}
                placeholder="Nombre de tu negocio"
                className={`flex-1 min-w-0 bg-transparent outline-none text-[14px] ${ink} placeholder:${oscuro ? 'text-white/35' : 'text-muted'}`}
              />
              <button type="submit" className="shrink-0 inline-flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5 text-[13px] font-semibold text-white transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] hover:-translate-y-0.5 active:scale-[0.98]"
                style={nivel3 ? { background: 'linear-gradient(90deg,#FF7A2A,#FF4FA3)' } : { background: '#5B5BD6' }}>
                Ver mi web
                <span className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center"><svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
              </button>
            </div>
            <p className={`mt-2.5 text-[11.5px] ${muted}`}>Gratis, con tus reseñas y fotos reales de Google. 30 segundos, sin registro.</p>
          </form>
        </div>
      </div>
    </motion.div>
  )
}
