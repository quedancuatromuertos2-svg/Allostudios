import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code")
  const state = req.nextUrl.searchParams.get("state")
  const error = req.nextUrl.searchParams.get("error")

  if (error || !code || !state) {
    return NextResponse.redirect(
      new URL("/calendar?error=google_denied", req.url)
    )
  }

  let businessId: string
  try {
    ;({ businessId } = JSON.parse(
      Buffer.from(state, "base64url").toString()
    ))
  } catch {
    return NextResponse.redirect(
      new URL("/calendar?error=invalid_state", req.url)
    )
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://allostudios.net"
  const redirectUri = `${appUrl}/api/google/callback`

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!tokenRes.ok) {
    return NextResponse.redirect(
      new URL("/calendar?error=token_exchange", req.url)
    )
  }

  const tokens = await tokenRes.json()

  await supabaseAdmin
    .from("businesses")
    .update({ google_calendar_token: tokens })
    .eq("id", businessId)

  return NextResponse.redirect(new URL("/calendar?connected=true", req.url))
}
