import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const businessId = req.nextUrl.searchParams.get("businessId")
  if (!businessId) return NextResponse.json({ connected: false })

  const { data } = await supabaseAdmin
    .from("businesses")
    .select("google_calendar_token")
    .eq("id", businessId)
    .eq("owner_clerk_id", userId)
    .single()

  const token = data?.google_calendar_token as any
  return NextResponse.json({
    connected: !!token?.access_token,
  })
}
