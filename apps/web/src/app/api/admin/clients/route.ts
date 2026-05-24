import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/admin"

export async function GET(req: Request) {
  const { userId } = await auth()
  const denied = requireAdmin(userId)
  if (denied) return denied

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "25")
  const search = url.searchParams.get("q") || ""
  const from = (page - 1) * limit

  let query = supabaseAdmin
    .from("businesses")
    .select(`
      id, name, niche, phone, email, created_at, owner_clerk_id, vapi_assistant_id,
      subscription:subscriptions(plan, status, calls_used, calls_limit, trial_ends_at, created_at)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1)

  if (search) query = query.ilike("name", `%${search}%`)

  const { data, count, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Get call counts per business for last 30 days
  const since30 = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const bizIds = (data || []).map(b => b.id)
  const { data: callCounts } = await supabaseAdmin
    .from("calls")
    .select("business_id")
    .in("business_id", bizIds)
    .gte("created_at", since30)

  const callMap: Record<string, number> = {}
  ;(callCounts || []).forEach(c => { callMap[c.business_id] = (callMap[c.business_id] || 0) + 1 })

  const enriched = (data || []).map(b => ({
    ...b,
    calls30d: callMap[b.id] || 0,
  }))

  return NextResponse.json({ data: enriched, total: count, page, limit })
}
