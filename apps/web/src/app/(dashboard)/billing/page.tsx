import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"
import { BillingClient } from "./client"

export default async function BillingPage() {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const { data: businesses } = await supabaseAdmin
    .from("businesses")
    .select("id")
    .eq("owner_clerk_id", userId)
    .limit(1)

  if (!businesses?.length) redirect("/onboarding")

  const businessId = businesses[0].id
  const month = new Date().toISOString().slice(0, 7)

  const [{ data: subscription }, { data: usage }] = await Promise.all([
    supabaseAdmin
      .from("subscriptions")
      .select("plan, status, current_period_end, calls_used, calls_limit, trial_ends_at")
      .eq("business_id", businessId)
      .single(),
    supabaseAdmin
      .from("billing_usage")
      .select("minutes_used, calls_count")
      .eq("business_id", businessId)
      .eq("month", month)
      .maybeSingle(),
  ])

  return <BillingClient businessId={businessId} subscription={subscription ?? null} usage={usage ?? null} />
}
