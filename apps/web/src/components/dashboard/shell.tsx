"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardSidebar } from "./sidebar"
import { DashboardHeader } from "./header"
import { BillingGate } from "./billing-gate"
import { AlertTriangle, X } from "lucide-react"

interface DashboardShellProps {
  children: React.ReactNode
  needsBilling: boolean
  hasSubscription: boolean
  trialEndsAt?: string | null
  subscriptionStatus?: string | null
}

export function DashboardShell({
  children,
  needsBilling,
  hasSubscription,
  trialEndsAt,
  subscriptionStatus,
}: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Compute days left in trial
  const trialDaysLeft =
    trialEndsAt && subscriptionStatus === "trialing"
      ? Math.floor((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      : null

  const showTrialBanner =
    !bannerDismissed &&
    trialDaysLeft !== null &&
    trialDaysLeft <= 3

  const trialLabel =
    trialDaysLeft !== null && trialDaysLeft <= 0
      ? "Tu prueba gratis termina hoy"
      : trialDaysLeft === 1
        ? "Tu prueba gratis termina mañana"
        : `Tu prueba gratis termina en ${trialDaysLeft} días`

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <DashboardSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader onMenuOpen={() => setSidebarOpen(true)} />

        {/* Trial expiry banner — shows when ≤1 day left */}
        {showTrialBanner && (
          <div className="flex items-center justify-between gap-3 px-5 py-2.5 bg-amber-50 border-b border-amber-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[12.5px] font-medium text-amber-800 truncate">
                {trialLabel} · Activa tu plan para no perder el acceso
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/billing"
                className="px-3 py-1 rounded-lg bg-amber-500 text-white text-[12px] font-semibold hover:bg-amber-600 transition-colors"
              >
                Actualizar ahora →
              </Link>
              <button
                onClick={() => setBannerDismissed(true)}
                className="text-amber-500 hover:text-amber-700 transition-colors p-0.5"
                aria-label="Cerrar"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <BillingGate required={needsBilling} hasSubscription={hasSubscription}>
          <main className="flex-1 overflow-y-auto p-6">{children}</main>
        </BillingGate>
      </div>
    </div>
  )
}
