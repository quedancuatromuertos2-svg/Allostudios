import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendPedirResena } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/*  Pide la reseña sola. Dos toques por cliente y ninguno más:
      · día 7  (la entrega ya está hecha)
      · día 30 (con el primer informe delante, que es cuando tiene algo que contar)
    Manda el email al cliente y a Ángel un WhatsApp con el mensaje ya escrito para reenviarlo de un
    toque (mientras no esté la WhatsApp Cloud API, el WhatsApp al cliente lo manda él).          */

const DIAS = 86400000
const ENLACE = () => process.env.GOOGLE_REVIEW_URL || 'https://allostudios.net'

async function avisarAngel(texto: string) {
  const apikey = process.env.CALLMEBOT_APIKEY, phone = process.env.ALERT_WHATSAPP
  if (!apikey || !phone) return
  await fetch(`https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(apikey)}`).catch(() => {})
}

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization') || ''
  const url = new URL(req.url)
  if (secret && auth !== `Bearer ${secret}` && url.searchParams.get('secret') !== secret && !req.headers.get('x-vercel-cron')) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const ahora = Date.now()
  const { data: pedidos } = await supabaseAdmin
    .from('pedidos')
    .select('id, nombre, negocio, email, telefono, pagado_at, resena_pedida_at, resena_recordada_at, resena_dejada')
    .eq('estado', 'pagado')
    .eq('resena_dejada', false)
    .not('pagado_at', 'is', null)
    .limit(200)

  let pedidas = 0, recordadas = 0
  for (const p of pedidos || []) {
    const dias = (ahora - Date.parse(p.pagado_at)) / DIAS
    const negocio = p.negocio || p.nombre || ''
    const wa = p.telefono ? `https://wa.me/${String(p.telefono).replace(/\D/g, '')}?text=${encodeURIComponent(`Hola${negocio ? ' ' + negocio : ''}! ¿Nos dejas una reseña en Google? Son 30 segundos y a nosotros nos ayuda muchísimo 🙏 ${ENLACE()}`)}` : ''

    if (dias >= 7 && !p.resena_pedida_at) {
      if (p.email) await sendPedirResena(p.email, { negocio, producto: p.nombre || '', enlace: ENLACE(), momento: 'entrega' }).catch(() => {})
      await supabaseAdmin.from('pedidos').update({ resena_pedida_at: new Date().toISOString() }).eq('id', p.id)
      await avisarAngel(`⭐ Pídele la reseña a ${negocio} (7 días desde el alta).\n${wa || 'Sin teléfono: mírale el email.'}`)
      pedidas++
    } else if (dias >= 30 && p.resena_pedida_at && !p.resena_recordada_at) {
      if (p.email) await sendPedirResena(p.email, { negocio, producto: p.nombre || '', enlace: ENLACE(), momento: 'informe' }).catch(() => {})
      await supabaseAdmin.from('pedidos').update({ resena_recordada_at: new Date().toISOString() }).eq('id', p.id)
      await avisarAngel(`⭐ Segundo toque de reseña a ${negocio} (1 mes, con el informe delante).\n${wa || ''}`)
      recordadas++
    }
  }
  return NextResponse.json({ ok: true, pedidas, recordadas, revisados: pedidos?.length || 0 })
}
