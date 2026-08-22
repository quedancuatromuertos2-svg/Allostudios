import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const runtime = 'nodejs'
export const maxDuration = 60

// Entrada de leads desde el Captador local (node subir.js).
// No usa sesión de Clerk: se autentica con una clave compartida, porque quien
// llama es un script, no un navegador.

type Entrada = Record<string, unknown>

const str = (v: unknown, max = 300) => {
  const s = String(v ?? '').trim()
  return s ? s.slice(0, max) : null
}
const num = (v: unknown) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export async function POST(req: NextRequest) {
  const clave = process.env.CAPTADOR_SYNC_KEY
  if (!clave) return NextResponse.json({ error: 'Sync no configurado' }, { status: 503 })
  if (req.headers.get('x-captador-key') !== clave) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const leads = Array.isArray(body?.leads) ? (body.leads as Entrada[]) : null
  if (!leads) return NextResponse.json({ error: 'Falta el array leads' }, { status: 400 })
  if (leads.length > 1000) return NextResponse.json({ error: 'Máximo 1000 leads por envío' }, { status: 400 })

  const workspace = str(body?.workspace, 60) || 'allostudios'

  const filas = leads
    .map((l) => ({
      workspace,
      external_id: str(l.external_id ?? l.id, 200),
      name: str(l.name, 200),
      sector: str(l.sector, 80),
      sector_label: str(l.sector_label ?? l.sectorLabel, 120),
      phone: str(l.phone, 40),
      website: str(l.website, 400),
      instagram: str(l.instagram, 200),
      address: str(l.address, 300),
      city: str(l.city, 100),
      lat: num(l.lat),
      lon: num(l.lon),
      rating: num(l.rating),
      reviews: num(l.reviews),
      score: num(l.score),
      tier: str(l.tier, 4),
      problems: Array.isArray(l.problems) ? l.problems.slice(0, 8) : null,
      hook: str(l.hook, 400),
      message: str(l.message, 4000),
      place_id: str(l.place_id ?? l.placeId, 120),
      updated_at: new Date().toISOString(),
    }))
    .filter((f) => f.external_id && f.name)

  if (!filas.length) return NextResponse.json({ error: 'Ningún lead válido' }, { status: 400 })

  // Upsert por (workspace, external_id): re-subir la misma lista actualiza los
  // datos sin duplicar. `status`, `notes` y el comercial asignado NO van en el
  // payload a propósito — así volver a sincronizar nunca pisa el trabajo hecho.
  const { error } = await supabaseAdmin
    .from('captador_leads')
    .upsert(filas, { onConflict: 'workspace,external_id', ignoreDuplicates: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { count } = await supabaseAdmin
    .from('captador_leads')
    .select('id', { count: 'exact', head: true })
    .eq('workspace', workspace)

  return NextResponse.json({ ok: true, recibidos: leads.length, guardados: filas.length, total: count ?? null })
}
