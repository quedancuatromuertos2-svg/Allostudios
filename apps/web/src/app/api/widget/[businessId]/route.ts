import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(_req: Request, { params }: { params: { businessId: string } }) {
  const { data } = await supabaseAdmin
    .from("businesses")
    .select("name, ai_config, agent_name")
    .eq("id", params.businessId)
    .single()

  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const cfg = (data.ai_config as Record<string, unknown>) || {}

  return NextResponse.json({
    name: data.name,
    agentName: (cfg.settings as Record<string, unknown>)?.agentName || data.agent_name || "Asistente",
    greeting: (cfg.first_message as string) || `Hola, soy el asistente de ${data.name}. ¿En qué puedo ayudarte?`,
  })
}
