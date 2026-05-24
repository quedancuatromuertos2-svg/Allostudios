import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { requireAdmin } from "@/lib/admin"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  const denied = requireAdmin(userId)
  if (denied) return denied

  const [bizRes, callsRes, apptRes, leadsRes] = await Promise.all([
    supabaseAdmin
      .from("businesses")
      .select("*, subscription:subscriptions(*), services(*)")
      .eq("id", params.id)
      .single(),
    supabaseAdmin
      .from("calls")
      .select("id, status, duration_seconds, started_at, summary, caller_number")
      .eq("business_id", params.id)
      .order("started_at", { ascending: false })
      .limit(20),
    supabaseAdmin
      .from("appointments")
      .select("id, customer_name, scheduled_at, status")
      .eq("business_id", params.id)
      .order("scheduled_at", { ascending: false })
      .limit(10),
    supabaseAdmin
      .from("leads")
      .select("id, name, phone, status, created_at")
      .eq("business_id", params.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ])

  if (!bizRes.data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({
    business: bizRes.data,
    calls: callsRes.data || [],
    appointments: apptRes.data || [],
    leads: leadsRes.data || [],
  })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  const denied2 = requireAdmin(userId)
  if (denied2) return denied2

  const body = await req.json()

  if (body.subscription) {
    const { plan, status, calls_limit } = body.subscription
    await supabaseAdmin
      .from("subscriptions")
      .update({ plan, status, calls_limit })
      .eq("business_id", params.id)
  }

  if (body.is_active !== undefined) {
    await supabaseAdmin.from("businesses").update({ is_active: body.is_active }).eq("id", params.id)
  }

  return NextResponse.json({ success: true })
}
