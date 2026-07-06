"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/nextjs"
import { api } from "@/lib/api"
import { useBusinessStore } from "@/store/business.store"
import { LogoFull } from "@/components/Logo"

const NICHES = [
  { id: "agencia",     niche: "REAL_ESTATE", label: "Agencia inmobiliaria",     icon: "🏢", desc: "Compraventa y alquiler" },
  { id: "agente",      niche: "REAL_ESTATE", label: "Agente independiente",      icon: "🔑", desc: "Trabajas por tu cuenta" },
  { id: "promotora",   niche: "REAL_ESTATE", label: "Promotora",                 icon: "🏗️", desc: "Obra nueva" },
  { id: "vacacional",  niche: "REAL_ESTATE", label: "Alquiler vacacional",       icon: "🏖️", desc: "Corta estancia" },
  { id: "fincas",      niche: "REAL_ESTATE", label: "Administración de fincas",  icon: "📋", desc: "Gestión y comunidades" },
  { id: "alquileres",  niche: "REAL_ESTATE", label: "Gestión de alquileres",     icon: "🏘️", desc: "Larga estancia" },
]

const PLANS = [
  {
    key: "STARTER",
    name: "Starter",
    price: 399,
    calls: "1.500 min/mes · ~375 llamadas",
    features: ["Recepcionista IA 24/7", "Cualifica leads automáticamente", "Agenda visitas en tu calendario", "Resumen del lead por WhatsApp", "Panel de control"],
    highlighted: false,
  },
  {
    key: "PROFESSIONAL",
    name: "Professional",
    price: 599,
    calls: "2.250 min/mes · ~560 llamadas",
    features: ["Todo lo de Starter", "IA avanzada · hasta 3 números", "Atención en varios idiomas", "Analytics e informes con IA", "Soporte prioritario"],
    highlighted: true,
  },
]

const fade = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
}

