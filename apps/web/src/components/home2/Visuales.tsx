'use client'

import { motion } from 'framer-motion'

/*  Los tres visuales de los capítulos. Uno por pack, una sola pieza cada uno:
    Estándar → la web en un móvil (concepto real, cargado en vivo).
    Pro      → el chat de WhatsApp contestando a las 22:14.
    Max      → el informe del día 28.                                            */

/* ── Marco de móvil compartido ── */
function Movil({ children, oscuro }: { children: React.ReactNode; oscuro?: boolean }) {
  return (
    <div className={`relative w-[300px] h-[620px] rounded-[44px] p-[10px] ${oscuro ? 'bg-[#1c1c22]' : 'bg-[#18181B]'}`}
      style={{ boxShadow: '0 40px 90px -30px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.12)' }}>
      <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[92px] h-[26px] rounded-full bg-black z-10" />
      <div className="w-full h-full rounded-[34px] overflow-hidden bg-white relative">{children}</div>
    </div>
  )
}

/* ── ESTÁNDAR: la web de concepto, en vivo ── */
export function VisualWeb() {
  return (
    <div className="flex items-end gap-6">
      <Movil>
        <iframe
          src="https://concepto-navaja.vercel.app"
          title="Web de concepto: Navaja, barbería"
          className="w-[390px] h-[806px] origin-top-left border-0"
          style={{ transform: 'scale(0.718)' }}
          loading="lazy"
        />
      </Movil>
      <div className="hidden md:block max-w-[220px] pb-10">
        <p className="text-[12px] font-mono tracking-[0.12em] uppercase text-muted">Concepto · Barbería</p>
        <p className="mt-2 text-[14px] text-dim font-light leading-relaxed">Una web de verdad, con su marca, sus precios y su botón de WhatsApp. Tócala: se mueve.</p>
        <a href="/webs" className="mt-3 inline-block text-[13px] font-medium text-accent underline underline-offset-4">Ver los tres conceptos →</a>
      </div>
    </div>
  )
}

/* ── PRO: el chat a las 22:14 ── */
const CHAT = [
  { de: 'cliente', hora: '22:14', txt: 'Hola! Tenéis hueco mañana por la tarde para corte y barba?' },
  { de: 'ia', hora: '22:14', txt: '¡Hola! Sí: mañana tengo a las 17:30 y a las 18:45. Corte + barba son 25 € y dura unos 40 min. ¿Cuál te va mejor?' },
  { de: 'cliente', hora: '22:15', txt: 'A las 17:30. Soy Marcos' },
  { de: 'ia', hora: '22:15', txt: 'Hecho, Marcos: mañana 17:30, corte + barba. Estamos en C/ Sueca 14 (Ruzafa). Te mando un recordatorio por la mañana 👋' },
]
export function VisualChat() {
  return (
    <div className="flex items-end gap-6">
      <Movil oscuro>
        <div className="h-full flex flex-col bg-[#0b141a]">
          <div className="flex items-center gap-3 px-4 pt-11 pb-3 bg-[#1f2c34]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-[#FF7A2A]" />
            <div>
              <div className="text-[13.5px] font-semibold text-white">Barbería Navaja</div>
              <div className="text-[11px] text-emerald-400">en línea</div>
            </div>
          </div>
          <div className="flex-1 px-3 py-4 space-y-2.5 overflow-hidden" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
            {CHAT.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.5, duration: 0.5 }}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug ${m.de === 'ia' ? 'bg-[#005c4b] text-white ml-auto rounded-br-md' : 'bg-[#202c33] text-white rounded-bl-md'}`}
              >
                {m.txt}
                <span className="block text-right text-[10px] text-white/50 mt-1">{m.hora}{m.de === 'ia' ? ' ✓✓' : ''}</span>
              </motion.div>
            ))}
          </div>
          <div className="px-3 pb-6 pt-2 bg-[#0b141a]">
            <div className="h-9 rounded-full bg-[#2a3942] px-4 flex items-center text-[12px] text-white/40">Escribe un mensaje</div>
          </div>
        </div>
      </Movil>
      <div className="hidden md:block max-w-[220px] pb-10">
        <p className="text-[12px] font-mono tracking-[0.12em] uppercase text-white/45">Ejemplo real de conversación</p>
        <p className="mt-2 text-[14px] text-white/65 font-light leading-relaxed">El dueño estaba cenando. La cita quedó en su agenda y él se enteró por la mañana.</p>
        <p className="mt-3 text-[11.5px] text-white/35">Demo de nuestro asistente · negocio de ejemplo</p>
      </div>
    </div>
  )
}

/* ── MAX: el informe del día 28 ── */
const FILAS = [
  ['Visitas a la web', '1.240', '+38 %'],
  ['Llamadas desde Google', '27', '+9'],
  ['Conversaciones del asistente', '63', '19 citas'],
  ['Anuncios · contactos', '41', '4,7 € cada uno'],
  ['Reseñas nuevas', '11', '4,9 ★'],
]
export function VisualInforme() {
  return (
    <div className="w-full max-w-[560px] lg rounded-[22px] p-7 md:p-9">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[11px] font-mono tracking-[0.14em] uppercase text-muted">Informe · 28 de octubre</p>
          <h3 className="mt-1.5 font-display text-[22px] font-semibold text-ink tracking-[-0.02em]">Qué ha entrado y qué ha costado</h3>
        </div>
        <span className="text-[11px] text-muted">ejemplo</span>
      </div>
      <div className="mt-6 divide-y divide-ink/10">
        {FILAS.map(([k, v, d], i) => (
          <motion.div
            key={k}
            initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.12 }}
            className="flex items-center justify-between py-3.5"
          >
            <span className="text-[14px] text-dim">{k}</span>
            <span className="flex items-baseline gap-3">
              <span className="font-display text-[22px] font-semibold text-ink tracking-[-0.02em]">{v}</span>
              <span className="text-[12px] text-accent font-medium w-[86px] text-right">{d}</span>
            </span>
          </motion.div>
        ))}
      </div>
      <p className="mt-5 text-[12.5px] text-muted">Te lo mandamos por WhatsApp el día 28 de cada mes. Cinco líneas. Si un mes no ves nada, nos lo dices.</p>
    </div>
  )
}
