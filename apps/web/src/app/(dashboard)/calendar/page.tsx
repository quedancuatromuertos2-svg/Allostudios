"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useBusinessStore } from "@/store/business.store"
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  parseISO,
  isToday,
} from "date-fns"
import { es } from "date-fns/locale"
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Clock,
  User,
  Phone,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import { motion } from "framer-motion"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const { currentBusinessId } = useBusinessStore()

  const { data: appointmentsRes, isLoading } = useQuery({
    queryKey: ["appointments", currentBusinessId],
    queryFn: () =>
      api
        .get(`/api/businesses/${currentBusinessId}/appointments?limit=500`)
        .then((r) => r.data?.data || []),
    enabled: !!currentBusinessId,
  })

  const { data: googleStatus } = useQuery({
    queryKey: ["google-status", currentBusinessId],
    queryFn: () =>
      api
        .get(`/api/google/status?businessId=${currentBusinessId}`)
        .then((r) => r.data),
    enabled: !!currentBusinessId,
  })

  const appointments: any[] = appointmentsRes || []

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd })

  const getForDay = (day: Date) =>
    appointments.filter(
      (a) => a.scheduled_at && isSameDay(parseISO(a.scheduled_at), day)
    )

  const selectedAppts = getForDay(selectedDate)
  const totalThisMonth = appointments.filter(
    (a) =>
      a.scheduled_at && isSameMonth(parseISO(a.scheduled_at), currentDate)
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Calendario
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            {totalThisMonth} cita{totalThisMonth !== 1 ? "s" : ""} este mes
          </p>
        </div>

        {/* Google Calendar button */}
        {googleStatus?.connected ? (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-emerald-200 bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            Google Calendar conectado
          </div>
        ) : (
          <a
            href={
              currentBusinessId
                ? `/api/google/connect?businessId=${currentBusinessId}`
                : "#"
            }
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Conectar Google Calendar
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
        >
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <h2 className="text-base font-bold text-gray-900 dark:text-white capitalize">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-gray-400 dark:text-gray-600 py-2"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day) => {
              const dayAppts = getForDay(day)
              const isSelected = isSameDay(day, selectedDate)
              const inMonth = isSameMonth(day, currentDate)
              const today = isToday(day)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative min-h-[58px] p-1.5 rounded-xl text-left transition-colors ${
                    isSelected
                      ? "bg-violet-600"
                      : today
                      ? "bg-violet-50 dark:bg-violet-900/30 ring-1 ring-violet-300 dark:ring-violet-700"
                      : inMonth
                      ? "hover:bg-gray-50 dark:hover:bg-gray-800"
                      : "opacity-30 pointer-events-none"
                  }`}
                >
                  <span
                    className={`text-xs font-semibold block mb-1 ${
                      isSelected
                        ? "text-white"
                        : today
                        ? "text-violet-600 dark:text-violet-400"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="space-y-0.5">
                    {dayAppts.slice(0, 2).map((apt: any) => (
                      <div
                        key={apt.id}
                        className={`text-xs truncate rounded px-1 py-0.5 leading-tight ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300"
                        }`}
                      >
                        {format(parseISO(apt.scheduled_at), "HH:mm")}{" "}
                        {apt.customer_name?.split(" ")[0]}
                      </div>
                    ))}
                    {dayAppts.length > 2 && (
                      <div
                        className={`text-xs font-medium ${
                          isSelected ? "text-white/70" : "text-gray-400"
                        }`}
                      >
                        +{dayAppts.length - 2}
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Day detail */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6"
        >
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-white capitalize">
              {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              {selectedAppts.length > 0
                ? `${selectedAppts.length} cita${selectedAppts.length !== 1 ? "s" : ""}`
                : "Sin citas"}
            </p>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {selectedAppts.map((apt: any) => (
              <div
                key={apt.id}
                className="border border-gray-100 dark:border-gray-800 rounded-xl p-3.5 space-y-2.5"
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-violet-600 flex-shrink-0" />
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {format(parseISO(apt.scheduled_at), "HH:mm")}
                    {apt.ends_at &&
                      ` — ${format(parseISO(apt.ends_at), "HH:mm")}`}
                  </span>
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                      apt.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : apt.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {apt.status === "confirmed"
                      ? "Confirmada"
                      : apt.status === "cancelled"
                      ? "Cancelada"
                      : apt.status}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {apt.customer_name || "Cliente"}
                  </span>
                </div>

                {apt.customer_phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {apt.customer_phone}
                    </span>
                  </div>
                )}

                {apt.service?.name && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 pl-5">
                    {apt.service.name}
                    {apt.service.price > 0 && ` · ${apt.service.price}€`}
                  </p>
                )}

                {apt.notes && (
                  <p className="text-xs text-gray-400 italic pl-5 border-l-2 border-gray-100 dark:border-gray-700">
                    {apt.notes}
                  </p>
                )}
              </div>
            ))}

            {selectedAppts.length === 0 && (
              <div className="text-center py-10">
                <CalendarDays className="w-8 h-8 mx-auto text-gray-200 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-400 dark:text-gray-600">
                  Sin citas este día
                </p>
              </div>
            )}
          </div>

          {!googleStatus?.connected && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-500">
                    Google Calendar no conectado
                  </p>
                  <p className="text-xs text-amber-600/70 dark:text-amber-600 mt-0.5">
                    Conecta tu cuenta para sincronizar citas automáticamente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
