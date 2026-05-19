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

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status, trial_ends_at")
    .eq("business_id", businesses[0].id)
    .single()

  const trialExpired =
    subscription?.status === "TRIALING" &&
    subscription.trial_ends_at &&
    new Date(subscription.trial_ends_at) < new Date()

  const needsBilling =
    !subscription ||
    trialExpired ||
    subscription.status === "cancelled" ||
    subscription.status === "past_due"

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader />
        <BillingGate required={!!needsBilling}>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </BillingGate>
      </div>
    </div>
  )
}
