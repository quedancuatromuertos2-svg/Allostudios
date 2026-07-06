import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { updateVapiAssistant, vapiRequest } from "@/lib/vapi"

const PHONE_LIMITS: Record<string, number> = {
  STARTER: 1,
  PROFESSIONAL: 3,
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id, ai_config")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { data: sub } = await supabaseAdmin
    .from("subscriptions")
    .select("plan")
    .eq("business_id", params.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  let vapiConfig = null
  if (business.vapi_assistant_id) {
    try {
      vapiConfig = await vapiRequest(`/assistant/${business.vapi_assistant_id}`)
    } catch {}
  }

  // Auto-repair: fix invalid vapi_routing_number (same as custom phone or missing when there's a Vapi phone)
  let aiConfig = (business.ai_config as Record<string, unknown>) || {}
  const customPhones = (aiConfig.custom_phones as string[]) || []
  const routingNum = aiConfig.vapi_routing_number as string | undefined
  const vapiPhoneId = aiConfig.vapi_phone_number_id as string | undefined
  const invalidRouting = !routingNum || customPhones.includes(routingNum)

  if (customPhones.length > 0 && invalidRouting) {
    try {
      let realVapiNumber: string | null = null

      // Try by phone_number_id first
      if (vapiPhoneId) {
        const vapiPhone = await vapiRequest(`/phone-number/${vapiPhoneId}`)
        if (vapiPhone?.number && !customPhones.includes(vapiPhone.number)) {
          realVapiNumber = vapiPhone.number
        }
      }

      // If not found, search all Vapi numbers linked to this assistant
      if (!realVapiNumber && business.vapi_assistant_id) {
        const allPhones = await vapiRequest(`/phone-number?limit=20`)
        if (Array.isArray(allPhones)) {
          const linked = allPhones.find(
            (p: Record<string, unknown>) =>
              p.assistantId === business.vapi_assistant_id &&
              !customPhones.includes(p.number as string)
          )
          if (linked?.number) realVapiNumber = linked.number as string
        }
      }

      if (realVapiNumber) {
        aiConfig = { ...aiConfig, vapi_routing_number: realVapiNumber }
        await supabaseAdmin
          .from("businesses")
          .update({ ai_config: aiConfig })
          .eq("id", params.id)
      }
    } catch {}
  }

  return NextResponse.json({
    ai_config: aiConfig,
    vapi: vapiConfig,
    plan: sub?.plan || "STARTER",
  })
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("id, vapi_assistant_id, ai_config")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const body = await req.json()
  const {
    system_prompt, voice_id, voice_provider, first_message, faqs, settings,
    add_phone, remove_phone, set_primary_phone,
  } = body

  const existingConfig = (business.ai_config as Record<string, unknown>) || {}
  const ai_config: Record<string, unknown> = { ...existingConfig }

  // Standard ai-config fields
  if (system_prompt !== undefined) ai_config.system_prompt = system_prompt
  if (voice_id !== undefined) ai_config.voice_id = voice_id
  if (voice_provider !== undefined) ai_config.voice_provider = voice_provider
  if (first_message !== undefined) ai_config.first_message = first_message
  if (faqs !== undefined) ai_config.faqs = faqs
  if (settings !== undefined) ai_config.settings = settings

  // Phone number management
  if (add_phone !== undefined || remove_phone !== undefined || set_primary_phone !== undefined) {
    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("plan")
      .eq("business_id", params.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    const plan = sub?.plan || "STARTER"
    const limit = PHONE_LIMITS[plan] ?? 1
    const currentCustom: string[] = (existingConfig.custom_phones as string[]) || []

    if (add_phone) {
      if (currentCustom.length >= limit) {
        return NextResponse.json(
          { error: `Tu plan ${plan} permite máximo ${limit} número${limit > 1 ? "s" : ""}` },
          { status: 400 }
        )
      }
      if (!currentCustom.includes(add_phone)) {
        const newPhones = [...currentCustom, add_phone]
        ai_config.custom_phones = newPhones
        // On first custom phone: promote custom as primary and save Vapi number as routing ONLY
        // if there is a real Vapi-assigned number (has vapi_phone_number_id) that differs from the custom phone
        if (currentCustom.length === 0) {
          const vapiNumId = existingConfig.vapi_phone_number_id as string | undefined
          const vapiNum = existingConfig.vapi_phone_number as string | undefined
          const existingRouting = existingConfig.vapi_routing_number as string | undefined
          // Only use vapiNum as routing if it's a real Vapi-assigned number (has an ID) and is different
          if (vapiNumId && vapiNum && vapiNum !== add_phone) {
            ai_config.vapi_routing_number = vapiNum
          } else if (existingRouting && existingRouting !== add_phone) {
            // Keep existing routing number if already set and valid
            ai_config.vapi_routing_number = existingRouting
          } else {
            // Clear invalid routing (same as custom phone)
            ai_config.vapi_routing_number = null
          }
          ai_config.vapi_phone_number = add_phone
        }
      }
    }

    if (remove_phone) {
      const newPhones = currentCustom.filter((p) => p !== remove_phone)
      ai_config.custom_phones = newPhones
      // If removed number was the primary, restore
      if (existingConfig.vapi_phone_number === remove_phone) {
        if (newPhones.length > 0) {
          ai_config.vapi_phone_number = newPhones[0]
        } else {
          // No custom phones left → restore Vapi routing number as primary
          ai_config.vapi_phone_number = (existingConfig.vapi_routing_number as string) || null
          ai_config.vapi_routing_number = null
        }
      }
    }

    if (set_primary_phone) {
      if (currentCustom.includes(set_primary_phone)) {
        ai_config.vapi_phone_number = set_primary_phone
      }
    }
  }

  const { error } = await supabaseAdmin
    .from("businesses")
    .update({ ai_config })
    .eq("id", params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  if (business.vapi_assistant_id && (system_prompt !== undefined || first_message !== undefined || voice_id !== undefined)) {
    try {
      const workingZones = (settings as Record<string, unknown>)?.workingZones as string | undefined
      const resolvedPrompt = system_prompt
        ? system_prompt.replace(/\{\{working_zones\}\}/g, workingZones || "")
        : undefined
      await updateVapiAssistant(business.vapi_assistant_id, {
        systemPrompt: resolvedPrompt || undefined,
        greetingMessage: first_message || undefined,
        voice: voice_id || undefined,
      })
    } catch (e) {
      console.error("Vapi assistant update failed:", e)
    }
  }

  return NextResponse.json({ success: true })
}
