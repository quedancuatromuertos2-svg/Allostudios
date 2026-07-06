"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { useBusinessStore } from "@/store/business.store"
import {
  Brain,
  Save,
  Plus,
  Trash2,
  Volume2,
  MessageSquare,
  Settings,
  Play,
  CheckCircle2,
  Phone,
  PhoneOff,
  Copy,
  Check,
  Wrench,
  Star,
  X,
  ArrowRight,
  Lock,
  PhoneCall,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react"

const VOICES = [
  { id: "21m00Tcm4TlvDq8ikWAM", label: "Voz femenina", desc: "Cálida y profesional (Rachel)", provider: "11labs", gender: "female" as const },
  { id: "ErXwobaYiN019PkySvjV", label: "Voz masculina", desc: "Seguro y cercano (Antoni)", provider: "11labs", gender: "male" as const },
]

let currentAudio: HTMLAudioElement | null = null

async function playVoicePreview(voice: (typeof VOICES)[0], setPlaying: (id: string | null) => void) {
  // Stop any current playback
  if (currentAudio) { currentAudio.pause(); currentAudio = null }
  window.speechSynthesis?.cancel()

  setPlaying(voice.id)

  try {
    const res = await fetch("/api/voice-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ voiceId: voice.id }),
    })
    if (!res.ok) throw new Error("no_key")
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    currentAudio = new Audio(url)
    currentAudio.onended = () => setPlaying(null)
    currentAudio.onerror = () => setPlaying(null)
    currentAudio.play()
  } catch {
    // Fallback: browser TTS with gender-tuned pitch
    setPlaying(null)
    if (typeof window === "undefined" || !window.speechSynthesis) return
    const utterance = new SpeechSynthesisUtterance("Hola, soy tu asistente de voz. ¿En qué puedo ayudarte hoy?")
    utterance.lang = "es-ES"
    utterance.pitch = voice.gender === "female" ? (voice.id === VOICES[0].id ? 1.4 : 1.1) : (voice.id === VOICES[1].id ? 0.55 : 0.75)
    utterance.rate = voice.gender === "female" ? 1.0 : 0.9
    const voices = window.speechSynthesis.getVoices()
    const esVoice = voice.gender === "female"
      ? voices.find(v => v.lang.startsWith("es") && /Lucía|Monica|Paulina|Mónica|female|woman/i.test(v.name))
      : voices.find(v => v.lang.startsWith("es") && /Jorge|Pablo|male|man/i.test(v.name))
    if (esVoice) utterance.voice = esVoice
    window.speechSynthesis.speak(utterance)
  }
}

const TABS = [
  { id: "prompt", label: "Prompt & Voz", icon: Brain },
  { id: "faqs", label: "FAQs", icon: MessageSquare },
  { id: "advanced", label: "Avanzado", icon: Settings },
]

const DEFAULT_FORM = {
  agentName: "Marta",
  greetingMessage: "",
  systemPrompt: "",
  workingZones: "",
  voice: VOICES[0].id,
  temperature: 0.7,
  enableBooking: true,
  enableLeadCapture: true,
  enableTransfer: false,
  transferNumber: "",
  faqs: [] as { id: string; question: string; answer: string }[],
}

const PHONE_LIMITS: Record<string, number> = { STARTER: 1, PROFESSIONAL: 3 }

