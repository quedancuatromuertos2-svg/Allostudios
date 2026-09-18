'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { WEBS, porClave, eur } from '@/lib/precios'
import { VisualChat, VisualWeb } from './Visuales'
import { Retargeting } from './Piezas'

/*  "Elige tu pack" — la tienda (como "Comprar un iPhone"): título, pestañas y tres
    tarjetas. Cuanto más caro, más premium la presentación: Estándar es papel blanco,
    Pro es cristal oscuro con la luz de la marca, Max es cinematográfico (luz a toda
    tarjeta, nombre en degradado, brillo que respira). La tarjeta entera lleva a su
    capítulo; el botón, a contratar.                                                    */

const NIVELES = [
  {
    clave: 'PACK_ESTANDAR', nivel: 1, etiqueta: 'Que te encuentren', nombre: 'Estándar',
    dolor: 'Trabajo bien y no me encuentran.', visual: <VisualWeb compacto />, cap: '#estandar', luz: 'faro',
    rejilla: [['web', 'Web en 7 días', 'con tu marca, móvil'], ['google', 'Arriba en Google', 'ficha trabajada cada mes'], ['estrella', 'Reseñas 5★', 'se piden solas'], ['informe', 'Informe día 28', 'qué ha cambiado']],
  },
  {
    clave: 'PACK_PRO', nivel: 2, etiqueta: 'El más elegido', nombre: 'Pro',
    dolor: 'Contesto tarde y se van a otro.', visual: <VisualChat compacto />, cap: '#pro', luz: 'haz',
    rejilla: [['chat', 'Contesta tu WhatsApp', '24/7, en 8 segundos'], ['agenda', 'Citas en tu agenda', 'sin que toques nada'], ['premium', 'Web Premium', 'con tus reseñas dentro'], ['mas', 'Todo lo del Estándar', 'Google + reseñas + informe']],
  },
  {
    clave: 'PACK_MAX', nivel: 3, etiqueta: 'Que te lleguen clientes', nombre: 'Max',
    dolor: 'Quiero llenar la agenda, no solo estar.', visual: <div className="pt-2"><Retargeting compacto /></div>, cap: '#max', luz: 'prisma',
    rejilla: [['ads', 'Anuncios en tu zona', 'Meta y Google, gestionados'], ['retarget', 'Vuelven a verte', 'el que miró y no reservó'], ['control', 'Tú decides la inversión', 'desde 5 €/día, en tu cuenta'], ['mas', 'Todo lo del Pro', 'web premium + asistente']],
  },
]

const ICONOS: Record<string, string> = {
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
  google: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  estrella: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>',
  informe: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.2L4 21l1.8-4.6A8 8 0 1 1 21 12z"/>',
  agenda: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/><path d="m9 15 2 2 4-4"/>',
  premium: '<path d="m12 3 3 6 6 .8-4.5 4.2 1.2 6L12 17l-5.7 3 1.2-6L3 9.8 9 9z"/>',
  mas: '<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
  ads: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  euro: '<path d="M18 7a7 7 0 1 0 0 10"/><path d="M4 10h10M4 14h10"/>',
  retarget: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="m10 12 2 2 4-4"/>',
  control: '<path d="M4 12h16"/><circle cx="14" cy="12" r="3"/><path d="M4 6h16M4 18h16"/><circle cx="8" cy="6" r="2"/><circle cx="16" cy="18" r="2"/>',
}
const COLOR: Record<string, string> = {
  web: '#5B5BD6', google: '#4285F4', estrella: '#F5B301', informe: '#FF7A2A', chat: '#25D366', agenda: '#7C7CE8',
  premium: '#FF4FA3', mas: '#FF9A5C', ads: '#FF4FA3', euro: '#34A853', control: '#5B5BD6', retarget: '#FF7A2A',
}
function Icono({ k }: { k: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={COLOR[k] || '#5B5BD6'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: ICONOS[k] }} />
  )
}

const PESTANAS = ['Todos los packs', 'Solo la web', 'Complementos']
const fmt = (n: number) => n.toLocaleString('es-ES', { minimumFractionDigits: 0 })

