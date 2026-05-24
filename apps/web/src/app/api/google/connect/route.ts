import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

function clean(s: string) {
  return s.replace(/^﻿/, "").trim()
}

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.redirect(new URL("/login", req.url))

  const businessId = req.nextUrl.searchParams.get("businessId")
  if (!businessId)
    return NextResponse.json({ error: "Missing businessId" }, { status: 400 })

  const clientId = clean(process.env.GOOGLE_CLIENT_ID || "")
  if (!clientId) {
    return NextResponse.redirect(
      new URL("/calendar?error=google_not_configured", req.url)
    )
  }

  const appUrl = clean(
    process.env.NEXT_PUBLIC_APP_URL || "https://allostudios.net"
  ).replace(/\/$/, "")
  const redirectUri = `${appUrl}/api/google/callback`

  const state = Buffer.from(JSON.stringify({ businessId, userId })).toString(
    "base64url"
  )

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set(
    "scope",
    "https://www.googleapis.com/auth/calendar.events"
  )
  authUrl.searchParams.set("access_type", "offline")
  authUrl.searchParams.set("prompt", "consent")
  authUrl.searchParams.set("state", state)

  return NextResponse.redirect(authUrl.toString())
}
