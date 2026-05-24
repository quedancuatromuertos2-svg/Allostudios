"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  PhoneCall,
  PhoneMissed,
  Search,
  Play,
  FileText,
  ChevronLeft,
  ChevronRight,
  Phone,
} from "lucide-react"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import { useBusinessStore } from "@/store/business.store"

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  COMPLETED: {
    label: "Completada",
    class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  ended: {
    label: "Completada",
    class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  MISSED: {
    label: "Perdida",
    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  "no-answer": {
    label: "Perdida",
    class: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  },
  IN_PROGRESS: {
    label: "En curso",
    class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  TRANSFERRED: {
    label: "Transferida",
    class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  },
  FAILED: {
    label: "Fallida",
    class: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  },
}

const SENTIMENT_MAP: Record<string, string> = {
  positive: "😊",
  neutral: "😐",
  negative: "😟",
}

export default function CallsPage() {
  const { currentBusinessId: bizId } = useBusinessStore()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [selectedCall, setSelectedCall] = useState<any>(null)

  const { data, isLoading } = useQuery({
    queryKey: ["calls", bizId, page, search],
    queryFn: () =>
      api
        .get(`/api/businesses/${bizId}/calls?page=${page}&limit=15${search ? `&search=${encodeURIComponent(search)}` : ""}`)
        .then((r) => r.data),
    enabled: !!bizId,
  })

  const calls = data?.data || []
  const totalPages = data?.pages || 1

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Llamadas</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Historial completo de llamadas con transcripciones y resúmenes IA
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 flex items-center gap-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl px-4 py-2.5">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por número o resumen..."
            className="bg-transparent text-sm outline-none flex-1"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Calls list */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="divide-y divide-gray-50 dark:divide-gray-800">
            {isLoading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32" />
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded w-64" />
                    </div>
                  </div>
                </div>
              ))
            ) : calls.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <Phone className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">
                  {search ? "No hay llamadas que coincidan con la búsqueda" : "No hay llamadas todavía"}
                </p>
              </div>
            ) : (
              calls.map((call: any) => {
                const status = STATUS_MAP[call.status]
                return (
                  <button
                    key={call.id}
                    onClick={() => setSelectedCall(call)}
                    className={`w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      selectedCall?.id === call.id ? "bg-violet-50 dark:bg-violet-900/20" : ""
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        call.status === "MISSED" || call.status === "no-answer"
                          ? "bg-red-50 dark:bg-red-900/20"
                          : "bg-violet-50 dark:bg-violet-900/20"
                      }`}
                    >
                      {call.status === "MISSED" || call.status === "no-answer" ? (
                        <PhoneMissed className="w-4 h-4 text-red-500" />
                      ) : (
                        <PhoneCall className="w-4 h-4 text-violet-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {call.caller_name || call.caller_number || "Desconocido"}
                        </p>
                        {call.sentiment && (
                          <span className="text-sm">{SENTIMENT_MAP[call.sentiment]}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {call.ai_summary
                          ? call.ai_summary.substring(0, 50) + "..."
                          : "Sin resumen"}
                      </p>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <p className="text-xs text-gray-400 mb-1">
                        {call.created_at &&
                          format(parseISO(call.created_at), "d MMM · HH:mm", { locale: es })}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          status?.class || "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {status?.label || call.status}
                      </span>
                    </div>
                  </button>
                )
              })
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-50 dark:border-gray-800">
            <p className="text-xs text-gray-400">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Call detail */}
        <div className="lg:col-span-2">
          {selectedCall ? (
            <motion.div
              key={selectedCall.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sticky top-6"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedCall.caller_name || selectedCall.caller_number || "Desconocido"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {selectedCall.created_at &&
                      format(parseISO(selectedCall.created_at), "d MMMM yyyy · HH:mm", {
                        locale: es,
                      })}
                  </p>
                </div>
                {selectedCall.sentiment && (
                  <span className="text-2xl">{SENTIMENT_MAP[selectedCall.sentiment]}</span>
                )}
              </div>

              {selectedCall.recording_url && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4 flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                    <Play className="w-3 h-3 text-white ml-0.5" />
                  </button>
                  <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div className="h-1.5 w-1/3 bg-violet-600 rounded-full" />
                  </div>
                  <span className="text-xs text-gray-400">
                    {selectedCall.duration_seconds
                      ? `${Math.floor(selectedCall.duration_seconds / 60)}:${String(selectedCall.duration_seconds % 60).padStart(2, "0")}`
                      : "--:--"}
                  </span>
                </div>
              )}

              {selectedCall.ai_summary && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Resumen IA
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedCall.ai_summary}
                  </p>
                </div>
              )}

              {selectedCall.transcript && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" />
                    Transcripción
                  </p>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 max-h-48 overflow-y-auto">
                    <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-wrap">
                      {selectedCall.transcript}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-12 text-center">
              <PhoneCall className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Selecciona una llamada para ver los detalles</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
