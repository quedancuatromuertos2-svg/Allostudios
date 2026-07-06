import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { createVapiAssistant, createVapiPhoneNumber } from "@/lib/vapi"
import { buildSystemPrompt } from "@/lib/agent-prompts"

const NICHE_PROMPTS: Record<string, { agentName: string; prompt: string; greeting: string }> = {
  BARBER_SHOP: {
    agentName: "Carlos",
    prompt: "Eres Carlos, asistente telefónico de una barbería moderna. Tono amigable, directo y masculino. Gestiona reservas preguntando qué servicio desea el cliente y qué barbero prefiere. Sé breve: máximo 2 frases por respuesta.",
    greeting: "¡Hola! Gracias por llamar. ¿En qué te puedo ayudar?",
  },
  HAIR_SALON: {
    agentName: "Sofía",
    prompt: "Eres Sofía, asistente de un salón de belleza premium. Tono elegante y cálido. Gestiona citas, explica tratamientos y recomienda servicios. Máximo 2 frases por respuesta.",
    greeting: "Buenos días, gracias por llamar. ¿En qué puedo ayudarte?",
  },
  RESTAURANT: {
    agentName: "Marcos",
    prompt: "Eres Marcos, asistente de un restaurante. Gestiona reservas de mesa de forma rápida. Pregunta número de personas, fecha y hora. Máximo 2 frases por respuesta.",
    greeting: "¡Buenas! ¿En qué te puedo ayudar?",
  },
  DENTAL_CLINIC: {
    agentName: "Laura",
    prompt: "Eres Laura, recepcionista virtual de una clínica dental. Tono profesional y calmado. Gestiona citas y recoge síntomas básicos. Prioriza urgencias. Máximo 2 frases.",
    greeting: "Clínica dental, le atiende Laura. ¿En qué puedo ayudarle?",
  },
  REAL_ESTATE: {
    agentName: "Marta",
    prompt: "Eres Marta, recepcionista virtual inmobiliaria. Cualifica leads de forma natural: operación (compra/alquiler), zona, presupuesto y habitaciones. Agenda visitas. Tono profesional y cálido, una pregunta cada vez. Máximo 2 frases. Si te preguntan si eres una persona o una IA, responde con sinceridad que eres un asistente virtual.",
    greeting: "Hola, le atiende Marta, asistente virtual. Le informo de que esta llamada puede grabarse. ¿En qué puedo ayudarle?",
  },
  GYM: {
    agentName: "Diego",
    prompt: "Eres Diego, asistente de un gimnasio. Energético y motivador. Gestiona inscripciones, horarios de clases y entrenamiento personal. Máximo 2 frases.",
    greeting: "¡Hola! Soy Diego. ¿En qué te puedo ayudar?",
  },
  DEFAULT: {
    agentName: "Sofía",
    prompt: "Eres Sofía, asistente telefónica profesional. Gestiona llamadas, responde preguntas y agenda citas de forma eficiente. Tono amigable. Máximo 2 frases.",
    greeting: "Hola, gracias por llamar. ¿En qué puedo ayudarte?",
  },
}

