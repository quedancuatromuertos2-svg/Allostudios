import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'
import { porClave, sinStripe } from '@/lib/precios'
import { CONTRATO_VERSION } from '@/lib/contrato'

export const runtime = 'nodejs'

// Abre la pasarela de pago de Stripe para un servicio del catálogo.
// No pide cuenta ni registro: a un negocio local no se le puede exigir que
// se cree un usuario para pagarte. El email lo recoge la propia pasarela.
export async function POST(req: NextRequest) {
  const d = await req.json().catch(() => ({}))
  const art = porClave(String(d?.clave || ''))
  if (!art) return NextResponse.json({ error: 'Ese servicio no existe' }, { status: 400 })

  // Periodo: cuota mensual o el año por adelantado (10 cuotas). Extras: p. ej. la web Cinematográfica en un pack.
  const anual = d?.periodo === 'anio' && !!art.anual
  const extras = (Array.isArray(d?.extras) ? d.extras : [])
    .map((c: unknown) => porClave(String(c)))
    .filter((e): e is NonNullable<typeof e> => !!e && (art.extras || []).includes(e.clave))
  // Un extra sin precio anual (AEO) va siempre mensual, aunque el pack se pague por adelantado.
  const precioDe = (a: typeof art) => (anual && a.anual ? a.anual.priceId : a.priceId)
  if ([art, ...extras].some((a) => sinStripe(precioDe(a)))) {
    return NextResponse.json({ error: 'Este producto todavía no está activado para el pago. Escríbenos por WhatsApp y lo activamos al momento.' }, { status: 503 })
  }
  const totalMes = art.eur + extras.reduce((t, e) => t + e.eur, 0)
  const importeCent = (anual ? totalMes * 10 : totalMes) * 100

  // Sin contrato aceptado no hay pago: queda registrado quién, cuándo, desde dónde y qué versión.
  if (!d?.aceptaContrato) {
    return NextResponse.json({ error: 'Marca la casilla de aceptación del contrato para continuar.' }, { status: 400 })
  }
  const ua = (req.headers.get('user-agent') || '').slice(0, 200)
  // Comercial que trae la venta: campo del formulario (si lo teclea el cliente) o cookie de ?c=<slug>
  const cookieC = req.headers.get('cookie')?.match(/(?:^|;\s*)allo_c=([a-z0-9-]{2,30})/i)?.[1] || ''
  const comercial = (String(d?.comercial || '').trim().toLowerCase() || cookieC.toLowerCase()).replace(/[^a-z0-9-]/g, '').slice(0, 30) || null

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Pagos no configurados' }, { status: 503 })
  }

  const origen = req.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'https://allostudios.net'
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
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
      importe_cent: importeCent,
      cobro: art.cobro,
      email, telefono, negocio,
      notas: [anual ? 'Año por adelantado' : '', extras.length ? `Extras: ${extras.map((e) => e.clave).join(', ')}` : ''].filter(Boolean).join(' · ') || null,
      contrato_version: CONTRATO_VERSION,
      contrato_aceptado_at: new Date().toISOString(),
      contrato_ip: ip,
      contrato_ua: ua,
      comercial,
    })
    .select('id')
    .single()

  try {
    const sesion = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [art, ...extras].map((a) => ({ price: precioDe(a), quantity: 1 })),
      locale: 'es',
      customer_email: email || undefined,
      success_url: `${origen}/gracias?s={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origen}/contratar/${art.clave.toLowerCase()}?cancelado=1`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      metadata: { clave: art.clave, extras: extras.map((e) => e.clave).join(','), periodo: anual ? 'anio' : 'mes', pedidoId: pedido?.id || '', negocio: negocio || '', telefono: telefono || '', contrato: CONTRATO_VERSION, comercial: comercial || '' },
      custom_text: {
        submit: { message: art.permanencia
          ? `Al pagar confirmas el contrato de suscripción (versión ${CONTRATO_VERSION}): ${art.permanencia} meses de permanencia, 0 € de entrada. Copia en allostudios.net/contrato.`
          : `Al pagar confirmas el contrato de suscripción (versión ${CONTRATO_VERSION}), sin permanencia. Copia en allostudios.net/contrato.` },
      },
      subscription_data: {
        metadata: { clave: art.clave, extras: extras.map((e) => e.clave).join(','), periodo: anual ? 'anio' : 'mes', pedidoId: pedido?.id || '', comercial: comercial || '' },
        ...(art.permanencia ? { description: `${art.nombre} · permanencia ${art.permanencia} meses` } : {}),
      },
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
