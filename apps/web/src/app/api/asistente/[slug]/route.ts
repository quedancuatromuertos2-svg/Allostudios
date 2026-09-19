import { NextRequest, NextResponse } from 'next/server'
import { cargarAsistente, responder, type Asistente } from '@/lib/asistente/motor'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/*  Webhook del asistente de WhatsApp de un negocio: https://allostudios.net/api/asistente/<slug>
    - Meta (WhatsApp Cloud API): GET para verificar el webhook, POST con los mensajes.
    - Twilio (WhatsApp por Twilio): POST con formulario; se contesta con TwiML.
    El motor es el mismo (lib/asistente/motor.ts); aquí solo se traduce el canal.                */

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  const a = await cargarAsistente(params.slug)
  if (!a) return NextResponse.json({ error: 'No existe' }, { status: 404 })
  const sp = req.nextUrl.searchParams
  // Verificación de Meta: devuelve hub.challenge si el verify token coincide
  if (sp.get('hub.mode') === 'subscribe' && sp.get('hub.verify_token') === a.verify_token) {
    return new NextResponse(sp.get('hub.challenge') || '', { status: 200 })
  }
  return NextResponse.json({ asistente: a.slug, activo: a.activo, canal: a.canal })
}

async function enviarMeta(a: Asistente, a_quien: string, texto: string) {
  if (!a.meta_phone_number_id || !a.meta_token) { console.error('asistente sin credenciales de Meta', a.slug); return }
  const r = await fetch(`https://graph.facebook.com/v20.0/${a.meta_phone_number_id}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${a.meta_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', to: a_quien, type: 'text', text: { body: texto, preview_url: false } }),
  })
  if (!r.ok) console.error('meta send', r.status, (await r.text()).slice(0, 300))
}

async function marcarLeido(a: Asistente, waId: string) {
  if (!a.meta_phone_number_id || !a.meta_token) return
  fetch(`https://graph.facebook.com/v20.0/${a.meta_phone_number_id}/messages`, {
    method: 'POST', headers: { Authorization: `Bearer ${a.meta_token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messaging_product: 'whatsapp', status: 'read', message_id: waId }),
  }).catch(() => {})
}

function twiml(msg: string) {
  const esc = msg.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return new NextResponse(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${esc}</Message></Response>`, { status: 200, headers: { 'Content-Type': 'text/xml' } })
}

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  const a = await cargarAsistente(params.slug)
  if (!a) return NextResponse.json({ error: 'No existe' }, { status: 404 })

  const tipo = req.headers.get('content-type') || ''

  // ── Twilio: formulario ──
  if (tipo.includes('application/x-www-form-urlencoded') || tipo.includes('multipart/form-data')) {
    const form = await req.formData()
    const texto = String(form.get('Body') || '').trim()
    const de = String(form.get('From') || '').replace('whatsapp:', '').replace('+', '')
    if (!texto || !de) return twiml('¡Hola! ¿En qué te ayudo?')
    const r = await responder(a, de, texto, String(form.get('MessageSid') || '') || undefined)
    return twiml(r || '')
  }

  // ── Meta: JSON ──
  let body: { entry?: { changes?: { value?: { messages?: { id: string; from: string; type: string; text?: { body: string }; button?: { text: string }; interactive?: { button_reply?: { title: string }; list_reply?: { title: string } } }[] } }[] }[] }
  try { body = await req.json() } catch { return NextResponse.json({ ok: true }) }
  const mensajes = body.entry?.flatMap((e) => e.changes || []).flatMap((c) => c.value?.messages || []) || []
  // Se contesta 200 enseguida (Meta reintenta si tardamos) y se procesa cada mensaje
  await Promise.all(mensajes.map(async (m) => {
    const texto = m.type === 'text' ? m.text?.body : m.type === 'button' ? m.button?.text : m.type === 'interactive' ? (m.interactive?.button_reply?.title || m.interactive?.list_reply?.title) : null
    if (!texto) {
      // audio, imagen, ubicación…: se pide texto y se avisa
      const r = await responder(a, m.from, `[el cliente ha enviado un mensaje de tipo ${m.type} que no puedo leer]`, m.id)
      if (r) await enviarMeta(a, m.from, r)
      return
    }
    marcarLeido(a, m.id)
    const r = await responder(a, m.from, texto.trim(), m.id)
    if (r) await enviarMeta(a, m.from, r)
  }))
  return NextResponse.json({ ok: true })
}
