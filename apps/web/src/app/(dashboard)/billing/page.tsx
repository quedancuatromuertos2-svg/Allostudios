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

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("plan, status, current_period_end, calls_used, calls_limit, trial_ends_at")
    .eq("business_id", businessId)
    .single()

  return <BillingClient businessId={businessId} subscription={subscription ?? null} />
}
