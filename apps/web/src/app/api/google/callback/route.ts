import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

function clean(s: string) {
  return s.replace(/^﻿/, "").trim()
}

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
    ;({ businessId } = JSON.parse(Buffer.from(state, "base64url").toString()))
  } catch {
    return NextResponse.redirect(
      new URL("/calendar?error=invalid_state", req.url)
    )
  }

  const appUrl = clean(
    process.env.NEXT_PUBLIC_APP_URL || "https://allostudios.net"
  ).replace(/\/$/, "")
  const redirectUri = `${appUrl}/api/google/callback`

  const clientId = clean(process.env.GOOGLE_CLIENT_ID || "")
  const clientSecret = clean(process.env.GOOGLE_CLIENT_SECRET || "")

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  })

  if (!tokenRes.ok) {
    const err = await tokenRes.text()
    console.error("Google token exchange failed:", err)
    return NextResponse.redirect(
      new URL("/calendar?error=token_exchange", req.url)
    )
  }

  const tokens = await tokenRes.json()
  // Store expiry as absolute timestamp for refresh logic
  const tokensWithExpiry = {
    ...tokens,
    expiry_date: tokens.expires_in
      ? Date.now() + tokens.expires_in * 1000
      : null,
  }

  const { error: dbErr } = await supabaseAdmin
    .from("businesses")
    .update({ google_calendar_token: tokensWithExpiry })
    .eq("id", businessId)

  if (dbErr) {
    console.error("Failed to save Google token:", dbErr.message)
    // If column doesn't exist yet, redirect with a specific error
    if (dbErr.message.includes("column")) {
      return NextResponse.redirect(
        new URL("/calendar?error=db_column_missing", req.url)
      )
    }
    return NextResponse.redirect(
      new URL("/calendar?error=save_failed", req.url)
    )
  }

  return NextResponse.redirect(new URL("/calendar?connected=true", req.url))
}
