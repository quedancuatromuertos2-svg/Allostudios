import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { porClave } from '@/lib/precios'

export const runtime = 'nodejs'

// Abre la pasarela de pago de Stripe para un servicio del catálogo.
// No pide cuenta ni registro: a un negocio local no se le puede exigir que
// se cree un usuario para pagarte. El email lo recoge la propia pasarela.
export async function POST(req: NextRequest) {
  const d = await req.json().catch(() => ({}))
  const art = porClave(String(d?.clave || ''))
  if (!art) return NextResponse.json({ error: 'Ese servicio no existe' }, { status: 400 })

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Pagos no configurados' }, { status: 503 })
  }

  const origen = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://allostudios.net'
  const negocio = String(d?.negocio || '').trim().slice(0, 120) || null
  const telefono = String(d?.telefono || '').trim().slice(0, 40) || null
  const email = String(d?.email || '').trim().slice(0, 160) || null

  // Se deja constancia ANTES de mandarlo a pagar: si luego abandona el pago,
  // queda el rastro de que alguien intentó contratar y se le puede llamar.
  const { data: pedido } = await supabaseAdmin
    .from('pedidos')
    .insert({
      clave: art.clave,
      nombre: art.nombre,
      importe_cent: art.eur * 100,
      cobro: art.cobro,
      email, telefono, negocio,
    })
    .select('id')
    .single()

  try {
    const sesion = await stripe.checkout.sessions.create({
      mode: art.cobro === 'mes' ? 'subscription' : 'payment',
      line_items: [{ price: art.priceId, quantity: 1 }],
      locale: 'es',
      customer_email: email || undefined,
      success_url: `${origen}/gracias?s={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origen}/contratar/${art.clave.toLowerCase()}?cancelado=1`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { clave: art.clave, pedidoId: pedido?.id || '', negocio: negocio || '', telefono: telefono || '' },
      ...(art.cobro === 'mes'
        ? { subscription_data: { metadata: { clave: art.clave, pedidoId: pedido?.id || '' } } }
        : { payment_intent_data: { metadata: { clave: art.clave, pedidoId: pedido?.id || '' } } }),
    })

    if (pedido?.id) {
      await supabaseAdmin.from('pedidos').update({ stripe_session_id: sesion.id }).eq('id', pedido.id)
    }
    return NextResponse.json({ url: sesion.url })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Error de pago'
    if (pedido?.id) {
      await supabaseAdmin.from('pedidos').update({ estado: 'fallido', notas: msg.slice(0, 400) }).eq('id', pedido.id)
    }
    return NextResponse.json({ error: msg }, { status: 502 })
  }
}
