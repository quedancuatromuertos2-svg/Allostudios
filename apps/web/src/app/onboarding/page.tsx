"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import { useBusinessStore } from "@/store/business.store"

const NICHES = [
  { key: "BARBER_SHOP",    label: "Barbería",        icon: "✂️", desc: "Cortes, barbas, estilo" },
  { key: "HAIR_SALON",     label: "Peluquería",       icon: "💇", desc: "Cortes, tintes, tratamientos" },
  { key: "RESTAURANT",     label: "Restaurante",      icon: "🍽️", desc: "Reservas, menús, delivery" },
  { key: "DENTAL_CLINIC",  label: "Clínica Dental",   icon: "🦷", desc: "Citas, limpiezas, ortodoncia" },
  { key: "REAL_ESTATE",    label: "Inmobiliaria",     icon: "🏠", desc: "Propiedades, visitas, leads" },
  { key: "GYM",            label: "Gimnasio",         icon: "💪", desc: "Membresías, clases, PT" },
  { key: "SPA",            label: "Spa / Masajes",    icon: "🧖", desc: "Tratamientos, bienestar" },
  { key: "VET_CLINIC",     label: "Veterinaria",      icon: "🐾", desc: "Citas, consultas, urgencias" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const { setCurrentBusiness, businesses } = useBusinessStore()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [canAddMore, setCanAddMore] = useState(true)
  const [form, setForm] = useState({ name: "", niche: "", phone: "", address: "", description: "" })

  // On mount: check if user already has businesses
  useEffect(() => {
    api.get("/api/businesses")
      .then(({ data }) => {
        const list = data?.data ?? []
        if (list.length > 0) {
          // User has at least one business.
          // Check if their plan allows more (the API will enforce the hard limit).
          // We can safely let them proceed to the form — the API will reject if over limit.
          setCanAddMore(true)
          // If no current business is set, set it now
          if (businesses.length === 0) {
            setCurrentBusiness(list[0])
          }
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNicheSelect = (key: string) => {
    setForm((f) => ({ ...f, niche: key }))
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!form.name || !form.niche) return
    setLoading(true)
    try {
      const { data } = await api.post("/api/onboarding", form)
      setCurrentBusiness(data)
      router.push("/dashboard")
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      alert(error?.response?.data?.error || "Error al crear el negocio")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "#d41f1f" }}>
              <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, color: "#fff", fontSize: "1rem", fontStyle: "italic" }}>a</span>
            </div>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.4rem", color: "#1a1614" }}>
              <span style={{ color: "#d41f1f" }}>allo</span>Studios
            </span>
          </div>
          <p className="text-muted-foreground text-sm">Configura tu agente de voz en 2 minutos</p>
        </motion.div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                step >= s ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground"
              }`}>
                {s}
              </div>
              {s < 2 && <div className={`w-12 h-0.5 ${step > s ? "bg-violet-600" : "bg-muted"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <h2 className="text-2xl font-bold text-center mb-2">¿Qué tipo de negocio tienes?</h2>
              <p className="text-muted-foreground text-center mb-6 text-sm">
                Elegimos el prompt y la voz perfecta para tu sector
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {NICHES.map((n) => (
                  <button
                    key={n.key}
                    onClick={() => handleNicheSelect(n.key)}
                    className="p-4 rounded-xl border border-border hover:border-violet-500 hover:bg-violet-500/5 transition-all text-center"
                  >
                    <div className="text-3xl mb-2">{n.icon}</div>
                    <div className="font-medium text-sm">{n.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{n.desc}</div>
                  </button>
                ))}
              </div>

              {/* Back to home */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={() => router.push(businesses.length > 0 ? "/dashboard" : "/")}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {businesses.length > 0 ? "Volver al dashboard" : "Volver al inicio"}
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-6 rounded-2xl space-y-4"
            >
              <div>
                <h2 className="text-2xl font-bold mb-1">Cuéntanos sobre tu negocio</h2>
                <p className="text-muted-foreground text-sm">Esta info la usará tu agente de IA en las llamadas</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nombre del negocio *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Barbería El Maestro"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Teléfono de contacto</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+34 600 000 000"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Dirección</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  placeholder="Calle Mayor 1, Madrid"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Descripción (opcional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  placeholder="Somos una barbería clásica con 20 años de experiencia..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!form.name || loading}
                  className="flex-1 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creando agente..." : "¡Crear mi agente IA!"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
