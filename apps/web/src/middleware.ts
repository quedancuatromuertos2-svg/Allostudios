import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/login(.*)",
  "/register(.*)",
  "/sso-callback(.*)",
  "/api/clerk-proxy(.*)",
  "/api/voice/webhook(.*)",
  "/api/billing/webhook(.*)",
  "/api/google/callback(.*)",
])

function redirectAppSubdomain(req: NextRequest) {
  const host = req.headers.get("host") || ""
  if (host.startsWith("app.allostudios.net")) {
    const url = req.nextUrl.clone()
    url.host = "allostudios.net"
    return NextResponse.redirect(url, { status: 301 })
  }
}

export default clerkMiddleware(
  async (auth, req) => {
    const subdirectRedirect = redirectAppSubdomain(req)
    if (subdirectRedirect) return subdirectRedirect

    if (!isPublicRoute(req)) {
      const { userId } = await auth()
      if (!userId) return NextResponse.redirect(new URL("/login", req.url))
    }
  },
  { publishableKey: "pk_live_Y2xlcmsuYWxsb3N0dWRpb3MubmV0JA" }
)

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
}
