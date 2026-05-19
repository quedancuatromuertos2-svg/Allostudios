import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { name, niche, phone, address, description } = body

  const existing = await supabaseAdmin
    .from("users").select("id").eq("clerk_id", userId).single()

  if (!existing.data) {
    await supabaseAdmin.from("users").insert({
      clerk_id: userId,
      onboarding_completed: false,
    })
  }

  const { data: business, error } = await supabaseAdmin
    .from("businesses")
    .insert({
      owner_clerk_id: userId,
      name,
      niche,
      phone: phone || null,
      address: address || null,
      description: description || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  await supabaseAdmin.from("users").update({ onboarding_completed: true }).eq("clerk_id", userId)

  return NextResponse.json(business, { status: 201 })
}
