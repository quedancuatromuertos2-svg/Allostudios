import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { lookupBusiness } from '@/lib/places'
import { sendLeadEmail } from '@/lib/email'
import { encodeDemo, slimPlace } from '@/lib/demo-token'

export const runtime = 'nodejs'

// Genera la demo de un negocio a partir del formulario público (/tu-web):
// 1) busca el negocio en Google Places (datos reales), 2) guarda el LEAD en Supabase,
// 3) avisa al equipo (email + WhatsApp) para que Fran lo cierre en caliente,
// 4) devuelve el id para redirigir a la demo (/tu-web/[id]).
export async function POST(req: NextRequest) {
  try {
    const d = await req.json().catch(() => ({}))

    // Honeypot anti-bots: campo oculto "web"; si viene relleno, lo ignoramos.
    if (String(d?.web || '').trim()) return NextResponse.json({ ok: true, id: null })

    const negocio = String(d?.negocio || '').trim().slice(0, 120)
    const ciudad = (String(d?.ciudad || '').trim() || 'Valencia').slice(0, 80)
    const sector = String(d?.sector || '').trim().slice(0, 60)
    const telefono = String(d?.telefono || '').trim().slice(0, 40)
    const email = String(d?.email || '').trim().slice(0, 120)
    const consent = Boolean(d?.consent)

    if (!negocio || !telefono || !consent) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    // Rate limit: máx 6 generaciones por IP en la última hora.
    try {
      const since = new Date(Date.now() - 3600_000).toISOString()
      const { count } = await supabaseAdmin
        .from('demo_leads')
        .select('id', { count: 'exact', head: true })
        .eq('ip', ip)
        .gte('created_at', since)
      if ((count || 0) >= 6) {
        return NextResponse.json({ error: 'Has generado varias ya. Prueba en un rato 🙂' }, { status: 429 })
      }
    } catch {
      /* si la tabla aún no existe, seguimos y fallará el insert con mensaje claro */
    }

    // Datos reales del negocio (reseñas, foto, dirección, web actual)
    const place = await lookupBusiness(negocio, ciudad).catch(() => null)

    // Guardamos el lead. Si la tabla `demo_leads` todavía no existe (o Supabase falla),
    // NO dejamos al visitante sin su demo: la servimos firmada dentro de la URL.
    let id: string
    let guardado = true
    try {
      const { data: row, error } = await supabaseAdmin
        .from('demo_leads')
        .insert({ negocio, ciudad, sector, telefono, email: email || null, consent, place, ip })
        .select('id')
        .single()
      if (error || !row) throw new Error(error?.message || 'insert failed')
      id = row.id
    } catch {
      guardado = false
      id = encodeDemo({ n: negocio, c: ciudad, s: sector, p: slimPlace(place) })
    }

    // Aviso al equipo — mismo canal que las solicitudes normales
    sendLeadEmail({
      nombre: `[DEMO] ${negocio}`,
      telefono,
      servicio: 'Demo web autogenerada',
      inmobiliaria: negocio,
      email: email || undefined,
      mensaje:
        `Generó su demo en /tu-web. Ciudad: ${ciudad}. Sector: ${sector || '—'}. ` +
        `Web actual: ${place?.website || 'NO tiene'}. ${place?.rating ? `${place.rating}★ (${place.reviews} reseñas).` : ''}` +
        (guardado ? '' : ' ⚠️ NO guardado en Supabase (falta la tabla demo_leads) — apunta este lead a mano.'),
    }).catch(() => {})

    const apikey = process.env.CALLMEBOT_APIKEY
    const alertPhone = process.env.ALERT_WHATSAPP
    if (apikey && alertPhone) {
      const text =
        `🔥 Demo generada (lead caliente)\n` +
        `Negocio: ${negocio} (${ciudad})\nTel: ${telefono}\n` +
        `${place?.website ? 'YA tiene web' : 'SIN web'} ${place?.rating ? `· ${place.rating}★(${place.reviews})` : ''}`
      fetch(
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(alertPhone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`,
      ).catch(() => {})
    }

    return NextResponse.json({ ok: true, id })
  } catch {
    return NextResponse.json({ error: 'Error inesperado' }, { status: 500 })
  }
}
