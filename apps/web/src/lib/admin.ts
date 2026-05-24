import { NextResponse } from "next/server"

/** Returns true if the Clerk userId is in the ADMIN_USER_IDS env var (comma-separated). */
export function isAdmin(userId: string): boolean {
  const ids = (process.env.ADMIN_USER_IDS || "").split(",").map((s) => s.trim()).filter(Boolean)
  return ids.length > 0 && ids.includes(userId)
}

/** Convenience: returns a 403 response if the user is not an admin. */
export function requireAdmin(userId: string | null | undefined): NextResponse | null {
  if (!userId || !isAdmin(userId)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }
  return null
}
