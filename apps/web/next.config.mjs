/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "api.dicebear.com"],
  },

  // El panel de control del antiguo producto (bot de voz que agendaba citas) ya no
  // se vende: quien entre a la web va al panel de captación. El código sigue ahí
  // por si algún día se recupera, pero no se llega a él desde fuera.
  async redirects() {
    const viejas = [
      "/dashboard",
      "/onboarding",
      "/ai-config",
      "/analytics",
      "/calendar",
      "/calls",
      "/team",
      "/settings",
    ]
    // Productos retirados con el modelo de suscripción (18/09/2026): Instagram y los
    // mantenimientos sueltos ya no existen; las claves *_MES pasan a ser el producto.
    const retirados = {
      "/contratar/instagram": "/contratar",
      "/contratar/instagram_pro": "/contratar/pack_todo",
      "/contratar/mantenimiento": "/contratar",
      "/contratar/mant_cine": "/contratar",
      "/contratar/asistente_ia_mes": "/contratar/asistente_ia",
      "/contratar/seo_local_mes": "/contratar/seo_local",
      "/pricing": "/#precios", // página del bot de voz antiguo (399 €/mes)
    }
    return [
      ...viejas.map((source) => ({ source, destination: "/panel", permanent: false })),
      ...Object.entries(retirados).map(([source, destination]) => ({ source, destination, permanent: true })),
    ]
  },
}

export default nextConfig
