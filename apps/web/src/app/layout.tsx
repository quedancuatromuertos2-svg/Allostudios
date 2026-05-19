import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" })

export const metadata: Metadata = {
  title: "alloStudios — Recepcionista con IA para tu negocio",
  description:
    "Plataforma de agentes de voz con inteligencia artificial. Atiende llamadas, reserva citas y gestiona leads automáticamente 24/7.",
  keywords: "IA, voz, recepcionista virtual, agenda, citas, barbería, salón",
  openGraph: {
    title: "alloStudios",
    description: "Tu recepcionista virtual con IA",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      proxyUrl={process.env.NODE_ENV === "production" ? "https://allostudios.net/api/clerk-proxy" : undefined}
      signInUrl="/login"
      signUpUrl="/register"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
    >
      <html lang="es" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
