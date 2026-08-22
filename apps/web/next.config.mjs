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
    return viejas.map((source) => ({ source, destination: "/panel", permanent: false }))
  },
}

export default nextConfig
