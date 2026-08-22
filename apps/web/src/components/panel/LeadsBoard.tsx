'use client'

import { useMemo, useState } from 'react'
import type { Lead, PanelMember } from '@/lib/panel'

const ESTADOS = [
  { k: 'nuevo', label: 'Nuevos', color: 'bg-surface text-dim border-border' },
  { k: 'contactado', label: 'Contactados', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { k: 'interesado', label: 'Interesados', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { k: 'cliente', label: 'Clientes', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { k: 'descartado', label: 'Descartados', color: 'bg-surface text-muted border-border' },
]

const pill = (estado: string) => ESTADOS.find((e) => e.k === estado)?.color || 'bg-surface text-dim border-border'

function waLink(phone: string, message: string) {
  const digits = phone.replace(/[^\d]/g, '')
  const num = digits.length === 9 ? `34${digits}` : digits
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`
}

export default function LeadsBoard({ leads: iniciales, member }: { leads: Lead[]; member: PanelMember }) {
  const [leads, setLeads] = useState(iniciales)
  const [filtro, setFiltro] = useState<string>('nuevo')
  const [busca, setBusca] = useState('')
  const [abierto, setAbierto] = useState<string | null>(null)
  const [guardando, setGuardando] = useState<string | null>(null)

  const conteo = useMemo(() => {
    const c: Record<string, number> = {}
    leads.forEach((l) => { c[l.status] = (c[l.status] || 0) + 1 })
    return c
  }, [leads])

  const visibles = useMemo(() => {
    const q = busca.trim().toLowerCase()
    return leads.filter((l) => {
      if (filtro !== 'todos' && l.status !== filtro) return false
      if (!q) return true
      return [l.name, l.sector_label, l.city, l.address, l.phone].some((v) => (v || '').toLowerCase().includes(q))
    })
  }, [leads, filtro, busca])

  async function cambiar(id: string, status: string) {
    setGuardando(id)
    const previo = leads
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status } : l)))
    try {
      const r = await fetch('/api/panel/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!r.ok) throw new Error()
    } catch {
      setLeads(previo) // si falla, lo dejamos como estaba
    } finally {
      setGuardando(null)
    }
  }

  if (!leads.length) {
    return (
      <div className="card p-10 text-center">
        <h2 className="font-display text-title font-semibold text-ink">Todavía no hay leads aquí.</h2>
        <p className="mt-3 text-dim font-light max-w-md mx-auto">
          {member.role === 'admin'
            ? 'Sube la lista desde el Captador con SUBIR-LEADS.bat y aparecerán aquí al instante.'
            : 'En cuanto te asignen negocios los verás en esta pantalla.'}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {[{ k: 'todos', label: 'Todos' }, ...ESTADOS].map((e) => {
          const n = e.k === 'todos' ? leads.length : conteo[e.k] || 0
          return (
            <button
              key={e.k}
              onClick={() => setFiltro(e.k)}
              className={`px-3.5 py-2 rounded-full text-[12.5px] font-medium border transition-all duration-200 ${
                filtro === e.k
                  ? 'bg-ink text-white border-ink'
                  : 'border-border text-dim hover:text-ink hover:border-ink/30'
              }`}
            >
              {e.label} <span className="opacity-60">{n}</span>
            </button>
          )
        })}
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar negocio, sector, calle…"
          className="ml-auto w-full sm:w-64 px-4 py-2 rounded-full border border-border bg-white text-[13px] text-ink placeholder:text-muted focus:border-accent outline-none transition-colors"
        />
      </div>

      {/* Lista */}
      <div className="space-y-2.5">
        {visibles.map((l) => {
          const open = abierto === l.id
          return (
            <div key={l.id} className="card overflow-hidden">
              <div className="p-4 md:p-5 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setAbierto(open ? null : l.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    {l.tier && (
                      <span className="w-6 h-6 shrink-0 rounded-lg bg-accent-light text-accent text-[11px] font-bold flex items-center justify-center">
                        {l.tier}
                      </span>
                    )}
                    <span className="text-[15px] font-semibold text-ink truncate">{l.name}</span>
                    {l.score != null && <span className="text-[11.5px] text-muted shrink-0">{l.score} pts</span>}
                  </div>
                  <div className="text-[12.5px] text-dim mt-1 truncate">
                    {[l.sector_label, l.city || l.address, l.website ? 'tiene web' : 'SIN WEB'].filter(Boolean).join(' · ')}
                  </div>
                </button>

                <span className={`text-[11px] font-semibold uppercase tracking-[0.1em] px-2.5 py-1 rounded-full border ${pill(l.status)}`}>
                  {l.status}
                </span>

                {l.phone && (
                  <a
                    href={waLink(l.phone, l.message || `Hola, soy de AlloStudios. Os escribo por ${l.name}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => l.status === 'nuevo' && cambiar(l.id, 'contactado')}
                    className="btn-accent text-[12.5px] px-4 py-2 rounded-full"
                  >
                    WhatsApp
                  </a>
                )}
              </div>

              {open && (
                <div className="border-t border-border bg-surface/40 p-4 md:p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 text-[13px]">
                    <div className="space-y-1.5">
                      {l.phone && <p className="text-dim">Teléfono: <a href={`tel:+${l.phone}`} className="text-ink font-medium">{l.phone}</a></p>}
                      {l.address && <p className="text-dim">Dirección: <span className="text-ink">{l.address}</span></p>}
                      {l.rating != null && <p className="text-dim">Google: <span className="text-ink">{l.rating}★ · {l.reviews || 0} reseñas</span></p>}
                      {l.website && (
                        <p className="text-dim truncate">
                          Web: <a href={l.website} target="_blank" rel="noopener noreferrer" className="text-accent underline">{l.website}</a>
                        </p>
                      )}
                    </div>
                    <div>
                      {l.problems && l.problems.length > 0 && (
                        <>
                          <p className="text-[11px] uppercase tracking-[0.14em] text-muted font-semibold mb-1.5">Por qué te necesita</p>
                          <ul className="space-y-1 text-dim">
                            {l.problems.map((p, i) => <li key={i}>· {p}</li>)}
                          </ul>
                        </>
                      )}
                    </div>
                  </div>

                  {l.message && (
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.14em] text-muted font-semibold mb-1.5">Mensaje sugerido</p>
                      <pre className="text-[12.5px] text-dim whitespace-pre-wrap font-sans bg-white border border-border rounded-xl p-3.5 max-h-52 overflow-y-auto">{l.message}</pre>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {ESTADOS.map((e) => (
                      <button
                        key={e.k}
                        disabled={guardando === l.id}
                        onClick={() => cambiar(l.id, e.k)}
                        className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all disabled:opacity-50 ${
                          l.status === e.k ? 'bg-ink text-white border-ink' : 'border-border text-dim hover:text-ink hover:border-ink/30'
                        }`}
                      >
                        {e.label.replace(/s$/, '')}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {!visibles.length && (
          <p className="text-[13.5px] text-muted text-center py-10">
            Ningún lead con ese filtro.
          </p>
        )}
      </div>
    </>
  )
}
