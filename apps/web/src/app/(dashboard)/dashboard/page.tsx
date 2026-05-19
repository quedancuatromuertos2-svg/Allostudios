"use client"

import { motion } from "framer-motion"
import { useQuery } from "@tanstack/react-query"
import {
  PhoneCall,
  PhoneMissed,
  CalendarCheck,
  TrendingUp,
  Clock,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { api } from "@/lib/api"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useBusinessStore } from "@/store/business.store"

function StatCard({
  title,
  value,
  change,
  icon: Icon,
  color,
}: {
  title: string
  value: string | number
  change: number
  icon: React.ElementType
  color: string
}) {
  const isPositive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownRight className="w-3 h-3" />
          )}
          {Math.abs(change)}%
        </span>
      </div>
      <p className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">
        {value}
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    </motion.div>
  )
}

export default function DashboardPage() {
  const { currentBusinessId } = useBusinessStore()
  const bizId = currentBusinessId

  const { data: stats } = useQuery({
    queryKey: ["analytics", "dashboard", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/analytics?type=dashboard`).then((r) => r.data),
    enabled: !!bizId,
  })

  const { data: callVolume } = useQuery({
    queryKey: ["analytics", "callVolume", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/analytics?type=volume&days=14`).then((r) => r.data),
    enabled: !!bizId,
  })

  const { data: recentCalls } = useQuery({
    queryKey: ["calls", "recent", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/calls?limit=5`).then((r) => r.data?.data),
    enabled: !!bizId,
  })

  const statCards = [
    {
      title: "Llamadas totales (30d)",
      value: stats?.totalCalls ?? "—",
      change: stats?.callsChangePercent ?? 0,
      icon: PhoneCall,
      color: "bg-violet-600",
    },
    {
      title: "Llamadas perdidas",
      value: stats?.missedCalls ?? "—",
      change: -(stats?.callsChangePercent ?? 0),
      icon: PhoneMissed,
      color: "bg-red-500",
    },
    {
      title: "Citas reservadas",
      value: stats?.appointmentsBooked ?? "—",
      change: stats?.appointmentsChangePercent ?? 0,
      icon: CalendarCheck,
      color: "bg-emerald-600",
    },
    {
      title: "Tasa de conversión",
      value: `${stats?.conversionRate ?? 0}%`,
      change: stats?.appointmentsChangePercent ?? 0,
      icon: TrendingUp,
      color: "bg-blue-600",
    },
  ]

  const statusColors: Record<string, string> = {
    COMPLETED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    MISSED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    IN_PROGRESS: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    TRANSFERRED: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  }

  const statusLabels: Record<string, string> = {
    COMPLETED: "Completada",
    MISSED: "Perdida",
    IN_PROGRESS: "En curso",
    TRANSFERRED: "Transferida",
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Vista general de tu negocio
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Call volume chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">Volumen de llamadas</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Últimos 14 días</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={callVolume || []}>
              <defs>
                <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(parseISO(d), "d MMM", { locale: es })}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                labelFormatter={(l) => format(parseISO(l as string), "d MMMM", { locale: es })}
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#8b5cf6"
                fill="url(#totalGrad)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="answered"
                name="Atendidas"
                stroke="#10b981"
                fill="transparent"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick stats */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Resumen rápido</h2>
          <div className="space-y-4">
            {[
              {
                label: "Duración media de llamada",
                value: `${Math.floor((stats?.avgCallDuration || 0) / 60)}m ${(stats?.avgCallDuration || 0) % 60}s`,
                icon: Clock,
              },
              {
                label: "Próximas citas",
                value: stats?.upcomingAppointments ?? 0,
                icon: CalendarCheck,
              },
              {
                label: "Leads calientes",
                value: stats?.hotLeads ?? 0,
                icon: TrendingUp,
              },
              {
                label: "Leads totales (30d)",
                value: stats?.leadsGenerated ?? 0,
                icon: Users,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
              >
                <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <item.icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent calls */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Llamadas recientes</h2>
          <a
            href="/calls"
            className="text-sm text-violet-600 dark:text-violet-400 hover:underline"
          >
            Ver todas
          </a>
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-800">
          {(recentCalls || []).map((call: any) => (
            <div key={call.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {call.callerName || call.callerNumber || "Desconocido"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {call.aiSummary
                    ? call.aiSummary.substring(0, 60) + "..."
                    : "Sin resumen disponible"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {call.duration && (
                  <span className="text-xs text-gray-400">
                    {Math.floor(call.duration / 60)}:{String(call.duration % 60).padStart(2, "0")}
                  </span>
                )}
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    statusColors[call.status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {statusLabels[call.status] || call.status}
                </span>
              </div>
            </div>
          ))}
          {!recentCalls?.length && (
            <div className="px-6 py-12 text-center text-gray-400 text-sm">
              No hay llamadas recientes
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
