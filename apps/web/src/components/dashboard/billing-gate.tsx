"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreditCard, Sparkles } from "lucide-react"

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
  const isBilling = pathname === "/billing"

  useEffect(() => {
    if (required && !isBilling) {
      router.replace("/billing?expired=true")
    }
  }, [required, isBilling, router])

  if (required && !isBilling) {
    return (
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mx-auto">
            <CreditCard className="w-7 h-7 text-violet-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {hasSubscription ? "Tu período de prueba ha terminado" : "Activa tu cuenta"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {hasSubscription
              ? "Elige un plan para seguir usando alloStudios."
              : "Empieza tu prueba gratuita de 7 días sin necesidad de tarjeta."}
          </p>
          <button
            onClick={() => router.push("/billing")}
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {hasSubscription ? "Ver planes" : "Empezar prueba gratis"}
          </button>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
