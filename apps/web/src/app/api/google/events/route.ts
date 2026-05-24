import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { supabaseAdmin } from "@/lib/supabase"
import { getValidAccessToken } from "@/lib/google-calendar"

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const businessId = req.nextUrl.searchParams.get("businessId")
  const timeMin = req.nextUrl.searchParams.get("timeMin")
  const timeMax = req.nextUrl.searchParams.get("timeMax")

  if (!businessId) return NextResponse.json({ events: [] })

  const { data } = await supabaseAdmin
    .from("businesses")
    .select("google_calendar_token")
    .eq("id", businessId)
    .eq("owner_clerk_id", userId)
    .single()

  const token = data?.google_calendar_token as any
  if (!token?.access_token) return NextResponse.json({ events: [] })

  try {
    const accessToken = await getValidAccessToken(token)

    const params = new URLSearchParams({
      singleEvents: "true",
      orderBy: "startTime",
      maxResults: "250",
    })
    if (timeMin) params.set("timeMin", timeMin)
    if (timeMax) params.set("timeMax", timeMax)

    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    )

    if (!res.ok) {
      console.error("Google Calendar events fetch failed:", await res.text())
      return NextResponse.json({ events: [] })
    }

    const json = await res.json()
    return NextResponse.json({ events: json.items || [] })
  } catch (err) {
    console.error("Error fetching Google Calendar events:", err)
    return NextResponse.json({ events: [] })
  }
}
