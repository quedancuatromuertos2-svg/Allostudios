"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { ArrowRight, CheckCircle, Star, Phone, Calendar, BarChart3, Users, Zap, Shield } from "lucide-react"

// ── Voice demo data ────────────────────────────────────────────────────────────

const DEMO_SCENARIOS = [
  {
    id: "barber",
    label: "Barbería",
    business: "Barbería El Maestro",
    messages: [
      { ai: true,  text: "¡Hola! Gracias por llamar a Barbería El Maestro. ¿En qué puedo ayudarte?" },
      { ai: false, text: "Quería pedir cita para un corte de pelo para mañana" },
      { ai: true,  text: "Claro. Tengo disponible mañana a las 10:00 o las 16:30. ¿Cuál prefieres?" },
      { ai: false, text: "Las 10 está bien, soy Juan García" },
      { ai: true,  text: "Perfecto Juan, cita confirmada para mañana a las 10:00. ¡Hasta mañana!" },
    ],
    result: "Juan García · Mañana 10:00 → Google Calendar",
  },
  {
    id: "dental",
    label: "Clínica Dental",
    business: "Clínica Dental Sonrisa",
    messages: [
      { ai: true,  text: "Clínica Dental Sonrisa, le atiende Laura. ¿En qué puedo ayudarle?" },
      { ai: false, text: "Tengo un dolor de muelas desde ayer, necesito cita urgente" },
      { ai: true,  text: "Entiendo, le damos preferencia. ¿Puede venir hoy a las 17:00?" },
      { ai: false, text: "Sí, perfecto. Soy Carmen Ruiz" },
      { ai: true,  text: "Anotado Carmen, cita urgente hoy a las 17:00. Le esperamos." },
    ],
    result: "Carmen Ruiz · Hoy 17:00 (urgente) → Google Calendar",
  },
  {
    id: "restaurant",
    label: "Restaurante",
    business: "Restaurante La Bodega",
    messages: [
      { ai: true,  text: "¡Buenas tardes! Restaurante La Bodega, ¿en qué le puedo ayudar?" },
      { ai: false, text: "Quería reservar mesa para 4 personas el sábado por la noche" },
      { ai: true,  text: "Con mucho gusto. ¿Prefiere las 20:30 o las 21:30?" },
      { ai: false, text: "Las 21:30 mejor, a nombre de López" },
      { ai: true,  text: "Reserva confirmada — 4 personas el sábado a las 21:30, a nombre de López. ¡Hasta el sábado!" },
    ],
    result: "4 personas · Sábado 21:30 · López → Google Calendar",
  },
] as const

