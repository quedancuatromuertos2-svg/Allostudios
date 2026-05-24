import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/admin"

export async function GET() {
  const { userId } = await auth()
  const denied = requireAdmin(userId)
  if (denied) return denied

  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [bizRes, subRes, callsRes, newBizRes] = await Promise.all([
    supabaseAdmin.from("businesses").select("id", { count: "exact" }),
    supabaseAdmin.from("subscriptions").select("plan, status, calls_used, calls_limit"),
    supabaseAdmin.from("calls").select("id, created_at", { count: "exact" }).gte("created_at", since30),
    supabaseAdmin.from("businesses").select("id", { count: "exact" }).gte("created_at", since30),
  ])

  const subs = subRes.data || []
  const planPrices: Record<string, number> = { STARTER: 79, PROFESSIONAL: 199, ENTERPRISE: 499, TRIAL: 0 }
  const mrr = subs.filter(s => s.status === "active").reduce((sum, s) => sum + (planPrices[s.plan] || 0), 0)
  const activeSubs = subs.filter(s => s.status === "active").length
  const trialSubs = subs.filter(s => s.status === "trialing").length

  const planDist = subs.reduce((acc: Record<string, number>, s) => {
    acc[s.plan] = (acc[s.plan] || 0) + 1
    return acc
  }, {})

  return NextResponse.json({
    totalBusinesses: bizRes.count || 0,
    newBusinesses30d: newBizRes.count || 0,
    mrr,
    activeSubs,
    trialSubs,
    callsThisMonth: callsRes.count || 0,
    planDist,
  })
}
