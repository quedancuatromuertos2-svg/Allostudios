'use client'

import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { VisualWeb } from './Visuales'

/*  Las animaciones propias de cada capítulo, ligadas al scroll (progreso 0→1 de la sección):

    ESTÁNDAR · "Que te encuentren": una búsqueda de Google que se escribe sola mientras bajas
    («barbería ruzafa»), aparecen tres resultados y el negocio del cliente sube del puesto 3
    al puesto 1. Al lado, la web en el móvil.

    PRO · "Que te contesten": el chat de WhatsApp se escribe con el scroll, burbuja a burbuja,
    con los "escribiendo…" entre medias. Cuanto más bajas, más avanza la conversación.

    (MAX lleva la palabra en perspectiva, dentro de CapituloPack.)                            */

const QUERY = 'barbería ruzafa'
const RESULTADOS = [
  { n: 'Barbería Navaja', r: '4,9', v: 184, d: 'Ruzafa · Abierto · Cierra 20:30', tuyo: true },
  { n: 'Barber Shop Centro', r: '4,3', v: 61, d: 'Ruzafa · Abierto' },
  { n: 'Peluquería Unisex Sol', r: '4,1', v: 37, d: 'Russafa · Cierra 19:00' },
]

/*  Progreso PROPIO de cada visual: 0 cuando entra por abajo de la pantalla, 1 cuando su parte
    baja llega al tercio superior. Antes iba con el progreso de todo el capítulo y en el móvil (capítulo
    altísimo) el visual se iba de la pantalla con la animación apenas empezada.                        */
function useProgresoPropio(ref: React.RefObject<HTMLDivElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'end 30%'] })
  // Se remapea al 0-0.6 que ya usan los tramos de abajo
  return useTransform(scrollYProgress, [0, 1], [0, 0.6])
}

