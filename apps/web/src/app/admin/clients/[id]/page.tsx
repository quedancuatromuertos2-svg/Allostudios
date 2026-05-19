"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, PhoneCall, Calendar, Users, Settings, CheckCircle, XCircle } from "lucide-react"

const PLANS = ["TRIAL", "STARTER", "PROFESSIONAL", "ENTERPRISE"]
const PLAN_CALLS: Record<string, number> = { TRIAL: 50, STARTER: 200, PROFESSIONAL: 1000, ENTERPRISE: 999999 }

export default function AdminClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "client", id],
    queryFn: () => api.get(`/api/admin/clients/${id}`).then(r => r.data),
  })

  const mutation = useMutation({
    mutationFn: (payload: any) => api.patch(`/api/admin/clients/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "client", id] }),
  })

  const [editPlan, setEditPlan] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState("")

  if (isLoading) return <div className="text-gray-500 text-sm">Cargando...</div>
  if (!data) return <div className="text-gray-500 text-sm">Cliente no encontrado</div>

  const { business, calls, appointments, leads } = data
  const sub = Array.isArray(business.subscription) ? business.subscription[0] : business.subscription

  const savePlan = () => {
    mutation.mutate({
      subscription: { plan: selectedPlan, calls_limit: PLAN_CALLS[selectedPlan] },
    })
    setEditPlan(false)
  }

  const toggleActive = () => {
    mutation.mutate({ is_active: !business.is_active })
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">{business.name}</h1>
          <p className="text-gray-400 text-sm">{business.niche?.replace(/_/g, " ")} · ID: {business.id.slice(0, 8)}…</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={toggleActive}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              business.is_active
                ? "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                : "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30"
            }`}
          >
            {business.is_active ? "Desactivar" : "Activar"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Subscription card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-white flex items-center gap-2">
            <Settings className="w-4 h-4 text-violet-400" /> Suscripción
          </h2>
          {editPlan ? (
            <div className="space-y-2">
              <select
                value={selectedPlan}
                onChange={e => setSelectedPlan(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
              >
                {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={savePlan} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white text-sm py-1.5 rounded-lg">
                  Guardar
                </button>
                <button onClick={() => setEditPlan(false)} className="flex-1 bg-gray-800 text-gray-300 text-sm py-1.5 rounded-lg">
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Plan</span>
                <span className="text-white font-medium">{sub?.plan || "TRIAL"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Estado</span>
                <div className="flex items-center gap-1">
                  {sub?.status === "active"
                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    : <XCircle className="w-3.5 h-3.5 text-amber-400" />}
                  <span className="text-sm capitalize text-gray-300">{sub?.status || "trialing"}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Llamadas usadas</span>
                <span className="text-white">{sub?.calls_used || 0} / {sub?.calls_limit || 50}</span>
              </div>
              <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-violet-500 rounded-full"
                  style={{ width: `${Math.min(100, ((sub?.calls_used || 0) / (sub?.calls_limit || 50)) * 100)}%` }}
                />
              </div>
              <button
                onClick={() => { setSelectedPlan(sub?.plan || "TRIAL"); setEditPlan(true) }}
                className="w-full mt-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm py-1.5 rounded-lg transition-colors"
              >
                Cambiar plan
              </button>
            </>
          )}
        </div>

        {/* Business info */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-2">
          <h2 className="font-semibold text-white mb-3">Datos del negocio</h2>
          {[
            ["Teléfono", business.phone || "—"],
            ["Dirección", business.address || "—"],
            ["Vapi ID", business.vapi_assistant_id ? business.vapi_assistant_id.slice(0, 16) + "…" : "Sin configurar"],
            ["Registrado", new Date(business.created_at).toLocaleDateString("es-ES")],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between py-1 border-b border-gray-800 last:border-0">
              <span className="text-xs text-gray-500">{k}</span>
              <span className="text-sm text-gray-300 truncate max-w-[60%] text-right">{v}</span>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold text-white mb-1">Actividad</h2>
          {[
            { icon: PhoneCall, label: "Llamadas totales", value: calls.length },
            { icon: Calendar, label: "Citas registradas", value: appointments.length },
            { icon: Users, label: "Leads capturados", value: leads.length },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center">
                <item.icon className="w-4 h-4 text-gray-400" />
              </div>
              <span className="text-sm text-gray-400 flex-1">{item.label}</span>
              <span className="text-white font-semibold">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calls list */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h2 className="font-semibold text-white">Últimas llamadas</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
              <th className="text-left px-5 py-3">Llamante</th>
              <th className="text-left px-5 py-3">Estado</th>
              <th className="text-left px-5 py-3">Duración</th>
              <th className="text-left px-5 py-3">Resumen</th>
              <th className="text-right px-5 py-3">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/50">
            {calls.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-800/30">
                <td className="px-5 py-3 text-gray-300">{c.caller_number || "Desconocido"}</td>
                <td className="px-5 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    c.status === "completed" ? "bg-emerald-500/20 text-emerald-300" : "bg-gray-700 text-gray-400"
                  }`}>{c.status}</span>
                </td>
                <td className="px-5 py-3 text-gray-400">
                  {c.duration_seconds ? `${Math.floor(c.duration_seconds / 60)}m ${c.duration_seconds % 60}s` : "—"}
                </td>
                <td className="px-5 py-3 text-gray-500 max-w-xs truncate">{c.summary || "—"}</td>
                <td className="px-5 py-3 text-right text-gray-500">
                  {c.started_at ? new Date(c.started_at).toLocaleDateString("es-ES") : "—"}
                </td>
              </tr>
            ))}
            {calls.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-8 text-center text-gray-600">Sin llamadas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
