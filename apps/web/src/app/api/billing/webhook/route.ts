import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase"
import { releasePhoneNumber } from "@/lib/twilio"
import { vapiRequest } from "@/lib/vapi"
import { sendWelcomeEmail } from "@/lib/email"
import Stripe from "stripe"

function getPlanMinutes(planKey: string, status?: string): number {
  if (status === "trialing") return 60
  const limits: Record<string, number> = { STARTER: 1500, PROFESSIONAL: 2250 }
  return limits[planKey] ?? 1500
}

async function releaseBusiness(businessId: string) {
  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("ai_config")
    .eq("id", businessId)
    .single()

  if (!business) return
  const aiConfig = (business.ai_config as Record<string, unknown>) || {}
  const twilioSid = aiConfig.twilio_sid as string | undefined
  const vapiPhoneNumberId = aiConfig.vapi_phone_number_id as string | undefined

  if (twilioSid) {
    try { await releasePhoneNumber(twilioSid) } catch {}
  }

  if (vapiPhoneNumberId) {
    try { await vapiRequest(`/phone-number/${vapiPhoneNumberId}`, { method: "DELETE" }) } catch {}
  }

  await supabaseAdmin
    .from("businesses")
    .update({
      ai_config: {
        ...aiConfig,
        vapi_phone_number: null,
        vapi_phone_number_id: null,
        twilio_sid: null,
        optimization_mode: 0,
      },
    })
    .eq("id", businessId)
}

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get("stripe-signature")

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
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
        trial_ends_at: (sub as any).trial_end
          ? new Date((sub as any).trial_end * 1000).toISOString()
          : null,
        calls_limit: getPlanMinutes(planKey, sub.status),
        calls_used: 0,
      }, { onConflict: "business_id" })

      // Send welcome email (non-blocking)
      const customerEmail = session.customer_details?.email
      if (customerEmail) {
        const { data: biz } = await supabaseAdmin
          .from("businesses")
          .select("name")
          .eq("id", businessId)
          .single()
        const planName = planKey === "PROFESSIONAL" ? "Professional" : "Starter"
        sendWelcomeEmail(customerEmail, biz?.name || "tu negocio", planName).catch(() => {})
      }
      break
    }

    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription
      const businessId = sub.metadata?.businessId
      if (!businessId) break

      const { data: existing } = await supabaseAdmin
        .from("subscriptions")
        .select("plan, calls_limit")
        .eq("stripe_subscription_id", sub.id)
        .single()

      const planKey = existing?.plan || "STARTER"
      const newCallsLimit = getPlanMinutes(planKey, sub.status)

      await supabaseAdmin.from("subscriptions")
        .update({
          status: sub.status,
          current_period_start: new Date((sub as any).current_period_start * 1000).toISOString(),
          current_period_end: new Date((sub as any).current_period_end * 1000).toISOString(),
          calls_limit: newCallsLimit,
        })
        .eq("stripe_subscription_id", sub.id)
      break
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription
      const businessId = sub.metadata?.businessId

      await supabaseAdmin.from("subscriptions")
        .update({ status: "cancelled" })
        .eq("stripe_subscription_id", sub.id)

      if (businessId) {
        try { await releaseBusiness(businessId) } catch {}
      }
      break
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice
      const subId = (invoice as any).subscription as string
      if (!subId) break

      const { data: existing } = await supabaseAdmin
        .from("subscriptions")
        .select("plan")
        .eq("stripe_subscription_id", subId)
        .single()

      const planKey = existing?.plan || "STARTER"

      await supabaseAdmin.from("subscriptions")
        .update({
          calls_used: 0,
          status: "active",
          calls_limit: getPlanMinutes(planKey, "active"),
        })
        .eq("stripe_subscription_id", subId)

      // Reset optimization mode at billing cycle renewal
      const { data: sub2 } = await supabaseAdmin
        .from("subscriptions")
        .select("business_id")
        .eq("stripe_subscription_id", subId)
        .single()
      if (sub2?.business_id) {
        const { data: biz } = await supabaseAdmin
          .from("businesses")
          .select("ai_config")
          .eq("id", sub2.business_id)
          .single()
        if (biz) {
          const cfg = (biz.ai_config as Record<string, unknown>) || {}
          await supabaseAdmin.from("businesses")
            .update({ ai_config: { ...cfg, optimization_mode: 0 } })
            .eq("id", sub2.business_id)
        }
      }
      break
    }

    default:
      break
  }

  return NextResponse.json({ received: true })
}
