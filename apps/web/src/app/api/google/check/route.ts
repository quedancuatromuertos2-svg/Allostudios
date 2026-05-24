import { NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"

export async function GET(req: NextRequest) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  const rawClientId = process.env.GOOGLE_CLIENT_ID || ""
  const rawClientSecret = process.env.GOOGLE_CLIENT_SECRET || ""

  const appUrl =
    rawAppUrl.replace(/^﻿/, "").trim().replace(/\/$/, "") ||
    "https://allostudios.net"
  const redirectUri = `${appUrl}/api/google/callback`

  return NextResponse.json({
    redirectUri,
    appUrl: {
      raw: rawAppUrl.substring(0, 60),
      cleaned: appUrl,
      hasBom: rawAppUrl.length > 0 && rawAppUrl.charCodeAt(0) === 0xfeff,
      firstBytes: Array.from(rawAppUrl.substring(0, 5)).map((c) =>
        c.charCodeAt(0)
      ),
    },
    googleClientId: {
      set: !!rawClientId,
      length: rawClientId.length,
      hasBom: rawClientId.length > 0 && rawClientId.charCodeAt(0) === 0xfeff,
      firstBytes: Array.from(rawClientId.substring(0, 6)).map((c) =>
        c.charCodeAt(0)
      ),
      preview:
        rawClientId.substring(0, 25) + (rawClientId.length > 25 ? "..." : ""),
    },
    googleClientSecret: {
      set: !!rawClientSecret,
      length: rawClientSecret.length,
      hasBom:
        rawClientSecret.length > 0 &&
        rawClientSecret.charCodeAt(0) === 0xfeff,
    },
    instructions: `Register this EXACT URI in Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client → Authorized redirect URIs: ${redirectUri}`,
  })
}
