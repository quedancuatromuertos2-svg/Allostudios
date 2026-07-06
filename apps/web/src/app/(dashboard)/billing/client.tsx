"use client"

import { useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { CreditCard, Loader2, Check, Zap, Shield, ArrowRight, Clock, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

type Subscription = {
  plan: string
  status: string
  current_period_end: string | null
  calls_used: number
  calls_limit: number
  trial_ends_at: string | null
} | null

type UsageData = {
  minutes_used: number
  calls_count: number
} | null

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    price: 399,
    desc: "Para inmobiliarias que no quieren perder ni un lead",
    minutes: "1.500 min/mes",
    minutesCount: 1500,
    features: [
      "Recepcionista IA 24/7",
      "1 número de teléfono",
      "Cualifica leads y agenda visitas",
      "Google Calendar",
      "Resumen del lead por WhatsApp",
      "Soporte por email",
    ],
    highlighted: false,
    trial: true,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: 599,
    desc: "IA avanzada, más minutos, todo incluido.",
    minutes: "2.250 min/mes",
    minutesCount: 2250,
    features: [
      "Todo lo de Starter",
      "2.250 minutos incluidos",
      "IA avanzada · hasta 3 números",
      "Atención en varios idiomas",
      "Analytics e informes con IA",
      "Soporte prioritario",
    ],
    highlighted: true,
    trial: true,
  },
]

