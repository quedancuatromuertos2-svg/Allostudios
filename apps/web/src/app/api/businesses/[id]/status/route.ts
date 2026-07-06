import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const [{ data: business }, { data: job }] = await Promise.all([
    supabaseAdmin
      .from("businesses")
      .select("id, vapi_assistant_id, ai_config, name")
      .eq("id", params.id)
      .eq("owner_clerk_id", userId)
      .single(),
    supabaseAdmin
      .from("provisioning_jobs")
      .select("status, completed_steps, retry_count, error_message, updated_at")
      .eq("business_id", params.id)
      .maybeSingle(),
  ])

  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const cfg = (business.ai_config as Record<string, unknown>) || {}

  const hasAssistant = !!business.vapi_assistant_id
  const hasPhone = !!cfg.vapi_phone_number
  const isConnected = !!cfg.vapi_phone_number_id
  const hasSpanishNumber = !!cfg.twilio_sid

  // Compute real status
  let overallStatus: "pending" | "provisioning" | "needs_number" | "ready" | "error" = "pending"

  if (hasAssistant && hasPhone && isConnected) {
    overallStatus = "ready"
  } else if (job?.status === "running" || job?.status === "pending") {
    overallStatus = "provisioning"
  } else if (job?.status === "failed") {
    overallStatus = "error"
  } else if (hasAssistant && !isConnected) {
    overallStatus = "needs_number"
  }

  return NextResponse.json({
    status: overallStatus,
    has_assistant: hasAssistant,
    has_phone: hasPhone,
    is_connected: isConnected,
    has_spanish_number: hasSpanishNumber,
    phone_number: (cfg.vapi_phone_number as string) || null,
    job_status: job?.status || null,
    job_error: job?.error_message || null,
    retry_count: job?.retry_count || 0,
    completed_steps: job?.completed_steps || [],
  })
}
