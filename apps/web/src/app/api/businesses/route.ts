import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { createVapiAssistant } from "@/lib/vapi"

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
    agentName: "Alex",
    prompt: "Eres Alex, agente virtual inmobiliario. Califica leads: pregunta presupuesto, zona y tipo de operación. Agenda visitas. Tono profesional. Máximo 2 frases.",
    greeting: "Inmobiliaria, le atiende Alex. ¿En qué puedo ayudarle?",
  },
  GYM: {
    agentName: "Diego",
    prompt: "Eres Diego, asistente de un gimnasio. Energético y motivador. Gestiona inscripciones, horarios de clases y entrenamiento personal. Máximo 2 frases.",
    greeting: "¡Hola! Gym, soy Diego. ¿En qué te puedo ayudar?",
  },
  DEFAULT: {
    agentName: "Sofía",
    prompt: "Eres Sofía, asistente telefónica profesional. Gestiona llamadas, responde preguntas y agenda citas de forma eficiente. Tono amigable. Máximo 2 frases.",
    greeting: "Hola, gracias por llamar. ¿En qué puedo ayudarte?",
  },
}

// GET /api/businesses — list user's businesses
export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("businesses")
    .select("*, subscription:subscriptions(*)")
    .eq("owner_clerk_id", userId)
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ data })
}

// POST /api/businesses — create business
export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, niche, phone, email, address, city } = body

  // Generate slug
  const slug = name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").substring(0, 50)

  // Create Vapi assistant
  const nicheConfig = NICHE_PROMPTS[niche] || NICHE_PROMPTS.DEFAULT
  const systemPrompt = `${nicheConfig.prompt}\n\nNombre del negocio: ${name}${address ? `\nDirección: ${address}` : ""}${phone ? `\nTeléfono: ${phone}` : ""}`

  let vapiAssistantId = null
  try {
    const assistant = await createVapiAssistant({
      name: `${name} — ${nicheConfig.agentName}`,
      systemPrompt,
      greetingMessage: nicheConfig.greeting.replace("Clínica dental", name).replace("Inmobiliaria", name).replace("Gym", name),
    })
    vapiAssistantId = assistant.id
  } catch (e) {
    console.error("Vapi assistant creation failed:", e)
  }

  // Create business in Supabase
  const { data: business, error } = await supabaseAdmin
    .from("businesses")
    .insert({
      name,
      slug,
      niche,
      phone,
      email,
      address,
      city,
      owner_clerk_id: userId,
      vapi_assistant_id: vapiAssistantId,
      agent_name: nicheConfig.agentName,
      greeting_message: nicheConfig.greeting,
      system_prompt: systemPrompt,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Create trial subscription
  await supabaseAdmin.from("subscriptions").insert({
    business_id: business.id,
    plan: "STARTER",
    status: "TRIALING",
    calls_limit: 50,
    minutes_limit: 150,
    trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  })

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
    DEFAULT: [
      { name: "Servicio estándar", duration: 60, price: 50 },
    ],
  }

  const services = defaultServices[niche] || defaultServices.DEFAULT
  await supabaseAdmin.from("services").insert(
    services.map((s) => ({ ...s, business_id: business.id, currency: "EUR" }))
  )

  return NextResponse.json(business, { status: 201 })
}
