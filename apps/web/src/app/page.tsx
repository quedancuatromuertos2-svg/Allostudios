import Link from "next/link"

export default function HomePage() {
  return (
    <div style={{ background: "#f5f2ec", minHeight: "100vh", fontFamily: "Georgia, serif" }}>
      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.2rem 2.5rem", borderBottom: "1px solid #e8e2d9" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#d41f1f", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontWeight: 900, color: "#fff", fontSize: "1rem", fontStyle: "italic" }}>a</span>
          </div>
          <span style={{ fontWeight: 700, fontSize: "1.2rem", color: "#1a1614" }}>
            <span style={{ color: "#d41f1f" }}>allo</span>Studios
          </span>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          <Link href="/login" style={{ color: "#5a4f48", textDecoration: "none", fontSize: "0.9rem" }}>Acceder</Link>
          <Link href="/register" style={{ background: "#d41f1f", color: "#fff", padding: "0.5rem 1.2rem", borderRadius: "99px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
            Empezar gratis
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: "center", padding: "6rem 1.5rem 4rem" }}>
        <p style={{ color: "#d41f1f", fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.2rem" }}>
          Recepcionista con IA para tu negocio
        </p>
        <h1 style={{ fontSize: "clamp(2.2rem, 6vw, 3.8rem)", fontWeight: 700, color: "#1a1614", lineHeight: 1.15, maxWidth: 720, margin: "0 auto 1.5rem" }}>
          Atiende llamadas y reserva citas mientras tú descansas
        </h1>
        <p style={{ color: "#7a6f68", fontSize: "1.1rem", maxWidth: 560, margin: "0 auto 2.5rem", lineHeight: 1.7, fontFamily: "system-ui, sans-serif" }}>
          Tu agente de voz con IA atiende llamadas 24/7, responde preguntas, reserva citas y captura leads — sin que tengas que hacer nada.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" style={{ background: "#d41f1f", color: "#fff", padding: "0.85rem 2.2rem", borderRadius: "99px", textDecoration: "none", fontSize: "1rem", fontWeight: 700, display: "inline-block" }}>
            Prueba gratis 7 días →
          </Link>
          <Link href="/login" style={{ background: "#fff", color: "#1a1614", padding: "0.85rem 2.2rem", borderRadius: "99px", textDecoration: "none", fontSize: "1rem", fontWeight: 600, border: "1.5px solid #d8d0c8", display: "inline-block" }}>
            Ya tengo cuenta
          </Link>
        </div>
        <p style={{ color: "#b0a89e", fontSize: "0.8rem", marginTop: "1rem", fontFamily: "system-ui, sans-serif" }}>Sin tarjeta de crédito • Cancela cuando quieras</p>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 960, margin: "0 auto", padding: "2rem 1.5rem 5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
        {[
          { icon: "📞", title: "Atiende llamadas 24/7", desc: "Tu agente de IA contesta en segundos, en tu idioma, con el tono de tu negocio." },
          { icon: "📅", title: "Reservas automáticas", desc: "Agenda citas directamente en tu calendario sin que tengas que intervenir." },
          { icon: "🎯", title: "Captura de leads", desc: "Recoge datos de clientes, clasifica intenciones y te avisa de los más calientes." },
          { icon: "📊", title: "Dashboard en tiempo real", desc: "Ve todas las llamadas, citas y métricas de tu negocio en un solo lugar." },
          { icon: "🔧", title: "Configura sin código", desc: "Personaliza el nombre, voz, horarios y respuestas de tu agente en minutos." },
          { icon: "💳", title: "Precios claros", desc: "Planes desde 49€/mes. Sin sorpresas. Sin contratos largos." },
        ].map(({ icon, title, desc }) => (
          <div key={title} style={{ background: "#fff", borderRadius: 16, padding: "1.75rem", border: "1px solid #ede7df" }}>
            <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{icon}</div>
            <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#1a1614", marginBottom: "0.5rem" }}>{title}</h3>
            <p style={{ color: "#7a6f68", fontSize: "0.875rem", lineHeight: 1.6, fontFamily: "system-ui, sans-serif", margin: 0 }}>{desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section style={{ background: "#fff", padding: "5rem 1.5rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#1a1614", marginBottom: "0.75rem" }}>Precios sencillos</h2>
        <p style={{ color: "#7a6f68", marginBottom: "3rem", fontFamily: "system-ui, sans-serif" }}>7 días gratis, sin necesidad de tarjeta.</p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", flexWrap: "wrap", maxWidth: 900, margin: "0 auto" }}>
          {[
            { name: "Starter", price: "49", calls: "300 llamadas/mes", features: ["1 agente de voz", "Reservas automáticas", "Dashboard básico", "Soporte por email"] },
            { name: "Professional", price: "99", calls: "1.000 llamadas/mes", features: ["3 agentes de voz", "Analytics avanzado", "Integraciones CRM", "Soporte prioritario"], highlight: true },
            { name: "Enterprise", price: "249", calls: "Ilimitadas", features: ["Agentes ilimitados", "Marca blanca", "API acceso completo", "Account manager dedicado"] },
          ].map(({ name, price, calls, features, highlight }) => (
            <div key={name} style={{ background: highlight ? "#d41f1f" : "#f5f2ec", borderRadius: 20, padding: "2rem 1.75rem", minWidth: 240, flex: 1, maxWidth: 280, border: highlight ? "none" : "1.5px solid #ede7df" }}>
              <h3 style={{ color: highlight ? "#fff" : "#1a1614", fontWeight: 700, fontSize: "1.1rem", marginBottom: "0.25rem" }}>{name}</h3>
              <p style={{ color: highlight ? "#ffb3b3" : "#7a6f68", fontSize: "0.8rem", marginBottom: "1.25rem", fontFamily: "system-ui, sans-serif" }}>{calls}</p>
              <p style={{ color: highlight ? "#fff" : "#1a1614", fontSize: "2.5rem", fontWeight: 900, marginBottom: "1.5rem" }}>{price}<span style={{ fontSize: "1rem", fontWeight: 400 }}>€/mes</span></p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", textAlign: "left" }}>
                {features.map(f => (
                  <li key={f} style={{ color: highlight ? "#ffe0e0" : "#5a4f48", fontSize: "0.85rem", padding: "0.3rem 0", fontFamily: "system-ui, sans-serif" }}>✓ {f}</li>
                ))}
              </ul>
              <Link href="/register" style={{ background: highlight ? "#fff" : "#d41f1f", color: highlight ? "#d41f1f" : "#fff", padding: "0.7rem 1.5rem", borderRadius: "99px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, display: "block", textAlign: "center" }}>
                Empezar gratis
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ textAlign: "center", padding: "5rem 1.5rem" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, color: "#1a1614", marginBottom: "1rem" }}>¿Listo para automatizar tu recepción?</h2>
        <p style={{ color: "#7a6f68", marginBottom: "2rem", fontFamily: "system-ui, sans-serif" }}>Únete a los negocios que ya nunca pierden una llamada.</p>
        <Link href="/register" style={{ background: "#d41f1f", color: "#fff", padding: "1rem 2.5rem", borderRadius: "99px", textDecoration: "none", fontSize: "1.05rem", fontWeight: 700, display: "inline-block" }}>
          Crear mi cuenta gratis →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #e8e2d9", padding: "1.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <span style={{ color: "#b0a89e", fontSize: "0.8rem", fontFamily: "system-ui, sans-serif" }}>© 2026 alloStudios. Todos los derechos reservados.</span>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link href="/login" style={{ color: "#7a6f68", textDecoration: "none", fontSize: "0.8rem", fontFamily: "system-ui, sans-serif" }}>Acceder</Link>
          <Link href="/register" style={{ color: "#7a6f68", textDecoration: "none", fontSize: "0.8rem", fontFamily: "system-ui, sans-serif" }}>Registro</Link>
        </div>
      </footer>
    </div>
  )
}