function VoiceDemo() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(0)
  const [typing, setTyping] = useState(false)
  const [done, setDone] = useState(false)
  const [secs, setSecs] = useState(0)

  const reset = (idx: number) => {
    setActive(idx)
    setVisible(0)
    setTyping(false)
    setDone(false)
    setSecs(0)
  }

  useEffect(() => {
    const msgs = DEMO_SCENARIOS[active].messages
    const timeouts: ReturnType<typeof setTimeout>[] = []
    let t = 600

    msgs.forEach((msg, i) => {
      timeouts.push(setTimeout(() => setTyping(true), t))
      t += msg.ai ? 1300 : 850
      timeouts.push(setTimeout(() => { setTyping(false); setVisible(i + 1) }, t))
      t += 650
    })

    timeouts.push(setTimeout(() => { setTyping(false); setDone(true) }, t + 200))
    return () => timeouts.forEach(clearTimeout)
  }, [active])

  useEffect(() => {
    if (done) return
    const id = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [done, active])

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`

  const scenario = DEMO_SCENARIOS[active]
  const msgs = scenario.messages

  return (
    <div className="max-w-[540px] mx-auto">
      {/* Scenario tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {DEMO_SCENARIOS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => reset(i)}
            className={`px-4 py-[7px] rounded-full text-[13px] font-medium transition-all duration-200 ${
              active === i
                ? "bg-[#7c3aed] text-white shadow-sm"
                : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-[0_2px_24px_rgba(0,0,0,0.06)]">
        {/* Header */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-gray-100 bg-[#FAFAFA]">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[12px] font-medium text-gray-600">
            Llamada activa · {scenario.business}
          </span>
          <span className="ml-auto font-mono text-[11px] text-gray-400">{fmt(secs)}</span>
        </div>

        {/* Messages */}
        <div className="p-5 bg-white min-h-[300px] space-y-3.5">
          <AnimatePresence mode="popLayout">
            {msgs.slice(0, visible).map((m, i) => (
              <motion.div
                key={`${active}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28, ease }}
                className={`flex gap-2.5 ${!m.ai ? "flex-row-reverse" : ""}`}
              >
                <div className={`w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5 ${m.ai ? "bg-violet-100 text-[#7c3aed]" : "bg-gray-100 text-gray-500"}`}>
                  {m.ai ? "AI" : "·"}
                </div>
                <div className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-[1.5] ${
                  m.ai
                    ? "bg-gray-50 border border-gray-100 text-gray-700 rounded-tl-none"
                    : "bg-[#7c3aed] text-white rounded-tr-none"
                }`}>
                  {m.text}
                </div>
              </motion.div>
            ))}

            {typing && !done && (
              <motion.div
                key="typing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex gap-2.5"
              >
                <div className="w-[22px] h-[22px] rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold mt-0.5 bg-violet-100 text-[#7c3aed]">
                  AI
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-none px-3.5 py-3 flex items-center gap-1">
                  {[0, 0.18, 0.36].map((d, i) => (
                    <motion.span
                      key={i}
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.55, delay: d, repeat: Infinity }}
                      className="block w-1.5 h-1.5 rounded-full bg-gray-300"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease }}
                className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 rounded-xl p-3"
              >
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[11.5px] font-semibold text-emerald-700">Confirmado automáticamente</p>
                  <p className="text-[10.5px] text-emerald-600 truncate">{scenario.result}</p>
                </div>
                <button
                  onClick={() => reset(active)}
                  className="text-[11px] text-gray-400 hover:text-gray-600 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  ↻ Repetir
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

const ease = [0.22, 1, 0.36, 1] as const

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-64px" })
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

function SectionGlow({ side = "right", dark = false }: { side?: "left" | "right"; dark?: boolean }) {
  const bg = dark
    ? "radial-gradient(circle, rgba(124,58,237,0.22) 0%, transparent 63%)"
    : "radial-gradient(circle, rgba(167,139,250,0.13) 0%, transparent 63%)"
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      <motion.div
        animate={{ x: side === "right" ? [0, 20, 0] : [0, -20, 0], y: [0, -14, 0] }}
        transition={{ duration: side === "right" ? 28 : 32, repeat: Infinity, ease: "easeInOut" }}
        className={`absolute top-[-10%] w-[520px] h-[520px] rounded-full ${
          side === "right" ? "right-[-10%]" : "-left-[10%]"
        }`}
        style={{ background: bg }}
      />
    </div>
  )
}

function HeroAmbient() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
      <motion.div
        animate={{ x: [0, 22, 0], y: [0, -14, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 right-[-8%] w-[580px] h-[580px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.22) 0%, transparent 65%)" }}
      />
      <motion.div
        animate={{ x: [0, -16, 0], y: [0, 20, 0] }}
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute top-[15%] -left-32 w-[460px] h-[460px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(196,181,253,0.16) 0%, transparent 65%)" }}
      />
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut", delay: 10 }}
        className="absolute bottom-[5%] left-[35%] w-[380px] h-[380px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(124,58,237,0.09) 0%, transparent 65%)" }}
      />
    </div>
  )
}

const PLANS = [
  {
    n: "Starter",
    pm: "99",   om: "132",
    pa: "79",   oa: "105",
    c: "300 llamadas/mes",
    f: ["1 agente de voz", "Reservas automáticas", "Google Calendar", "Dashboard analítico", "Soporte email"],
    h: false, b: undefined as string | undefined,
  },
  {
    n: "Professional",
    pm: "199",  om: "265",
    pa: "159",  oa: "212",
    c: "1.000 llamadas/mes",
    f: ["3 agentes IA", "Multi-sede (hasta 3)", "Analytics avanzado", "Soporte prioritario", "Onboarding guiado"],
    h: true, b: "MÁS POPULAR",
  },
  {
    n: "Enterprise",
    pm: "799",  om: "1.065",
    pa: "639",  oa: "852",
    c: "Llamadas ilimitadas",
    f: ["Agentes ilimitados", "API completa + webhooks", "Marca blanca", "SLA 99.9% garantizado", "Account manager dedicado"],
    h: false, b: undefined,
  },
]

export default function HomePage() {
  const [annual, setAnnual] = useState(false)
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-b border-black/[0.05]">
        <div className="max-w-[1100px] mx-auto px-6 h-[58px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-[26px] h-[26px] rounded-full bg-[#7c3aed] flex items-center justify-center">
              <span className="text-white font-black italic text-[11px]" style={{ fontFamily: "Georgia, serif" }}>a</span>
            </div>
            <span className="font-semibold text-[15px] tracking-tight" style={{ fontFamily: "Georgia, serif" }}>
              <span className="text-[#7c3aed]">allo</span>Studios
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[["Producto", "#producto"], ["Precios", "#precios"], ["Sectores", "#sectores"]].map(([l, h]) => (
              <a key={l} href={h} className="text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors duration-200">{l}</a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <Link href="/login" className="hidden sm:block text-[13.5px] text-gray-500 hover:text-gray-900 transition-colors duration-200">Acceder</Link>
            <Link href="/register" className="text-[13px] font-medium bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-[18px] py-[7px] rounded-full transition-colors duration-200">
              Empezar gratis
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative pt-[126px] pb-20 px-6 text-center overflow-hidden">
        <HeroAmbient />
        <div className="relative max-w-[700px] mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
            className="inline-flex items-center gap-2 border border-gray-200/80 text-[12px] font-medium text-gray-500 px-4 py-[6px] rounded-full mb-9 tracking-wide"
          >
            <span className="w-[6px] h-[6px] rounded-full bg-emerald-500" />
            Más de 500 negocios confían en alloStudios
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.07, ease }}
            className="text-[3.8rem] sm:text-[5rem] lg:text-[6rem] font-bold text-gray-900 leading-[1.02] tracking-[-0.03em] mb-7"
          >
            La recepcionista<br />
            <span style={{ color: "#7c3aed" }}>que nunca descansa.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16, ease }}
            className="text-[1.1rem] text-gray-500 leading-[1.8] mb-9 max-w-[460px] mx-auto"
          >
            Responde llamadas, reserva citas y captura leads — las 24 horas, todos los días del año.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.23, ease }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5"
          >
            <Link href="/register" className="inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold text-[14px] px-8 py-3.5 rounded-xl transition-colors duration-200">
              Prueba gratis 7 días <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#como-funciona" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-gray-500 hover:text-gray-900 transition-colors duration-200 px-5 py-3.5">
              Ver cómo funciona
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.32, ease }}
            className="text-[11.5px] text-gray-400 tracking-wide"
          >
            Sin tarjeta de crédito · Sin contrato · Cancela cuando quieras
          </motion.p>
        </div>

        {/* Product screenshot */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.38, ease }}
          className="max-w-[1100px] mx-auto mt-20"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            className="rounded-[20px] overflow-hidden border border-black/[0.08] shadow-[0_2px_6px_rgba(0,0,0,0.03),0_24px_80px_rgba(0,0,0,0.09)]"
          >
            {/* Apple-style browser chrome */}
            <div className="flex items-center gap-2 px-5 py-[13px] bg-[#F2F2F7] border-b border-black/[0.06]">
              <div className="flex gap-[7px]">
                <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
                <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
                <div className="w-3 h-3 rounded-full bg-[#28C840]" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-white/80 border border-black/[0.06] rounded-lg px-4 py-[5px] text-[12px] text-gray-400 max-w-[220px] w-full text-center">
                  app.allostudios.net
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2.5 py-[5px] rounded-full">
                <span className="w-[5px] h-[5px] rounded-full bg-emerald-500 animate-pulse" />
                En vivo
              </div>
            </div>

            {/* App layout */}
            <div className="flex bg-white min-h-[370px]">
              {/* Sidebar */}
              <div className="w-[196px] border-r border-gray-100 bg-[#FAFAFA] p-4 flex-shrink-0 hidden md:block">
                <div className="flex items-center gap-2.5 mb-5 px-1">
                  <div className="w-7 h-7 rounded-lg bg-[#7c3aed] flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-white">BE</span>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[12px] font-semibold text-gray-800 leading-tight truncate">Barbería El Rey</div>
                    <div className="text-[10px] text-gray-400">Plan Starter</div>
                  </div>
                </div>
                <div className="space-y-[2px] text-[12px]">
                  {[
                    { l: "Dashboard",  active: true,  dot: false },
                    { l: "Llamadas",   active: false, dot: true  },
                    { l: "Calendario", active: false, dot: false },
                    { l: "Analytics",  active: false, dot: false },
                    { l: "Config. IA", active: false, dot: false },
                  ].map(({ l, active, dot }) => (
                    <div
                      key={l}
                      className={`flex items-center justify-between px-3 py-[7px] rounded-lg ${
                        active
                          ? "bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)] text-gray-900 font-medium"
                          : "text-gray-400"
                      }`}
                    >
                      {l}
                      {dot && <span className="w-[5px] h-[5px] rounded-full bg-[#7c3aed]" />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main */}
              <div className="flex-1 p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-[15px] font-semibold text-gray-900">Panel general</h2>
                    <p className="text-[11px] text-gray-400 mt-0.5">Últimas 24 horas · Actualizado hace 2 min</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7c3aed] bg-violet-50 border border-violet-100 px-3 py-[5px] rounded-lg font-medium">
                    <span className="w-[5px] h-[5px] rounded-full bg-[#7c3aed] animate-pulse" />
                    Agente activo
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {[
                    { v: "24",   l: "Llamadas hoy",    s: "+3 vs ayer",      c: "text-emerald-600" },
                    { v: "11",   l: "Citas reservadas", s: "↑ 22% esta sem.", c: "text-emerald-600" },
                    { v: "100%", l: "Tasa de atención", s: "0 perdidas",      c: "text-[#7c3aed]"   },
                    { v: "8",    l: "Leads capturados", s: "4 prioritarios",  c: "text-emerald-600" },
                  ].map((s) => (
                    <div key={s.l} className="bg-white rounded-xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                      <p className="text-[22px] font-bold text-gray-900 tracking-tight mb-0.5 leading-none">{s.v}</p>
                      <p className="text-[11px] text-gray-500 mb-1.5 leading-tight">{s.l}</p>
                      <p className={`text-[10px] font-semibold ${s.c}`}>{s.s}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-5 gap-3">
                  <div className="col-span-3 bg-white rounded-xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <p className="text-[11px] font-semibold text-gray-600 mb-3">Volumen · últimas 2 semanas</p>
                    <div className="flex items-end gap-[3px] h-[48px]">
                      {[4, 7, 5, 9, 6, 8, 12, 7, 10, 13, 8, 15, 11, 14].map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-t-[3px] ${i === 13 ? "bg-[#7c3aed]" : "bg-violet-200/50"}`}
                          style={{ height: `${(h / 15) * 100}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                    <p className="text-[11px] font-semibold text-gray-600 mb-2.5">Recientes</p>
                    <div className="space-y-2">
                      {[
                        { n: "Juan García",  t: "10:32", s: "Cita",     c: "text-emerald-600 bg-emerald-50" },
                        { n: "+34 612 ···",  t: "11:05", s: "En curso", c: "text-blue-600 bg-blue-50"      },
                        { n: "María L.",     t: "11:47", s: "Cita",     c: "text-emerald-600 bg-emerald-50" },
                        { n: "Carlos P.",    t: "12:03", s: "Info",     c: "text-gray-500 bg-gray-100"      },
                      ].map((r) => (
                        <div key={r.n} className="flex items-center justify-between">
                          <div>
                            <p className="text-[11px] font-medium text-gray-800 leading-tight">{r.n}</p>
                            <p className="text-[10px] text-gray-400">{r.t}</p>
                          </div>
                          <span className={`text-[9px] font-semibold px-2 py-[3px] rounded-full ${r.c}`}>{r.s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── TRUST BAR ──────────────────────────────────────────────── */}
      <div className="border-y border-gray-100 py-7 px-6">
        <div className="max-w-[860px] mx-auto flex flex-wrap items-center justify-center gap-10 md:gap-16">
          {[
            { v: "+500",   l: "negocios activos"    },
            { v: "94%",    l: "llamadas atendidas"  },
            { v: "24/7",   l: "disponibilidad"      },
            { v: "<2 seg", l: "tiempo de respuesta" },
          ].map((s) => (
            <div key={s.l} className="text-center">
              <div className="text-[1.5rem] font-bold text-gray-900 tracking-tight">{s.v}</div>
              <div className="text-[11.5px] text-gray-400 mt-[2px]">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ───────────────────────────────────────────── */}
      <section id="como-funciona" className="relative py-28 px-6">
        <SectionGlow side="left" />
        <div className="max-w-[900px] mx-auto">
          <Reveal className="text-center mb-20">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.16em] mb-4">CÓMO FUNCIONA</p>
            <h2 className="text-[2.75rem] font-bold text-gray-900 tracking-[-0.025em]">Simple como debe ser.</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-14">
            {[
              { n: "01", t: "Crea tu agente",        d: "Elige tu sector. El sistema genera el prompt y la voz perfecta para tu negocio en segundos." },
              { n: "02", t: "Conecta tu número",     d: "Vincula tu número de teléfono. Desde ese momento, todas las llamadas pasan por el agente IA." },
              { n: "03", t: "Listo. Funciona solo.", d: "Atiende, reserva citas y envía un resumen diario. Tú ves todo en el dashboard en tiempo real." },
            ].map(({ n, t, d }, i) => (
              <Reveal key={n} delay={i * 0.1}>
                <div className="text-[11px] font-bold text-gray-300 tracking-[0.14em] mb-4">{n}</div>
                <h3 className="text-[17px] font-semibold text-gray-900 mb-3">{t}</h3>
                <p className="text-[14px] text-gray-500 leading-[1.72]">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEFORE / AFTER ─────────────────────────────────────────── */}
      <section className="relative py-24 px-6 border-t border-gray-100">
        <SectionGlow side="right" />
        <div className="max-w-[900px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.16em] mb-4">EL CAMBIO</p>
            <h2 className="text-[2.75rem] font-bold text-gray-900 tracking-[-0.025em]">Lo que pasa cuando suena el teléfono.</h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            <Reveal>
              <div className="rounded-2xl border border-gray-200 p-8 h-full">
                <p className="text-[11px] font-bold text-red-400 uppercase tracking-[0.14em] mb-7">Antes</p>
                <div className="space-y-4">
                  {[
                    ["Son las 20:30. El teléfono suena.", false],
                    ["Estás con un cliente. No puedes atender.", false],
                    ["La llamada se pierde.", true],
                    ["El cliente llama a la competencia.", true],
                    ["Pierdes la reserva y el ingreso.", true],
                  ].map(([text, bad]) => (
                    <div key={text as string} className="flex items-start gap-3">
                      <div className={`w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center mt-[2px] ${bad ? "bg-red-100" : "bg-gray-100"}`}>
                        <span className={`text-[9px] font-bold ${bad ? "text-red-500" : "text-gray-400"}`}>{bad ? "✕" : "→"}</span>
                      </div>
                      <p className={`text-[14px] leading-relaxed ${bad ? "text-red-500" : "text-gray-500"}`}>{text as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-violet-200/60 bg-[#FAFAFE] p-8 h-full">
                <p className="text-[11px] font-bold text-[#7c3aed] uppercase tracking-[0.14em] mb-7">Con alloStudios</p>
                <div className="space-y-4">
                  {[
                    ["Son las 20:30. El teléfono suena.", false],
                    ["El agente contesta en menos de 2 segundos.", true],
                    ["Gestiona la llamada con naturalidad.", true],
                    ["La cita queda reservada en el calendario.", true],
                    ["Tú lo ves todo en el dashboard al despertar.", true],
                  ].map(([text, good]) => (
                    <div key={text as string} className="flex items-start gap-3">
                      <div className={`w-[18px] h-[18px] rounded-full flex-shrink-0 flex items-center justify-center mt-[2px] ${good ? "bg-violet-100" : "bg-gray-100"}`}>
                        <span className={`text-[9px] font-bold ${good ? "text-[#7c3aed]" : "text-gray-400"}`}>{good ? "✓" : "→"}</span>
                      </div>
                      <p className={`text-[14px] leading-relaxed ${good ? "text-gray-800 font-medium" : "text-gray-500"}`}>{text as string}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── VOICE DEMO ─────────────────────────────────────────────── */}
      <section className="relative py-28 px-6 border-t border-gray-100">
        <SectionGlow side="left" />
        <div className="max-w-[900px] mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[11px] font-semibold text-[#7c3aed] uppercase tracking-[0.16em] mb-4">EN ACCIÓN</p>
            <h2 className="text-[2.75rem] font-bold text-gray-900 tracking-[-0.025em] mb-4">
              Así suena tu agente IA.
            </h2>
            <p className="text-[14px] text-gray-500 max-w-[440px] mx-auto leading-[1.72]">
              Selecciona un sector y observa cómo gestiona una llamada real — en segundos, sin errores, 24/7.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <VoiceDemo />
          </Reveal>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section id="producto" className="relative py-24 px-6 bg-gray-950">
        <SectionGlow side="right" dark />
        <div className="max-w-[1000px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[11px] font-semibold text-violet-400 uppercase tracking-[0.16em] mb-4">FUNCIONES</p>
            <h2 className="text-[2.75rem] font-bold text-white tracking-[-0.025em]">
              Todo lo que necesitas.<br />Nada que no necesites.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-3.5">
            {[
              { Icon: Phone,     t: "Voz IA 24/7",          d: "Atiende cada llamada en segundos, los 365 días del año." },
              { Icon: Calendar,  t: "Reservas automáticas",  d: "Agenda citas en tiempo real durante la llamada." },
              { Icon: Users,     t: "Captura de leads",      d: "Registra datos y clasifica clientes automáticamente." },
              { Icon: BarChart3, t: "Analytics claro",       d: "Métricas reales para tomar mejores decisiones." },
              { Icon: Zap,       t: "Sin código",            d: "Configura todo desde un panel visual en minutos." },
              { Icon: Shield,    t: "Seguro y fiable",       d: "GDPR, cifrado y 99.9% uptime garantizado." },
            ].map(({ Icon, t, d }, i) => (
              <Reveal key={t} delay={i * 0.07}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="p-6 rounded-2xl border border-gray-800 hover:border-gray-700 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-300 bg-gray-900"
                >
                  <div className="w-9 h-9 bg-violet-900/50 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-4 h-4 text-violet-400" />
                  </div>
                  <h3 className="text-[14.5px] font-semibold text-white mb-1.5">{t}</h3>
                  <p className="text-[13.5px] text-gray-400 leading-[1.65]">{d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUTCOMES ───────────────────────────────────────────────── */}
      <section className="relative py-28 px-6 border-t border-gray-100">
        <SectionGlow side="left" />
        <div className="max-w-[900px] mx-auto">
          <Reveal className="text-center mb-16">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.16em] mb-4">RESULTADOS</p>
            <h2 className="text-[2.75rem] font-bold text-gray-900 tracking-[-0.025em]">Lo que cambia en 30 días.</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { v: "+40%",   c: "text-[#7c3aed]", t: "Más citas",         d: "Al atender el 100% de las llamadas, los negocios reportan un aumento del 40% en citas el primer mes." },
              { v: "0",      c: "text-gray-900",   t: "Llamadas perdidas", d: "El agente trabaja 365 días, festivos incluidos. Sin voicemail. Sin clientes que esperan." },
              { v: "5h/sem", c: "text-[#7c3aed]", t: "Tiempo recuperado", d: "Dejas de gestionar llamadas manualmente y recuperas horas para lo que realmente importa." },
            ].map(({ v, c, t, d }, i) => (
              <Reveal key={t} delay={i * 0.1}>
                <div className="pt-7 border-t-2 border-gray-100">
                  <div className={`text-[3.2rem] font-bold ${c} mb-3 tracking-tight leading-none`}>{v}</div>
                  <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{t}</h3>
                  <p className="text-[13.5px] text-gray-500 leading-[1.65]">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── NICHES ─────────────────────────────────────────────────── */}
      <section id="sectores" className="relative py-24 px-6 border-t border-gray-100">
        <SectionGlow side="right" />
        <div className="max-w-[1000px] mx-auto">
          <Reveal className="text-center mb-12">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.16em] mb-4">SECTORES</p>
            <h2 className="text-[2.75rem] font-bold text-gray-900 tracking-[-0.025em]">Hecho para tu negocio.</h2>
            <p className="text-[14px] text-gray-500 mt-4">Preconfigurado con el prompt y el tono adecuado para cada sector.</p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { n: "Barberías",         d: "Cortes y citas"        },
              { n: "Peluquerías",       d: "Tintes y tratamientos" },
              { n: "Clínicas Dentales", d: "Urgencias y reservas"  },
              { n: "Restaurantes",      d: "Reservas de mesa"      },
              { n: "Inmobiliarias",     d: "Leads y visitas"       },
              { n: "Gimnasios",         d: "Membresías y clases"   },
              { n: "Spas",              d: "Tratamientos"          },
              { n: "Veterinarias",      d: "Citas y urgencias"     },
            ].map(({ n, d }, i) => (
              <Reveal key={n} delay={i * 0.04}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="bg-white rounded-xl p-5 border border-gray-100 hover:border-gray-200 hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-[border-color,box-shadow] duration-200"
                >
                  <p className="text-[14px] font-semibold text-gray-800 mb-1">{n}</p>
                  <p className="text-[12px] text-gray-400">{d}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────── */}
      <section id="precios" className="relative py-28 px-6 border-t border-gray-100 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(196,181,253,0.12) 0%, transparent 65%)" }}
          />
        </div>
        <div className="relative max-w-[940px] mx-auto">
          <Reveal className="text-center mb-10">
            <div className="inline-flex items-center gap-2 text-[#7c3aed] bg-violet-50 text-[11px] font-semibold px-4 py-[6px] rounded-full border border-violet-100/80 mb-5">
              OFERTA DE LANZAMIENTO — 25% DESCUENTO
            </div>
            <h2 className="text-[2.75rem] font-bold text-gray-900 tracking-[-0.025em] mb-3">Precios que tienen sentido.</h2>
            <p className="text-[14px] text-gray-500 mb-8">7 días gratis. Sin tarjeta. Una sola cita recuperada ya paga el plan.</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => setAnnual(false)}
                className={`px-5 py-[7px] rounded-full text-[13px] font-medium transition-all duration-200 ${
                  !annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Mensual
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={`flex items-center gap-2 px-5 py-[7px] rounded-full text-[13px] font-medium transition-all duration-200 ${
                  annual ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Anual
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                  2 meses gratis
                </span>
              </button>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {PLANS.map(({ n, pm, pa, om, oa, c, f, h, b }, i) => {
              const price = annual ? pa : pm
              const original = annual ? oa : om
              return (
                <Reveal key={n} delay={i * 0.1}>
                  <div className={`relative rounded-2xl p-8 border h-full flex flex-col ${
                    h
                      ? "border-[#7c3aed]/25 shadow-[0_0_0_1px_rgba(124,58,237,0.1),0_8px_40px_rgba(124,58,237,0.08)] bg-white"
                      : "border-gray-200 bg-white"
                  }`}>
                    {b && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#7c3aed] text-white text-[10px] font-bold px-4 py-[5px] rounded-full tracking-wide whitespace-nowrap">
                        {b}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-gray-900 mb-0.5">{n}</p>
                      <p className="text-[12px] text-gray-400 mb-5">{c}</p>
                      <div className="mb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[13px] text-gray-400 line-through">{original}€</span>
                          <span className="text-[11px] font-semibold text-[#7c3aed] bg-violet-50 px-2 py-0.5 rounded-full">-25%</span>
                        </div>
                        <motion.p
                          key={price}
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.22, ease }}
                          className="text-[2.5rem] font-bold text-gray-900 tracking-tight leading-none"
                        >
                          {price}<span className="text-[15px] font-normal text-gray-400"> €/mes</span>
                        </motion.p>
                        {annual && (
                          <p className="text-[11px] text-gray-400 mt-1.5">Facturado anualmente</p>
                        )}
                      </div>
                      <ul className="space-y-2.5 mb-8">
                        {f.map((feat) => (
                          <li key={feat} className="flex items-center gap-2.5 text-[13.5px] text-gray-600">
                            <CheckCircle className="w-3.5 h-3.5 text-[#7c3aed] flex-shrink-0" />
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link
                      href="/register"
                      className={`block text-center text-[13.5px] font-semibold py-3 rounded-xl transition-colors duration-200 ${
                        h ? "bg-[#7c3aed] text-white hover:bg-[#6d28d9]" : "bg-gray-900 text-white hover:bg-gray-800"
                      }`}
                    >
                      {n === "Enterprise" ? "Contratar ahora" : "Empezar gratis 7 días"}
                    </Link>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────── */}
      <section className="relative py-24 px-6 bg-gray-950">
        <SectionGlow side="left" dark />
        <div className="max-w-[1000px] mx-auto">
          <Reveal className="text-center mb-14">
            <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-[0.16em] mb-4">CLIENTES</p>
            <h2 className="text-[2.75rem] font-bold text-white tracking-[-0.025em]">Lo que dicen los negocios.</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { n: "Carlos M.", r: "Barbería El Rey · Madrid",          m: "+35 citas/mes",    s: "Antes perdía 4 llamadas al día. Ahora el agente lo atiende todo y me manda el resumen cada mañana. Agenda siempre llena." },
              { n: "Laura S.", r: "Clínica Dental Sonrisa · Barcelona",  m: "+40% conversión",  s: "Los pacientes no notan que es IA. Gestiona urgencias con criterio real. 40% más de citas con el mismo equipo." },
              { n: "Miguel A.", r: "Gym PowerFit · Valencia",            m: "12h ahorradas/sem", s: "Gestiona las 3 sedes simultáneamente. Setup en 20 minutos. ROI positivo desde la primera semana." },
            ].map(({ n, r, m, s }, i) => (
              <Reveal key={n} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className="bg-gray-900 rounded-2xl border border-gray-800 p-6 hover:border-gray-700 hover:shadow-[0_8px_40px_rgba(0,0,0,0.35)] transition-[border-color,box-shadow] duration-300 h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="flex gap-[3px]">
                      {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-900/30 border border-emerald-800/50 px-2.5 py-[4px] rounded-full">{m}</span>
                  </div>
                  <p className="text-[13.5px] text-gray-300 leading-[1.7] mb-5 flex-1">"{s}"</p>
                  <div>
                    <p className="text-[13.5px] font-semibold text-white">{n}</p>
                    <p className="text-[11.5px] text-gray-500 mt-0.5">{r}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section className="relative py-32 px-6 bg-gray-950 text-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.28) 0%, transparent 65%)" }}
          />
        </div>
        <div className="relative max-w-[560px] mx-auto">
          <Reveal>
            <h2 className="text-[3.25rem] font-bold text-white tracking-[-0.03em] mb-5 leading-[1.08]">
              Tu negocio merece<br />
              <span style={{ color: "#a78bfa" }}>nunca perder un cliente.</span>
            </h2>
            <p className="text-[16px] text-gray-400 mb-9 leading-[1.75]">
              Únete a más de 500 negocios que ya trabajan con recepcionista IA.<br />Empieza en 10 minutos.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-[14px] px-10 py-4 rounded-xl transition-colors duration-200"
            >
              Crear mi cuenta gratis <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-[11.5px] text-gray-500 mt-5">Sin tarjeta · Sin contrato · 7 días gratis · Soporte en español</p>
          </Reveal>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-8 px-6 bg-gray-950">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-[22px] h-[22px] rounded-full bg-[#7c3aed] flex items-center justify-center">
              <span className="text-white font-black italic text-[10px]" style={{ fontFamily: "Georgia, serif" }}>a</span>
            </div>
            <span className="font-semibold text-[13.5px] text-white" style={{ fontFamily: "Georgia, serif" }}>
              <span className="text-violet-400">allo</span>Studios
            </span>
          </Link>
          <p className="text-[11.5px] text-gray-500">© 2026 alloStudios. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link href="/login"    className="text-[11.5px] text-gray-500 hover:text-gray-300 transition-colors">Acceder</Link>
            <Link href="/register" className="text-[11.5px] text-gray-500 hover:text-gray-300 transition-colors">Registro</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}
