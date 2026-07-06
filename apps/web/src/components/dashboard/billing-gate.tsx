"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreditCard } from "lucide-react"

export function BillingGate({
  required,
  hasSubscription,
  children,
}: {
  required: boolean
  hasSubscription: boolean
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const isBilling = pathname.startsWith("/billing")

  useEffect(() => {
    if (required && !isBilling) {
      router.replace("/billing?expired=true")
    }
  }, [required, isBilling, router])

  if (required && !isBilling) {
    return (
      <main className="flex-1 flex items-center justify-center p-6 bg-canvas">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            style={{ background: "rgba(91,91,214,0.08)" }}>
            <CreditCard className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-[1.1rem] font-semibold text-ink">
              {hasSubscription ? "Tu período de prueba ha terminado" : "Activa tu suscripción"}
            </h2>
            <p className="text-[0.875rem] text-muted mt-2">
              {hasSubscription
                ? "Elige un plan para seguir usando AlloStudios y no perder tu configuración."
                : "Selecciona un plan para acceder al panel de control."}
            </p>
          </div>
          <button
            onClick={() => router.push("/billing")}
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-dark text-white text-[13.5px] font-semibold px-6 py-2.5 rounded-xl transition-colors"
          >
            <CreditCard className="w-3.5 h-3.5" />
            Ver planes
          </button>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