export function BusquedaEnVivo({ sinMovil }: { progreso?: MotionValue<number>; sinMovil?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const progreso = useProgresoPropio(ref)
  // Tramos del scroll: 0.05-0.22 se escribe · 0.22-0.32 aparecen resultados · 0.32-0.5 el cliente sube al 1
  const letras = useTransform(progreso, [0.05, 0.22], [0, QUERY.length])
  const texto = useTransform(letras, (n) => QUERY.slice(0, Math.round(n)))
  const cursor = useTransform(progreso, (p) => (p > 0.05 && p < 0.24 ? 1 : 0))
  const listaOp = useTransform(progreso, [0.22, 0.3], [0, 1])
  const listaY = useTransform(progreso, [0.22, 0.3], [12, 0])
  // El cliente empieza en el puesto 3 (y = 2 filas) y sube al 1; los otros bajan una fila
  const FILA = 66
  const tuyoY = useTransform(progreso, [0.34, 0.5], [FILA * 2, 0])
  const otrosY = useTransform(progreso, [0.34, 0.5], [0, FILA])
  const badgeOp = useTransform(progreso, [0.5, 0.58], [0, 1])
  const badgeEsc = useTransform(progreso, [0.5, 0.58], [0.8, 1])

  return (
    <div ref={ref} className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
      {/* Google */}
      <div className="w-full max-w-[520px]">
        <div className="rounded-full px-5 py-3.5 flex items-center gap-3" style={{ background: '#fff', boxShadow: '0 1px 6px rgba(32,33,36,.28)' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <div className="flex-1 text-[16px] text-[#202124] flex items-center">
            <motion.span>{texto}</motion.span>
            <motion.span style={{ opacity: cursor }} className="inline-block w-[2px] h-[18px] bg-[#1a73e8] ml-[1px] animate-pulse" />
          </div>
          <div className="flex gap-2">
            <span className="w-4 h-4 rounded-full" style={{ background: 'conic-gradient(#4285f4,#ea4335,#fbbc04,#34a853,#4285f4)' }} />
          </div>
        </div>

        <motion.div style={{ opacity: listaOp, y: listaY }} className="mt-4 rounded-2xl overflow-hidden" >
          <div className="px-4 pt-3 pb-2 text-[12px] text-[#5f6368] flex items-center gap-2" style={{ background: '#fff' }}>
            <span className="font-medium text-[#202124]">Negocios</span> · barbería · Ruzafa, València
          </div>
          <div className="relative" style={{ background: '#fff', height: FILA * 3 + 8 }}>
            {RESULTADOS.map((r, i) => {
              const y = r.tuyo ? tuyoY : otrosY
              const base = r.tuyo ? 0 : FILA * (i - 1)
              return (
                <motion.div key={r.n} style={{ y, top: base + 4 }} className={`absolute left-2 right-2 rounded-xl px-3 flex items-center gap-3 ${r.tuyo ? 'bg-[#e8f0fe]' : ''}`} >
                  <div style={{ height: FILA - 8 }} className="flex items-center gap-3 w-full">
                    <div className="w-11 h-11 rounded-lg shrink-0" style={{ background: r.tuyo ? 'linear-gradient(135deg,#1f3b2f,#0f1f18)' : '#e8eaed' }} />
                    <div className="min-w-0 flex-1">
                      <div className="text-[14px] font-medium text-[#202124] truncate">{r.n}</div>
                      <div className="text-[12px] text-[#5f6368] flex items-center gap-1"><span className="text-[#202124]">{r.r}</span><span className="text-[#fbbc04] tracking-[-1px]">★★★★★</span>({r.v}) · {r.d}</div>
                    </div>
                    {r.tuyo && (
                      <motion.span style={{ opacity: badgeOp, scale: badgeEsc }} className="shrink-0 text-[10.5px] font-bold uppercase tracking-wide text-[#188038] bg-white px-2 py-1 rounded-full" >Puesto 1</motion.span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
        <p className="mt-3 text-[12px] text-muted">Así es como te encuentran: ficha completa, reseñas y una web que Google entiende.</p>
      </div>

      {/* La web en el móvil (si no hay panel de demo al lado) */}
      {!sinMovil && <VisualWeb />}
    </div>
  )
}

/* ── PRO: el chat que se escribe con el scroll ── */
const CHAT = [
  { de: 'cliente', hora: '22:14', txt: 'Hola! Tenéis hueco mañana por la tarde para corte y barba?' },
  { de: 'ia', hora: '22:14', txt: '¡Hola! Sí: mañana tengo a las 17:30 y a las 18:45. Corte + barba son 25 € y dura unos 40 min. ¿Cuál te va mejor?' },
  { de: 'cliente', hora: '22:15', txt: 'A las 17:30. Soy Marcos' },
  { de: 'ia', hora: '22:15', txt: 'Hecho, Marcos: mañana 17:30, corte + barba. Estamos en C/ Sueca 14 (Ruzafa). Te mando un recordatorio por la mañana 👋' },
]

function Burbuja({ m, progreso, desde }: { m: (typeof CHAT)[number]; progreso: MotionValue<number>; desde: number }) {
  const op = useTransform(progreso, [desde, desde + 0.04], [0, 1])
  const y = useTransform(progreso, [desde, desde + 0.04], [10, 0])
  const esc = useTransform(progreso, [desde, desde + 0.04], [0.96, 1])
  return (
    <motion.div style={{ opacity: op, y, scale: esc, transformOrigin: m.de === 'ia' ? '100% 100%' : '0% 100%' }}
      className={`max-w-[85%] rounded-2xl px-3 py-2 text-[12.5px] leading-snug ${m.de === 'ia' ? 'bg-[#005c4b] text-white ml-auto rounded-br-md' : 'bg-[#202c33] text-white rounded-bl-md'}`}>
      {m.txt}
      <span className="block text-right text-[10px] text-white/50 mt-1">{m.hora}{m.de === 'ia' ? ' ✓✓' : ''}</span>
    </motion.div>
  )
}

function Escribiendo({ progreso, desde, hasta }: { progreso: MotionValue<number>; desde: number; hasta: number }) {
  const op = useTransform(progreso, [desde, desde + 0.01, hasta - 0.01, hasta], [0, 1, 1, 0])
  // Ocupa sitio solo mientras se ve: así no deja huecos entre burbujas
  const alto = useTransform(progreso, [desde, desde + 0.01, hasta - 0.01, hasta], [0, 32, 32, 0])
  const margen = useTransform(progreso, [desde, desde + 0.01, hasta - 0.01, hasta], [-10, 0, 0, -10])
  return (
    <motion.div style={{ opacity: op, height: alto, marginTop: margen }} className="ml-auto w-14 rounded-2xl rounded-br-md bg-[#005c4b] flex items-center justify-center gap-1 overflow-hidden">
      {[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/70 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
    </motion.div>
  )
}

export function ChatEnVivo(_: { progreso?: MotionValue<number> }) {
  const ref = useRef<HTMLDivElement>(null)
  const progreso = useProgresoPropio(ref)
  // Tramos: cliente 0.10 · escribiendo 0.14-0.22 · ia 0.22 · cliente 0.30 · escribiendo 0.34-0.42 · ia 0.42
  const T = [0.1, 0.22, 0.3, 0.42]
  const cita = useTransform(progreso, [0.5, 0.56], [0, 1])
  const citaY = useTransform(progreso, [0.5, 0.56], [8, 0])
  return (
    <div ref={ref} className="flex items-end gap-6">
      <div className="relative w-[300px] h-[620px] rounded-[44px] p-[10px] bg-[#1c1c22]" style={{ boxShadow: '0 40px 90px -30px rgba(0,0,0,.55), inset 0 0 0 1px rgba(255,255,255,.12)' }}>
        <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[92px] h-[26px] rounded-full bg-black z-10" />
        <div className="w-full h-full rounded-[34px] overflow-hidden relative">
          <div className="h-full flex flex-col bg-[#0b141a]">
            <div className="flex items-center gap-3 px-4 pt-11 pb-3 bg-[#1f2c34]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent to-[#FF7A2A]" />
              <div>
                <div className="text-[13.5px] font-semibold text-white">Barbería Navaja</div>
                <div className="text-[11px] text-emerald-400">en línea</div>
              </div>
            </div>
            <div className="flex-1 px-3 py-4 space-y-2.5 overflow-hidden" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.04) 1px, transparent 1px)', backgroundSize: '18px 18px' }}>
              <Burbuja m={CHAT[0]} progreso={progreso} desde={T[0]} />
              <Escribiendo progreso={progreso} desde={T[0] + 0.04} hasta={T[1]} />
              <Burbuja m={CHAT[1]} progreso={progreso} desde={T[1]} />
              <Burbuja m={CHAT[2]} progreso={progreso} desde={T[2]} />
              <Escribiendo progreso={progreso} desde={T[2] + 0.04} hasta={T[3]} />
              <Burbuja m={CHAT[3]} progreso={progreso} desde={T[3]} />
            </div>
            <div className="px-3 pb-6 pt-2 bg-[#0b141a]">
              <div className="h-9 rounded-full bg-[#2a3942] px-4 flex items-center text-[12px] text-white/40">Escribe un mensaje</div>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block max-w-[240px] pb-10">
        <p className="text-[12px] font-mono tracking-[0.12em] uppercase text-white/45">Sigue bajando: la conversación avanza contigo</p>
        <p className="mt-2 text-[14px] text-white/65 font-light leading-relaxed">El dueño estaba cenando. La cita quedó en su agenda y él se enteró por la mañana.</p>
        <motion.div style={{ opacity: cita, y: citaY }} className="mt-4 rounded-2xl px-4 py-3 text-[#111]" >
          <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,.94)', boxShadow: '0 20px 40px -20px rgba(0,0,0,.5)' }}>
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[#111]/60">Google Calendar</div>
            <div className="text-[13.5px] font-semibold mt-0.5">Marcos · corte + barba</div>
            <div className="text-[12.5px] text-[#111]/70">Mañana, 17:30 · añadida a las 22:15</div>
          </div>
        </motion.div>
        <p className="mt-3 text-[11.5px] text-white/35">Demo de nuestro asistente · negocio de ejemplo</p>
      </div>
    </div>
  )
}