const PLAN_BUSINESS_LIMITS: Record<string, number> = {
  STARTER: 1,
  PROFESSIONAL: 3,
  PRO: 3,
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, niche, phone, address, description } = body

  // Check how many businesses user already has
  const { data: existingBiz, count: bizCount } = await supabaseAdmin
    .from("businesses")
    .select("id", { count: "exact" })
    .eq("owner_clerk_id", userId)

  const currentCount = bizCount ?? 0

  // Determine plan limit from most recent subscription
  let planLimit = 1
  if (existingBiz && existingBiz.length > 0) {
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("plan")
      .eq("business_id", existingBiz[0].id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (sub?.plan) {
      planLimit = PLAN_BUSINESS_LIMITS[sub.plan.toUpperCase()] ?? 1
    }
  }

  if (currentCount >= planLimit) {
    const limitMsg = planLimit === 1
      ? "Tu plan solo permite 1 negocio. Actualiza a Professional para añadir más."
      : `Tu plan permite máximo ${planLimit} negocios. Actualiza a Professional para más.`
    return NextResponse.json({ error: limitMsg }, { status: 400 })
  }

  // Upsert user record
  const { data: existing } = await supabaseAdmin
    .from("users")
    .select("id")
    .eq("clerk_id", userId)
    .single()

  if (!existing) {
    await supabaseAdmin.from("users").insert({ clerk_id: userId, onboarding_completed: false })
  }

  // Build niche-specific prompt.
  // REAL_ESTATE uses the full pro recepcionista prompt (qualifies leads + books visits).
  const nicheConfig = NICHE_PROMPTS[niche] || NICHE_PROMPTS.DEFAULT
  const basePrompt = niche === "REAL_ESTATE"
    ? buildSystemPrompt(name, nicheConfig.agentName)
    : nicheConfig.prompt
  const systemPrompt = `${basePrompt}\n\nNombre del negocio: ${name}${address ? `\nDirección: ${address}` : ""}${phone ? `\nTeléfono: ${phone}` : ""}${description ? `\nDescripción: ${description}` : ""}`

  // Create Vapi assistant
  let vapiAssistantId: string | null = null
  try {
    const assistant = await createVapiAssistant({
      name: `${name} — ${nicheConfig.agentName}`,
      systemPrompt,
      greetingMessage: nicheConfig.greeting,
    })
    vapiAssistantId = assistant.id
  } catch (e) {
    console.error("Vapi assistant creation failed — provisioner will retry:", e)
  }

  // Create business
  const { data: business, error } = await supabaseAdmin
    .from("businesses")
    .insert({
      owner_clerk_id: userId,
      name,
      niche,
      phone: phone || null,
      address: address || null,
      description: description || null,
      vapi_assistant_id: vapiAssistantId,
      agent_name: nicheConfig.agentName,
      greeting_message: nicheConfig.greeting,
      system_prompt: systemPrompt,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Buy Vapi native number and link to assistant
  let vapiPhoneNumberId: string | null = null
  let vapiPhoneNumber: string | null = null
  if (vapiAssistantId) {
    for (const areaCode of ["350", "341", "502", "212"]) {
      try {
        const { vapiRequest } = await import("@/lib/vapi")
        const phoneResult = await vapiRequest("/phone-number", {
          method: "POST",
          body: JSON.stringify({
            provider: "vapi",
            numberDesiredAreaCode: areaCode,
            assistantId: vapiAssistantId,
            name: `biz-${business.id.slice(0, 8)}`,
          }),
        })
        if (phoneResult?.id) {
          vapiPhoneNumberId = phoneResult.id
          vapiPhoneNumber = phoneResult.number
          break
        }
      } catch { continue }
    }
  }

  // Store ai_config
  const aiConfig = {
    system_prompt: systemPrompt,
    first_message: nicheConfig.greeting,
    voice_id: "ErXwobaYiN019PkySvjV",
    voice_provider: "11labs",
    faqs: [],
    settings: {
      agentName: nicheConfig.agentName,
      temperature: 0.7,
      enableBooking: true,
      enableLeadCapture: true,
      enableTransfer: false,
      transferNumber: "",
    },
    vapi_phone_number_id: vapiPhoneNumberId,
    vapi_phone_number: vapiPhoneNumber,
  }

  await supabaseAdmin.from("businesses").update({ ai_config: aiConfig }).eq("id", business.id)

  // Create default services by niche
  const defaultServices: Record<string, Array<{ name: string; duration: number; price: number }>> = {
    BARBER_SHOP: [
      { name: "Corte de pelo", duration: 30, price: 18 },
      { name: "Arreglo de barba", duration: 20, price: 12 },
      { name: "Corte + Barba", duration: 45, price: 25 },
      { name: "Degradado", duration: 30, price: 20 },
    ],
    HAIR_SALON: [
      { name: "Corte y peinado", duration: 60, price: 35 },
      { name: "Tinte completo", duration: 120, price: 65 },
      { name: "Mechas", duration: 150, price: 85 },
    ],
    DENTAL_CLINIC: [
      { name: "Consulta inicial", duration: 30, price: 0 },
      { name: "Limpieza dental", duration: 45, price: 60 },
      { name: "Empaste", duration: 60, price: 80 },
    ],
    RESTAURANT: [
      { name: "Mesa para 2", duration: 90, price: 0 },
      { name: "Mesa para 4", duration: 90, price: 0 },
    ],
    GYM: [
      { name: "Membresía mensual", duration: 30, price: 35 },
      { name: "Clase grupal", duration: 60, price: 10 },
      { name: "Entrenamiento personal", duration: 60, price: 45 },
    ],
    REAL_ESTATE: [
      { name: "Visita a inmueble", duration: 30, price: 0 },
      { name: "Valoración de inmueble", duration: 45, price: 0 },
      { name: "Asesoramiento personalizado", duration: 30, price: 0 },
    ],
    DEFAULT: [{ name: "Visita a inmueble", duration: 30, price: 0 }],
  }

  const services = defaultServices[niche] || defaultServices.DEFAULT
  await supabaseAdmin.from("services").insert(
    services.map((s) => ({ ...s, business_id: business.id, currency: "EUR" }))
  ).then(({ error: e }) => { if (e) console.error("Services insert failed:", e.message) })

  await supabaseAdmin.from("users").update({ onboarding_completed: true }).eq("clerk_id", userId)

  return NextResponse.json({ ...business, ai_config: aiConfig }, { status: 201 })
}
