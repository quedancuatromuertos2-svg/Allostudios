"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Save, Building2, Globe, Clock, CheckCircle2 } from "lucide-react"
import { useBusinessStore } from "@/store/business.store"

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
  { value: "BARBER_SHOP", label: "Barbería" },
  { value: "HAIR_SALON", label: "Salón de Belleza" },
  { value: "RESTAURANT", label: "Restaurante" },
  { value: "DENTAL_CLINIC", label: "Clínica Dental" },
  { value: "REAL_ESTATE", label: "Inmobiliaria" },
  { value: "GYM", label: "Gimnasio" },
  { value: "CAR_WORKSHOP", label: "Taller de Coches" },
  { value: "BEAUTY_CENTER", label: "Centro de Estética" },
  { value: "HOTEL", label: "Hotel" },
  { value: "OTHER", label: "Otro" },
]

export default function SettingsPage() {
  const { currentBusinessId: bizId } = useBusinessStore()
  const [saved, setSaved] = useState(false)

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    website: "",
    description: "",
    timezone: "Europe/Madrid",
    niche: "BARBER_SHOP",
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
    mutationFn: (data: typeof form) =>
      api.patch(`/api/businesses/${bizId}`, data),
    onSuccess: () => {
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Ajustes</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Información general de tu negocio
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4 text-violet-600" />
          <h2 className="font-semibold text-gray-900 dark:text-white">Información del negocio</h2>
        </div>

        {[
          { key: "name", label: "Nombre del negocio", placeholder: "Mi Barbería" },
          { key: "email", label: "Email de contacto", placeholder: "info@minegocio.com" },
          { key: "phone", label: "Teléfono", placeholder: "+34 600 000 000" },
          { key: "address", label: "Dirección", placeholder: "Calle Mayor, 1" },
          { key: "city", label: "Ciudad", placeholder: "Madrid" },
          { key: "website", label: "Sitio web", placeholder: "https://minegocio.com" },
        ].map((field) => (
          <div key={field.key}>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              {field.label}
            </label>
            <input
              value={form[field.key as keyof typeof form]}
              onChange={(e) => updateField(field.key as keyof typeof form, e.target.value)}
              placeholder={field.placeholder}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 transition-colors"
            />
          </div>
        ))}

        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
            Descripción
          </label>
          <textarea
            value={form.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Describe brevemente tu negocio..."
            rows={3}
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 resize-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              Sector
            </label>
            <select
              value={form.niche}
              onChange={(e) => updateField("niche", e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"
            >
              {NICHES.map((n) => (
                <option key={n.value} value={n.value}>
                  {n.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              Zona horaria
            </label>
            <select
              value={form.timezone}
              onChange={(e) => updateField("timezone", e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"
            >
              {TIMEZONES.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending || !bizId}
          className={`gap-2 transition-all ${
            saved
              ? "bg-emerald-600 hover:bg-emerald-600 text-white"
              : "bg-violet-600 hover:bg-violet-700 text-white"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {mutation.isPending ? "Guardando..." : "Guardar cambios"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
