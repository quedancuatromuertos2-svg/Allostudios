export type SubscriptionPlan = "STARTER" | "PROFESSIONAL" | "ENTERPRISE"
export type SubscriptionStatus =
  | "TRIALING"
  | "ACTIVE"
  | "PAST_DUE"
  | "CANCELED"
  | "INCOMPLETE"

export interface PricingPlan {
  id: SubscriptionPlan
  name: string
  description: string
  price: number
  currency: string
  interval: "month" | "year"
  callsLimit: number
  minutesLimit: number
  features: string[]
  highlighted?: boolean
  stripePriceId: string
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "STARTER",
    name: "Starter",
    description: "Perfecto para negocios que están empezando",
    price: 79,
    currency: "EUR",
    interval: "month",
    callsLimit: 200,
    minutesLimit: 600,
    stripePriceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    features: [
      "200 llamadas/mes",
      "10 horas de conversación",
      "1 número de teléfono",
      "Reservas automáticas",
      "Panel básico",
      "Soporte por email",
    ],
  },
  {
    id: "PROFESSIONAL",
    name: "Professional",
    description: "Para negocios en crecimiento que necesitan más potencia",
    price: 199,
    currency: "EUR",
    interval: "month",
    callsLimit: 1000,
    minutesLimit: 3000,
    highlighted: true,
    stripePriceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "",
    features: [
      "1.000 llamadas/mes",
      "50 horas de conversación",
      "3 números de teléfono",
      "Reservas + CRM de leads",
      "Confirmaciones WhatsApp/SMS",
      "Analytics avanzados",
      "Sincronización Google Calendar",
      "Soporte prioritario",
    ],
  },
  {
    id: "ENTERPRISE",
    name: "Enterprise",
    description: "Sin límites para grandes negocios y franquicias",
    price: 499,
    currency: "EUR",
    interval: "month",
    callsLimit: 999999,
    minutesLimit: 999999,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    features: [
      "Llamadas ilimitadas",
      "Minutos ilimitados",
      "Números ilimitados",
      "Multi-ubicación",
      "API personalizada",
      "Voz personalizada con IA",
      "Integraciones CRM",
      "Account manager dedicado",
      "SLA 99.9%",
    ],
  },
]
