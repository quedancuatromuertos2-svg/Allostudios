"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check, Zap } from "lucide-react"

const plans = [
  {
    name: "Starter",
    price: 79,
    description: "Para negocios que empiezan",
    calls: "200 llamadas/mes",
    minutes: "10 horas",
    features: [
      "1 número de teléfono",
      "Reservas automáticas",
      "Panel básico",
      "Transcripciones de llamadas",
      "Soporte por email",
    ],
    cta: "Empezar gratis",
    highlighted: false,
  },
  {
    name: "Professional",
    price: 199,
    description: "El más popular entre negocios",
    calls: "1.000 llamadas/mes",
    minutes: "50 horas",
    features: [
      "3 números de teléfono",
      "Reservas + CRM de leads",
      "Confirmaciones WhatsApp/SMS",
      "Analytics avanzados",
      "Google Calendar sync",
      "Resúmenes con IA",
      "Soporte prioritario",
    ],
    cta: "Empezar gratis",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 499,
    description: "Para grandes negocios y franquicias",
    calls: "Ilimitadas",
    minutes: "Ilimitadas",
    features: [
      "Números ilimitados",
      "Multi-ubicación",
      "Voz personalizada con IA",
      "Integraciones CRM",
      "API personalizada",
      "Account manager dedicado",
      "SLA 99.9% uptime",
    ],
    cta: "Hablar con ventas",
    highlighted: false,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-sm font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-4">
            Precios
          </p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-5">
            Precios simples y transparentes
          </h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            14 días de prueba gratuita sin necesidad de tarjeta de crédito.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? "bg-violet-600 text-white shadow-2xl shadow-violet-500/30 scale-105"
                  : "bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-black text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    Más popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3
                  className={`text-lg font-bold mb-1 ${
                    plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-sm ${
                    plan.highlighted ? "text-violet-200" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {plan.description}
                </p>
              </div>

              <div className="mb-6">
                <span
                  className={`text-5xl font-extrabold ${
                    plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"
                  }`}
                >
                  {plan.price}€
                </span>
                <span
                  className={`text-sm ${
                    plan.highlighted ? "text-violet-200" : "text-gray-500"
                  }`}
                >
                  /mes
                </span>
              </div>

              <div
                className={`flex gap-4 text-sm mb-6 pb-6 border-b ${
                  plan.highlighted
                    ? "border-violet-500 text-violet-200"
                    : "border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400"
                }`}
              >
                <div>
                  <p className={`font-semibold ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {plan.calls}
                  </p>
                  <p className="text-xs">de conversación</p>
                </div>
                <div>
                  <p className={`font-semibold ${plan.highlighted ? "text-white" : "text-gray-900 dark:text-white"}`}>
                    {plan.minutes}
                  </p>
                  <p className="text-xs">voz total</p>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm">
                    <Check
                      className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                        plan.highlighted ? "text-violet-200" : "text-violet-600"
                      }`}
                    />
                    <span
                      className={
                        plan.highlighted ? "text-violet-100" : "text-gray-600 dark:text-gray-400"
                      }
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link href="/register">
                <Button
                  className={`w-full h-11 font-semibold ${
                    plan.highlighted
                      ? "bg-white text-violet-600 hover:bg-violet-50"
                      : "bg-violet-600 hover:bg-violet-700 text-white"
                  }`}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
