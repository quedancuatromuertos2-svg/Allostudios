function clean(s: string | undefined) {
  return (s || "").replace(/^﻿/, "").trim()
}

interface GoogleTokens {
  access_token: string
  refresh_token?: string
  expiry_date?: number
}

async function refreshAccessToken(tokens: GoogleTokens): Promise<string> {
  if (!tokens.refresh_token) throw new Error("No refresh token available")

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clean(process.env.GOOGLE_CLIENT_ID),
      client_secret: clean(process.env.GOOGLE_CLIENT_SECRET),
      refresh_token: tokens.refresh_token,
      grant_type: "refresh_token",
    }),
  })

  if (!res.ok) throw new Error("Token refresh failed")
  const data = await res.json()
  return data.access_token
}

export async function getValidAccessToken(tokens: GoogleTokens): Promise<string> {
  const isExpired = tokens.expiry_date
    ? tokens.expiry_date < Date.now() + 60_000
    : false

  if (!isExpired) return tokens.access_token
  return refreshAccessToken(tokens)
}

export async function createCalendarEvent(
  tokens: GoogleTokens,
  event: {
    summary: string
    description?: string
    startDateTime: string
    endDateTime: string
    attendeeEmail?: string
  }
) {
  const accessToken = await getValidAccessToken(tokens)

  const body: Record<string, unknown> = {
    summary: event.summary,
    description: event.description,
    start: { dateTime: event.startDateTime, timeZone: "Europe/Madrid" },
    end: { dateTime: event.endDateTime, timeZone: "Europe/Madrid" },
  }

  if (event.attendeeEmail) {
    body.attendees = [{ email: event.attendeeEmail }]
  }

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error?.message || "Calendar event creation failed")
  }

  return res.json()
}
