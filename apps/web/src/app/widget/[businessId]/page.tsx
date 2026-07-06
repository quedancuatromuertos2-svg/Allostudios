"use client"

import { useState, useEffect, useRef } from "react"
import { useParams } from "next/navigation"

interface Message { role: "user" | "assistant"; content: string }

export default function WidgetPage() {
  const { businessId } = useParams<{ businessId: string }>()
  const [config, setConfig] = useState<{ name: string; agentName: string; greeting: string } | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [started, setStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/widget/${businessId}`)
      .then(r => r.json())
      .then(d => {
        setConfig(d)
        setMessages([{ role: "assistant", content: d.greeting }])
      })
  }, [businessId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    try {
      const res = await fetch(`/api/widget/${businessId}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: "assistant", content: data.reply || "Lo siento, intenta de nuevo." }])
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Error de conexión. Intenta de nuevo." }])
    } finally {
      setLoading(false)
    }
  }

  if (!config) return null

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", height: "100vh", display: "flex", flexDirection: "column", background: "#fff", margin: 0 }}>
      {/* Header */}
      <div style={{ background: "#5B5BD6", padding: "14px 16px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
          💬
        </div>
        <div>
          <div style={{ color: "#fff", fontWeight: 600, fontSize: 14 }}>{config.agentName}</div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{config.name}</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80" }} />
          <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 12 }}>En línea</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 12px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%",
              padding: "10px 14px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? "#5B5BD6" : "#F4F4F8",
              color: msg.role === "user" ? "#fff" : "#1a1a1a",
              fontSize: 14,
              lineHeight: 1.5,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ padding: "10px 14px", borderRadius: "18px 18px 18px 4px", background: "#F4F4F8", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#999", animation: "pulse 1.4s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: "12px", borderTop: "1px solid #eee", display: "flex", gap: 8, flexShrink: 0 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Escribe tu mensaje..."
          style={{ flex: 1, padding: "10px 14px", borderRadius: 24, border: "1.5px solid #e5e5e5", outline: "none", fontSize: 14, background: "#fafafa" }}
          disabled={loading}
          autoFocus
        />
        <button
          onClick={send}
          disabled={!input.trim() || loading}
          style={{ width: 42, height: 42, borderRadius: "50%", background: input.trim() && !loading ? "#5B5BD6" : "#e5e5e5", border: "none", cursor: input.trim() && !loading ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke={input.trim() && !loading ? "#fff" : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke={input.trim() && !loading ? "#fff" : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div style={{ textAlign: "center", padding: "6px", fontSize: 11, color: "#bbb" }}>
        Powered by <strong style={{ color: "#5B5BD6" }}>AlloStudios</strong>
      </div>

      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { margin: 0; }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  )
}
