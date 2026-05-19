import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { subDays, format } from "date-fns"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const type = url.searchParams.get("type") || "dashboard"
  const days = parseInt(url.searchParams.get("days") || "30")

  // Verify ownership
  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const since = subDays(new Date(), days).toISOString()

  if (type === "dashboard") {
    const [callsRes, appointmentsRes, leadsRes, subRes] = await Promise.all([
      supabaseAdmin.from("calls").select("id, status, duration, started_at").eq("business_id", params.id).gte("created_at", since),
      supabaseAdmin.from("appointments").select("id, status").eq("business_id", params.id).gte("created_at", since),
      supabaseAdmin.from("leads").select("id, score").eq("business_id", params.id).gte("created_at", since),
      supabaseAdmin.from("subscriptions").select("calls_used, calls_limit, minutes_used, minutes_limit, plan, status").eq("business_id", params.id).single(),
    ])

    const calls = callsRes.data || []
    const appointments = appointmentsRes.data || []
    const leads = leadsRes.data || []
    const sub = subRes.data

    const totalCalls = calls.length
    const answeredCalls = calls.filter((c) => c.status === "ended").length
    const missedCalls = calls.filter((c) => c.status === "no-answer" || c.status === "busy").length
    const appointmentsBooked = appointments.filter((a) => a.status !== "canceled").length
    const leadsGenerated = leads.length
    const hotLeads = leads.filter((l) => l.score === "hot").length
    const totalDuration = calls.reduce((sum, c) => sum + (c.duration || 0), 0)
    const avgCallDuration = answeredCalls > 0 ? Math.round(totalDuration / answeredCalls) : 0
    const conversionRate = totalCalls > 0 ? Math.round((appointmentsBooked / totalCalls) * 100) : 0

    return NextResponse.json({
      totalCalls, answeredCalls, missedCalls, appointmentsBooked,
      leadsGenerated, hotLeads, avgCallDuration, conversionRate,
      callsUsed: sub?.calls_used || 0,
      callsLimit: sub?.calls_limit || 50,
      plan: sub?.plan || "STARTER",
    })
  }

  if (type === "volume") {
    // Generate daily buckets
    const allDays = Array.from({ length: days }, (_, i) => {
      const d = subDays(new Date(), days - 1 - i)
      return format(d, "yyyy-MM-dd")
    })

    const { data: calls } = await supabaseAdmin
      .from("calls")
      .select("created_at, status")
      .eq("business_id", params.id)
      .gte("created_at", since)

    const buckets: Record<string, { total: number; answered: number; missed: number }> = {}
    allDays.forEach((d) => { buckets[d] = { total: 0, answered: 0, missed: 0 } })
    ;(calls || []).forEach((c) => {
      const d = c.created_at.substring(0, 10)
      if (buckets[d]) {
        buckets[d].total++
        if (c.status === "ended") buckets[d].answered++
        if (c.status === "no-answer" || c.status === "busy") buckets[d].missed++
      }
    })

    return NextResponse.json(allDays.map((d) => ({ date: d, ...buckets[d] })))
  }

  if (type === "hourly") {
    const { data: calls } = await supabaseAdmin
      .from("calls")
      .select("started_at")
      .eq("business_id", params.id)
      .gte("created_at", since)
      .not("started_at", "is", null)

    const hourCounts = new Array(24).fill(0)
    ;(calls || []).forEach((c) => {
      const h = new Date(c.started_at).getHours()
      hourCounts[h]++
    })

    return NextResponse.json(hourCounts.map((calls, hour) => ({ hour, calls })))
  }

  if (type === "recent") {
    const { data } = await supabaseAdmin
      .from("calls")
      .select("id, caller_number, caller_name, status, duration, ai_summary, sentiment, started_at, created_at")
      .eq("business_id", params.id)
      .order("created_at", { ascending: false })
      .limit(10)

    return NextResponse.json(data || [])
  }

  return NextResponse.json({ error: "Unknown type" }, { status: 400 })
}
