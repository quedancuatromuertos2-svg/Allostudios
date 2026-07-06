import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { stripe } from "@/lib/stripe"
import { vapiRequest } from "@/lib/vapi"

export async function DELETE() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const errors: string[] = []

  // 1. Get all businesses for this user
  const { data: businesses } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id, stripe_customer_id, ai_config")
    .eq("owner_clerk_id", userId)

  for (const biz of businesses || []) {
    // 2. Cancel active Stripe subscriptions
    const { data: subs } = await supabaseAdmin
      .from("subscriptions")
      .select("stripe_subscription_id")
      .eq("business_id", biz.id)
      .not("stripe_subscription_id", "is", null)

    for (const sub of subs || []) {
      if (sub.stripe_subscription_id) {
        try {
          await stripe.subscriptions.cancel(sub.stripe_subscription_id)
        } catch (e) {
          errors.push(`Stripe cancel failed: ${e}`)
        }
      }
    }

    // 3. Delete Stripe customer
    if (biz.stripe_customer_id) {
      try {
        await stripe.customers.del(biz.stripe_customer_id)
      } catch (e) {
        errors.push(`Stripe customer delete failed: ${e}`)
      }
    }

    // 4. Delete Vapi phone number
    const cfg = biz.ai_config as Record<string, unknown> | null
    if (cfg?.vapi_phone_number_id) {
      try {
        await vapiRequest(`/phone-number/${cfg.vapi_phone_number_id}`, { method: "DELETE" })
      } catch (e) {
        errors.push(`Vapi phone delete failed: ${e}`)
      }
    }

    // 5. Delete Vapi assistant
    if (biz.vapi_assistant_id) {
      try {
        await vapiRequest(`/assistant/${biz.vapi_assistant_id}`, { method: "DELETE" })
      } catch (e) {
        errors.push(`Vapi assistant delete failed: ${e}`)
      }
    }
  }

  // 6. Delete all Supabase data for this user (cascades through businesses)
  await supabaseAdmin.from("users").delete().eq("clerk_id", userId)
  await supabaseAdmin.from("businesses").delete().eq("owner_clerk_id", userId)

  // 7. Delete Clerk user (must be last — invalidates auth)
  try {
    const client = await clerkClient()
    await client.users.deleteUser(userId)
  } catch (e) {
    errors.push(`Clerk delete failed: ${e}`)
    return NextResponse.json({ error: "Error eliminando usuario", details: errors }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
