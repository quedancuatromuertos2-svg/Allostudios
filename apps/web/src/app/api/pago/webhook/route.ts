import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLeadEmail } from '@/lib/email'
import { porClave, eur } from '@/lib/precios'

export const runtime = 'nodejs'

// Stripe avisa aquí cuando alguien paga. Es la única fuente fiable: el
// usuario puede cerrar el navegador antes de volver a la web, pero este
// aviso llega igual.
export async function POST(req: NextRequest) {
  const firma = req.headers.get('stripe-signature')
  const secreto = process.env.STRIPE_PAGO_WEBHOOK_SECRET
  const cuerpo = await req.text()

  let evento: Stripe.Event
  try {
    if (!firma || !secreto) throw new Error('Falta la firma del webhook')
    evento = stripe.webhooks.constructEvent(cuerpo, firma, secreto)
  } catch (e) {
    return NextResponse.json(
      { error: `Firma no válida: ${e instanceof Error ? e.message : ''}` },
      { status: 400 },
    )
  }

  if (evento.type !== 'checkout.session.completed') {
    return NextResponse.json({ recibido: true })
  }

  const s = evento.data.object as Stripe.Checkout.Session
  const clave = String(s.metadata?.clave || '')
  const art = porClave(clave)
  const email = s.customer_details?.email || s.customer_email || null
  const negocio = String(s.metadata?.negocio || '') || null
  const telefono = s.customer_details?.phone || String(s.metadata?.telefono || '') || null

  await supabaseAdmin
    .from('pedidos')
    .update({
      estado: 'pagado',
      pagado_at: new Date().toISOString(),
      email,
      negocio,
      telefono,
      stripe_customer_id: typeof s.customer === 'string' ? s.customer : null,
      stripe_subscription_id: typeof s.subscription === 'string' ? s.subscription : null,
    })
    .eq('stripe_session_id', s.id)

  // Aviso al equipo por el mismo canal que el resto de solicitudes
  const importe = art ? eur(art.eur) : `${((s.amount_total || 0) / 100).toFixed(0)} €`
  const recurrente = art?.cobro === 'mes'
  sendLeadEmail({
    nombre: `[PAGO] ${negocio || email || 'Cliente'}`,
    telefono: telefono || '—',
    email: email || undefined,
    servicio: `${art?.nombre || clave} · ${importe}${recurrente ? '/mes' : ''}`,
    inmobiliaria: negocio || undefined,
    mensaje:
      `PAGO CONFIRMADO de ${importe}${recurrente ? ' al mes (suscripción activa)' : ' (pago único)'}. ` +
      (art?.acompana
        ? `Al entregar, mándale el enlace del mantenimiento: allostudios.net/contratar/${art.acompana.toLowerCase()}. `
        : '') +
      `Sesión de Stripe: ${s.id}`,
  }).catch(() => {})

  const apikey = process.env.CALLMEBOT_APIKEY
  const alertPhone = process.env.ALERT_WHATSAPP
  if (apikey && alertPhone) {
    const texto =
      `💸 PAGO en allostudios.net\n${art?.nombre || clave}\n${importe}${recurrente ? '/mes' : ' pago único'}\n` +
      `${negocio || ''} ${email || ''}`
    fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(alertPhone)}&text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(apikey)}`,
    ).catch(() => {})
  }

  return NextResponse.json({ recibido: true })
}
