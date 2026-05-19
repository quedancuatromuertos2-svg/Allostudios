"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { api } from "@/lib/api"
import { useBusinessStore } from "@/store/business.store"

const NICHES = [
  { key: "BARBER_SHOP", label: "Barbería", icon: "✂️", desc: "Cortes, barbas, estilo" },
  { key: "HAIR_SALON", label: "Peluquería", icon: "💇", desc: "Cortes, tintes, tratamientos" },
  { key: "RESTAURANT", label: "Restaurante", icon: "🍽️", desc: "Reservas, menús, delivery" },
  { key: "DENTAL_CLINIC", label: "Clínica Dental", icon: "🦷", desc: "Citas, limpiezas, ortodoncia" },
  { key: "REAL_ESTATE", label: "Inmobiliaria", icon: "🏠", desc: "Propiedades, visitas, leads" },
  { key: "GYM", label: "Gimnasio", icon: "💪", desc: "Membresías, clases, PT" },
  { key: "SPA", label: "Spa / Masajes", icon: "🧖", desc: "Tratamientos, bienestar" },
  { key: "VET_CLINIC", label: "Veterinaria", icon: "🐾", desc: "Citas, consultas, urgencias" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const setCurrentBusiness = useBusinessStore((s) => s.setCurrentBusiness)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "",
    niche: "",
    phone: "",
    address: "",
    description: "",
  })

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

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="text-4xl font-bold gradient-text mb-2">VoiceFlow AI</div>
          <p className="text-muted-foreground">Configura tu agente de voz en 2 minutos</p>
        </motion.div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                  step >= s ? "bg-violet-600 text-white" : "bg-muted text-muted-foreground"
                }`}
              >
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
              <p className="text-muted-foreground text-center mb-6">
                Elegimos el prompt y la voz perfecta para tu sector
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {NICHES.map((n) => (
                  <button
                    key={n.key}
                    onClick={() => handleNicheSelect(n.key)}
                    className="p-4 rounded-xl border border-border hover:border-violet-500 hover:bg-violet-500/5 transition-all text-center group"
                  >
                    <div className="text-3xl mb-2">{n.icon}</div>
                    <div className="font-medium text-sm">{n.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">{n.desc}</div>
                  </button>
                ))}
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
