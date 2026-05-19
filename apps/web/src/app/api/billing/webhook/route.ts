import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: "Webhook verification failed" }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session
      const { businessId, planKey } = session.metadata || {}
      if (!businessId || !planKey) break

      const subscriptionId = session.subscription as string
      const sub = await stripe.subscriptions.retrieve(subscriptionId)

      await supabaseAdmin.from("subscriptions").upsert({
        business_id: businessId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: session.customer as string,
        plan: planKey,
        status: sub.status,
        current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
        current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
        calls_limit: getPlanCalls(planKey),
        calls_used: 0,
      }, { onConflict: "business_id" })
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const businessId = sub.metadata?.businessId
      if (!businessId) break

      await supabaseAdmin.from("subscriptions")
        .update({
          status: sub.status,
          current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
        })
        .eq("stripe_subscription_id", sub.id)
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      await supabaseAdmin.from("subscriptions")
        .update({ status: "cancelled" })
        .eq("stripe_subscription_id", sub.id)
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      const subId = (invoice as any).subscription as string
      if (!subId) break

      await supabaseAdmin.from("subscriptions")
        .update({ calls_used: 0, status: "active" })
        .eq("stripe_subscription_id", subId)
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}

function getPlanCalls(planKey: string): number {
  const limits: Record<string, number> = { STARTER: 200, PROFESSIONAL: 1000, ENTERPRISE: 999999 }
  return limits[planKey] ?? 200
}
