"use client"

import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useBusinessStore } from "@/store/business.store"
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { PhoneCall, PhoneMissed, CalendarCheck, Users, TrendingUp, Clock } from "lucide-react"

const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-gray-100 rounded-xl ${className ?? ""}`} />
}

export default function AnalyticsPage() {
  const { currentBusinessId: bizId } = useBusinessStore()

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["analytics", "dashboard", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/analytics?type=dashboard`).then((r) => r.data),
    enabled: !!bizId,
  })

  const { data: callVolume, isLoading: volumeLoading } = useQuery({
    queryKey: ["analytics", "callVolume", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/analytics?type=volume&days=30`).then((r) => r.data),
    enabled: !!bizId,
  })

  const { data: hourly, isLoading: hourlyLoading } = useQuery({
    queryKey: ["analytics", "hourly", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/analytics?type=hourly`).then((r) => r.data),
    enabled: !!bizId,
  })

  const hasData = !statsLoading && stats && stats.totalCalls > 0
  const pieData = hasData
    ? [
        { name: "Atendidas", value: stats.answeredCalls },
        { name: "Perdidas", value: stats.missedCalls },
        { name: "Visitas", value: stats.appointmentsBooked },
        { name: "Leads", value: stats.leadsGenerated },
      ].filter((d) => d.value > 0)
    : []

  const kpis = [
    { label: "Llamadas totales", value: stats?.totalCalls ?? "—", icon: PhoneCall, color: "text-violet-600", bg: "bg-violet-50" },
    { label: "Atendidas", value: stats?.answeredCalls ?? "—", icon: PhoneCall, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Perdidas", value: stats?.missedCalls ?? "—", icon: PhoneMissed, color: "text-red-500", bg: "bg-red-50" },
    { label: "Visitas agendadas", value: stats?.appointmentsBooked ?? "—", icon: CalendarCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Leads generados", value: stats?.leadsGenerated ?? "—", icon: Users, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Conversión", value: stats ? `${stats.conversionRate}%` : "—", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[1.3rem] font-semibold text-ink tracking-[-0.025em]">Analytics</h1>
        <p className="text-muted text-[13px] mt-0.5">Métricas de los últimos 30 días</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((k) => (
          <div key={k.label} className="bg-white border border-border rounded-2xl p-4">
            {statsLoading ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <>
                <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center mb-3`}>
                  <k.icon className={`w-4 h-4 ${k.color}`} />
                </div>
                <p className="text-[1.4rem] font-bold text-ink leading-none">{k.value}</p>
                <p className="text-[11.5px] text-muted mt-1">{k.label}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!statsLoading && !hasData && (
        <div className="bg-white border border-border rounded-2xl p-12 text-center">
          <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Clock className="w-7 h-7 text-muted" />
          </div>
          <h3 className="font-semibold text-ink mb-2">Todavía no hay llamadas</h3>
          <p className="text-[13px] text-muted max-w-sm mx-auto">
            Los gráficos aparecerán aquí cuando el bot empiece a recibir llamadas.
          </p>
        </div>
      )}

      {/* Charts — only shown when there is data or while loading */}
      {(statsLoading || hasData) && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Call volume */}
          <div className="md:col-span-2 bg-white border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-ink mb-6">Volumen de llamadas — últimos 30 días</h2>
            {volumeLoading ? (
              <Skeleton className="h-[280px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={callVolume || []}>
                  <defs>
                    <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradAnswered" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={(d) => format(parseISO(d), "d MMM", { locale: es })} tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Area type="monotone" dataKey="total" name="Total" stroke="#8b5cf6" fill="url(#gradTotal)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="answered" name="Atendidas" stroke="#10b981" fill="url(#gradAnswered)" strokeWidth={2} />
                  <Area type="monotone" dataKey="missed" name="Perdidas" stroke="#ef4444" fill="transparent" strokeWidth={1.5} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Hourly */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-ink mb-6">Horas de mayor actividad</h2>
            {hourlyLoading ? (
              <Skeleton className="h-[220px] w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={hourly || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tickFormatter={(h) => `${h}h`} tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
                  <Tooltip formatter={(v: any) => [v, "Llamadas"]} labelFormatter={(l: any) => `${l}:00h`} contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "12px", color: "#fff", fontSize: "12px" }} />
                  <Bar dataKey="calls" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Pie */}
          <div className="bg-white border border-border rounded-2xl p-6">
            <h2 className="font-semibold text-ink mb-6">Distribución de resultados</h2>
            {statsLoading && <Skeleton className="h-[160px] w-full" />}
            {!statsLoading && pieData.length === 0 && (
              <p className="text-[13px] text-muted text-center py-10">Sin datos todavía</p>
            )}
            {!statsLoading && pieData.length > 0 && (
              <div className="flex items-center justify-between">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                      {pieData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-3 pl-6">
                  {pieData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-[13px] text-muted flex-1">{item.name}</span>
                      <span className="text-[13px] font-semibold text-ink">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
