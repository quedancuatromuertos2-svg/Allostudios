import Stripe from "stripe"

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

export const PLANS = {
  STARTER: {
    name: "Starter",
    price: 99,
    annualPrice: 990,
    calls: 200,
    priceId: process.env.STRIPE_STARTER_PRICE_ID || "",
    annualPriceId: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID || "",
  },
  PROFESSIONAL: {
    name: "Professional",
    price: 199,
    annualPrice: 1990,
    calls: 1000,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || "",
    annualPriceId: process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID || "",
  },
  ENTERPRISE: {
    name: "Enterprise",
    price: 499,
    annualPrice: 4990,
    calls: 999999,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "",
    annualPriceId: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || "",
  },
}
