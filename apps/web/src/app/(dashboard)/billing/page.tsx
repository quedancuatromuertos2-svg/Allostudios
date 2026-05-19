"use client"

import { useQuery, useMutation } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Check, CreditCard, Zap, TrendingUp, ArrowUpRight } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const BUSINESS_ID = "demo-business-id"
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

const PLANS = [
  {
    id: "STARTER",
    name: "Starter",
    price: 79,
    calls: 200,
    features: ["200 llamadas/mes", "1 número", "Reservas automáticas"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || "",
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    price: 199,
    calls: 1000,
    features: ["1.000 llamadas/mes", "3 números", "WhatsApp/SMS", "Analytics avanzados"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRICE_ID || "",
    highlighted: true,
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    price: 499,
    calls: 999999,
    features: ["Ilimitadas", "API", "Account manager", "SLA 99.9%"],
    priceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID || "",
  },
]

export default function BillingPage() {
  const { data: subscription } = useQuery({
    queryKey: ["subscription", BUSINESS_ID],
    queryFn: () =>
      api.get(`/billing/subscription/${BUSINESS_ID}`).then((r) => r.data),
  })

  const checkoutMutation = useMutation({
    mutationFn: (priceId: string) =>
      api
        .post(`/billing/checkout/${BUSINESS_ID}`, {
          priceId,
          successUrl: `${APP_URL}/billing?success=true`,
          cancelUrl: `${APP_URL}/billing`,
        })
        .then((r) => r.data),
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url
    },
  })

  const portalMutation = useMutation({
    mutationFn: () =>
      api
        .post(`/billing/portal/${BUSINESS_ID}`, {
          returnUrl: `${APP_URL}/billing`,
        })
        .then((r) => r.data),
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url
    },
  })

  const usagePercent = subscription
    ? Math.min(100, (subscription.callsUsed / subscription.callsLimit) * 100)
    : 0

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Facturación</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Gestiona tu suscripción y método de pago
        </p>
      </div>

      {/* Current subscription */}
      {subscription && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white mb-1">
                Plan actual: {subscription.plan}
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    subscription.status === "ACTIVE" || subscription.status === "TRIALING"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {subscription.status === "TRIALING" ? "Período de prueba" : subscription.status}
                </span>
                {subscription.currentPeriodEnd && (
                  <span className="text-xs text-gray-400">
                    Renueva el{" "}
                    {format(new Date(subscription.currentPeriodEnd), "d MMMM yyyy", {
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
              <CreditCard className="w-4 h-4" />
              Gestionar pago
            </Button>
          </div>

          {/* Usage */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 dark:text-gray-400">Llamadas usadas</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {subscription.callsUsed} / {subscription.callsLimit === 999999 ? "∞" : subscription.callsLimit}
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
        </div>
      )}

      {/* Plans */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Cambiar plan</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const isCurrent = subscription?.plan === plan.id
            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/20"
                    : "border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      Popular
                    </span>
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
                      <Check className="w-4 h-4 text-violet-600" />
                      <span className="text-gray-600 dark:text-gray-400">{f}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    isCurrent
                      ? "bg-gray-100 text-gray-400 cursor-default"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                  disabled={isCurrent || checkoutMutation.isPending}
                  onClick={() => !isCurrent && checkoutMutation.mutate(plan.priceId)}
                >
                  {isCurrent ? "Plan actual" : "Cambiar a este plan"}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
