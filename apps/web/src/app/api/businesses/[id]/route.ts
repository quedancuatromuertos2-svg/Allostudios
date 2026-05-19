import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from("businesses")
    .select("*, subscription:subscriptions(*), services(*)")
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, phone, email, address, city, website, description, timezone, niche,
    agent_name, greeting_message, system_prompt, enable_booking, enable_transfer, transfer_number } = body

  const { data, error } = await supabaseAdmin
    .from("businesses")
    .update({
      name, phone, email, address, city, website, description, timezone, niche,
      agent_name, greeting_message, system_prompt,
      enable_booking, enable_transfer, transfer_number,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("owner_clerk_id", userId)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