function statusBadge(status: string) {
  const s = status.toLowerCase()
  if (s === "trialing") return { label: "Prueba activa", color: "#16a34a", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" }
  if (s === "active") return { label: "Activo", color: "#16a34a", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" }
  if (s === "past_due") return { label: "Pago pendiente", color: "#d97706", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" }
  if (s === "cancelled" || s === "canceled") return { label: "Cancelado", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" }
  return { label: status, color: "#706D69", bg: "rgba(160,157,153,0.08)", border: "rgba(160,157,153,0.2)" }
}

function isActiveStatus(status: string) {
  const s = status.toLowerCase()
  return s === "active" || s === "trialing"
}

export function BillingClient({
  businessId,
  subscription,
  usage,
}: {
  businessId: string
  subscription: Subscription
  usage: UsageData
}) {
  const checkoutMutation = useMutation({
    mutationFn: (planKey: string) =>
      api.post("/api/billing/checkout", { planKey, businessId }).then((r) => r.data),
    onSuccess: (data) => { if (data.url) window.location.href = data.url },
  })

  const portalMutation = useMutation({
    mutationFn: () =>
      api.post("/api/billing/portal", { businessId }).then((r) => r.data),
    onSuccess: (data) => { if (data.url) window.location.href = data.url },
  })

  // minutes_limit = calls_limit (repurposed to store minutes)
  const minutesIncluded = subscription?.calls_limit ?? 0
  const minutesUsed = usage?.minutes_used ?? 0
  const minutesRemaining = Math.max(0, minutesIncluded - minutesUsed)
  const usagePercent = minutesIncluded > 0 ? Math.min(100, (minutesUsed / minutesIncluded) * 100) : 0

  const currentPlanId = subscription?.plan?.toUpperCase()
  const badge = subscription ? statusBadge(subscription.status) : null
  const isActive = subscription ? isActiveStatus(subscription.status) : false

  const barColor = usagePercent >= 90 ? "#ef4444" : usagePercent >= 70 ? "#f59e0b" : "#5B5BD6"

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-[1.3rem] font-semibold text-ink tracking-[-0.025em]">Facturación</h1>
        <p className="text-muted text-[13px] mt-0.5">Gestiona tu suscripción y método de pago</p>
      </div>

      {/* Current subscription card */}
      {subscription && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-border rounded-2xl p-5 space-y-5"
        >
          {/* Plan header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.1em] mb-1">Plan actual</div>
              <div className="flex items-center gap-2.5">
                <span className="text-[1.1rem] font-semibold text-ink capitalize">
                  {subscription.plan.toLowerCase()}
                </span>
                {badge && (
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{ color: badge.color, background: badge.bg, border: `1px solid ${badge.border}` }}>
                    {badge.label}
                  </span>
                )}
              </div>

              {subscription.status.toLowerCase() === "trialing" && subscription.trial_ends_at && (
                <p className="text-[12px] text-muted mt-1">
                  Prueba termina el{" "}
                  <span className="font-semibold text-dim">
                    {format(new Date(subscription.trial_ends_at), "d 'de' MMMM yyyy", { locale: es })}
                  </span>
                </p>
              )}

              {subscription.current_period_end && subscription.status.toLowerCase() === "active" && (
                <p className="text-[12px] text-muted mt-1">
                  Próxima factura el{" "}
                  <span className="font-semibold text-dim">
                    {format(new Date(subscription.current_period_end), "d 'de' MMMM yyyy", { locale: es })}
                  </span>
                </p>
              )}
            </div>

            <button
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-[12.5px] font-medium text-dim hover:text-ink hover:bg-surface transition-all"
            >
              {portalMutation.isPending
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <CreditCard className="w-3.5 h-3.5" />
              }
              Gestionar pago
            </button>
          </div>

          {/* Minutes usage */}
          <div className="bg-surface rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted" />
                <span className="text-[13px] font-medium text-ink">Minutos este mes</span>
              </div>
              <div className="text-right">
                <span className="text-[13px] font-semibold text-ink">{Math.round(minutesUsed)}</span>
                <span className="text-[12px] text-muted"> / {minutesIncluded} min</span>
              </div>
            </div>

            <div className="h-2 bg-border rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="h-full rounded-full transition-colors"
                style={{ background: barColor }}
              />
            </div>

            <div className="flex items-center justify-between text-[12px]">
              <span style={{ color: barColor }} className="font-medium">
                {Math.round(usagePercent)}% utilizado
              </span>
              <span className="text-muted">
                {minutesRemaining} min restantes
              </span>
            </div>

            {usagePercent >= 90 && (
              <div className="pt-1 border-t border-border">
                <p className="text-[12px] text-red-500 font-medium">
                  Estás cerca del límite. Actualiza tu plan para evitar interrupciones.
                </p>
              </div>
            )}
            {usagePercent >= 70 && usagePercent < 90 && (
              <div className="pt-1 border-t border-border">
                <p className="text-[12px] font-medium" style={{ color: "#f59e0b" }}>
                  Más del 70% usado. Tu asistente está optimizando respuestas para mayor eficiencia.
                </p>
              </div>
            )}
          </div>

          {/* Stats row */}
          {usage && (
            <div className="flex gap-4">
              <div className="flex-1 bg-surface rounded-xl p-3 text-center">
                <div className="text-[1.1rem] font-semibold text-ink">{usage.calls_count}</div>
                <div className="text-[11px] text-muted mt-0.5">Llamadas</div>
              </div>
              <div className="flex-1 bg-surface rounded-xl p-3 text-center">
                <div className="text-[1.1rem] font-semibold text-ink">{Math.round(minutesUsed)}</div>
                <div className="text-[11px] text-muted mt-0.5">Minutos</div>
              </div>
              <div className="flex-1 bg-surface rounded-xl p-3 text-center">
                <div className="text-[1.1rem] font-semibold text-ink">
                  {usage.calls_count > 0 ? Math.round(minutesUsed / usage.calls_count) : 0}
                </div>
                <div className="text-[11px] text-muted mt-0.5">Min/llamada</div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-[13.5px] font-semibold text-ink mb-4">
          {subscription ? "Cambiar plan" : "Elige tu plan"}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {PLANS.map((plan, idx) => {
            const isCurrent = currentPlanId === plan.id
            const isLoading = checkoutMutation.isPending && checkoutMutation.variables === plan.id

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className={`relative rounded-2xl border p-5 flex flex-col transition-all duration-200 ${
                  plan.highlighted
                    ? "border-accent shadow-glow ring-1 ring-accent/15"
                    : "border-border"
                } ${isCurrent ? "opacity-80" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent text-white text-[10.5px] font-semibold tracking-[0.06em] uppercase shadow-sm">
                      <Zap className="w-2.5 h-2.5" />
                      Recomendado
                    </span>
                  </div>
                )}

                {plan.trial && !isCurrent && (
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold mb-3"
                    style={{ color: "#16a34a" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    7 días gratis
                  </div>
                )}

                <div className="mb-1">
                  <div className="text-[11px] font-semibold text-muted uppercase tracking-[0.1em]">{plan.name}</div>
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-[2rem] font-semibold text-ink tracking-[-0.04em]">{plan.price}€</span>
                  <span className="text-muted text-[13px]">/mes</span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed mb-3">{plan.desc}</p>

                <div className="flex items-center gap-1.5 mb-4">
                  <TrendingUp className="w-3.5 h-3.5 text-accent" />
                  <span className="text-[12px] font-semibold text-accent">{plan.minutes}</span>
                </div>

                <ul className="space-y-2 flex-1 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12px] text-dim">
                      <Check className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={isCurrent || checkoutMutation.isPending}
                  onClick={() => { if (!isCurrent) checkoutMutation.mutate(plan.id) }}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all ${
                    isCurrent
                      ? "bg-surface text-muted cursor-default border border-border"
                      : plan.highlighted
                        ? "bg-accent text-white hover:bg-accent-dark"
                        : "bg-ink text-white hover:bg-zinc-700"
                  } disabled:opacity-50`}
                >
                  {isLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {isCurrent ? "Plan actual" : isLoading ? "Redirigiendo..." : (
                    <>
                      {plan.trial ? "Empezar prueba gratis" : "Contratar ahora"}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </motion.div>
            )
          })}
        </div>

        {/* Trust row */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {[
            { icon: Shield, text: "7 días gratis, sin riesgo" },
            { icon: CreditCard, text: "Se requiere tarjeta" },
            { icon: Check, text: "Cancela cuando quieras" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-1.5 text-[11.5px] text-muted">
              <Icon className="w-3 h-3" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
