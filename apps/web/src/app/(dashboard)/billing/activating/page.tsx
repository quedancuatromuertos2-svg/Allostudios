"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"

export default function ActivatingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!sessionId) {
      router.replace("/billing")
      return
    }

    let cancelled = false
    let tries = 0
    const MAX_TRIES = 10

    async function poll() {
      if (cancelled) return
      tries++
      setAttempt(tries)

      try {
        const res = await fetch("/api/billing/activate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        })
        const data = await res.json()

        if (data.ready) {
          if (!cancelled) {
            setStatus("success")
            setTimeout(() => router.replace("/ai-config"), 2000)
          }
          return
        }
      } catch {}

      if (tries >= MAX_TRIES) {
        if (!cancelled) setStatus("error")
        return
      }

      // Retry with backoff: 1.5s, 2s, 2.5s...
      setTimeout(poll, 1500 + tries * 500)
    }

    poll()
    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
      {status === "loading" && (
        <>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(91,91,214,0.08)" }}>
            <Loader2 className="w-7 h-7 text-accent animate-spin" />
          </div>
          <div>
            <h2 className="text-[1.1rem] font-semibold text-ink">Activando tu suscripción...</h2>
            <p className="text-[13px] text-muted mt-1.5">
              Estamos confirmando tu pago con el banco. Esto tarda solo unos segundos.
            </p>
            {attempt > 3 && (
              <p className="text-[12px] text-muted mt-3 opacity-60">
                Verificando con Stripe... (intento {attempt})
              </p>
            )}
          </div>
        </>
      )}

      {status === "success" && (
        <>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-green-50">
            <CheckCircle2 className="w-7 h-7 text-green-500" />
          </div>
          <div>
            <h2 className="text-[1.1rem] font-semibold text-ink">¡Suscripción activa!</h2>
            <p className="text-[13px] text-muted mt-1.5">
              Tu prueba de 7 días ha comenzado. Configurando tu agente IA...
            </p>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-red-50">
            <XCircle className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h2 className="text-[1.1rem] font-semibold text-ink">No pudimos confirmar el pago</h2>
            <p className="text-[13px] text-muted mt-1.5 max-w-sm">
              Tu tarjeta ha sido verificada pero la activación tardó más de lo esperado.
              Espera 1 minuto y recarga la página — tu suscripción debería estar activa.
            </p>
          </div>
          <button
            onClick={() => router.replace("/billing")}
            className="px-5 py-2.5 rounded-xl bg-accent text-white text-[13px] font-semibold hover:bg-accent-dark transition-all"
          >
            Ir a facturación
          </button>
        </>
      )}
    </div>
  )
}
