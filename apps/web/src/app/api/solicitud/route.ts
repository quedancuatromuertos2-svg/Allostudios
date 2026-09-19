import { NextResponse } from 'next/server'
import { sendLeadEmail } from '@/lib/email'

export const runtime = 'nodejs'

// Recibe las solicitudes/contrataciones del formulario público de la web.
// Envía un email al equipo (Resend) y, si está configurado, un aviso por WhatsApp (CallMeBot).
export async function POST(req: Request) {
  try {
    const d = await req.json().catch(() => ({}))
    const nombre = String(d?.nombre || '').trim()
    const telefono = String(d?.telefono || '').trim()
    const servicio = String(d?.servicio || '').trim()
    const presupuesto = ['<100', '100-300', '>300'].includes(String(d?.presupuesto)) ? String(d.presupuesto) : ''

    if (!nombre || !telefono || !servicio) {
      return NextResponse.json({ error: 'Faltan datos obligatorios' }, { status: 400 })
    }

    const data = {
      nombre,
      telefono,
      servicio,
      inmobiliaria: String(d?.inmobiliaria || '').trim() || undefined,
      email: String(d?.email || '').trim() || undefined,
      // el presupuesto va dentro del mensaje para no tocar la plantilla del email
      mensaje: [presupuesto ? `Presupuesto: ${presupuesto} €/mes` : '', String(d?.mensaje || '').trim()].filter(Boolean).join(' · ') || undefined,
    }

    // 1) Email al equipo (queda registro)
    await sendLeadEmail(data)

    // 2) Aviso por WhatsApp al móvil (opcional — requiere CallMeBot configurado)
    const apikey = process.env.CALLMEBOT_APIKEY
    const phone = process.env.ALERT_WHATSAPP
    if (apikey && phone) {
      const text =
        `🔔 Nueva solicitud AlloStudios\n` +
        `Servicio: ${servicio}\n` +
        (presupuesto ? `Presupuesto: ${presupuesto} €/mes\n` : '') +
        `Nombre: ${nombre}` +
        (data.inmobiliaria ? `\nInmobiliaria: ${data.inmobiliaria}` : '') +
        `\nTel: ${telefono}`
      await fetch(
        `https://api.callmebot.com/whatsapp.php?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(text)}&apikey=${encodeURIComponent(apikey)}`,
      ).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'No se pudo enviar la solicitud' }, { status: 500 })
  }
}
