import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { businessId } = await req.json()

  const { data: business } = await supabaseAdmin
    .from("businesses")
    .select("stripe_customer_id")
    .eq("id", businessId)
    .eq("owner_clerk_id", userId)
    .single()

  if (!business?.stripe_customer_id) {
    return NextResponse.json({ error: "No billing account found" }, { status: 404 })
  }

  const origin = req.headers.get("origin") || "http://localhost:3000"

  const session = await stripe.billingPortal.sessions.create({
    customer: business.stripe_customer_id,
    return_url: `${origin}/billing`,
  })

  return NextResponse.json({ url: session.url })
}
