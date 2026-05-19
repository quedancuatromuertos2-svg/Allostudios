import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { getVapiCalls } from "@/lib/vapi"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "20")
  const from = (page - 1) * limit

  // Get business to verify ownership + get vapi assistant id
  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Get calls from Supabase (synced from Vapi webhooks)
  const { data: calls, count, error } = await supabaseAdmin
    .from("calls")
    .select("*", { count: "exact" })
    .eq("business_id", params.id)
    .order("created_at", { ascending: false })
    .range(from, from + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data: calls,
    total: count,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
  })
}
