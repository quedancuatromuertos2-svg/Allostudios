import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import LiquidTrail from "@/components/LiquidTrail"

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  metadataBase: new URL("https://allostudios.net"),
  title: {
    default: "AlloStudios — Webs, Instagram y Anuncios para negocios locales de Valencia",
    template: "%s | AlloStudios",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  description:
    "AlloStudios: agencia digital para negocios locales de Valencia. Webs profesionales desde 499 €, gestión de Instagram, anuncios de Meta y Google, SEO local y un asistente de IA que responde tus mensajes 24/7. Pide tu demo gratis.",
  keywords: [
    "diseño web Valencia", "web para negocios Valencia", "agencia digital Valencia",
    "gestión de Instagram Valencia", "community manager Valencia", "publicidad Meta Ads Valencia",
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
    title: "AlloStudios — Webs, Instagram y Anuncios para negocios locales",
    description:
      "Tu negocio, lleno. Tu marketing, resuelto. Webs desde 499 €, gestión de Instagram, anuncios y un asistente de IA que responde 24/7 — para negocios locales de Valencia. Pide tu demo gratis.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlloStudios — Marketing para tu negocio local",
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
                logo: "https://allostudios.net/favicon.svg",
                image: "https://allostudios.net/favicon.svg",
                description:
                  "Agencia digital para negocios locales de Valencia: webs profesionales desde 499 €, gestión de Instagram, anuncios de Meta y Google, SEO local, reseñas y asistente de IA 24/7.",
                areaServed: { "@type": "City", name: "Valencia" },
                priceRange: "€€",
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+34-613-112-671",
                  contactType: "sales",
                  availableLanguage: "Spanish",
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
                    name: "Web Arranque",
                    price: "499",
                    priceCurrency: "EUR",
                    description: "Web profesional a medida en 7 días, con tu marca, más 49 €/mes de hosting, cambios y soporte. Demo gratis antes de pagar.",
                  },
                  {
                    "@type": "Offer",
                    name: "Web Premium",
                    price: "790",
                    priceCurrency: "EUR",
                    description: "Web con animaciones premium, copy profesional y tus reseñas de Google integradas, más 49 €/mes.",
                  },
                  {
                    "@type": "Offer",
                    name: "Web Cinematográfica",
                    price: "1490",
                    priceCurrency: "EUR",
                    description: "Web con efecto Apple: tu producto cobra vida con el scroll. 100% a medida, más 79 €/mes.",
                  },
                  {
                    "@type": "Offer",
                    name: "Gestión de Instagram",
                    price: "199",
                    priceCurrency: "EUR",
                    description: "Contenido profesional cada semana, publicado por nosotros. Desde 199 €/mes, sin permanencia.",
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
                      text: "Somos una agencia digital para negocios locales de Valencia. Hacemos tu web profesional, gestionamos tu Instagram, ponemos en marcha tus anuncios de Meta y Google, te subimos en Google (SEO local y reseñas) y montamos un asistente de IA que responde tus mensajes 24/7. Un único partner para todo lo que te trae clientes.",
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
                    name: "¿Cuánto cuesta una web con AlloStudios?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Tenemos tres niveles: Arranque por 499 € + 49 €/mes (todo incluido), Premium por 790 € con animaciones y reseñas integradas, y Cinematográfica desde 1.490 € con el efecto de scroll estilo Apple. Todos sin permanencia y con hosting, cambios y soporte incluidos.",
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
                      text: "No. Ninguno de nuestros servicios tiene permanencia. Te quedas con nosotros porque los resultados te compensan, no porque un contrato te obligue.",
                    },
                  },
                ],
              }),
            }}
          />
        </head>
        <body className={`${inter.variable} font-sans antialiased`}>
          <LiquidTrail />
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