function StatusBanner({ bizId }: { bizId: string }) {
  const queryClient = useQueryClient()
  const [repairing, setRepairing] = useState(false)

  const { data: status, isLoading } = useQuery({
    queryKey: ["bizStatus", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/status`).then(r => r.data),
    enabled: !!bizId,
    refetchInterval: (query) => {
      const s = (query.state.data as Record<string, unknown> | undefined)?.status
      return (s === "provisioning" || s === "pending" || s === "needs_number") ? 5000 : false
    },
  })

  const repair = async () => {
    setRepairing(true)
    try {
      await api.post(`/api/businesses/${bizId}/repair`, {})
      queryClient.invalidateQueries({ queryKey: ["bizStatus", bizId] })
      queryClient.invalidateQueries({ queryKey: ["aiConfig", bizId] })
    } catch {} finally {
      setRepairing(false)
    }
  }

  if (isLoading) return null

  const s = status?.status

  if (s === "ready") {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-green-50 border border-green-100">
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
        </span>
        <span className="text-[12.5px] font-semibold text-green-700">Sistema activo — asistente y número conectados</span>
        <span className="ml-auto font-mono text-[12px] text-green-600">{status.phone_number}</span>
      </div>
    )
  }

  if (s === "provisioning") {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-100">
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
        <span className="text-[12.5px] font-semibold text-blue-700">Configurando tu asistente... Esto tarda 1-2 minutos.</span>
      </div>
    )
  }

  if (s === "needs_number") {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
        <Phone className="w-4 h-4 text-amber-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-[12.5px] font-semibold text-amber-800">El bot necesita un número español +34</span>
          <span className="text-[11.5px] text-amber-600 ml-1.5">Lo asignamos automáticamente, sin coste extra.</span>
        </div>
        <button
          onClick={repair}
          disabled={repairing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[12px] font-semibold hover:bg-amber-600 disabled:opacity-50 transition-all shrink-0"
        >
          {repairing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Phone className="w-3 h-3" />}
          {repairing ? "Asignando..." : "Asignar número +34"}
        </button>
      </div>
    )
  }

  if (s === "error") {
    return (
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200">
        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <span className="text-[12.5px] font-semibold text-red-700">Error en la configuración.</span>
          {status?.job_error && (
            <span className="text-[11.5px] text-red-600 ml-1">{status.job_error}</span>
          )}
        </div>
        <button
          onClick={repair}
          disabled={repairing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[12px] font-semibold hover:bg-red-600 disabled:opacity-50 transition-all shrink-0"
        >
          {repairing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {repairing ? "Reparando..." : "Reparar"}
        </button>
      </div>
    )
  }

  // pending — no provisioning job yet
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
      <span className="text-[12.5px] font-semibold text-amber-700 flex-1">El asistente no está activado todavía.</span>
      <button
        onClick={repair}
        disabled={repairing}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[12px] font-semibold hover:bg-amber-600 disabled:opacity-50 transition-all shrink-0"
      >
        {repairing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
        {repairing ? "Activando..." : "Activar ahora"}
      </button>
    </div>
  )
}

function ForwardingCard({
  fromPhone, toPhone, copiedNum, onCopy,
}: { fromPhone: string; toPhone: string; copiedNum: string | null; onCopy: (n: string) => void }) {
  const destClean = toPhone.replace(/\s/g, "")
  const [showHelp, setShowHelp] = useState(false)

  return (
    <div className="mx-5 mb-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 space-y-3">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
          <ArrowRight className="w-3 h-3 text-white" />
        </div>
        <p className="text-[12.5px] font-semibold text-blue-800">Vincula tu número al bot</p>
      </div>

      <p className="text-[11.5px] text-blue-700">
        Para que las llamadas a <strong>{fromPhone}</strong> las atienda el bot, desvía ese número a:
      </p>

      {/* Routing number */}
      <div className="flex items-center gap-2">
        <div className="flex-1 min-w-0 bg-white border border-blue-200 rounded-lg px-3 py-2 font-mono text-[14px] font-semibold text-blue-900 tracking-wide truncate">
          {destClean}
        </div>
        <button onClick={() => onCopy(destClean)}
          className="px-3 py-2 rounded-lg border border-blue-200 bg-white text-blue-600 hover:bg-blue-50 transition-colors shrink-0"
          title="Copiar número">
          {copiedNum === destClean ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>

      {/* Two options */}
      <div className="space-y-2">
        {/* iPhone */}
        <div className="bg-white border border-blue-100 rounded-xl p-3 space-y-1.5">
          <p className="text-[11.5px] font-semibold text-ink">📱 iPhone</p>
          <ol className="space-y-1">
            {["Ajustes → Teléfono → Desvío de llamadas", "Activa el interruptor", "Copia y pega el número de arriba"].map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px] text-dim">
                <span className="font-semibold text-blue-500 shrink-0">{i + 1}.</span>{s}
              </li>
            ))}
          </ol>
        </div>

        {/* Android */}
        <div className="bg-white border border-blue-100 rounded-xl p-3 space-y-1">
          <p className="text-[11.5px] font-semibold text-ink">🤖 Android</p>
          <p className="text-[11px] text-dim">App Teléfono → ⋮ → Ajustes → Desvío de llamadas → Desviar siempre → pega el número</p>
        </div>
      </div>

      {/* Can't configure? */}
      <button
        onClick={() => setShowHelp(h => !h)}
        className="text-[11px] text-blue-600 font-medium underline underline-offset-2 text-left"
      >
        ¿No te aparece la opción de desvío? →
      </button>

      {showHelp && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
          <p className="text-[11.5px] font-semibold text-amber-800">
            Algunos operadores bloquean el desvío a números internacionales. Llama a tu operador para activarlo:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { op: "Movistar", tel: "1004" },
              { op: "Vodafone", tel: "123" },
              { op: "Orange", tel: "1470" },
              { op: "Yoigo", tel: "622" },
            ].map(({ op, tel }) => (
              <a key={op} href={`tel:${tel}`}
                className="flex items-center justify-between bg-white border border-amber-200 rounded-lg px-3 py-2 hover:bg-amber-50 transition-colors">
                <span className="text-[11.5px] font-semibold text-ink">{op}</span>
                <span className="text-[11.5px] font-mono text-amber-700 font-semibold">{tel}</span>
              </a>
            ))}
          </div>
          <p className="text-[10.5px] text-amber-700">
            Diles que quieres activar el <strong>desvío incondicional de voz</strong> a un número internacional.
          </p>
        </div>
      )}

      {/* Pause */}
      <div className="border-t border-blue-200 pt-2.5">
        <p className="text-[11px] text-blue-600">
          <span className="font-semibold">Para pausar el bot:</span> ve al mismo sitio y desactiva el desvío de llamadas.
        </p>
      </div>
    </div>
  )
}

function TestCallCard({ bizId }: { bizId: string }) {
  const queryClient = useQueryClient()
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [status, setStatus] = useState<"idle" | "calling" | "needs_number" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [tab, setTab] = useState<"inbound" | "outbound">("inbound")

  const assignNumber = async () => {
    setAssigning(true)
    setStatus("idle")
    try {
      await api.post(`/api/businesses/${bizId}/assign-number`, {})
      queryClient.invalidateQueries({ queryKey: ["aiConfig", bizId] })
      // After assigning, retry call automatically if phone is set
      if (phone.trim()) await doCall()
      else setStatus("idle")
    } catch {
      setStatus("error")
      setErrorMsg("Error asignando número. Inténtalo de nuevo.")
    } finally {
      setAssigning(false)
    }
  }

  const doCall = async () => {
    setLoading(true)
    setStatus("idle")
    setErrorMsg("")
    try {
      const res = await api.post(`/api/businesses/${bizId}/test-call`, { phoneNumber: phone.trim() })
      if (res.data.success) { setStatus("calling"); setPhone("") }
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error
      if (msg === "needs_spanish_number") { setStatus("needs_number"); return }
      setErrorMsg(
        msg === "no_phone_number" ? "El bot aún no tiene número. Recarga la página." :
        msg === "no_assistant" ? "El asistente no está configurado todavía." :
        msg || "Error al iniciar la llamada"
      )
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const { data: config } = useQuery({
    queryKey: ["aiConfig", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/ai-config`).then(r => r.data),
    enabled: !!bizId,
  })
  const botPhone = (config?.ai_config?.vapi_phone_number as string) || null

  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(22,163,74,0.08)" }}>
          <PhoneCall className="w-4.5 h-4.5 text-green-600" style={{ width: "18px", height: "18px" }} />
        </div>
        <div className="flex-1">
          <div className="text-[13.5px] font-semibold text-ink">Prueba el bot ahora</div>
          <p className="text-[12px] text-muted mt-0.5">Habla con el bot para verificar que funciona.</p>
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1 bg-surface border border-border rounded-lg p-0.5 mb-4 w-fit">
        <button onClick={() => setTab("inbound")}
          className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${tab === "inbound" ? "bg-white text-ink shadow-xs border border-border" : "text-muted hover:text-dim"}`}>
          Llamo yo al bot
        </button>
        <button onClick={() => setTab("outbound")}
          className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${tab === "outbound" ? "bg-white text-ink shadow-xs border border-border" : "text-muted hover:text-dim"}`}>
          El bot me llama
        </button>
      </div>

      {tab === "inbound" ? (
        botPhone ? (
          <div className="space-y-3">
            <p className="text-[12.5px] text-muted">Llama a este número desde tu móvil — el bot responde inmediatamente:</p>
            <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3">
              <Phone className="w-4 h-4 text-accent shrink-0" />
              <span className="font-mono text-[15px] font-semibold text-ink flex-1">{botPhone}</span>
              <a href={`tel:${botPhone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-[12.5px] font-semibold hover:bg-green-700 transition-all shrink-0">
                <PhoneCall className="w-3.5 h-3.5" />
                Llamar
              </a>
            </div>
            <p className="text-[11px] text-muted">Número americano (+1) — funciona igual que un +34 para la prueba.</p>
          </div>
        ) : (
          <p className="text-[12.5px] text-muted">Activa el bot primero para obtener el número.</p>
        )
      ) : (
        status === "calling" ? (
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
            </span>
            <p className="text-[13px] font-semibold text-green-700">¡Llamando a tu móvil ahora!</p>
            <button onClick={() => setStatus("idle")} className="ml-auto text-[11.5px] text-green-600 hover:text-green-800 font-medium">Otra prueba</button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="flex-1 min-w-0 flex items-center bg-surface border border-border rounded-xl overflow-hidden focus-within:border-accent/50 transition-all">
                <span className="pl-4 text-[13.5px] text-muted font-mono shrink-0">+34</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setStatus("idle") }}
                  placeholder="655 707 471"
                  maxLength={9}
                  className="flex-1 min-w-0 bg-transparent px-2 py-2.5 text-[13.5px] text-ink outline-none"
                  onKeyDown={(e) => e.key === "Enter" && phone.replace(/\D/g,"").length === 9 && doCall()}
                />
                <span className="pr-3 text-[11px] text-muted shrink-0">{phone.replace(/\D/g,"").length}/9</span>
              </div>
              <button
                onClick={doCall}
                disabled={loading || phone.replace(/\D/g,"").length !== 9}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-600 text-white text-[13px] font-semibold hover:bg-green-700 disabled:opacity-40 transition-all shrink-0"
              >
                {loading ? <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : <PhoneCall className="w-4 h-4" />}
                {loading ? "..." : "Llamarme"}
              </button>
            </div>
            {phone.length > 0 && phone.replace(/\D/g,"").length !== 9 && (
              <p className="text-[11.5px] text-amber-600">Introduce los 9 dígitos sin el +34</p>
            )}
            {status === "error" && <p className="text-[12px] text-red-500">{errorMsg}</p>}
          </div>
        )
      )}
    </div>
  )
}

function EmbedCard({ bizId }: { bizId: string }) {
  const [copied, setCopied] = useState(false)
  const code = `<script src="https://allostudios.net/embed.js" data-business-id="${bizId}"></script>`

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(91,91,214,0.08)" }}>
          <MessageSquare className="text-accent" style={{ width: 18, height: 18 }} />
        </div>
        <div>
          <div className="text-[13.5px] font-semibold text-ink">Widget de chat para tu web</div>
          <p className="text-[12px] text-muted mt-0.5">Añade este código a tu web y tus clientes podrán chatear con el bot directamente.</p>
        </div>
      </div>
      <div className="bg-surface border border-border rounded-xl p-3 flex items-center gap-2">
        <code className="flex-1 text-[12px] text-ink font-mono truncate">{code}</code>
        <button onClick={copy} className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-[12px] font-semibold hover:bg-accent-dark transition-all">
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copiado" : "Copiar"}
        </button>
      </div>
      <p className="text-[11.5px] text-muted mt-2.5">Pega este código antes del <code className="bg-surface px-1 rounded">{`</body>`}</code> de tu página.</p>
    </div>
  )
}

function PhoneNumberCard({ bizId }: { bizId: string }) {
  const queryClient = useQueryClient()
  const [copiedNum, setCopiedNum] = useState<string | null>(null)
  const [repairing, setRepairing] = useState(false)
  const [repairResults, setRepairResults] = useState<string[] | null>(null)
  const [showAddInput, setShowAddInput] = useState(false)
  const [newPhone, setNewPhone] = useState("")
  const [saving, setSaving] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)

  const { data: config, refetch } = useQuery({
    queryKey: ["aiConfig", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/ai-config`).then((r) => r.data),
    enabled: !!bizId,
  })

  const plan: string = config?.plan || "STARTER"
  const limit = PHONE_LIMITS[plan] ?? 1
  const aiConfig = (config?.ai_config || {}) as Record<string, unknown>
  const primaryPhone = aiConfig.vapi_phone_number as string | undefined
  const routingNumber = aiConfig.vapi_routing_number as string | undefined
  const customPhones: string[] = (aiConfig.custom_phones as string[]) || []
  const hasCustom = customPhones.length > 0
  const canAddMore = customPhones.length < limit

  const copy = (num: string) => {
    navigator.clipboard.writeText(num)
    setCopiedNum(num)
    setTimeout(() => setCopiedNum(null), 2000)
  }

  const repair = async () => {
    setRepairing(true)
    setRepairResults(null)
    try {
      const { data } = await api.post(`/api/businesses/${bizId}/repair`, {})
      setRepairResults(data.results || [])
      await refetch()
      queryClient.invalidateQueries({ queryKey: ["aiConfig", bizId] })
    } catch {
      setRepairResults(["Error al reparar el asistente"])
    } finally {
      setRepairing(false)
    }
  }

  const addPhone = async () => {
    if (!newPhone.trim()) return
    setSaving(true)
    try {
      await api.patch(`/api/businesses/${bizId}/ai-config`, { add_phone: newPhone.trim() })
      await refetch()
      queryClient.invalidateQueries({ queryKey: ["aiConfig", bizId] })
      setNewPhone("")
      setShowAddInput(false)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { error?: string } } })?.response?.data?.error
      if (msg) alert(msg)
    } finally {
      setSaving(false)
    }
  }

  const removePhone = async (phone: string) => {
    try {
      await api.patch(`/api/businesses/${bizId}/ai-config`, { remove_phone: phone })
      await refetch()
      queryClient.invalidateQueries({ queryKey: ["aiConfig", bizId] })
    } catch {}
  }

  const setPrimary = async (phone: string) => {
    try {
      await api.patch(`/api/businesses/${bizId}/ai-config`, { set_primary_phone: phone })
      await refetch()
      queryClient.invalidateQueries({ queryKey: ["aiConfig", bizId] })
    } catch {}
  }

  // ── State: Has custom phone numbers ──
  if (hasCustom) {
    return (
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        {/* Primary number header */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(91,91,214,0.08)" }}>
            <Phone className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.08em] mb-0.5">
              Número principal del bot
            </div>
            <div className="text-[1.1rem] font-semibold text-ink tracking-[-0.02em]">{primaryPhone}</div>
            <p className="text-[12px] text-muted mt-0.5">
              Los clientes llaman a este número y el bot responde
            </p>
          </div>
          <button
            onClick={() => copy(primaryPhone!)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-[12.5px] font-medium text-dim hover:text-ink hover:bg-surface transition-all shrink-0"
          >
            {copiedNum === primaryPhone ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedNum === primaryPhone ? "Copiado" : "Copiar"}
          </button>
        </div>

        {/* Forwarding section */}
        {routingNumber ? (
          // Has routing number → show 1-tap USSD activation
          <ForwardingCard
            fromPhone={primaryPhone!}
            toPhone={routingNumber}
            copiedNum={copiedNum}
            onCopy={copy}
          />
        ) : (
          // No routing number → need to assign a Vapi number first
          <div className="mx-5 mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 flex items-start gap-3">
            <Phone className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-[12.5px] font-semibold text-red-700">Falta el número técnico de desvío</p>
              <p className="text-[11.5px] text-red-600 mt-0.5">
                Para que el bot atienda llamadas en tu número, necesitas asignar primero un número técnico automático.
              </p>
            </div>
            <button onClick={repair} disabled={repairing}
              className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500 text-white text-[12px] font-semibold hover:bg-red-600 disabled:opacity-50 transition-all">
              {repairing ? <span className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" /> : <Wrench className="w-3 h-3" />}
              {repairing ? "..." : "Asignar"}
            </button>
          </div>
        )}

        {/* Multiple numbers list (PROFESSIONAL) */}
        {customPhones.length > 1 && (
          <div className="border-t border-border mx-0 px-5 py-3 space-y-2">
            <p className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">Todos tus números</p>
            {customPhones.map((phone) => (
              <div key={phone} className="flex items-center gap-2.5">
                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${phone === primaryPhone ? "bg-accent" : "bg-border"}`} />
                <span className="text-[13px] text-ink flex-1 font-mono">{phone}</span>
                {phone !== primaryPhone && (
                  <button
                    onClick={() => setPrimary(phone)}
                    className="flex items-center gap-1 text-[11px] text-accent hover:text-accent-dark font-medium transition-colors"
                  >
                    <Star className="w-3 h-3" />
                    Principal
                  </button>
                )}
                {phone === primaryPhone && (
                  <span className="text-[11px] text-accent font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3" /> Principal
                  </span>
                )}
                <button onClick={() => removePhone(phone)} className="text-muted hover:text-red-500 transition-colors p-0.5">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add number / plan limit footer */}
        <div className="border-t border-border px-5 py-3 flex items-center justify-between gap-3">
          {canAddMore ? (
            showAddInput ? (
              <div className="flex gap-2 flex-1">
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+34 600 000 000"
                  className="flex-1 min-w-0 bg-surface border border-border rounded-lg px-3 py-1.5 text-[13px] text-ink outline-none focus:border-accent/50 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && addPhone()}
                  autoFocus
                />
                <button onClick={addPhone} disabled={saving || !newPhone.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-white text-[12.5px] font-semibold disabled:opacity-50 shrink-0">
                  {saving ? <span className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => { setShowAddInput(false); setNewPhone("") }}
                  className="px-2 py-1.5 rounded-lg border border-border text-muted hover:text-ink transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAddInput(true)}
                className="flex items-center gap-1.5 text-[12.5px] font-medium text-accent hover:text-accent-dark transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Añadir otro número ({customPhones.length}/{limit})
              </button>
            )
          ) : (
            <div className="flex items-center gap-1.5 text-[12px] text-muted">
              <Lock className="w-3 h-3" />
              Límite del plan alcanzado ({limit}/{limit})
              {plan === "STARTER" && (
                <a href="/billing" className="text-accent font-semibold hover:underline ml-1">
                  Ampliar plan →
                </a>
              )}
            </div>
          )}

          {customPhones.length === 1 && (
            showRemoveConfirm ? (
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11.5px] text-red-600 font-medium">¿Desactivar el bot?</span>
                <button
                  onClick={() => setShowRemoveConfirm(false)}
                  className="px-2.5 py-1 rounded-lg border border-border text-[11.5px] text-muted hover:text-ink transition-colors">
                  Cancelar
                </button>
                <a
                  href={`tel:${encodeURIComponent("##21#")}`}
                  onClick={() => { removePhone(customPhones[0]); setShowRemoveConfirm(false) }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500 text-white text-[11.5px] font-semibold hover:bg-red-600 transition-colors">
                  <PhoneOff className="w-3 h-3" />
                  Desactivar y quitar
                </a>
              </div>
            ) : (
              <button onClick={() => setShowRemoveConfirm(true)}
                className="flex items-center gap-1.5 text-[12px] text-muted hover:text-red-500 transition-colors shrink-0">
                <X className="w-3.5 h-3.5" />
                Quitar número
              </button>
            )
          )}
        </div>
      </div>
    )
  }

  // ── State: Only Vapi-assigned number (no custom) ──
  if (primaryPhone) {
    return (
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(91,91,214,0.08)" }}>
            <Phone className="w-5 h-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-muted uppercase tracking-[0.08em] mb-0.5">Número del bot</div>
            <div className="text-[1.1rem] font-semibold text-ink tracking-[-0.02em] font-mono">{primaryPhone}</div>
            <p className="text-[12px] text-muted mt-0.5">
              Comparte este número con tus clientes. El bot atiende las llamadas automáticamente.
            </p>
          </div>
          <button onClick={() => copy(primaryPhone)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-[12.5px] font-medium text-dim hover:text-ink hover:bg-surface transition-all shrink-0">
            {copiedNum === primaryPhone ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedNum === primaryPhone ? "Copiado" : "Copiar"}
          </button>
        </div>

        {/* Optional: add forwarding from existing business number */}
        <div className="border-t border-border px-5 py-4 space-y-2.5">
          <p className="text-[12px] font-semibold text-muted">¿Quieres desviar también tu número actual?</p>
          <p className="text-[11.5px] text-muted">
            Si ya tienes un número de negocio y quieres que el bot lo atienda también, añádelo aquí.
          </p>
          <div className="flex gap-2">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+34 600 000 000"
              className="flex-1 min-w-0 bg-surface border border-border rounded-lg px-3 py-2 text-[13px] text-ink outline-none focus:border-accent/50 transition-all"
              onKeyDown={(e) => e.key === "Enter" && addPhone()}
            />
            <button onClick={addPhone} disabled={saving || !newPhone.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-white text-[12.5px] font-semibold disabled:opacity-50 shrink-0 hover:bg-accent-dark transition-all">
              {saving
                ? <span className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
                : <><ArrowRight className="w-3.5 h-3.5" /> Añadir</>
              }
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── State: No phone at all ──
  return (
    <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(239,68,68,0.08)" }}>
          <Phone className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <div className="text-[13px] font-semibold text-ink">Sin número asignado</div>
          <div className="text-[12px] text-muted">Asigna un número para que el bot pueda atender llamadas</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <div className="border border-border rounded-xl p-4 space-y-2.5">
          <div>
            <p className="text-[13px] font-semibold text-ink">Número automático</p>
            <p className="text-[11.5px] text-muted mt-0.5">Te asignamos un número de nuestra red</p>
          </div>
          <button onClick={repair} disabled={repairing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-accent text-white text-[12.5px] font-semibold hover:bg-accent-dark transition-all disabled:opacity-50 w-full justify-center">
            <Wrench className="w-3.5 h-3.5" />
            {repairing ? "Asignando..." : "Asignar número"}
          </button>
        </div>

        <div className="border border-border rounded-xl p-4 space-y-2.5">
          <div>
            <p className="text-[13px] font-semibold text-ink">Mi número de negocio</p>
            <p className="text-[11.5px] text-muted mt-0.5">Conecta el número que ya usas</p>
          </div>
          <div className="flex gap-2">
            <input
              type="tel"
              value={newPhone}
              onChange={(e) => setNewPhone(e.target.value)}
              placeholder="+34 600 000 000"
              className="flex-1 min-w-0 bg-surface border border-border rounded-lg px-3 py-1.5 text-[13px] text-ink outline-none focus:border-accent/50 transition-all"
              onKeyDown={(e) => e.key === "Enter" && addPhone()}
            />
            <button onClick={addPhone} disabled={saving || !newPhone.trim()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-white text-[12.5px] font-semibold disabled:opacity-50 shrink-0 hover:bg-accent-dark transition-all">
              {saving
                ? <span className="w-3 h-3 rounded-full border border-white/30 border-t-white animate-spin" />
                : <><ArrowRight className="w-3.5 h-3.5" /> Vincular</>
              }
            </button>
          </div>
        </div>
      </div>

      {repairResults && (
        <div className="space-y-1">
          {repairResults.map((r, i) => (
            <p key={i} className="text-[12px] text-dim">{r}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AIConfigPage() {
  const { currentBusinessId: bizId } = useBusinessStore()
  const [activeTab, setActiveTab] = useState("prompt")
  const [saved, setSaved] = useState(false)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const [form, setForm] = useState(DEFAULT_FORM)

  const { data: bizStatus } = useQuery({
    queryKey: ["bizStatus", bizId],
    queryFn: () => api.get(`/api/businesses/${bizId}/status`).then(r => r.data),
    enabled: !!bizId,
  })

  const { data: config } = useQuery({
    queryKey: ["aiConfig", bizId],
    queryFn: () =>
      api.get(`/api/businesses/${bizId}/ai-config`).then((r) => r.data),
    enabled: !!bizId,
  })

  useEffect(() => {
    if (config?.ai_config) {
      const c = config.ai_config
      const settings = c.settings || {}
      setForm({
        agentName: settings.agentName || "Sofía",
        greetingMessage: c.first_message || "",
        systemPrompt: c.system_prompt || "",
        workingZones: settings.workingZones || "",
        voice: c.voice_id || VOICES[0].id,
        temperature: settings.temperature ?? 0.7,
        enableBooking: settings.enableBooking ?? true,
        enableLeadCapture: settings.enableLeadCapture ?? true,
        enableTransfer: settings.enableTransfer ?? false,
        transferNumber: settings.transferNumber || "",
        faqs: c.faqs || [],
      })
    }
  }, [config])

  const mutation = useMutation({
    mutationFn: (data: typeof form) => {
      const voice = VOICES.find((v) => v.id === data.voice) || VOICES[0]
      return api.patch(`/api/businesses/${bizId}/ai-config`, {
        system_prompt: data.systemPrompt,
        first_message: data.greetingMessage,
        voice_id: data.voice,
        voice_provider: voice.provider,
        faqs: data.faqs,
        settings: {
          agentName: data.agentName,
          temperature: data.temperature,
          enableBooking: data.enableBooking,
          enableLeadCapture: data.enableLeadCapture,
          enableTransfer: data.enableTransfer,
          transferNumber: data.transferNumber,
          workingZones: data.workingZones,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["aiConfig", bizId] })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const addFAQ = () => {
    setForm((f) => ({
      ...f,
      faqs: [...f.faqs, { id: Date.now().toString(), question: "", answer: "" }],
    }))
  }

  const updateFAQ = (id: string, field: "question" | "answer", value: string) => {
    setForm((f) => ({
      ...f,
      faqs: f.faqs.map((faq) => (faq.id === id ? { ...faq, [field]: value } : faq)),
    }))
  }

  const removeFAQ = (id: string) => {
    setForm((f) => ({ ...f, faqs: f.faqs.filter((faq) => faq.id !== id) }))
  }

  return (
    <div className="space-y-5 max-w-4xl">
      <div>
        <h1 className="text-[1.3rem] font-semibold text-ink tracking-[-0.025em]">Configuración de Marta</h1>
        <p className="text-muted text-[13px] mt-0.5">Personaliza cómo habla, cualifica leads y agenda visitas tu recepcionista IA</p>
      </div>

      {/* Provisioning status banner */}
      {bizId && <StatusBanner bizId={bizId} />}

      {/* Phone number card — only when bot has a number */}
      {bizId && (bizStatus?.has_assistant || bizStatus?.has_phone) && <PhoneNumberCard bizId={bizId} />}

      {/* Test call — only when bot has an assistant (ready or needs_number) */}
      {bizId && bizStatus?.has_assistant && <TestCallCard bizId={bizId} />}

      {/* Widget embed code */}
      {bizId && <EmbedCard bizId={bizId} />}

      {/* Tabs */}
      <div className="flex gap-0.5 bg-surface border border-border rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-ink shadow-xs border border-border"
                : "text-muted hover:text-dim"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "prompt" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-5"
        >
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold text-[14px] text-ink mb-4">Identidad del agente</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[12.5px] font-semibold text-ink mb-1.5 block">Nombre del agente</label>
                  <input
                    value={form.agentName}
                    onChange={(e) => setForm((f) => ({ ...f, agentName: e.target.value }))}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-[13.5px] text-ink outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
                    placeholder="Marta"
                  />
                </div>
                <div>
                  <label className="text-[12.5px] font-semibold text-ink mb-1.5 block">Mensaje de bienvenida</label>
                  <textarea
                    value={form.greetingMessage}
                    onChange={(e) => setForm((f) => ({ ...f, greetingMessage: e.target.value }))}
                    rows={3}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-[13.5px] text-ink outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                    placeholder="Hola, gracias por llamar. ¿En qué puedo ayudarte?"
                  />
                </div>
                <div>
                  <label className="text-[12.5px] font-semibold text-ink mb-1.5 block">Zonas de trabajo</label>
                  <textarea
                    value={form.workingZones}
                    onChange={(e) => setForm((f) => ({ ...f, workingZones: e.target.value }))}
                    rows={3}
                    className="w-full bg-surface border border-border rounded-xl px-4 py-2.5 text-[13.5px] text-ink outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all resize-none"
                    placeholder="Ej: Ruzafa, Extramurs, El Carmen, L'Eixample (Valencia)"
                  />
                  <p className="text-[11px] text-muted mt-1">
                    Usa{" "}
                    <code className="bg-surface px-1 rounded font-mono text-ink">{"{{working_zones}}"}</code>{" "}
                    en el prompt para insertar estas zonas automáticamente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-border p-5">
              <h2 className="font-semibold text-[14px] text-ink mb-4 flex items-center gap-2">
                <Volume2 className="w-3.5 h-3.5 text-accent" />
                Voz del agente
              </h2>
              <div className="space-y-2">
                {VOICES.map((voice) => (
                  <label key={voice.id} className="flex items-center gap-3 cursor-pointer py-1">
                    <input
                      type="radio"
                      name="voice"
                      value={voice.id}
                      checked={form.voice === voice.id}
                      onChange={() => setForm((f) => ({ ...f, voice: voice.id }))}
                      className="accent-accent flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-ink">{voice.label}</p>
                      <p className="text-[11.5px] text-muted">{voice.desc}</p>
                    </div>
                    <button
                      type="button"
                      disabled={playingVoice === voice.id}
                      onClick={(e) => { e.preventDefault(); playVoicePreview(voice, setPlayingVoice) }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11.5px] font-medium transition-all disabled:opacity-60"
                      style={{ background: "rgba(91,91,214,0.08)", color: "#5B5BD6" }}
                    >
                      {playingVoice === voice.id
                        ? <span className="w-2.5 h-2.5 rounded-full border border-accent border-t-transparent animate-spin inline-block" />
                        : <Play className="w-2.5 h-2.5" />
                      }
                      {playingVoice === voice.id ? "..." : "Preview"}
                    </button>
                  </label>
                ))}
                <p className="text-[11px] text-muted pt-1">Preview usa voces reales de ElevenLabs · Añade ELEVENLABS_API_KEY en Vercel para activarlo</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-5">
            <h2 className="font-semibold text-[14px] text-ink mb-1.5">System Prompt</h2>
            <p className="text-[11.5px] text-muted mb-3">
              Define el comportamiento y tono del agente. Variables disponibles:{" "}
              <code className="bg-surface px-1 rounded text-ink font-mono">{"{{business_name}}"}</code>{" "}
              <code className="bg-surface px-1 rounded text-ink font-mono">{"{{working_zones}}"}</code>
            </p>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
              rows={16}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-[13px] text-ink outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all resize-none font-mono"
              placeholder="Eres Marta, recepcionista virtual de {{business_name}}, una inmobiliaria..."
            />
          </div>
        </motion.div>
      )}

      {activeTab === "faqs" && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-semibold text-[14px] text-ink">Preguntas frecuentes</h2>
                <p className="text-[12px] text-muted mt-0.5">El agente usará estas respuestas automáticamente.</p>
              </div>
              <button
                onClick={addFAQ}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-white text-[12.5px] font-semibold hover:bg-accent-dark transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Añadir FAQ
              </button>
            </div>

            <div className="space-y-3">
              {form.faqs.map((faq, index) => (
                <div key={faq.id} className="border border-border rounded-xl p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-muted uppercase tracking-[0.08em]">FAQ #{index + 1}</span>
                    <button onClick={() => removeFAQ(faq.id)} className="text-muted hover:text-red-400 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <input
                    value={faq.question}
                    onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                    placeholder="¿Cuánto cuesta un corte de pelo?"
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-[13px] text-ink outline-none focus:border-accent/50 transition-all"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                    placeholder="El corte de pelo tiene un precio de 18€..."
                    rows={2}
                    className="w-full bg-surface border border-border rounded-lg px-3 py-2 text-[13px] text-ink outline-none focus:border-accent/50 transition-all resize-none"
                  />
                </div>
              ))}
              {form.faqs.length === 0 && (
                <div className="text-center py-10 text-muted">
                  <MessageSquare className="w-7 h-7 mx-auto mb-2 opacity-30" />
                  <p className="text-[13px]">No hay FAQs todavía. Añade la primera.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "advanced" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border p-5 space-y-5"
        >
          <h2 className="font-semibold text-[14px] text-ink">Configuración avanzada</h2>

          {[
            { key: "enableBooking", label: "Agendar visitas", description: "El agente agenda visitas a inmuebles en el calendario" },
            { key: "enableLeadCapture", label: "Captura de leads", description: "Registra nombre, teléfono y qué busca cada interesado" },
            { key: "enableTransfer", label: "Transferencia de llamadas", description: "Pasa la llamada a un agente humano si es necesario" },
          ].map((toggle) => (
            <div key={toggle.key} className="flex items-center justify-between py-3.5 border-b border-border last:border-0">
              <div>
                <p className="font-semibold text-[13.5px] text-ink">{toggle.label}</p>
                <p className="text-[12px] text-muted mt-0.5">{toggle.description}</p>
              </div>
              <button
                onClick={() => setForm((f) => ({ ...f, [toggle.key]: !f[toggle.key as keyof typeof f] }))}
                className={`relative w-10 h-5.5 rounded-full transition-colors ${
                  form[toggle.key as keyof typeof form] ? "bg-accent" : "bg-border"
                }`}
                style={{ height: "22px", width: "40px" }}
              >
                <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                  form[toggle.key as keyof typeof form] ? "translate-x-[20px]" : "translate-x-[3px]"
                }`} />
              </button>
            </div>
          ))}

          {form.enableTransfer && (
            <div>
              <label className="text-[12.5px] font-semibold text-ink mb-1.5 block">Número de transferencia</label>
              <input
                value={form.transferNumber}
                onChange={(e) => setForm((f) => ({ ...f, transferNumber: e.target.value }))}
                placeholder="+34 600 000 000"
                className="w-full max-w-xs bg-surface border border-border rounded-xl px-4 py-2.5 text-[13.5px] text-ink outline-none focus:border-accent/50 transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-[12.5px] font-semibold text-ink mb-1.5 block">
              Temperatura de respuesta ({form.temperature})
            </label>
            <input
              type="range" min="0" max="1" step="0.1"
              value={form.temperature}
              onChange={(e) => setForm((f) => ({ ...f, temperature: parseFloat(e.target.value) }))}
              className="w-full max-w-xs accent-accent"
            />
            <p className="text-[11.5px] text-muted mt-1">0 = muy consistente · 1 = más creativo</p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end">
        <button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending || !bizId}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13.5px] font-semibold transition-all disabled:opacity-40 ${
            saved ? "bg-green-500 text-white" : "bg-ink text-white hover:bg-zinc-700"
          }`}
        >
          {saved ? (
            <><CheckCircle2 className="w-4 h-4" />Guardado</>
          ) : (
            <><Save className="w-4 h-4" />{mutation.isPending ? "Guardando..." : "Guardar configuración"}</>
          )}
        </button>
      </div>
    </div>
  )
}
