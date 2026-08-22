'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { PanelMember } from '@/lib/panel'

const ROLES: { k: PanelMember['role']; label: string; ayuda: string }[] = [
  { k: 'comercial', label: 'Comercial', ayuda: 'Ve solo los leads que le asignes' },
  { k: 'admin', label: 'Admin', ayuda: 'Ve todo y puede repartir' },
  { k: 'cliente', label: 'Cliente', ayuda: 'Para quien pague la mensualidad de captación' },
]

export default function EquipoPanel({
  members,
  yo,
  sinAsignar,
}: {
  members: PanelMember[]
  yo: PanelMember
  sinAsignar: number
}) {
  const router = useRouter()
  const [abierto, setAbierto] = useState(false)
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [rol, setRol] = useState<PanelMember['role']>('comercial')
  const [msg, setMsg] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null)
  const [ocupado, setOcupado] = useState(false)

  async function llamar(url: string, init: RequestInit) {
    setOcupado(true)
    setMsg(null)
    try {
      const r = await fetch(url, init)
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d.error || 'No se pudo')
      router.refresh()
      return d
    } catch (e) {
      setMsg({ tipo: 'error', texto: e instanceof Error ? e.message : 'No se pudo' })
      return null
    } finally {
      setOcupado(false)
    }
  }

  async function alta(e: React.FormEvent) {
    e.preventDefault()
    const d = await llamar('/api/panel/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name: nombre, role: rol }),
    })
    if (d) {
      setMsg({ tipo: 'ok', texto: `${email} ya puede entrar. Que se registre en la web con ese mismo email.` })
      setEmail('')
      setNombre('')
    }
  }

  async function repartir() {
    const d = await llamar('/api/panel/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auto: true }),
    })
    if (d) setMsg({ tipo: 'ok', texto: `${d.repartidos} leads repartidos entre ${d.entre} personas.` })
  }

  return (
    <div className="card mb-6 overflow-hidden">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <div>
          <h2 className="text-[15px] font-semibold text-ink">Equipo · {members.length}</h2>
          <p className="text-[12.5px] text-dim mt-0.5">
            {sinAsignar > 0
              ? `${sinAsignar.toLocaleString('es-ES')} leads sin asignar a nadie`
              : 'Todos los leads tienen dueño'}
          </p>
        </div>
        <span className={`text-muted transition-transform duration-300 ${abierto ? 'rotate-45' : ''}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>

      {abierto && (
        <div className="border-t border-border p-5 space-y-6">
          {/* Alta */}
          <form onSubmit={alta} className="grid sm:grid-cols-[1.4fr_1fr_auto_auto] gap-2.5 items-end">
            <div>
              <label className="block text-[12px] font-medium text-dim mb-1.5">Email de la persona</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="fran@ejemplo.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-[13.5px] text-ink placeholder:text-muted focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-dim mb-1.5">Nombre</label>
              <input
                value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Fran"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-white text-[13.5px] text-ink placeholder:text-muted focus:border-accent outline-none"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-dim mb-1.5">Rol</label>
              <select
                value={rol} onChange={(e) => setRol(e.target.value as PanelMember['role'])}
                className="px-3.5 py-2.5 rounded-xl border border-border bg-white text-[13.5px] text-ink focus:border-accent outline-none"
              >
                {ROLES.map((r) => <option key={r.k} value={r.k}>{r.label}</option>)}
              </select>
            </div>
            <button disabled={ocupado} className="btn-accent rounded-full px-5 py-2.5 text-[13px] disabled:opacity-60">
              Dar de alta
            </button>
          </form>

          <p className="text-[12px] text-muted -mt-3">
            No hace falta que le crees contraseña: se registra él en la web con ese email y el panel
            lo reconoce solo. {ROLES.find((r) => r.k === rol)?.ayuda}.
          </p>

          {msg && (
            <p className={`text-[13px] ${msg.tipo === 'ok' ? 'text-emerald-600' : 'text-red-500'}`}>{msg.texto}</p>
          )}

          {/* Lista */}
          <div className="divide-y divide-border border-t border-border">
            {members.map((m) => (
              <div key={m.id} className="py-3 flex flex-wrap items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-medium text-ink truncate">
                    {m.name || m.email.split('@')[0]}
                    {m.id === yo.id && <span className="ml-2 text-[11px] text-muted">(tú)</span>}
                    {!m.clerk_id && <span className="ml-2 text-[11px] text-amber-600">sin registrar aún</span>}
                    {!m.active && <span className="ml-2 text-[11px] text-red-500">desactivado</span>}
                  </div>
                  <div className="text-[12.5px] text-muted truncate">{m.email}</div>
                </div>

                <select
                  value={m.role}
                  disabled={ocupado || m.id === yo.id}
                  onChange={(e) => llamar('/api/panel/members', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: m.id, role: e.target.value }),
                  })}
                  className="px-3 py-1.5 rounded-full border border-border bg-white text-[12.5px] text-dim disabled:opacity-50"
                >
                  {ROLES.map((r) => <option key={r.k} value={r.k}>{r.label}</option>)}
                </select>

                {m.id !== yo.id && (
                  <button
                    disabled={ocupado}
                    onClick={() => llamar(`/api/panel/members?id=${m.id}`, { method: 'DELETE' })}
                    className="text-[12.5px] text-muted hover:text-red-500 transition-colors disabled:opacity-50"
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Reparto */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <p className="text-[12.5px] text-dim max-w-sm">
              El reparto va en abanico: el mejor lead al primero, el siguiente al segundo… así nadie se
              queda con la peor mitad de la lista.
            </p>
            <button
              onClick={repartir}
              disabled={ocupado || sinAsignar === 0}
              className="btn-primary rounded-full text-[13px] disabled:opacity-40"
            >
              Repartir {sinAsignar > 0 ? sinAsignar.toLocaleString('es-ES') : ''} leads sin asignar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
