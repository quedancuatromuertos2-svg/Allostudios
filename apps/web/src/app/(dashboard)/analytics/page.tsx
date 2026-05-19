"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

const BUSINESS_ID = "demo-business-id"
const COLORS = ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444"]

export default function AnalyticsPage() {
  const { data: stats } = useQuery({
    queryKey: ["analytics", "dashboard", BUSINESS_ID],
    queryFn: () =>
      api.get(`/businesses/${BUSINESS_ID}/analytics/dashboard`).then((r) => r.data),
  })

  const { data: callVolume } = useQuery({
    queryKey: ["analytics", "callVolume", BUSINESS_ID],
    queryFn: () =>
      api.get(`/businesses/${BUSINESS_ID}/analytics/call-volume?days=30`).then((r) => r.data),
  })

  const { data: hourly } = useQuery({
    queryKey: ["analytics", "hourly", BUSINESS_ID],
    queryFn: () =>
      api.get(`/businesses/${BUSINESS_ID}/analytics/hourly`).then((r) => r.data),
  })

  const pieData = stats
    ? [
        { name: "Atendidas", value: stats.answeredCalls },
        { name: "Perdidas", value: stats.missedCalls },
        { name: "Citas", value: stats.appointmentsBooked },
        { name: "Leads", value: stats.leadsGenerated },
      ]
    : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Métricas detalladas de tu negocio
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Call volume */}
        <div className="md:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-6">
            Volumen de llamadas — últimos 30 días
          </h2>
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
              <XAxis
                dataKey="date"
                tickFormatter={(d) => format(parseISO(d), "d MMM", { locale: es })}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#8b5cf6"
                fill="url(#gradTotal)"
                strokeWidth={2.5}
              />
              <Area
                type="monotone"
                dataKey="answered"
                name="Atendidas"
                stroke="#10b981"
                fill="url(#gradAnswered)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="missed"
                name="Perdidas"
                stroke="#ef4444"
                fill="transparent"
                strokeWidth={1.5}
                strokeDasharray="4 2"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly heatmap */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-6">
            Horas de mayor actividad
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="hour"
                tickFormatter={(h) => `${h}h`}
                tick={{ fontSize: 10, fill: "#9ca3af" }}
              />
              <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} />
              <Tooltip
                formatter={(v: any) => [v, "Llamadas"]}
                labelFormatter={(l) => `${l}:00h`}
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="calls" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-6">
            Distribución de resultados
          </h2>
          <div className="flex items-center justify-between">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-3 pl-6">
              {pieData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                    {item.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
