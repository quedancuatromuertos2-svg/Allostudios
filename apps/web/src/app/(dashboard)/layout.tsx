import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { supabaseAdmin } from "@/lib/supabase"
import { DashboardShell } from "@/components/dashboard/shell"

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

  const { data: subscription } = await supabaseAdmin
    .from("subscriptions")
    .select("status, trial_ends_at, plan")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const status = subscription?.status?.toLowerCase()

  const trialExpired =
    status === "trialing" &&
    subscription?.trial_ends_at != null &&
    new Date(subscription.trial_ends_at) < new Date()

  const needsBilling =
    !subscription ||
    trialExpired ||
    status === "cancelled" ||
    status === "canceled" ||
    status === "past_due"

  return (
    <DashboardShell
      needsBilling={!!needsBilling}
      hasSubscription={!!subscription}
      trialEndsAt={subscription?.trial_ends_at ?? null}
      subscriptionStatus={subscription?.status ?? null}
    >
      {children}
    </DashboardShell>
  )
}
