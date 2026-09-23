'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AlloDino, { type Expresion } from './AlloDino'

/*  «Pregunta a allo»: chat de la web sobre el mismo motor que el asistente de WhatsApp (asistente
    «allo», /api/asistente/allo/chat). Burbuja a la izquierda (WhatsApp sigue a la derecha).
    Solo se muestra si NEXT_PUBLIC_CHAT_ALLO=1: hasta que exista el asistente en Supabase y haya
    clave de modelo, no se enseña. El avatar es la mascota (el allosaurus) y cambia de cara según
    lo que esté pasando; al cerrar cae el meteorito, que es de donde viene la historia de allo:
    se extinguió el que no supo adaptarse.                                                        */

type M = { de: 'yo' | 'allo'; t: string }
const SALUDO = 'Hola, soy allo. Dime qué negocio tienes y qué te falla (no te encuentran, contestas tarde, te faltan clientes) y te digo qué pack encaja. O escribe el nombre de tu negocio y te enseño cómo quedaría su web.'
const CAIDA = 1100 // ms que dura el meteorito antes de que se cierre el chat

function Meteorito() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".65">
        <path d="M55 1 40 16" /><path d="M47 2 35 10" /><path d="M54 9 46 21" />
      </g>
      <circle cx="23" cy="33" r="14" fill="currentColor" />
    </svg>
  )
}

export default function ChatAllo() {
  const [abierto, setAbierto] = useState(false)
  const [visible, setVisible] = useState(false)
  const [msgs, setMsgs] = useState<M[]>([{ de: 'allo', t: SALUDO }])
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const [cayendo, setCayendo] = useState(false)
  const sesion = useRef('')
  const fin = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CHAT_ALLO !== '1') return
    const t = setTimeout(() => setVisible(true), 4000)
    try { sesion.current = localStorage.getItem('allo-chat') || crypto.randomUUID(); localStorage.setItem('allo-chat', sesion.current) } catch { sesion.current = String(Date.now()) }
    return () => clearTimeout(t)
  }, [])
  useEffect(() => { fin.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, abierto])

  // Cerrar = que le caiga el meteorito. Con reduced-motion se cierra y ya.
  function cerrar() {
    if (cayendo) return
    const quieto = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (quieto) { setAbierto(false); return }
    setCayendo(true)
    setTimeout(() => { setAbierto(false); setCayendo(false) }, CAIDA)
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault()
    const t = texto.trim(); if (!t || pensando) return
    setMsgs((m) => [...m, { de: 'yo', t }]); setTexto(''); setPensando(true)
    try {
      const r = await fetch('/api/asistente/allo/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sesion: sesion.current, texto: t }) })
      const d = await r.json()
      setMsgs((m) => [...m, { de: 'allo', t: d.respuesta || 'Escríbenos por WhatsApp y te contestamos hoy.' }])
    } catch {
      setMsgs((m) => [...m, { de: 'allo', t: 'Se me ha cortado. Escríbenos por WhatsApp y te contestamos hoy.' }])
    } finally { setPensando(false) }
  }

  const cara: Expresion = cayendo ? 'susto' : pensando ? 'pensando' : 'normal'

  if (!visible) return null
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={cayendo ? { opacity: 1, y: [0, 0, -6, 4, 0], scale: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={cayendo
              ? { duration: CAIDA / 1000, times: [0, 0.68, 0.74, 0.82, 1] }
              : { duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="relative mb-3 w-[min(92vw,360px)] rounded-[1.6rem] p-1.5 bg-white/[.06] ring-1 ring-white/10"
          >
            <div className="relative rounded-[calc(1.6rem-0.375rem)] overflow-hidden bg-[rgba(16,15,22,.96)] shadow-[inset_0_1px_1px_rgba(255,255,255,.12)] text-white">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <AlloDino expresion={cara} parte="cara" className="w-9 h-9 shrink-0" title="allo" />
                <div className="flex-1"><div className="text-[13.5px] font-semibold">allo</div><div className="text-[11px] text-emerald-400">contesta al momento</div></div>
                <button onClick={cerrar} aria-label="Cerrar" className="w-8 h-8 rounded-full hover:bg-white/10 text-white/60">✕</button>
              </div>
              <div className="h-[340px] overflow-y-auto px-4 py-3 space-y-2 text-[13.5px] leading-snug">
                {msgs.map((m, i) => (
                  <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.de === 'allo' ? 'bg-white/[.08] rounded-bl-md' : 'bg-accent text-white ml-auto rounded-br-md'}`}>{m.t}</div>
                ))}
                {pensando && <div className="w-14 rounded-2xl rounded-bl-md bg-white/[.08] px-3 py-2 flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
                <div ref={fin} />
              </div>
              <form onSubmit={enviar} className="p-2 border-t border-white/10 flex items-center gap-2">
                <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe aquí…" maxLength={600} disabled={cayendo}
                  className="flex-1 min-w-0 bg-white/[.06] rounded-full px-4 py-2.5 text-[13.5px] text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-accent" />
                <button type="submit" disabled={pensando || cayendo} className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center disabled:opacity-50" aria-label="Enviar">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </form>

              {/* El meteorito: cruza el panel, fogonazo al impactar y se cierra */}
              {cayendo && (
                <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
                  <motion.div
                    className="absolute text-white/90"
                    initial={{ x: 330, y: -80, opacity: 0, rotate: -12 }}
                    animate={{ x: 26, y: 300, opacity: [0, 1, 1, 0], rotate: 8 }}
                    transition={{ duration: (CAIDA * 0.74) / 1000, ease: [0.45, 0, 0.9, 1], times: [0, 0.12, 0.85, 1] }}
                  >
                    <Meteorito />
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0, 0.85, 0] }}
                    transition={{ duration: CAIDA / 1000, times: [0, 0.7, 0.76, 0.92] }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => (abierto ? cerrar() : setAbierto(true))}
        className="lg flex items-center gap-2.5 rounded-full pl-2 pr-4 py-1.5 text-[13px] font-semibold text-ink shadow-[0_16px_40px_-18px_rgba(0,0,0,.6)]"
        aria-label="Pregunta a allo"
      >
        <AlloDino expresion="normal" parte="cara" className="w-9 h-9 shrink-0" />
        Pregunta a allo
      </motion.button>
    </div>
  )
}
