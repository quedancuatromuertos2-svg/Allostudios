"use client"

import { useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Zap, Sparkles, Loader2 } from "lucide-react"
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

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    price: 99,
    features: ["200 llamadas/mes", "1 número", "Reservas automáticas"],
    trial: true,
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: 199,
    features: ["1.000 llamadas/mes", "3 números", "WhatsApp/SMS", "Analytics avanzados"],
    highlighted: true,
    trial: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: 499,
    features: ["Ilimitadas", "API", "Account manager", "SLA 99.9%"],
    trial: false,
  },
]

function statusLabel(status: string) {
  const s = status.toLowerCase()
  if (s === "trialing") return "Período de prueba"
  if (s === "active") return "Activo"
  if (s === "past_due") return "Pago pendiente"
  if (s === "cancelled" || s === "canceled") return "Cancelado"
  return status
}

function isActiveStatus(status: string) {
  const s = status.toLowerCase()
  return s === "active" || s === "trialing"
}

export function BillingClient({
  businessId,
  subscription,
}: {
  businessId: string
  subscription: Subscription
}) {
  const checkoutMutation = useMutation({
    mutationFn: (planKey: string) =>
      api.post("/api/billing/checkout", { planKey, businessId }).then((r) => r.data),
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url
    },
  })

  const portalMutation = useMutation({
    mutationFn: () =>
      api.post("/api/billing/portal", { businessId }).then((r) => r.data),
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url
    },
  })

  const usagePercent = subscription
    ? Math.min(100, (subscription.calls_used / subscription.calls_limit) * 100)
    : 0

  const currentPlanId = subscription?.plan?.toUpperCase()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Facturación</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Gestiona tu suscripción y método de pago
        </p>
      </div>

      {subscription && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                Plan actual:{" "}
                <span className="capitalize">{subscription.plan.toLowerCase()}</span>
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActiveStatus(subscription.status)
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {statusLabel(subscription.status)}
                </span>
                {subscription.current_period_end && (
                  <span className="text-xs text-gray-400">
                    Renueva el{" "}
                    {format(new Date(subscription.current_period_end), "d MMMM yyyy", {
                      locale: es,
                    })}
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              className="gap-2"
            >
              {portalMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              Gestionar pago
            </Button>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Llamadas usadas</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {subscription.calls_used} /{" "}
                {subscription.calls_limit >= 999999 ? "∞" : subscription.calls_limit}
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  usagePercent > 80 ? "bg-red-500" : "bg-violet-600"
                }`}
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
          {subscription ? "Cambiar plan" : "Elige tu plan"}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = currentPlanId === plan.id
            const isLoading = checkoutMutation.isPending && checkoutMutation.variables === plan.id

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 transition-all ${
                  plan.highlighted
                    ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20"
                    : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                } ${!isCurrent && !checkoutMutation.isPending ? "hover:shadow-md" : ""}`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Popular
                    </span>
                  </div>
                )}

                {plan.trial && !isCurrent && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-3">
                    <Sparkles className="w-3 h-3" />
                    7 días gratis
                  </div>
                )}

                <h3 className="font-bold text-gray-900 dark:text-white mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    {plan.price}€
                  </span>
                  <span className="text-gray-400 text-sm">/mes</span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-violet-600 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full gap-2 ${
                    isCurrent
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default hover:bg-gray-100 dark:hover:bg-gray-800"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                  disabled={isCurrent || checkoutMutation.isPending}
                  onClick={() => {
                    if (!isCurrent) checkoutMutation.mutate(plan.id)
                  }}
                >
                  {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isCurrent
                    ? "Plan actual"
                    : isLoading
                    ? "Redirigiendo..."
                    : plan.trial
                    ? "Empezar prueba gratis"
                    : "Contratar ahora"}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
