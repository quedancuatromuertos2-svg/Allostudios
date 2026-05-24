"use client"

import { useState, useEffect } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { motion } from "framer-motion"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
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
} from "lucide-react"

const VOICES = [
  { id: "ErXwobaYiN019PkySvjV", label: "Lucía", desc: "Cálida y profesional · Mujer", lang: "es-ES", pitch: 1.15, provider: "11labs" },
  { id: "VR6AewLTigWG4xSOukaG", label: "Álvaro", desc: "Seguro y cercano · Hombre", lang: "es-ES", pitch: 0.85, provider: "11labs" },
  { id: "EXAVITQu4vr4xnSDxMaL", label: "Sofía", desc: "Amable y clara · Mujer", lang: "es-ES", pitch: 1.0, provider: "11labs" },
  { id: "onwK4e9ZLuTAKqWW03F9", label: "Daniel", desc: "Formal y confiable · Hombre", lang: "es-ES", pitch: 0.9, provider: "11labs" },
]

function playVoicePreview(voice: (typeof VOICES)[0]) {
  if (typeof window === "undefined" || !window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(
    "Hola, soy tu asistente de voz. ¿En qué puedo ayudarte hoy?"
  )
  utterance.lang = voice.lang
  utterance.pitch = voice.pitch
  utterance.rate = 0.95
  window.speechSynthesis.speak(utterance)
}

const TABS = [
  { id: "prompt", label: "Prompt & Voz", icon: Brain },
  { id: "faqs", label: "FAQs", icon: MessageSquare },
  { id: "advanced", label: "Avanzado", icon: Settings },
]

const DEFAULT_FORM = {
  agentName: "Sofía",
  greetingMessage: "",
  systemPrompt: "",
  voice: VOICES[0].id,
  temperature: 0.7,
  enableBooking: true,
  enableLeadCapture: true,
  enableTransfer: false,
  transferNumber: "",
  faqs: [] as { id: string; question: string; answer: string }[],
}

export default function AIConfigPage() {
  const { currentBusinessId: bizId } = useBusinessStore()
  const [activeTab, setActiveTab] = useState("prompt")
  const [saved, setSaved] = useState(false)
  const queryClient = useQueryClient()
  const [form, setForm] = useState(DEFAULT_FORM)

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
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuración del agente IA
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
          Personaliza cómo habla, qué dice y cómo responde tu agente
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "prompt" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="space-y-5">
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
                Identidad del agente
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Nombre del agente
                  </label>
                  <input
                    value={form.agentName}
                    onChange={(e) => setForm((f) => ({ ...f, agentName: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"
                    placeholder="Sofía"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                    Mensaje de bienvenida
                  </label>
                  <textarea
                    value={form.greetingMessage}
                    onChange={(e) => setForm((f) => ({ ...f, greetingMessage: e.target.value }))}
                    rows={3}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400 resize-none"
                    placeholder="Hola, gracias por llamar. ¿En qué puedo ayudarte?"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-violet-600" />
                Voz del agente
              </h2>
              <div className="space-y-2">
                {VOICES.map((voice) => (
                  <label
                    key={voice.id}
                    className="flex items-center gap-3 cursor-pointer py-1"
                  >
                    <input
                      type="radio"
                      name="voice"
                      value={voice.id}
                      checked={form.voice === voice.id}
                      onChange={() => setForm((f) => ({ ...f, voice: voice.id }))}
                      className="accent-violet-600 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{voice.label}</p>
                      <p className="text-xs text-gray-400">{voice.desc}</p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        playVoicePreview(voice)
                      }}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-900/60 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      Preview
                    </button>
                  </label>
                ))}
                <p className="text-xs text-gray-400 pt-1">
                  Preview usa la voz del navegador; la llamada real usará ElevenLabs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">System Prompt</h2>
            <p className="text-xs text-gray-500 mb-3">
              Define el comportamiento y tono del agente. Usa{" "}
              <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{"{{business_name}}"}</code>{" "}
              para referencias dinámicas.
            </p>
            <textarea
              value={form.systemPrompt}
              onChange={(e) => setForm((f) => ({ ...f, systemPrompt: e.target.value }))}
              rows={16}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-400 resize-none font-mono"
              placeholder="Eres Sofía, asistente telefónica de {{business_name}}..."
            />
          </div>
        </motion.div>
      )}

      {activeTab === "faqs" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Preguntas frecuentes
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  El agente usará estas respuestas automáticamente.
                </p>
              </div>
              <Button
                onClick={addFAQ}
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white gap-1"
              >
                <Plus className="w-4 h-4" />
                Añadir FAQ
              </Button>
            </div>

            <div className="space-y-4">
              {form.faqs.map((faq, index) => (
                <div
                  key={faq.id}
                  className="border border-gray-100 dark:border-gray-800 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400">FAQ #{index + 1}</span>
                    <button
                      onClick={() => removeFAQ(faq.id)}
                      className="text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    value={faq.question}
                    onChange={(e) => updateFAQ(faq.id, "question", e.target.value)}
                    placeholder="¿Cuánto cuesta un corte de pelo?"
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFAQ(faq.id, "answer", e.target.value)}
                    placeholder="El corte de pelo tiene un precio de 18€..."
                    rows={2}
                    className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none focus:border-violet-400 resize-none"
                  />
                </div>
              ))}
              {form.faqs.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No hay FAQs todavía. Añade la primera.</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "advanced" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 space-y-6"
        >
          <h2 className="font-semibold text-gray-900 dark:text-white">Configuración avanzada</h2>

          {[
            {
              key: "enableBooking",
              label: "Reservas automáticas",
              description: "El agente puede crear citas en el calendario",
            },
            {
              key: "enableLeadCapture",
              label: "Captura de leads",
              description: "Registra nombre y teléfono de clientes interesados",
            },
            {
              key: "enableTransfer",
              label: "Transferencia de llamadas",
              description: "Transfiere llamadas al equipo humano si es necesario",
            },
          ].map((toggle) => (
            <div
              key={toggle.key}
              className="flex items-center justify-between py-4 border-b border-gray-50 dark:border-gray-800 last:border-0"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white text-sm">{toggle.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{toggle.description}</p>
              </div>
              <button
                onClick={() =>
                  setForm((f) => ({ ...f, [toggle.key]: !f[toggle.key as keyof typeof f] }))
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  form[toggle.key as keyof typeof form]
                    ? "bg-violet-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                    form[toggle.key as keyof typeof form] ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          ))}

          {form.enableTransfer && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
                Número de transferencia
              </label>
              <input
                value={form.transferNumber}
                onChange={(e) => setForm((f) => ({ ...f, transferNumber: e.target.value }))}
                placeholder="+34 600 000 000"
                className="w-full max-w-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-violet-400"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 block">
              Temperatura de respuesta ({form.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={form.temperature}
              onChange={(e) =>
                setForm((f) => ({ ...f, temperature: parseFloat(e.target.value) }))
              }
              className="w-full max-w-xs accent-violet-600"
            />
            <p className="text-xs text-gray-400 mt-1">0 = muy consistente · 1 = más creativo</p>
          </div>
        </motion.div>
      )}

      <div className="flex justify-end">
        <Button
          onClick={() => mutation.mutate(form)}
          disabled={mutation.isPending || !bizId}
          className={`gap-2 transition-all ${
            saved
              ? "bg-emerald-600 hover:bg-emerald-600 text-white"
              : "bg-violet-600 hover:bg-violet-700 text-white"
          }`}
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Guardado
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {mutation.isPending ? "Guardando..." : "Guardar configuración"}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
