import type { Metadata } from 'next'
import Link from 'next/link'
import { CATALOGO, porClave, eur } from '@/lib/precios'
import { CLAUSULAS, CONTRATO_VERSION, PRESTADOR } from '@/lib/contrato'
import BotonImprimir from './BotonImprimir'

export const metadata: Metadata = {
  title: 'Contrato de suscripción',
  description: 'Contrato de prestación de servicios por suscripción de AlloStudios: qué incluye, cuota, permanencia y condiciones.',
  alternates: { canonical: 'https://allostudios.net/contrato' },
  robots: { index: false, follow: true },
}

/*  /contrato — el contrato que acepta el cliente.

    Tres usos:
    · Lectura antes de pagar (enlace desde el desglose de /contratar).
    · Copia con los datos rellenos tras el pago (enlace del email).
    · Impresión para la venta presencial (?pack=pro&negocio=...&print=1): sale con
      portada, cláusulas y bloques de firma. El cliente lo firma y paga en /contratar desde el móvil.

    Parámetros: pack (clave del catálogo, p. ej. pack_pro o pro), cine=1 (upgrade),
    anual=1, negocio, titular, nif, direccion, email, telefono, fecha.                             */

type SP = Record<string, string | string[] | undefined>
const uno = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || ''

function resolverProducto(p: string) {
  const k = p.toUpperCase()
  return porClave(k) || porClave(`PACK_${k}`) || porClave(`WEB_${k}`) || undefined
}

