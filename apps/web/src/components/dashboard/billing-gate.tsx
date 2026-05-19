"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { CreditCard } from "lucide-react"

export function BillingGate({
  required,
  children,
}: {
  required: boolean
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
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center mx-auto">
            <CreditCard className="w-7 h-7 text-violet-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Tu período de prueba ha terminado
          </h2>
          <p className="text-sm text-gray-500 max-w-xs">
            Elige un plan para seguir usando alloStudios.
          </p>
        </div>
      </main>
    )
  }

  return <>{children}</>
}
