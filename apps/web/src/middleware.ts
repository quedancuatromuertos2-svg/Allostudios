import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse, type NextRequest } from "next/server"

/**
 * Rutas que EXIGEN sesión iniciada.
 *
 * ⚠️ IMPORTANTE — lee esto antes de crear una página nueva:
 * Antes esto funcionaba al revés (había una lista de rutas públicas y todo lo
 * demás iba a /login). El efecto era que cualquier dirección inexistente
 * —/precios, /casos, /portfolio, /esto-no-existe— devolvía HTTP 200 con la
 * pantalla de login en vez de un 404. Google podía indexar infinitas URLs
 * basura con contenido duplicado, y quien tecleaba una dirección lógica
 * acababa en un login que no esperaba.
 *
 * Ahora es al contrario: solo se protege lo que está en esta lista y el resto
 * cae en el 404 de Next.js. A cambio, **si creas una página privada nueva
 * tienes que añadirla aquí o quedará abierta**. No se te olvide.
 */
const isProtectedRoute = createRouteMatcher([
  // Área de cliente y administración
  "/panel(.*)",
  "/onboarding(.*)",
  "/admin(.*)",
  "/dashboard(.*)",
  "/ai-config(.*)",
  "/analytics(.*)",
  "/billing(.*)",
  "/calendar(.*)",
  "/calls(.*)",
  "/settings(.*)",
  "/team(.*)",

  "/manual(.*)",

  // API privada. Los webhooks (Stripe, Vapi, WhatsApp, Clerk) y los callbacks
  // se quedan fuera a propósito: los llama un tercero sin sesión.
  "/api/account(.*)",
  "/api/admin(.*)",
  "/api/businesses(.*)",
  "/api/onboarding(.*)",
  "/api/voice-preview(.*)",
  "/api/billing/activate(.*)",
  "/api/billing/checkout(.*)",
  "/api/billing/portal(.*)",
  "/api/google/check(.*)",
  "/api/google/connect(.*)",
  "/api/google/events(.*)",
  "/api/google/status(.*)",
  "/api/debug(.*)",

  // Panel de captación. OJO: se listan una a una a propósito, porque
  // /api/panel/sync tiene que seguir siendo pública — es la que usa el
  // Captador de escritorio para volcar los leads sin sesión de navegador.
  "/api/panel/analizar(.*)",
  "/api/panel/assign(.*)",
  "/api/panel/buscar(.*)",
  "/api/panel/leads(.*)",
  "/api/panel/members(.*)",
  "/api/panel/ruta(.*)",
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

    if (isProtectedRoute(req)) {
      const { userId } = await auth()
      if (!userId) {
        // A la API se le contesta 401, no se la redirige a una pantalla HTML
        if (req.nextUrl.pathname.startsWith("/api/")) {
          return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }
        const login = new URL("/login", req.url)
        login.searchParams.set("redirect_url", req.nextUrl.pathname)
        return NextResponse.redirect(login)
      }
    }
  },
  { publishableKey: "pk_live_Y2xlcmsuYWxsb3N0dWRpb3MubmV0JA" }
)

export const config = {
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp4|webm|mov|m4v|avif)).*)", "/(api|trpc)(.*)"],
}
