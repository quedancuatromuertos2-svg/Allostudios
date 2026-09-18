import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter, Outfit } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import LiquidTrail from "@/components/LiquidTrail"

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" })
const outfit = Outfit({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-outfit" })

export const metadata: Metadata = {
  metadataBase: new URL("https://allostudios.net"),
  title: {
    default: "AlloStudios — Deja de perder clientes que te buscan y no te encuentran",
    template: "%s | AlloStudios",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/marca/icono-claro-64.png", sizes: "64x64", type: "image/png" },
      { url: "/marca/icono-claro-256.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  description:
    "AlloStudios: agencia digital para negocios locales de Valencia. Web profesional, SEO local, reseñas, anuncios de Meta y Google y un asistente de IA que responde tu WhatsApp 24/7. Packs desde 199 €/mes con 0 € de entrada. Pide tu demo gratis.",
  keywords: [
    "diseño web Valencia", "web para negocios Valencia", "agencia digital Valencia",
    "publicidad Meta Ads Valencia", "web por suscripción Valencia", "agencia IA negocios locales",
    "salir en ChatGPT negocio local", "AEO Valencia", "que la IA recomiende mi negocio",
    "SEO local Valencia", "salir en Google Valencia", "reseñas Google negocios",
    "chatbot WhatsApp negocio", "asistente IA para negocios", "web para peluquería restaurante clínica",
    "más clientes negocio local", "web profesional barata Valencia",
    "AlloStudios", "allostudios.net",
  ],
  authors: [{ name: "AlloStudios", url: "https://allostudios.net" }],
  creator: "AlloStudios",
  publisher: "AlloStudios",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://allostudios.net",
    languages: { "es-ES": "https://allostudios.net" },
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://allostudios.net",
    siteName: "AlloStudios",
    images: [{ url: "https://allostudios.net/marca/og.jpg", width: 1200, height: 630, alt: "allo." }],
    title: "AlloStudios — Deja de perder clientes que te buscan y no te encuentran",
    description:
      "Tu negocio, lleno. Tu marketing, resuelto. Web, SEO local, anuncios y un asistente de IA que responde tu WhatsApp 24/7 — packs desde 199 €/mes, 0 € de entrada. Pide tu demo gratis.",
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://allostudios.net/marca/og.jpg"],
    title: "AlloStudios — Que te encuentren, que te contesten, que te lleguen clientes",
    description:
      "Webs profesionales, gestión de Instagram, anuncios y asistente de IA para negocios de Valencia. Pide tu demo gratis por WhatsApp.",
    creator: "@allostudios",
  },
  category: "technology",
  classification: "Business",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey="pk_live_Y2xlcmsuYWxsb3N0dWRpb3MubmV0JA"
      signInUrl="/login"
      signUpUrl="/register"
      afterSignInUrl="/panel"
      afterSignUpUrl="/panel"
    >
      <html lang="es" suppressHydrationWarning>
        <head>
          {/* Structured Data — LocalBusiness / Agencia */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                name: "AlloStudios",
                url: "https://allostudios.net",
                logo: "https://allostudios.net/marca/icono-claro-512.png",
                image: "https://allostudios.net/marca/icono-claro-256.png",
                description:
                  "Agencia digital para negocios locales de Valencia: web profesional, SEO local, reseñas, anuncios de Meta y Google y asistente de IA 24/7. Packs por suscripción desde 199 €/mes, 0 € de entrada.",
                areaServed: { "@type": "City", name: "Valencia" },
                priceRange: "€€",
                telephone: "+34-695-868-793",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+34-695-868-793",
                  contactType: "sales",
                  availableLanguage: "Spanish",
                  // Compromiso público de respuesta: sale en los resultados de Google
                  hoursAvailable: {
                    "@type": "OpeningHoursSpecification",
                    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                    opens: "09:00",
                    closes: "20:00",
                  },
                },
                sameAs: [
                  "https://wa.me/34695868793",
                ],
              }),
            }}
          />
          {/* Structured Data — Catálogo de servicios */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Service",
                serviceType: "Diseño web y marketing para negocios locales",
                provider: { "@type": "Organization", name: "AlloStudios", url: "https://allostudios.net" },
                areaServed: { "@type": "City", name: "Valencia" },
                offers: [
                  {
                    "@type": "Offer",
                    name: "Pack Estándar",
                    price: "199",
                    priceCurrency: "EUR",
                    description: "Web profesional + SEO local mensual + reseñas 5★ automatizadas. 199 €/mes, 0 € de entrada, 12 meses.",
                  },
                  {
                    "@type": "Offer",
                    name: "Pack Pro",
                    price: "349",
                    priceCurrency: "EUR",
                    description: "Web Premium + SEO local + reseñas + asistente de IA en WhatsApp 24/7. 349 €/mes, 0 € de entrada, 12 meses.",
                  },
                  {
                    "@type": "Offer",
                    name: "Pack Max",
                    price: "499",
                    priceCurrency: "EUR",
                    description: "Todo lo del Pack Pro más campañas de Meta y Google Ads gestionadas. 499 €/mes, 0 € de entrada, 12 meses.",
                  },
                  {
                    "@type": "Offer",
                    name: "Web Arranque",
                    price: "99",
                    priceCurrency: "EUR",
                    description: "Web profesional a medida en 7 días con hosting, cambios y soporte incluidos. 99 €/mes, 0 € de entrada. Demo gratis antes de pagar.",
                  },
                ],
              }),
            }}
          />
          {/* Structured Data — FAQPage */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "¿Qué hace AlloStudios exactamente?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Somos una agencia digital para negocios locales de Valencia. Hacemos tu web profesional, te subimos en Google (SEO local y reseñas), ponemos en marcha tus anuncios de Meta y Google y montamos un asistente de IA que responde tu WhatsApp 24/7. Un único partner para todo lo que te trae clientes.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "¿Puedo ver cómo quedaría mi web antes de pagar?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Sí. Te preparamos una demo real de tu web con tu marca, tus colores y tu información, y te la enseñamos antes de que pagues nada. Si te gusta, la dejamos funcionando en 7 días. Ver la demo es gratis y no compromete a nada.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "¿Cuánto cuesta AlloStudios?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Por suscripción, con 0 € de entrada y 12 meses de permanencia. Tres packs: Estándar (199 €/mes: web + SEO local + reseñas), Pro (349 €/mes: web premium + SEO + reseñas + asistente de IA en WhatsApp) y Max (499 €/mes: lo anterior más campañas de Meta y Google Ads). Solo la web, desde 99 €/mes con hosting, cambios y soporte incluidos.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "¿Trabajáis solo con inmobiliarias?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "No. Trabajamos con todo tipo de negocios locales de Valencia: peluquerías y barberías, clínicas dentales, restaurantes, gimnasios, talleres, centros de estética, tiendas y autónomos. Adaptamos cada web y cada servicio al sector y a la marca de cada negocio.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "¿Hay permanencia?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Los packs y las webs tienen 12 meses de permanencia porque no cobramos nada por adelantado; pasado el año, sigues mes a mes sin compromiso. Los servicios sueltos (SEO local, reseñas, asistente, anuncios) no tienen permanencia.",
                    },
                  },
                ],
              }),
            }}
          />
        </head>
        <body className={`${inter.variable} ${outfit.variable} font-sans antialiased`}>
          <LiquidTrail />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
