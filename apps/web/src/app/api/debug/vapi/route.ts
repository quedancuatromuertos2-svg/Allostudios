import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { listVapiAssistants, listVapiPhoneNumbers } from "@/lib/vapi"

export const runtime = "nodejs"

export async function GET() {
  const results: Record<string, unknown> = {}

  // 1. Env vars check
  results.env = {
    VAPI_API_KEY: process.env.VAPI_API_KEY ? `set (${process.env.VAPI_API_KEY.length} chars)` : "MISSING",
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "MISSING",
    STRIPE_STARTER_PRICE_ID: process.env.STRIPE_STARTER_PRICE_ID ? "set" : "MISSING",
    STRIPE_PROFESSIONAL_PRICE_ID: process.env.STRIPE_PROFESSIONAL_PRICE_ID ? "set" : "MISSING",
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET ? "set" : "MISSING",
  }

  // 2. Vapi assistants
  try {
    const assistants = await listVapiAssistants()
    results.vapi_assistants = Array.isArray(assistants)
      ? assistants.map((a: Record<string, unknown>) => ({
          id: a.id,
          name: a.name,
          serverUrl: (a.model as Record<string, unknown> | undefined)?.serverUrl || a.serverUrl || "NOT SET",
          serverMessages: a.serverMessages,
          hasTools: Array.isArray((a.model as Record<string, unknown> | undefined)?.tools) && ((a.model as Record<string, unknown>).tools as unknown[]).length > 0,
          firstMessage: a.firstMessage,
        }))
      : assistants
  } catch (e: unknown) {
    results.vapi_assistants_error = e instanceof Error ? e.message : String(e)
  }

  // 3. Vapi phone numbers
  try {
    const phones = await listVapiPhoneNumbers()
    results.vapi_phone_numbers = Array.isArray(phones)
      ? phones.map((p: Record<string, unknown>) => ({
          id: p.id,
          number: p.number,
          assistantId: p.assistantId,
          metadata: p.metadata,
        }))
      : phones
  } catch (e: unknown) {
    results.vapi_phone_numbers_error = e instanceof Error ? e.message : String(e)
  }

  // 4. Businesses from Supabase
  try {
    const { data: businesses } = await supabaseAdmin
      .from("businesses")
      .select("id, name, vapi_assistant_id, ai_config")
      .limit(10)

    results.businesses = (businesses || []).map((b) => ({
      id: b.id,
      name: b.name,
      vapi_assistant_id: b.vapi_assistant_id,
      phone_number: (b.ai_config as Record<string, unknown> | null)?.vapi_phone_number || "NOT ASSIGNED",
      phone_number_id: (b.ai_config as Record<string, unknown> | null)?.vapi_phone_number_id || "NOT ASSIGNED",
    }))
  } catch (e: unknown) {
    results.businesses_error = e instanceof Error ? e.message : String(e)
  }

  // 5. Recent calls from Supabase
  try {
    const { data: calls } = await supabaseAdmin
      .from("calls")
      .select("id, business_id, status, started_at, duration_seconds, caller_number")
      .order("started_at", { ascending: false })
      .limit(5)

    results.recent_calls = calls || []
  } catch (e: unknown) {
    results.recent_calls_error = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(results)
}
