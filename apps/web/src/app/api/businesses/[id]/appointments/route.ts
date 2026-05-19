import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { addMinutes, parseISO } from "date-fns"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "20")
  const from = (page - 1) * limit

  const { data: business } = await supabaseAdmin
    .from("businesses").select("id").eq("id", params.id).eq("owner_clerk_id", userId).single()
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data, count, error } = await supabaseAdmin
    .from("appointments")
    .select("*, service:services(name, duration, price)", { count: "exact" })
    .eq("business_id", params.id)
    .order("scheduled_at", { ascending: true })
    .range(from, from + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data, total: count, page, limit })
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { customer_name, customer_phone, customer_email, scheduled_at, service_id, notes } = body

  // Get service duration
  let duration = 60
  if (service_id) {
    const { data: svc } = await supabaseAdmin.from("services").select("duration").eq("id", service_id).single()
    if (svc) duration = svc.duration
  }

  const scheduledDate = parseISO(scheduled_at)
  const endsAt = addMinutes(scheduledDate, duration)

  const { data, error } = await supabaseAdmin
    .from("appointments")
    .insert({
      business_id: params.id,
      service_id,
      customer_name,
      customer_phone,
      customer_email,
      notes,
      scheduled_at: scheduledDate.toISOString(),
      ends_at: endsAt.toISOString(),
      status: "confirmed",
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
