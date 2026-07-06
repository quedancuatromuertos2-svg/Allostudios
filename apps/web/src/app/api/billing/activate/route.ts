import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase"
import { provision } from "@/lib/provisioner"

function getPlanMinutes(planKey: string, status?: string): number {
  if (status === "trialing") return 60
  const limits: Record<string, number> = { STARTER: 1500, PROFESSIONAL: 2250 }
  return limits[planKey] ?? 1500
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { sessionId } = await req.json()
  if (!sessionId) return NextResponse.json({ error: "Missing sessionId" }, { status: 400 })

  const session = await stripe.checkout.sessions.retrieve(sessionId)
  if (session.payment_status !== "paid" && session.status !== "complete") {
    return NextResponse.json({ ready: false })
  }

  const { businessId, planKey } = session.metadata || {}
  if (!businessId || !planKey) return NextResponse.json({ error: "Missing metadata" }, { status: 400 })

  const subscriptionId = session.subscription as string
  if (!subscriptionId) return NextResponse.json({ ready: false })

  const sub = await stripe.subscriptions.retrieve(subscriptionId)

  await supabaseAdmin.from("subscriptions").upsert({
    business_id: businessId,
    stripe_subscription_id: subscriptionId,
    stripe_customer_id: session.customer as string,
    plan: planKey,
    status: sub.status,
    current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
    current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
    trial_ends_at: (sub as any).trial_end
      ? new Date((sub as any).trial_end * 1000).toISOString()
      : null,
    calls_limit: getPlanMinutes(planKey, sub.status),
    calls_used: 0,
  }, { onConflict: "business_id" })

  // Auto-provision agent + number (idempotent)
  provision(businessId).catch(console.error)

  return NextResponse.json({ ready: true, status: sub.status })
}
