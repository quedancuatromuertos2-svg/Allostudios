import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin"

export const runtime = "nodejs"

export async function GET() {
  const { userId } = await auth()
  const denied = requireAdmin(userId)
  if (denied) return denied

  const sk = process.env.CLERK_SECRET_KEY ?? ""
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""

  const skBytes = Array.from(Buffer.from(sk.substring(0, 3))).map((b) => b)
  const pkBytes = Array.from(Buffer.from(pk.substring(0, 3))).map((b) => b)

  return NextResponse.json({
    sk: {
      length: sk.length,
      prefix: sk.substring(0, 8),
      firstBytes: skBytes,
      startsCorrectly: sk.startsWith("sk_live_") || sk.startsWith("sk_test_"),
    },
    pk: {
      length: pk.length,
      prefix: pk.substring(0, 8),
      firstBytes: pkBytes,
      startsCorrectly: pk.startsWith("pk_live_") || pk.startsWith("pk_test_"),
    },
  })
}
