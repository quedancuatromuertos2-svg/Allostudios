"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { TrendingUp, Users, PhoneCall, CreditCard, Activity, Star } from "lucide-react"

export default function AdminOverviewPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => api.get("/api/admin/overview").then(r => r.data),
    refetchInterval: 30000,
  })

  const { data: clients } = useQuery({
    queryKey: ["admin", "clients", "recent"],
    queryFn: () => api.get("/api/admin/clients?limit=5").then(r => r.data),
  })

  const stats = [
    {
      label: "Negocios activos",
      value: data?.totalBusinesses ?? "—",
      sub: `+${data?.newBusinesses30d ?? 0} este mes`,
      icon: Users,
      color: "text-violet-400",
      bg: "bg-violet-500/10",
    },
    {
      label: "MRR",
      value: data?.mrr ? `${data.mrr}€` : "—",
      sub: `${data?.activeSubs ?? 0} suscrip. activas`,
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Llamadas (30d)",
      value: data?.callsThisMonth ?? "—",
      sub: "procesadas por IA",
      icon: PhoneCall,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "En prueba",
      value: data?.trialSubs ?? "—",
      sub: "pendientes de convertir",
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
    },
  ]

  const planColors: Record<string, string> = {
    STARTER: "text-blue-400",
    PROFESSIONAL: "text-violet-400",
    ENTERPRISE: "text-amber-400",
    TRIAL: "text-gray-400",
  }

  const statusDot: Record<string, string> = {
    active: "bg-emerald-400",
    trialing: "bg-amber-400",
    cancelled: "bg-red-400",
    past_due: "bg-red-500",
  }

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Panel de Administración</h1>
        <p className="text-gray-400 text-sm mt-1">Vista global de todos los clientes y métricas del negocio</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-sm text-gray-400 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-600 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Plan distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-violet-400" /> Distribución de planes
          </h2>
          <div className="space-y-3">
            {[
              { plan: "TRIAL", label: "Trial (14 días)" },
              { plan: "STARTER", label: "Starter — 79€/mes" },
              { plan: "PROFESSIONAL", label: "Professional — 199€/mes" },
              { plan: "ENTERPRISE", label: "Enterprise — 499€/mes" },
            ].map(({ plan, label }) => {
              const count = data?.planDist?.[plan] || 0
              const total = data?.totalBusinesses || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={plan}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${planColors[plan]}`}>{label}</span>
                    <span className="text-sm text-gray-400">{count} clientes</span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-violet-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent signups */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" /> Últimos registros
          </h2>
          <div className="space-y-3">
            {(clients?.data || []).map((c: any) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-900/50 flex items-center justify-center text-xs font-bold text-violet-300">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{c.niche?.replace(/_/g, " ").toLowerCase()}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${statusDot[c.subscription?.status] || "bg-gray-600"}`} />
                  <span className={`text-xs ${planColors[c.subscription?.plan || "TRIAL"]}`}>
                    {c.subscription?.plan || "—"}
                  </span>
                </div>
              </div>
            ))}
            {!clients?.data?.length && (
              <p className="text-sm text-gray-600 text-center py-4">Sin clientes aún</p>
            )}
          </div>
          <a href="/admin/clients" className="block text-center text-xs text-violet-400 hover:underline mt-4">
            Ver todos →
          </a>
        </div>
      </div>
    </div>
  )
}
