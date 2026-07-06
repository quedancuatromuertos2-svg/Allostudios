import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const url = new URL(req.url)
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "20")
  const search = url.searchParams.get("search") || ""
  const from = (page - 1) * limit

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  let query = supabaseAdmin
    .from("calls")
    .select("*", { count: "exact" })
    .eq("business_id", params.id)
    .order("started_at", { ascending: false })

  if (search) {
    query = query.or(`caller_number.ilike.%${search}%,summary.ilike.%${search}%,transcript.ilike.%${search}%`)
  }

  const { data: calls, count, error } = await query.range(from, from + limit - 1)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    data: calls || [],
    total: count || 0,
    page,
    limit,
    pages: Math.ceil((count || 0) / limit),
  })
}
