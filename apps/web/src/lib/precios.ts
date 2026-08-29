/*  Catálogo de AlloStudios enlazado con Stripe (cuenta en modo REAL).

    Los identificadores de precio NO son secretos: son públicos por diseño y
    van en el navegador cuando se abre el pago. La clave secreta es otra cosa
    y vive solo en las variables de entorno de Vercel.

    Creados el 2026-08-23. Si cambias un precio en Stripe, se crea un `price`
    nuevo (los precios son inmutables) y hay que actualizar el id aquí.        */

export type Cobro = 'unico' | 'mes'

export type Articulo = {
  clave: string
  nombre: string
  desc: string
  eur: number
  cobro: Cobro
  priceId: string
  /** Se cobra junto con este otro artículo (la web lleva su mantenimiento) */
  acompana?: string
}

export const CATALOGO: Articulo[] = [
  {
    clave: 'WEB_ARRANQUE', nombre: 'Web Arranque', eur: 499, cobro: 'unico',
    desc: 'Web profesional a medida, online en 7 días. Diseño único, móvil y SEO local.',
    priceId: 'price_1U9qZSAtD7Uqmi3UHoH1DtuU', acompana: 'MANTENIMIENTO',
  },
  {
    clave: 'WEB_PREMIUM', nombre: 'Web Premium', eur: 790, cobro: 'unico',
    desc: 'Web con animaciones avanzadas, copy profesional y tus reseñas de Google integradas.',
    priceId: 'price_1U9qZTAtD7Uqmi3UUBixVpS3', acompana: 'MANTENIMIENTO',
  },
  {
    clave: 'WEB_CINE', nombre: 'Web Cinematográfica', eur: 1490, cobro: 'unico',
    desc: 'Web con efecto de scroll cinematográfico. La más impactante del catálogo.',
    priceId: 'price_1U9qZTAtD7Uqmi3UezVUNBiZ', acompana: 'MANT_CINE',
  },
  {
    clave: 'MANTENIMIENTO', nombre: 'Mantenimiento web', eur: 49, cobro: 'mes',
    desc: 'Hosting, dominio, cambios ilimitados y soporte. Sin permanencia.',
    priceId: 'price_1U9qZTAtD7Uqmi3ULjYttGBi',
  },
  {
    clave: 'MANT_CINE', nombre: 'Mantenimiento Cinematográfica', eur: 79, cobro: 'mes',
    desc: 'Mantenimiento de la web cinematográfica: hosting, cambios y soporte.',
    priceId: 'price_1U9qZUAtD7Uqmi3UdgYcxSk1',
  },
  {
    clave: 'CAPTACION', nombre: 'Captación de clientes', eur: 249, cobro: 'mes',
    desc: '40 negocios cualificados al mes de tu zona: teléfono verificado, ficha y motivo por el que te necesitan.',
    priceId: 'price_1U9qZUAtD7Uqmi3UwN9rzTWx',
  },
  {
    clave: 'CAPTACION_PRO', nombre: 'Captación Pro', eur: 449, cobro: 'mes',
    desc: '100 negocios cualificados al mes con seguimiento en el panel.',
    priceId: 'price_1U9qZUAtD7Uqmi3UQbe0OC53',
  },
  {
    clave: 'INSTAGRAM', nombre: 'Gestión de Instagram', eur: 199, cobro: 'mes',
    desc: 'Contenido, publicación y respuesta de mensajes. Tu Instagram, resuelto.',
    priceId: 'price_1U9qZVAtD7Uqmi3UmDBnRFZT',
  },
  {
    clave: 'INSTAGRAM_PRO', nombre: 'Instagram Pro + Ads', eur: 349, cobro: 'mes',
    desc: 'Gestión de Instagram más campañas de anuncios de Meta.',
    priceId: 'price_1U9qZVAtD7Uqmi3UeKHCisus',
  },
]

export const porClave = (clave: string) => CATALOGO.find((a) => a.clave === clave)

export const eur = (n: number) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
