import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLeadEmail, sendContratoEmail } from '@/lib/email'
import { fijarComisionVenta, registrarCuota } from '@/lib/comisiones'
import { CONTRATO_VERSION } from '@/lib/contrato'
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

  // Vida de la suscripción: impagos y bajas avisan al equipo y quedan en el pedido.
  if (evento.type === 'invoice.payment_failed' || evento.type === 'customer.subscription.deleted' || evento.type === 'customer.subscription.updated') {
    await eventoSuscripcion(evento)
    return NextResponse.json({ recibido: true })
  }
  // Cada cuota cobrada → comisión del comercial (si la venta tiene uno). Idempotente por invoice.
  if (evento.type === 'invoice.paid') {
    const inv = evento.data.object as Stripe.Invoice
    const subId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id || ''
    if (subId) {
      const { data: pedido } = await supabaseAdmin.from('pedidos').select('id, comercial, comision_pct, pagado_at').eq('stripe_subscription_id', subId).maybeSingle()
      if (pedido?.id && pedido.comercial) {
        if (!pedido.comision_pct) await fijarComisionVenta(pedido.id, pedido.comercial, new Date((inv.status_transitions?.paid_at || inv.created) * 1000))
        // base sin IVA: subtotal_excluding_tax si Stripe lo da; si no, amount_paid
        const base = inv.subtotal_excluding_tax ?? inv.amount_paid ?? 0
        await registrarCuota({ pedidoId: pedido.id, stripeInvoiceId: inv.id, baseCent: base, cobradoAt: new Date((inv.status_transitions?.paid_at || inv.created) * 1000) }).catch((e) => console.error('comision', e))
      }
    }
    return NextResponse.json({ recibido: true })
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

  // Venta con comercial: se fija su % (escalera semanal) en el momento del pago
  {
    const comercial = String(s.metadata?.comercial || '')
    if (comercial) {
      const { data: p } = await supabaseAdmin.from('pedidos').select('id, comision_pct').eq('stripe_session_id', s.id).maybeSingle()
      if (p?.id && !p.comision_pct) await fijarComisionVenta(p.id, comercial, new Date()).catch((e) => console.error('comision', e))
    }
  }

  // Aviso al equipo por el mismo canal que el resto de solicitudes
  const anual = s.metadata?.periodo === 'anio'
  const extras = String(s.metadata?.extras || '').split(',').filter(Boolean)
  const importe = s.amount_total ? eur(s.amount_total / 100) : art ? eur(art.eur) : '—'
  const periodo = anual ? '/año (año por adelantado)' : '/mes'
  const detalle = `${art?.nombre || clave}${extras.length ? ` + ${extras.join(', ')}` : ''}`
  sendLeadEmail({
    nombre: `[PAGO] ${negocio || email || 'Cliente'}`,
    telefono: telefono || '—',
    email: email || undefined,
    servicio: `${detalle} · ${importe}${periodo}`,
    inmobiliaria: negocio || undefined,
    mensaje:
      `PAGO CONFIRMADO de ${importe}${periodo} (suscripción activa). ` +
      (art?.permanencia ? `Permanencia ${art.permanencia} meses. ` : '') +
      `Sesión de Stripe: ${s.id}`,
  }).catch(() => {})

  // Copia del contrato al cliente (con sus datos en el enlace, para que lo guarde en PDF)
  if (email) {
    const q = new URLSearchParams({ pack: clave.toLowerCase(), fecha: new Date().toLocaleDateString('es-ES') })
    if (extras.includes('CINE_UPGRADE')) q.set('cine', '1')
    if (anual) q.set('anual', '1')
    if (negocio) q.set('negocio', negocio)
    if (email) q.set('email', email)
    if (telefono) q.set('telefono', telefono)
    sendContratoEmail({
      to: email,
      negocio,
      producto: detalle,
      cuota: `${importe}${periodo}`,
      permanencia: art?.permanencia,
      anual,
      version: String(s.metadata?.contrato || CONTRATO_VERSION),
      enlace: `https://allostudios.net/contrato?${q.toString()}`,
    }).catch(() => {})
  }

  const apikey = process.env.CALLMEBOT_APIKEY
  const alertPhone = process.env.ALERT_WHATSAPP
  if (apikey && alertPhone) {
    const texto =
      `💸 PAGO en allostudios.net\n${detalle}\n${importe}${periodo}\n` +
      `${negocio || ''} ${email || ''}`
    fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(alertPhone)}&text=${encodeURIComponent(texto)}&apikey=${encodeURIComponent(apikey)}`,
    ).catch(() => {})
  }

  return NextResponse.json({ recibido: true })
}

// Impago, baja programada o baja efectiva de una suscripción: aviso al equipo y estado en `pedidos`.
async function eventoSuscripcion(evento: Stripe.Event) {
  let subId = ''
  let titulo = ''
  let estado = ''
  let detalle = ''
  if (evento.type === 'invoice.payment_failed') {
    const inv = evento.data.object as Stripe.Invoice
    subId = typeof inv.subscription === 'string' ? inv.subscription : inv.subscription?.id || ''
    titulo = '⚠️ IMPAGO de cuota'
    estado = 'impago'
    detalle = `${inv.customer_email || ''} · ${((inv.amount_due || 0) / 100).toFixed(0)} € · intento ${inv.attempt_count || 1}. Stripe reintenta; si no entra, aplica la cláusula 4 (suspender la web).`
  } else if (evento.type === 'customer.subscription.deleted') {
    const sub = evento.data.object as Stripe.Subscription
    subId = sub.id
    titulo = '🛑 BAJA efectiva de suscripción'
    estado = 'baja'
    detalle = `Suscripción ${sub.id} cancelada. Comprueba la permanencia: si no ha cumplido 12 meses, reclama las cuotas pendientes (cláusula 4).`
  } else {
    const sub = evento.data.object as Stripe.Subscription
    if (!sub.cancel_at_period_end) return
    subId = sub.id
    titulo = '⏳ BAJA programada (fin de periodo)'
    estado = 'baja_programada'
    detalle = `El cliente ha pedido cancelar al final del periodo. Llámale antes de que venza.`
  }

  const { data: pedido } = subId
    ? await supabaseAdmin.from('pedidos').select('id, negocio, email, telefono, nombre, pagado_at').eq('stripe_subscription_id', subId).maybeSingle()
    : { data: null }
  if (pedido?.id) {
    await supabaseAdmin.from('pedidos').update({ estado, notas: `${titulo} ${new Date().toISOString().slice(0, 10)}` }).eq('id', pedido.id)
  }
  const quien = pedido ? `${pedido.negocio || pedido.email || ''} (${pedido.nombre || ''}, alta ${String(pedido.pagado_at || '').slice(0, 10)})` : `sub ${subId}`
  sendLeadEmail({
    nombre: `[SUSCRIPCIÓN] ${titulo}`,
    telefono: pedido?.telefono || '—',
    email: pedido?.email || undefined,
    servicio: titulo,
    inmobiliaria: pedido?.negocio || undefined,
    mensaje: `${quien}. ${detalle}`,
  }).catch(() => {})
  const apikey = process.env.CALLMEBOT_APIKEY
  const alertPhone = process.env.ALERT_WHATSAPP
  if (apikey && alertPhone) {
    fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(alertPhone)}&text=${encodeURIComponent(`${titulo}\n${quien}\n${detalle}`)}&apikey=${encodeURIComponent(apikey)}`,
    ).catch(() => {})
  }
}