export default function OnboardingPage() {
  const router = useRouter()
  const { user } = useUser()
  const { setCurrentBusiness, businesses } = useBusinessStore()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [createdBusinessId, setCreatedBusinessId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: "", niche: "", phone: "", address: "", description: "" })

  useEffect(() => {
    api.get("/api/businesses")
      .then(({ data }) => {
        const list = data?.data ?? []
        if (list.length > 0) {
          setCurrentBusiness(list[0])
          // Business exists — dashboard handles billing gate/redirect
          router.replace("/dashboard")
          return
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

  const handleBusinessSubmit = async () => {
    if (!form.name || !form.niche) return
    setLoading(true)
    try {
      const { data } = await api.post("/api/onboarding", form)
      setCurrentBusiness(data)
      setCreatedBusinessId(data.id)
      setStep(3)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      alert(error?.response?.data?.error || "Error al crear el negocio")
    } finally {
      setLoading(false)
    }
  }

  const handlePlanSelect = async (planKey: string) => {
    if (!createdBusinessId) return
    setLoading(true)
    try {
      const { data } = await api.post("/api/billing/checkout", {
        planKey,
        businessId: createdBusinessId,
      })
      window.location.href = data.url
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } }
      alert(error?.response?.data?.error || "Error al iniciar el pago")
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAFAF9" }}>
        <div className="w-5 h-5 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    )
  }

  const stepLabels = ["Tipo de inmobiliaria", "Información", "Elige tu plan"]
  const totalSteps = 3

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-12 px-4 relative overflow-hidden"
      style={{ background: "#FAFAF9" }}
    >
      {/* Ambient */}
      <div className="absolute w-[600px] h-[500px] rounded-full blur-[140px] -top-1/4 -right-1/4 opacity-[0.06] pointer-events-none"
        style={{ background: "radial-gradient(circle, #5B5BD6 0%, transparent 65%)" }} />
      <div className="absolute w-[400px] h-[350px] rounded-full blur-[120px] bottom-0 -left-1/4 opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C7CE8 0%, transparent 65%)" }} />

      <div className="relative w-full max-w-2xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-10"
        >
          <a href="/" className="mb-5">
            <LogoFull size="lg" />
          </a>
          <p className="text-dim text-[0.875rem]">Pon a Marta a captar tus leads en 2 minutos</p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-center gap-3 mb-10"
        >
          {Array.from({ length: totalSteps }).map((_, i) => {
            const s = i + 1
            const done = step > s
            const active = step === s
            return (
              <div key={s} className="flex items-center gap-3">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-semibold transition-all duration-300
                    ${done ? "bg-green-500 text-white" : active ? "bg-accent text-white" : "bg-surface text-muted border border-border"}
                  `}>
                    {done ? "✓" : s}
                  </div>
                  <span className={`text-[10.5px] font-medium whitespace-nowrap transition-colors ${active ? "text-ink" : "text-muted"}`}>
                    {stepLabels[i]}
                  </span>
                </div>
                {s < totalSteps && (
                  <div className={`w-14 h-px mb-4 transition-colors ${step > s ? "bg-green-400" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </motion.div>

        {/* Step content */}
        <AnimatePresence mode="wait">

          {/* STEP 1 — Niche */}
          {step === 1 && (
            <motion.div key="step1" {...fade} transition={{ duration: 0.4 }}>
              <div className="text-center mb-7">
                <h2 className="text-[1.6rem] font-semibold text-ink tracking-[-0.025em]">¿Qué tipo de inmobiliaria tienes?</h2>
                <p className="text-dim text-[0.9rem] mt-2">Adaptamos a Marta, tu recepcionista IA, a cómo trabajas</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {NICHES.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleNicheSelect(n.niche)}
                    className="group p-4 rounded-2xl border border-border bg-white hover:border-accent/40 hover:bg-accent-light/30 hover:-translate-y-0.5 transition-all duration-200 text-center shadow-xs"
                  >
                    <div className="text-2xl mb-2">{n.icon}</div>
                    <div className="font-semibold text-[13px] text-ink">{n.label}</div>
                    <div className="text-[11px] text-muted mt-0.5 leading-tight">{n.desc}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <button
                  onClick={() => router.push(businesses.length > 0 ? "/dashboard" : "/")}
                  className="text-[13px] text-muted hover:text-ink transition-colors flex items-center gap-1.5"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {businesses.length > 0 ? "Volver al dashboard" : "Volver al inicio"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Business details */}
          {step === 2 && (
            <motion.div key="step2" {...fade} transition={{ duration: 0.4 }}>
              <div className="text-center mb-7">
                <h2 className="text-[1.6rem] font-semibold text-ink tracking-[-0.025em]">Cuéntanos sobre tu inmobiliaria</h2>
                <p className="text-dim text-[0.9rem] mt-2">Marta usará esta información para atender a tus contactos</p>
              </div>

              <div className="bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
                <div>
                  <label className="block text-[13px] font-semibold text-ink mb-1.5">
                    Nombre de la inmobiliaria <span className="text-accent">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Inmobiliaria Goya"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-[14px] text-ink placeholder:text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-ink mb-1.5">Teléfono de contacto</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-[14px] text-ink placeholder:text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-ink mb-1.5">Dirección</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Calle Goya 24, Madrid"
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-[14px] text-ink placeholder:text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-ink mb-1.5">Descripción de la inmobiliaria</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Inmobiliaria especializada en compraventa y alquiler en el centro de Madrid..."
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface text-[14px] text-ink placeholder:text-muted outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-border text-[13.5px] font-medium text-dim hover:text-ink hover:bg-surface transition-all"
                  >
                    Atrás
                  </button>
                  <button
                    onClick={handleBusinessSubmit}
                    disabled={!form.name || loading}
                    className="flex-1 py-2.5 rounded-xl bg-ink text-white text-[13.5px] font-semibold hover:bg-zinc-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                        Creando agente IA...
                      </span>
                    ) : "Continuar →"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Plan selection */}
          {step === 3 && (
            <motion.div key="step3" {...fade} transition={{ duration: 0.4 }}>
              <div className="text-center mb-7">
                <h2 className="text-[1.6rem] font-semibold text-ink tracking-[-0.025em]">Elige tu plan</h2>
                <p className="text-dim text-[0.9rem] mt-2">
                  7 días gratis · Cancela cuando quieras · Se cobrará al finalizar el periodo de prueba
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {PLANS.map((plan) => (
                  <div
                    key={plan.key}
                    className={`relative bg-white rounded-2xl border p-5 flex flex-col transition-all duration-200 ${
                      plan.highlighted
                        ? "border-accent shadow-glow ring-1 ring-accent/20"
                        : "border-border shadow-sm"
                    }`}
                  >
                    {plan.highlighted && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 rounded-full bg-accent text-white text-[10.5px] font-semibold tracking-[0.06em] uppercase shadow-sm">
                          Popular
                        </span>
                      </div>
                    )}

                    <div className="mb-4">
                      <div className="text-[13px] font-semibold text-muted uppercase tracking-[0.08em] mb-1">{plan.name}</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[2rem] font-semibold text-ink tracking-[-0.04em]">€{plan.price}</span>
                        <span className="text-dim text-[13px]">/mes</span>
                      </div>
                      <div className="text-[12px] text-muted mt-0.5">{plan.calls}</div>
                    </div>

                    <ul className="space-y-2 flex-1 mb-5">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-[12.5px] text-dim">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
                            <path d="M2 6l2.5 2.5L10 3.5" stroke="#5B5BD6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePlanSelect(plan.key)}
                      disabled={loading}
                      className={`w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all disabled:opacity-40 ${
                        plan.highlighted
                          ? "bg-accent text-white hover:bg-accent-dark"
                          : "bg-surface text-ink border border-border hover:bg-border"
                      }`}
                    >
                      {loading ? "Cargando..." : "Empezar prueba gratuita"}
                    </button>
                  </div>
                ))}
              </div>

              {/* Trust */}
              <div className="bg-white border border-border rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
                <div className="w-10 h-10 rounded-xl bg-accent-light flex items-center justify-center shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5B5BD6" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div>
                  <div className="text-[13px] font-semibold text-ink">Se requiere método de pago</div>
                  <div className="text-[12px] text-muted">No se cobrará nada durante los 7 días de prueba. Cancela antes del día 7 para no pagar nada.</div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