function Tarjeta({ t, i }: { t: (typeof NIVELES)[number]; i: number }) {
  const p = porClave(t.clave)!
  const oscuro = t.nivel >= 2
  const ir = (e: React.MouseEvent, url: string) => { e.preventDefault(); e.stopPropagation(); window.location.href = url }
  return (
    <motion.a
      href={t.cap}
      initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={`group relative rounded-[26px] flex flex-col overflow-hidden ${oscuro ? 'text-white' : 'text-[#18181B]'}`}
      style={
        t.nivel === 1
          ? { background: 'linear-gradient(180deg,#FFFFFF 0%,#F7F5F2 100%)', boxShadow: '0 0 0 1px rgba(255,255,255,.6), 0 0 0 6px rgba(255,255,255,.06), 0 40px 80px -36px rgba(0,0,0,.6), inset 0 1px 0 #fff' }
          : t.nivel === 2
            ? { background: 'linear-gradient(160deg,#17171d 0%,#1b1a2b 55%,#141420 100%)', boxShadow: '0 0 0 1px rgba(255,255,255,.08), 0 40px 80px -36px rgba(91,91,214,.55)' }
            : { background: '#0b0b10', boxShadow: '0 0 0 1px rgba(255,255,255,.1), 0 0 0 6px rgba(255,122,42,.06), 0 50px 100px -40px rgba(255,122,42,.55), 0 40px 80px -36px rgba(91,91,214,.5)' }
      }
    >
      {/* Estándar: un halo cálido de la luz «faro» arriba, muy tenue, para que no sea una tarjeta plana */}
      {t.nivel === 1 && (
        <div className="absolute inset-x-0 top-0 h-72 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 opacity-[.18]" style={{ backgroundImage: 'url(/marca/luces/faro.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.7) 60%, #fff 100%)' }} />
        </div>
      )}
      {/* Luz de fondo: Pro tenue, Max a toda tarjeta */}
      {oscuro && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className={`absolute inset-0 transition-transform duration-[1400ms] group-hover:scale-110 ${t.nivel === 3 ? 'opacity-[.75]' : 'opacity-[.35]'}`}
            style={{ backgroundImage: `url(/marca/luces/${t.luz}.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
          <div className="absolute inset-0" style={{ background: t.nivel === 3 ? 'linear-gradient(180deg, rgba(11,11,16,.2) 0%, rgba(11,11,16,.55) 45%, rgba(11,11,16,.95) 100%)' : 'linear-gradient(180deg, rgba(11,11,16,.5) 0%, rgba(11,11,16,.9) 100%)' }} />
          {t.nivel === 3 && (
            <motion.div animate={{ opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -inset-20" style={{ background: 'radial-gradient(60% 40% at 50% 15%, rgba(255,122,42,.45), transparent 70%)' }} />
          )}
        </div>
      )}

      <div className="relative px-7 pt-7">
        <div className="flex items-center justify-between">
          <p className={`text-[11px] font-bold tracking-[0.1em] uppercase ${t.nivel === 1 ? 'text-emerald-600' : t.nivel === 2 ? 'text-[#FF9A5C]' : 'text-white/80'}`}>{t.etiqueta}</p>
          {t.nivel === 3 && <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full" style={{ background: 'linear-gradient(90deg,#FF7A2A,#FF4FA3)', color: '#fff' }}>Todo incluido</span>}
          {t.nivel === 2 && <span className="text-[10.5px] font-semibold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-white/10 text-white/80">Recomendado</span>}
        </div>
        <h3 className={`mt-3 font-display leading-[.95] font-semibold tracking-[-0.04em] ${t.nivel === 3 ? 'text-[clamp(2.6rem,4vw,3.4rem)]' : 'text-[clamp(2rem,3vw,2.6rem)]'}`}>
          {t.nivel === 3 ? (
            <span style={{ background: 'linear-gradient(90deg,#fff 0%,#FFC2A0 45%,#FF7A2A 100%)', WebkitBackgroundClip: 'text', color: 'transparent' }}>Pack Max</span>
          ) : `Pack ${t.nombre}`}
        </h3>
        <p className={`mt-2 text-[14px] ${oscuro ? 'text-white/65' : 'text-[#4E4A5E]'}`}>«{t.dolor}»</p>
      </div>

      {/* El producto */}
      <div className="relative h-[230px] overflow-hidden flex items-start justify-center mt-5">
        {t.nivel === 3 && <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[420px] h-[240px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(closest-side, rgba(255,122,42,.35), transparent)', filter: 'blur(30px)' }} />}
        <div className="absolute inset-x-0 bottom-0 h-28 z-10" style={{ background: oscuro ? `linear-gradient(180deg, rgba(11,11,16,0), ${t.nivel === 3 ? '#0b0b10' : '#141420'})` : 'linear-gradient(180deg, rgba(255,255,255,0), #fff)' }} />
        <div className="transition-transform duration-700 group-hover:-translate-y-2">{t.visual}</div>
      </div>

      {/* Puntos + precio */}
      <div className="relative px-7 pb-7 mt-auto">
        {/* Cuadrícula de cristal: qué te da el pack, de un vistazo */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          {t.rejilla.map(([ic, tt, dd]) => (
            <div key={tt} className={`rounded-2xl p-3 ${oscuro ? 'border border-white/10' : 'border border-ink/[.06]'}`}
              style={{ background: oscuro ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.82)', backdropFilter: 'blur(14px)', boxShadow: oscuro ? 'inset 0 1px 0 rgba(255,255,255,.12)' : 'inset 0 1px 0 #fff, 0 10px 24px -16px rgba(24,24,27,.35), 0 0 0 1px rgba(24,24,27,.04)' }}>
              <div className="w-8 h-8 rounded-[10px] flex items-center justify-center mb-2" style={{ background: `${COLOR[ic] || '#5B5BD6'}${oscuro ? '33' : '1F'}`, boxShadow: `inset 0 0 0 1px ${COLOR[ic] || '#5B5BD6'}33` }}><Icono k={ic} /></div>
              <div className={`text-[12.5px] font-semibold leading-tight ${oscuro ? 'text-white' : 'text-[#18181B]'}`}>{tt}</div>
              <div className={`text-[11px] leading-snug mt-0.5 ${oscuro ? 'text-white/50' : 'text-[#6E6A7C]'}`}>{dd}</div>
            </div>
          ))}
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-[1.9rem] leading-none font-semibold tracking-[-0.03em]">{eur(p.eur)}</span>
          <span className={`text-[13px] ${oscuro ? 'text-white/55' : 'text-[#6E6A7C]'}`}>/mes · 0 € de entrada</span>
        </div>
        <p className={`text-[12px] mt-1 ${oscuro ? 'text-white/45' : 'text-[#6E6A7C]'}`}>o {fmt(p.eur * 10)} €/año pagando por adelantado (2 meses gratis)</p>
        <div className="mt-5 flex items-center gap-4">
          <button type="button" onClick={(e) => ir(e, `/contratar/${t.clave.toLowerCase()}`)}
            className={`rounded-full text-[13.5px] font-semibold px-5 py-2.5 transition-transform hover:-translate-y-0.5 ${t.nivel === 3 ? 'text-white' : t.nivel === 2 ? 'bg-accent text-white' : 'bg-[#18181B] text-white'}`}
            style={t.nivel === 3 ? { background: 'linear-gradient(90deg,#FF7A2A,#FF4FA3)', boxShadow: '0 8px 24px -8px rgba(255,122,42,.7)' } : undefined}>
            Contratar
          </button>
          <span className={`text-[13.5px] font-medium ${oscuro ? 'text-white/80' : 'text-[#5B5BD6]'} group-hover:underline underline-offset-4`}>Más información ›</span>
        </div>
      </div>
    </motion.a>
  )
}

export default function ElegirPack({ inicial = 0 }: { inicial?: number }) {
  const [tab, setTab] = useState(inicial)
  const aeo = porClave('AEO')!
  const ads = porClave('ADS')!

  return (
    <section id="elegir" className="relative py-24 md:py-36 overflow-hidden">
      {/* Luces de la marca moviéndose (como al principio de la página), sin estrías, bajo un velo de cristal */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        {[
          { c: 'rgba(91,91,214,.75)', s: '62vw', x: ['-12%', '8%', '-6%'], y: ['-10%', '18%', '-4%'], d: 26 },
          { c: 'rgba(255,79,163,.6)', s: '48vw', x: ['52%', '36%', '58%'], y: ['10%', '40%', '6%'], d: 31 },
          { c: 'rgba(255,122,42,.55)', s: '44vw', x: ['70%', '84%', '64%'], y: ['48%', '20%', '56%'], d: 37 },
          { c: 'rgba(255,226,176,.35)', s: '30vw', x: ['20%', '34%', '14%'], y: ['60%', '70%', '50%'], d: 29 },
        ].map((l, i) => (
          <motion.div key={i} animate={{ left: l.x, top: l.y }} transition={{ duration: l.d, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
            className="absolute rounded-full" style={{ width: l.s, height: l.s, background: `radial-gradient(closest-side, ${l.c}, transparent 70%)`, filter: 'blur(40px)' }} />
        ))}
        <div className="absolute inset-0 backdrop-blur-[60px]" style={{ background: 'linear-gradient(180deg, rgba(11,11,16,.55) 0%, rgba(11,11,16,.2) 30%, rgba(11,11,16,.3) 70%, rgba(11,11,16,.75) 100%)' }} />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="font-display text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-white max-w-2xl"
        >
          Elige<br />tu pack.
        </motion.h2>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 border-b border-white/15 pb-3 text-[14.5px]">
          {PESTANAS.map((p, i) => (
            <button key={p} type="button" onClick={() => setTab(i)}
              className={`pb-1 transition-colors ${tab === i ? 'text-white font-semibold border-b-2 border-white -mb-[14px] pb-3' : 'text-white/55 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>

        <p className="mt-8 text-[clamp(1.2rem,2vw,1.5rem)] font-semibold text-white tracking-[-0.02em]">
          {tab === 0 && <>Todos los packs. <span className="text-white/55 font-medium">Elige el tuyo; cada uno arregla una cosa.</span></>}
          {tab === 1 && <>Solo la web. <span className="text-white/55 font-medium">Todo incluido, 0 € de entrada.</span></>}
          {tab === 2 && <>Complementos. <span className="text-white/55 font-medium">Se añaden a cualquier pack.</span></>}
        </p>

        {tab === 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-stretch">
            {NIVELES.map((t, i) => <Tarjeta key={t.clave} t={t} i={i} />)}
          </div>
        )}

        {tab === 1 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {WEBS.map((w, i) => (
              <motion.div key={w.clave} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-[26px] p-7 flex flex-col" style={{ background: '#fff', boxShadow: '0 28px 60px -34px rgba(24,24,27,.28)' }}>
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#6E6A7C]">Solo web · {i === 2 ? 'la más impactante' : i === 1 ? 'la más elegida' : 'la esencial'}</p>
                <h3 className="mt-3 font-display text-[2rem] leading-tight font-semibold tracking-[-0.035em] text-[#18181B]">{w.nombre.replace('Web ', '')}</h3>
                <p className="mt-2 text-[13.5px] text-[#4E4A5E] flex-1">{w.desc}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[1.9rem] leading-none font-semibold text-[#18181B] tracking-[-0.03em]">{eur(w.eur)}</span>
                  <span className="text-[13px] text-[#6E6A7C]">/mes · 0 € de entrada</span>
                </div>
                <a href={`/contratar/${w.clave.toLowerCase()}`} className="mt-5 self-start rounded-full bg-[#18181B] text-white text-[13.5px] font-semibold px-5 py-2.5">Contratar</a>
              </motion.div>
            ))}
            <p className="md:col-span-3 text-[13px] text-white/55">En cualquier pack puedes cambiar la web por la Cinematográfica por +100 €/mes.</p>
          </div>
        )}

        {tab === 2 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[aeo, ads].map((a, i) => (
              <motion.div key={a.clave} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                className="rounded-[26px] p-7 flex flex-col" style={{ background: '#fff', boxShadow: '0 28px 60px -34px rgba(24,24,27,.28)' }}>
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase text-[#6E6A7C]">Complemento · sin permanencia</p>
                <h3 className="mt-3 font-display text-[2rem] leading-tight font-semibold tracking-[-0.035em] text-[#18181B]">{a.nombre}</h3>
                <p className="mt-2 text-[13.5px] text-[#4E4A5E] flex-1">{a.desc}</p>
                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-display text-[1.9rem] leading-none font-semibold text-[#18181B] tracking-[-0.03em]">{eur(a.eur)}</span>
                  <span className="text-[13px] text-[#6E6A7C]">/mes{a.clave === 'ADS' ? ' + inversión' : ''}</span>
                </div>
                <a href={`/contratar/${a.clave.toLowerCase()}`} className="mt-5 self-start rounded-full bg-[#18181B] text-white text-[13.5px] font-semibold px-5 py-2.5">Añadir</a>
              </motion.div>
            ))}
          </div>
        )}

        <p className="mt-8 text-[13px] text-white/55">
          ¿No sabes cuál? <a href="#compara" className="underline underline-offset-4 text-white">Compara los tres</a> o <a href="#tu-web" className="underline underline-offset-4 text-white">mira tu web gratis</a> antes de decidir.
        </p>
      </div>
    </section>
  )
}
