import { NextRequest, NextResponse } from "next/server"

const CLERK_FAPI = "https://funky-raptor-17.clerk.accounts.dev"

async function handler(req: NextRequest) {
  const { pathname, search } = new URL(req.url)
  // Strip /api/clerk-proxy prefix
  const clerkPath = pathname.replace(/^\/api\/clerk-proxy/, "")
  const target = `${CLERK_FAPI}${clerkPath}${search}`

  const headers = new Headers(req.headers)
  headers.set("host", new URL(CLERK_FAPI).host)
  headers.delete("connection")

  const body = req.method !== "GET" && req.method !== "HEAD" ? await req.arrayBuffer() : undefined

  const upstreamRes = await fetch(target, {
    method: req.method,
    headers,
    body: body as BodyInit | undefined,
    redirect: "manual",
  })

  const responseHeaders = new Headers(upstreamRes.headers)
  responseHeaders.delete("content-encoding")

  return new NextResponse(upstreamRes.body, {
    status: upstreamRes.status,
    headers: responseHeaders,
  })
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as OPTIONS }
