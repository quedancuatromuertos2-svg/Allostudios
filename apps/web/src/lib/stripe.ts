import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 399,
    minutes_included: 1500,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 599,
    minutes_included: 2250,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "",
  },
}

export type PlanKey = keyof typeof PLANS

// Overage pricing: 0.25€ per extra minute. El servicio nunca se corta.
export const OVERAGE_PRICE_PER_MINUTE_CENTS = 25
