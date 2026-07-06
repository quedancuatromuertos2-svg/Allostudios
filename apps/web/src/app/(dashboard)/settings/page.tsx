"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useClerk } from "@clerk/nextjs"
import { Save, Building2, Globe, Clock, CheckCircle2, Trash2, AlertTriangle, X } from "lucide-react"
import { useBusinessStore } from "@/store/business.store"
import { motion, AnimatePresence } from "framer-motion"

const TIMEZONES = [
  "Europe/Madrid",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "America/Mexico_City",
  "America/Bogota",
  "America/Lima",
  "America/Santiago",
  "America/Buenos_Aires",
]

const NICHES = [
  { value: "REAL_ESTATE", label: "Agencia inmobiliaria" },
  { value: "REAL_ESTATE_AGENT", label: "Agente independiente" },
  { value: "REAL_ESTATE_DEVELOPER", label: "Promotora" },
  { value: "VACATION_RENTAL", label: "Alquiler vacacional" },
  { value: "PROPERTY_MANAGEMENT", label: "Administración de fincas" },
  { value: "RENTAL_MANAGEMENT", label: "Gestión de alquileres" },
]

function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const router = useRouter()
  const { signOut } = useClerk()
  const [confirm, setConfirm] = useState("")
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    if (confirm !== "ELIMINAR") return
    setDeleting(true)
    setError(null)
    try {
      await api.delete("/api/account")
      await signOut()
      router.replace("/")
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: string } } }
      setError(err?.response?.data?.error || "Error al eliminar la cuenta. Inténtalo de nuevo.")
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl border border-border shadow-xl w-full max-w-md p-6"
      >
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "rgba(239,68,68,0.08)" }}>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold text-ink">Eliminar cuenta</h2>
              <p className="text-[12px] text-muted">Esta acción no se puede deshacer</p>
            </div>
          </div>
          <button onClick={onClose} disabled={deleting}
            className="text-muted hover:text-ink transition-colors p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-[13px] text-red-700 space-y-1.5">
            <p className="font-semibold">Se eliminará permanentemente:</p>
            <ul className="space-y-1 text-[12px]">
              <li>• Tu cuenta y perfil</li>
              <li>• Todos tus negocios y configuraciones</li>
              <li>• Tu asistente IA y número de teléfono</li>
              <li>• Todo el historial de llamadas y citas</li>
              <li>• Tu suscripción activa (sin reembolso)</li>
            </ul>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-ink mb-2 block">
              Escribe <span className="font-mono bg-surface px-1.5 py-0.5 rounded text-red-600">ELIMINAR</span> para confirmar
            </label>
            <input
              type="text"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="ELIMINAR"
              disabled={deleting}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-[14px] text-ink placeholder:text-muted outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all font-mono"
            />
          </div>

          {error && (
            <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl border border-border text-[13.5px] font-medium text-dim hover:text-ink hover:bg-surface transition-all disabled:opacity-40"
            >
              Cancelar
            </button>
            <button
              onClick={handleDelete}
              disabled={confirm !== "ELIMINAR" || deleting}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500 text-white text-[13.5px] font-semibold hover:bg-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {deleting ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  Eliminar cuenta
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function SettingsPage() {
  const { currentBusinessId: bizId } = useBusinessStore()
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    website: "",
    description: "",
    timezone: "Europe/Madrid",
    niche: "REAL_ESTATE",
  })

  const { data: business } = useQuery({
    queryKey: ["business", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}`).then((r) => r.data),
    enabled: !!bizId,
  })

  useEffect(() => {
    if (business) {
      setForm({
        name: business.name || "",
        email: business.email || "",
        phone: business.phone || "",
        address: business.address || "",
        city: business.city || "",
        website: business.website || "",
        description: business.description || "",
        timezone: business.timezone || "Europe/Madrid",
        niche: business.niche || "BARBER_SHOP",
      })
    }
  }, [business])

  const mutation = useMutation({
    mutationFn: (data: typeof form) => api.patch(`/api/businesses/${bizId}`, data),
    onSuccess: () => {
      setSaved(true)
      setSaveError(null)
      setTimeout(() => setSaved(false), 2500)
    },
    onError: (e: unknown) => {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error
      setSaveError(msg || "Error al guardar. Inténtalo de nuevo.")
    },
  })

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const inputCls = "w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-[13.5px] text-ink placeholder:text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
  const labelCls = "text-[12.5px] font-semibold text-ink mb-1.5 block"

  return (
    <>
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
        )}
      </AnimatePresence>

      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-[1.3rem] font-semibold text-ink tracking-[-0.025em]">Ajustes</h1>
          <p className="text-muted text-[13px] mt-0.5">Información general de tu inmobiliaria</p>
        </div>

        {/* Business info */}
        <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-3.5 h-3.5 text-accent" />
            <h2 className="font-semibold text-[14px] text-ink">Información del negocio</h2>
          </div>

          {[
            { key: "name", label: "Nombre de la inmobiliaria", placeholder: "Inmobiliaria Goya" },
            { key: "email", label: "Email de contacto", placeholder: "info@inmobiliariagoya.com" },
            { key: "phone", label: "Teléfono", placeholder: "+34 600 000 000" },
            { key: "address", label: "Dirección", placeholder: "Calle Goya 24, Madrid" },
            { key: "city", label: "Ciudad", placeholder: "Madrid" },
            { key: "website", label: "Sitio web", placeholder: "https://inmobiliariagoya.com" },
          ].map((field) => (
            <div key={field.key}>
              <label className={labelCls}>{field.label}</label>
              <input
                value={form[field.key as keyof typeof form]}
                onChange={(e) => updateField(field.key as keyof typeof form, e.target.value)}
                placeholder={field.placeholder}
                className={inputCls}
              />
            </div>
          ))}

          <div>
            <label className={labelCls}>Descripción</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Describe brevemente tu inmobiliaria, zonas y tipo de inmuebles..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`${labelCls} flex items-center gap-1.5`}>
                <Globe className="w-3 h-3" />
                Sector
              </label>
              <select
                value={form.niche}
                onChange={(e) => updateField("niche", e.target.value)}
                className={inputCls}
              >
                {NICHES.map((n) => (
                  <option key={n.value} value={n.value}>{n.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`${labelCls} flex items-center gap-1.5`}>
                <Clock className="w-3 h-3" />
                Zona horaria
              </label>
              <select
                value={form.timezone}
                onChange={(e) => updateField("timezone", e.target.value)}
                className={inputCls}
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz}>{tz}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex flex-col items-end gap-2">
          {saveError && (
            <p className="text-[12.5px] text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2">{saveError}</p>
          )}
          <button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !bizId}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all disabled:opacity-40 ${
              saved ? "bg-green-500 text-white" : "bg-ink text-white hover:bg-zinc-700"
            }`}
          >
            {saved ? (
              <><CheckCircle2 className="w-4 h-4" />Guardado</>
            ) : (
              <><Save className="w-4 h-4" />{mutation.isPending ? "Guardando..." : "Guardar cambios"}</>
            )}
          </button>
        </div>

        {/* Danger zone */}
        <div className="border border-red-100 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 bg-red-50/50 border-b border-red-100">
            <h2 className="text-[13.5px] font-semibold text-red-700">Zona peligrosa</h2>
            <p className="text-[12px] text-red-500 mt-0.5">Las siguientes acciones son permanentes e irreversibles</p>
          </div>
          <div className="px-5 py-4 bg-white flex items-center justify-between gap-4">
            <div>
              <p className="text-[13.5px] font-semibold text-ink">Eliminar cuenta</p>
              <p className="text-[12px] text-muted mt-0.5">
                Borra permanentemente tu cuenta, negocios, asistente IA y cancela la suscripción.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-all shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Eliminar cuenta
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
