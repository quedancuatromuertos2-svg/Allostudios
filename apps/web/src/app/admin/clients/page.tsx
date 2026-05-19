"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Search, PhoneCall, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

const PLAN_COLORS: Record<string, string> = {
  ENTERPRISE: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  PROFESSIONAL: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  STARTER: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  TRIAL: "bg-gray-500/20 text-gray-300 border-gray-500/30",
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  active: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  trialing: <Clock className="w-4 h-4 text-amber-400" />,
  cancelled: <XCircle className="w-4 h-4 text-red-400" />,
  past_due: <XCircle className="w-4 h-4 text-red-500" />,
}

const NICHE_EMOJI: Record<string, string> = {
  BARBER_SHOP: "✂️", HAIR_SALON: "💇", RESTAURANT: "🍽️", DENTAL_CLINIC: "🦷",
  REAL_ESTATE: "🏠", GYM: "💪", SPA: "🧖", VET_CLINIC: "🐾",
}

export default function AdminClientsPage() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "clients", page, search],
    queryFn: () => api.get(`/api/admin/clients?page=${page}&limit=20&q=${search}`).then(r => r.data),
    keepPreviousData: true,
  } as any)

  const clients = (data as any)?.data || []
  const total = (data as any)?.total || 0
  const pages = Math.ceil(total / 20)

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clientes</h1>
          <p className="text-gray-400 text-sm mt-1">{total} negocios registrados</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-xs text-gray-500 uppercase tracking-wider">
              <th className="text-left px-5 py-3">Negocio</th>
              <th className="text-left px-5 py-3">Sector</th>
              <th className="text-left px-5 py-3">Plan</th>
              <th className="text-left px-5 py-3">Estado</th>
              <th className="text-right px-5 py-3">Llamadas (30d)</th>
              <th className="text-right px-5 py-3">Uso</th>
              <th className="text-right px-5 py-3">Registro</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {isLoading && (
              <tr><td colSpan={8} className="text-center py-12 text-gray-600">Cargando...</td></tr>
            )}
            {clients.map((c: any) => {
              const sub = Array.isArray(c.subscription) ? c.subscription[0] : c.subscription
              const usagePct = sub ? Math.min(100, Math.round(((sub.calls_used || 0) / (sub.calls_limit || 1)) * 100)) : 0
              return (
                <tr key={c.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-medium text-white">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.phone || "—"}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-300">
                    {NICHE_EMOJI[c.niche] || "🏢"} {c.niche?.replace(/_/g, " ").toLowerCase()}
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium border ${PLAN_COLORS[sub?.plan || "TRIAL"]}`}>
                      {sub?.plan || "TRIAL"}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      {STATUS_ICON[sub?.status || "trialing"]}
                      <span className="text-xs text-gray-400 capitalize">{sub?.status || "trialing"}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="flex items-center justify-end gap-1 text-gray-300">
                      <PhoneCall className="w-3 h-3 text-gray-500" /> {c.calls30d}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <div className="w-16 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${usagePct > 80 ? "bg-red-500" : "bg-violet-500"}`}
                          style={{ width: `${usagePct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{sub?.calls_used || 0}/{sub?.calls_limit || 50}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right text-xs text-gray-500">
                    {new Date(c.created_at).toLocaleDateString("es-ES")}
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/admin/clients/${c.id}`} className="text-gray-500 hover:text-white transition-colors">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              )
            })}
            {!isLoading && clients.length === 0 && (
              <tr><td colSpan={8} className="text-center py-12 text-gray-600">No hay clientes</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-gray-800 text-sm text-gray-300 disabled:opacity-40 hover:bg-gray-700"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-500">Página {page} de {pages}</span>
          <button
            onClick={() => setPage(p => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 rounded-lg bg-gray-800 text-sm text-gray-300 disabled:opacity-40 hover:bg-gray-700"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  )
}
