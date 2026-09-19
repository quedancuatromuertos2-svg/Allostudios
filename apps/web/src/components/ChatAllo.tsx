'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/*  «Pregunta a allo»: chat de la web sobre el mismo motor que el asistente de WhatsApp (asistente
    «allo», /api/asistente/allo/chat). Burbuja a la izquierda (WhatsApp sigue a la derecha).
    Solo se muestra si NEXT_PUBLIC_CHAT_ALLO=1: hasta que exista el asistente en Supabase y haya
    clave de modelo, no se enseña. El personaje (BMO: A consola / B faro / C bolsillo) va en el
    avatar cuando Ángel elija; ahora lleva el icono de la marca.                                  */

type M = { de: 'yo' | 'allo'; t: string }
const SALUDO = 'Hola, soy allo. Dime qué negocio tienes y qué te falla (no te encuentran, contestas tarde, te faltan clientes) y te digo qué pack encaja. O escribe el nombre de tu negocio y te enseño cómo quedaría su web.'

export default function ChatAllo() {
  const [abierto, setAbierto] = useState(false)
  const [visible, setVisible] = useState(false)
  const [msgs, setMsgs] = useState<M[]>([{ de: 'allo', t: SALUDO }])
  const [texto, setTexto] = useState('')
  const [pensando, setPensando] = useState(false)
  const sesion = useRef('')
  const fin = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_CHAT_ALLO !== '1') return
    const t = setTimeout(() => setVisible(true), 4000)
    try { sesion.current = localStorage.getItem('allo-chat') || crypto.randomUUID(); localStorage.setItem('allo-chat', sesion.current) } catch { sesion.current = String(Date.now()) }
    return () => clearTimeout(t)
  }, [])
  useEffect(() => { fin.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, abierto])

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

  if (!visible) return null
  return (
    <div className="fixed bottom-6 left-6 z-50">
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="mb-3 w-[min(92vw,360px)] rounded-[1.6rem] p-1.5 bg-white/[.06] ring-1 ring-white/10"
          >
            <div className="rounded-[calc(1.6rem-0.375rem)] overflow-hidden bg-[rgba(16,15,22,.96)] shadow-[inset_0_1px_1px_rgba(255,255,255,.12)] text-white">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <img src="/marca/icono-claro-64.png" alt="" className="w-8 h-8 rounded-[10px]" />
                <div className="flex-1"><div className="text-[13.5px] font-semibold">allo</div><div className="text-[11px] text-emerald-400">contesta al momento</div></div>
                <button onClick={() => setAbierto(false)} aria-label="Cerrar" className="w-8 h-8 rounded-full hover:bg-white/10 text-white/60">✕</button>
              </div>
              <div className="h-[340px] overflow-y-auto px-4 py-3 space-y-2 text-[13.5px] leading-snug">
                {msgs.map((m, i) => (
                  <div key={i} className={`max-w-[85%] rounded-2xl px-3 py-2 ${m.de === 'allo' ? 'bg-white/[.08] rounded-bl-md' : 'bg-accent text-white ml-auto rounded-br-md'}`}>{m.t}</div>
                ))}
                {pensando && <div className="w-14 rounded-2xl rounded-bl-md bg-white/[.08] px-3 py-2 flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}</div>}
                <div ref={fin} />
              </div>
              <form onSubmit={enviar} className="p-2 border-t border-white/10 flex items-center gap-2">
                <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe aquí…" maxLength={600}
                  className="flex-1 min-w-0 bg-white/[.06] rounded-full px-4 py-2.5 text-[13.5px] text-white placeholder:text-white/35 outline-none focus:ring-1 focus:ring-accent" />
                <button type="submit" disabled={pensando} className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center disabled:opacity-50" aria-label="Enviar">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setAbierto((v) => !v)}
        className="lg flex items-center gap-2.5 rounded-full pl-1.5 pr-4 py-1.5 text-[13px] font-semibold text-ink shadow-[0_16px_40px_-18px_rgba(0,0,0,.6)]"
        aria-label="Pregunta a allo"
      >
        <img src="/marca/icono-claro-64.png" alt="" className="w-9 h-9 rounded-full" />
        Pregunta a allo
      </motion.button>
    </div>
  )
}
