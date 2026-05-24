import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { stripe, PLANS } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { planKey, businessId } = await req.json()
  const plan = PLANS[planKey as keyof typeof PLANS]
  if (!plan) return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  if (!plan.priceId) return NextResponse.json({ error: "Price not configured" }, { status: 400 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, name, stripe_customer_id")
    .eq("id", businessId)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 })

  let customerId = business.stripe_customer_id
  if (!customerId) {
    const { data: user } = await supabaseAdmin
      .from("users").select("email").eq("clerk_id", userId).single()

    const customer = await stripe.customers.create({
      name: business.name,
      email: user?.email || undefined,
      metadata: { businessId, userId },
    })
    customerId = customer.id

    await supabaseAdmin
      .from("businesses")
      .update({ stripe_customer_id: customerId })
      .eq("id", businessId)
  }

  const origin = req.headers.get("origin") || "http://localhost:3000"

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: plan.priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?billing=success`,
    cancel_url: `${origin}/billing?cancelled=true`,
    metadata: { businessId, planKey },
    subscription_data: {
      trial_period_days: planKey !== "ENTERPRISE" ? 7 : undefined,
      metadata: { businessId, planKey },
    },
  })

  return NextResponse.json({ url: session.url })
}
