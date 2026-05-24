import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { BillingGate } from "@/components/dashboard/billing-gate"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect("/login")

  const { data: businesses } = await supabaseAdmin
    .from("businesses")
    .select("id")
    .eq("owner_clerk_id", userId)
    .limit(1)

  if (!businesses?.length) redirect("/onboarding")

  const businessId = businesses[0].id

  let { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status, trial_ends_at")
    .eq("business_id", businessId)
    .single()

  // Auto-create 7-day trial for businesses that pre-date the onboarding fix
  if (!subscription) {
    const { data: created } = await supabaseAdmin
      .from("subscriptions")
      .insert({
        business_id: businessId,
        plan: "STARTER",
        status: "trialing",
        calls_limit: 50,
        calls_used: 0,
        trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select("status, trial_ends_at")
      .single()
    subscription = created
  }

  const status = subscription?.status?.toLowerCase()

  const trialExpired =
    status === "trialing" &&
    subscription?.trial_ends_at != null &&
    new Date(subscription.trial_ends_at) < new Date()

  const needsBilling =
    trialExpired ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "past_due"

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <BillingGate required={!!needsBilling} hasSubscription={!!subscription}>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </BillingGate>
      </div>
    </div>
  )
}
