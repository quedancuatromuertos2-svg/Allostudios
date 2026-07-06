import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { provision } from "@/lib/provisioner"

// Called by Vercel Cron every 5 minutes
// Authorization: Bearer CRON_SECRET env var
export async function GET(req: Request) {
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Find pending or failed jobs that haven't hit max retries
  const { data: jobs } = await supabaseAdmin
    .from("provisioning_jobs")
    .select("id, business_id, retry_count, status")
    .in("status", ["pending", "failed"])
    .lt("retry_count", 5)
    .order("created_at", { ascending: true })
    .limit(10)

  if (!jobs?.length) return NextResponse.json({ processed: 0 })

  const results = await Promise.allSettled(
    jobs.map(async (job) => {
      const result = await provision(job.business_id)
      return { businessId: job.business_id, ...result }
    })
  )

  const processed = results.filter(r => r.status === "fulfilled" && (r.value as any).ok).length
  const failed = results.filter(r => r.status === "rejected" || !(r.status === "fulfilled" && (r.value as any).ok)).length

  return NextResponse.json({ processed, failed, total: jobs.length })
}
