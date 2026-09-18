'use client'

import { motion } from 'framer-motion'

/*  Piezas "de producto" que van dentro del mosaico de cada pack: maquetas pequeñas y
    reales (una ficha de Google, una notificación, una agenda, un anuncio, un contador).
    Cada una cuenta una sola cosa. Están hechas para que el dueño se reconozca.        */

const ap = (d = 0) => ({
  initial: { opacity: 0, y: 14 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { delay: d, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
})

/* ── Google: la ficha del negocio como la ve la gente ── */
export function FichaGoogle({ oscuro }: { oscuro?: boolean }) {
  return (
    <motion.div {...ap(0.1)} className={`w-full max-w-[340px] rounded-2xl p-4 ${oscuro ? 'text-white' : 'text-[#202124]'}`}
      style={{ background: oscuro ? '#202124' : '#ffffff', boxShadow: '0 24px 50px -24px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.06)' }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[17px] font-semibold leading-tight">Barbería Navaja</div>
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px]">
            <span className="font-medium">4,9</span>
            <span className="text-[#fbbc04] tracking-[-1px]">★★★★★</span>
            <span className={oscuro ? 'text-white/55' : 'text-[#5f6368]'}>(184)</span>
          </div>
          <div className={`text-[12.5px] mt-0.5 ${oscuro ? 'text-white/55' : 'text-[#5f6368]'}`}>Barbería · Ruzafa</div>
        </div>
        <div className="w-16 h-16 rounded-xl shrink-0" style={{ background: 'linear-gradient(135deg,#1f3b2f,#0f1f18)' }} />
      </div>
      <div className="mt-3 flex items-center gap-2 text-[12.5px]">
        <span className="text-[#188038] font-medium">Abierto</span>
        <span className={oscuro ? 'text-white/55' : 'text-[#5f6368]'}>· Cierra a las 20:30</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        {['Llamar', 'Cómo llegar', 'Web', 'Reservar'].map((t, i) => (
          <div key={t} className={`rounded-full text-center text-[11.5px] py-1.5 font-medium ${i === 3 ? 'bg-[#1a73e8] text-white' : oscuro ? 'bg-white/10 text-[#8ab4f8]' : 'bg-[#e8f0fe] text-[#1a73e8]'}`}>{t}</div>
        ))}
      </div>
      <div className={`mt-3 pt-3 border-t text-[11.5px] ${oscuro ? 'border-white/10 text-white/50' : 'border-black/[.06] text-[#5f6368]'}`}>
        <span className="text-[#188038] font-medium">Posición 1</span> · «barbería ruzafa» · 1.240 búsquedas al mes
      </div>
    </motion.div>
  )
}

/* ── Notificación en el móvil del dueño (reseña nueva / cita nueva) ── */
export function Notificacion({ app, titulo, texto, hora, d = 0 }: { app: string; titulo: string; texto: string; hora: string; d?: number }) {
  return (
    <motion.div {...ap(d)} className="w-full max-w-[360px] rounded-[18px] px-4 py-3 flex gap-3 items-start text-[#111]"
      style={{ background: 'rgba(255,255,255,.94)', boxShadow: '0 20px 40px -20px rgba(0,0,0,.4), 0 0 0 1px rgba(0,0,0,.05)', backdropFilter: 'blur(20px)' }}>
      <div className={`w-9 h-9 rounded-[10px] shrink-0 ${app === 'Google' ? 'bg-white border border-black/10' : 'bg-[#25d366]'} flex items-center justify-center`}>
        {app === 'Google' ? (
          <span className="font-bold text-[16px]" style={{ background: 'linear-gradient(90deg,#4285f4,#ea4335,#fbbc04,#34a853)', WebkitBackgroundClip: 'text', color: 'transparent' }}>G</span>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20z"/></svg>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-[12px] font-semibold uppercase tracking-wide text-[#111]/70">{app}</span>
          <span className="text-[11px] text-[#111]/45">{hora}</span>
        </div>
        <div className="text-[13.5px] font-semibold leading-snug mt-0.5">{titulo}</div>
        <div className="text-[13px] text-[#111]/70 leading-snug">{texto}</div>
      </div>
    </motion.div>
  )
}

/* ── La agenda del dueño con la cita que entró sola ── */
export function Agenda() {
  const filas = [
    ['16:30', 'Pablo · corte', false],
    ['17:30', 'Marcos · corte + barba', true],
    ['18:45', 'Libre', false],
    ['19:30', 'Juan · barba', false],
  ] as const
  return (
    <motion.div {...ap(0.15)} className="w-full max-w-[340px] rounded-2xl overflow-hidden text-[#111]" style={{ background: '#ffffff', boxShadow: '0 24px 50px -24px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.06)' }}>
      <div className="px-4 py-3 border-b border-black/[.06] flex items-baseline justify-between">
        <span className="text-[14px] font-semibold">Mañana, jueves</span>
        <span className="text-[11.5px] text-[#111]/50">Google Calendar</span>
      </div>
      <div className="p-2">
        {filas.map(([h, t, nueva]) => (
          <div key={h} className={`flex items-center gap-3 px-2.5 py-2 rounded-xl ${nueva ? 'bg-[#e6f4ea]' : ''}`}>
            <span className="text-[12px] text-[#111]/50 w-10 tabular-nums">{h}</span>
            <span className={`text-[13px] ${t === 'Libre' ? 'text-[#111]/35' : 'font-medium'}`}>{t}</span>
            {nueva && <span className="ml-auto text-[10.5px] font-semibold text-[#188038] px-2 py-0.5 rounded-full" style={{ background: '#fff' }}>nueva · 22:15</span>}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Línea de tiempo: qué pasa después de contratar ── */
export function Timeline({ oscuro, pasos }: { oscuro?: boolean; pasos: [string, string][] }) {
  const t = oscuro ? 'text-white' : 'text-ink'
  const d = oscuro ? 'text-white/55' : 'text-dim'
  return (
    <div className="grid grid-cols-3 gap-3">
      {pasos.map(([cuando, que], i) => (
        <motion.div key={cuando} {...ap(0.1 + i * 0.1)} className="relative">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent shrink-0" />
            {i < pasos.length - 1 && <span className={`h-px flex-1 ${oscuro ? 'bg-white/15' : 'bg-ink/10'}`} />}
          </div>
          <div className={`mt-3 text-[13px] font-semibold ${t}`}>{cuando}</div>
          <div className={`text-[12.5px] ${d} leading-snug mt-0.5`}>{que}</div>
        </motion.div>
      ))}
    </div>
  )
}

/* ── Anuncio de Meta como lo ve el vecino ── */
export function Anuncio() {
  return (
    <motion.div {...ap(0.1)} className="w-full max-w-[340px] rounded-2xl overflow-hidden text-[#111]" style={{ background: '#ffffff', boxShadow: '0 24px 50px -24px rgba(0,0,0,.35), 0 0 0 1px rgba(0,0,0,.06)' }}>
      <div className="px-4 py-3 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full" style={{ background: 'linear-gradient(135deg,#1f3b2f,#0f1f18)' }} />
        <div>
          <div className="text-[13px] font-semibold leading-tight">Barbería Navaja</div>
          <div className="text-[11px] text-[#111]/50">Publicidad · Ruzafa, a 400 m</div>
        </div>
      </div>
      <div className="px-4 pb-3 text-[13px] leading-snug">Corte clásico y afeitado a navaja, sin prisa y con cita. Esta semana, primera visita a 19 €. Reserva en 20 segundos, sin llamar 👇</div>
      <div className="relative h-40 overflow-hidden">
        <img src="/marca/trabajo/navaja-foto-1.webp" alt="" className="w-full h-full object-cover" />
        <span className="absolute left-3 bottom-3 text-[11px] font-semibold tracking-wide uppercase text-white/90 bg-black/45 backdrop-blur px-2 py-1 rounded-md">Ruzafa · desde 19 €</span>
      </div>
      <div className="px-4 py-3 flex items-center justify-between bg-[#f0f2f5]">
        <div>
          <div className="text-[10.5px] uppercase tracking-wide text-[#111]/50">navaja.allostudios.net</div>
          <div className="text-[13px] font-semibold">Reservar cita</div>
        </div>
        <span className="text-[12.5px] font-semibold bg-[#e4e6eb] px-3 py-1.5 rounded-md">Reservar</span>
      </div>
    </motion.div>
  )
}

/* ── Coste por contacto: el número que importa en anuncios ── */
export function CostePorContacto({ oscuro }: { oscuro?: boolean }) {
  const t = oscuro ? 'text-white' : 'text-ink'
  const d = oscuro ? 'text-white/55' : 'text-dim'
  return (
    <motion.div {...ap(0.15)} className="w-full">
      <div className="flex items-end justify-between">
        <div>
          <div className={`font-display text-[clamp(2.6rem,5vw,4rem)] leading-none font-semibold tracking-[-0.04em] ${t}`}>4,7 €</div>
          <div className={`text-[13px] mt-2 ${d}`}>por cada persona que te escribe</div>
        </div>
        <div className="text-right">
          <div className={`font-display text-[1.6rem] leading-none font-semibold ${t}`}>41</div>
          <div className={`text-[12px] mt-1 ${d}`}>contactos este mes</div>
        </div>
      </div>
      <div className="mt-5 h-2 rounded-full bg-black/10 overflow-hidden">
        <motion.div initial={{ width: 0 }} whileInView={{ width: '68%' }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="h-full rounded-full bg-accent" />
      </div>
      <div className={`mt-2 flex justify-between text-[11.5px] ${d}`}><span>Inversión: 193 €</span><span>Tú la decides · desde 5 €/día</span></div>
    </motion.div>
  )
}

/* ── Texto marcador: la "escena" en grande dentro de una pieza ── */
export function Escena({ oscuro, cuando, que }: { oscuro?: boolean; cuando: string; que: string }) {
  return (
    <div>
      <div className={`font-display text-[clamp(2.4rem,4.5vw,3.6rem)] leading-none font-semibold tracking-[-0.04em] ${oscuro ? 'text-white' : 'text-ink'}`}>{cuando}</div>
      <p className={`mt-3 text-[15px] leading-relaxed ${oscuro ? 'text-white/65' : 'text-dim'}`}>{que}</p>
    </div>
  )
}