export default function ContratoPage({ searchParams }: { searchParams?: SP }) {
  const sp = searchParams || {}
  const art = resolverProducto(uno(sp.pack))
  const cine = uno(sp.cine) === '1' && !!art?.extras?.includes('CINE_UPGRADE')
  const anual = uno(sp.anual) === '1' && !!art?.anual
  const upgrade = cine ? porClave('CINE_UPGRADE') : undefined
  const cuota = (art?.eur || 0) + (upgrade?.eur || 0)
  const imprimir = uno(sp.print) === '1'

  const datos = {
    negocio: uno(sp.negocio), titular: uno(sp.titular), nif: uno(sp.nif), direccion: uno(sp.direccion),
    email: uno(sp.email), telefono: uno(sp.telefono),
    fecha: uno(sp.fecha) || new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }),
  }
  const linea = (v: string) => v || ' '.repeat(28)

  return (
    <>
      <style>{`
        .contrato{max-width:820px;margin:0 auto;padding:48px 24px 80px;color:#111;font-family:Inter,system-ui,sans-serif;font-size:14px;line-height:1.6;background:#fff}
        .contrato h1{font-family:Outfit,Inter,sans-serif;font-size:26px;font-weight:600;letter-spacing:-.02em;margin:0 0 4px}
        .contrato h2{font-size:15px;font-weight:600;margin:22px 0 6px}
        .contrato p{margin:0 0 8px}
        .contrato table{width:100%;border-collapse:collapse;margin:16px 0 8px;font-size:13.5px}
        .contrato td{padding:7px 10px;border:1px solid #ddd;vertical-align:top}
        .contrato td:first-child{width:32%;color:#555;background:#fafafa}
        .contrato .meta{color:#666;font-size:12.5px}
        .contrato .firmas{display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-top:40px}
        .contrato .firma{border-top:1px solid #111;padding-top:8px;font-size:12.5px;color:#444;min-height:90px}
        .contrato .acciones{display:flex;gap:12px;margin:0 0 24px;flex-wrap:wrap}
        .contrato .acciones a,.contrato .acciones button{font:inherit;font-size:13px;padding:9px 16px;border-radius:999px;border:1px solid #ccc;background:#fff;color:#111;text-decoration:none;cursor:pointer}
        .contrato .acciones .p{background:#111;color:#fff;border-color:#111}
        @media print{.no-print{display:none!important}.contrato{padding:0;max-width:none;font-size:12px}.contrato td{padding:5px 8px}body{background:#fff}}
      `}</style>
      <main className="contrato">
        <div className="acciones no-print">
          <Link href="/contratar" className="">← Volver a contratar</Link>
          <BotonImprimir auto={imprimir} />
        </div>

        <h1>Contrato de prestación de servicios por suscripción</h1>
        <p className="meta">AlloStudios · versión {CONTRATO_VERSION} · {datos.fecha}</p>

        <h2>Partes</h2>
        <table>
          <tbody>
            <tr><td>Prestador</td><td>{PRESTADOR.nombre} · NIF {PRESTADOR.nif} · {PRESTADOR.domicilio} · {PRESTADOR.email} · {PRESTADOR.telefono}</td></tr>
            <tr><td>Cliente (negocio)</td><td>{linea(datos.negocio)}</td></tr>
            <tr><td>Titular / representante</td><td>{linea(datos.titular)}</td></tr>
            <tr><td>NIF / CIF</td><td>{linea(datos.nif)}</td></tr>
            <tr><td>Dirección</td><td>{linea(datos.direccion)}</td></tr>
            <tr><td>Email de facturación</td><td>{linea(datos.email)}</td></tr>
            <tr><td>WhatsApp</td><td>{linea(datos.telefono)}</td></tr>
          </tbody>
        </table>

        <h2>Servicio contratado</h2>
        {art ? (
          <table>
            <tbody>
              <tr><td>Producto</td><td><strong>{art.nombre}</strong>{upgrade ? ` + ${upgrade.nombre}` : ''}</td></tr>
              {art.incluye && <tr><td>Incluye</td><td>{art.incluye.join(' · ')}{upgrade ? ' · Web Cinematográfica en lugar de la web del pack' : ''}</td></tr>}
              <tr><td>Cuota</td><td><strong>{eur(cuota)} al mes</strong>{anual ? ` · pagado el año por adelantado: ${eur(cuota * 10)} (10 cuotas por 12 meses)` : ''}</td></tr>
              <tr><td>Entrada</td><td>0 €</td></tr>
              <tr><td>Permanencia</td><td>{art.permanencia ? `${art.permanencia} meses desde la fecha de contratación; después, mes a mes sin permanencia` : 'Sin permanencia: se cancela con 15 días de preaviso'}</td></tr>
              <tr><td>Forma de pago</td><td>Tarjeta, mediante Stripe, en allostudios.net/contratar/{art.clave.toLowerCase()}</td></tr>
            </tbody>
          </table>
        ) : (
          <table>
            <tbody>
              <tr><td>Producto</td><td>{linea('')}</td></tr>
              <tr><td>Cuota</td><td>{linea('')} al mes · Entrada 0 €</td></tr>
              <tr><td>Permanencia</td><td>12 meses (packs y webs) / sin permanencia (servicios sueltos)</td></tr>
            </tbody>
          </table>
        )}
        {!art && (
          <p className="meta no-print">
            Puedes generar el contrato con el producto ya relleno: {CATALOGO.filter((a) => a.tipo !== 'extra').map((a, i) => (
              <span key={a.clave}>{i ? ' · ' : ''}<Link className="underline" href={`/contrato?pack=${a.clave.toLowerCase()}`}>{a.nombre}</Link></span>
            ))}
          </p>
        )}

        <h2>Condiciones</h2>
        {CLAUSULAS.map((c) => (
          <section key={c.titulo}>
            <h2>{c.titulo}</h2>
            {c.parrafos.map((p, i) => <p key={i}>{p}</p>)}
          </section>
        ))}

        <h2>Aceptación</h2>
        <p>
          El Cliente declara haber leído y aceptar íntegramente este contrato. La aceptación se realiza al marcar la casilla
          «He leído y acepto el contrato» y completar el pago en allostudios.net/contratar, quedando registrados la fecha,
          la versión del contrato y la dirección IP; o mediante firma manuscrita en este documento.
        </p>
        <div className="firmas">
          <div className="firma">Por el Prestador<br />{PRESTADOR.nombre}<br />Fecha: {datos.fecha}</div>
          <div className="firma">Por el Cliente<br />{datos.titular || 'Nombre y firma'}{datos.negocio ? ` · ${datos.negocio}` : ''}<br />Fecha: ______________</div>
        </div>
      </main>
    </>
  )
}
