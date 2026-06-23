const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM = "AlloStudios <hola@allostudios.net>"
const ALERT_EMAIL = process.env.ALERT_EMAIL || "hola@allostudios.net"

async function send(to: string, subject: string, html: string) {
  if (!RESEND_API_KEY) return
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  })
}

// Internal alert to the AlloStudios team when monitoring detects problems
export async function sendAlertEmail(subject: string, issues: string[], repairs: string[]) {
  const list = (arr: string[], color: string) =>
    arr.length
      ? `<ul style="margin:8px 0;padding-left:20px;color:#333;font-size:14px;line-height:1.6;">${arr.map((i) => `<li style="color:${color}">${i}</li>`).join("")}</ul>`
      : `<p style="color:#999;font-size:13px;margin:8px 0;">Ninguno</p>`
  const html = `
<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAFAF9;margin:0;padding:32px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #E8E8E4;overflow:hidden;">
    <div style="background:#16161a;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:18px;font-weight:700;">🔔 AlloStudios — Monitorización</h1>
    </div>
    <div style="padding:28px 32px;">
      <p style="color:#1a1a1a;font-size:15px;margin:0 0 4px;font-weight:600;">Incidencias detectadas:</p>
      ${list(issues, "#ef4444")}
      <p style="color:#1a1a1a;font-size:15px;margin:18px 0 4px;font-weight:600;">Reparaciones automáticas:</p>
      ${list(repairs, "#16a34a")}
      <p style="color:#999;font-size:12px;margin:24px 0 0;">Revisa el panel de admin para más detalle. — Monitor AlloStudios</p>
    </div>
  </div>
</body></html>`
  await send(ALERT_EMAIL, subject, html)
}

export async function sendWelcomeEmail(to: string, businessName: string, planName: string) {
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAFAF9;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #E8E8E4;overflow:hidden;">
    <div style="background:#5B5BD6;padding:32px 40px;">
      <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;letter-spacing:-0.5px;">AlloStudios</h1>
      <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Tu recepcionista IA está lista</p>
    </div>
    <div style="padding:40px;">
      <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 12px;font-weight:600;">¡Bienvenido a ${planName}!</h2>
      <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
        Tu agente IA para <strong>${businessName}</strong> ya está configurado y listo para atender llamadas.
        Tienes <strong>7 días de prueba gratuita</strong> — sin límites, sin compromisos.
      </p>
      <div style="background:#F4F4F8;border-radius:12px;padding:20px 24px;margin:0 0 28px;">
        <p style="margin:0 0 12px;color:#1a1a1a;font-size:13px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">Próximos pasos</p>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${["Configura el nombre y voz del agente", "Prueba una llamada desde el panel", "Comparte el número con tus clientes"].map((s, i) => `
          <div style="display:flex;align-items:center;gap:12px;">
            <div style="width:24px;height:24px;background:#5B5BD6;border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <span style="color:#fff;font-size:11px;font-weight:700;">${i + 1}</span>
            </div>
            <span style="color:#444;font-size:14px;">${s}</span>
          </div>`).join("")}
        </div>
      </div>
      <a href="https://allostudios.net/ai-config"
        style="display:inline-block;background:#5B5BD6;color:#fff;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
        Configurar mi agente →
      </a>
      <p style="color:#999;font-size:12px;margin:28px 0 0;line-height:1.5;">
        Cualquier duda, responde este email o escríbenos por WhatsApp.<br/>
        — El equipo de AlloStudios
      </p>
    </div>
  </div>
</body>
</html>`
  await send(to, `¡Bienvenido a AlloStudios! Tu agente para ${businessName} está listo`, html)
}

// Solicitud de contratación / propuesta enviada desde la web pública.
export async function sendLeadEmail(d: {
  nombre: string; inmobiliaria?: string; telefono: string; email?: string; servicio: string; mensaje?: string;
}) {
  const row = (k: string, v?: string) =>
    v ? `<tr><td style="padding:8px 0;color:#888;font-size:13px;width:130px;vertical-align:top;">${k}</td><td style="padding:8px 0;color:#1a1a1a;font-size:14px;font-weight:600;">${v}</td></tr>` : ''
  const digits = d.telefono.replace(/[^\d]/g, '')
  const wa = digits.length === 9 ? '34' + digits : digits
  const html = `
<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAFAF9;margin:0;padding:32px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #E8E8E4;overflow:hidden;">
    <div style="background:#5B5BD6;padding:24px 32px;">
      <h1 style="color:#fff;margin:0;font-size:18px;font-weight:700;">🔔 Nueva solicitud desde la web</h1>
      <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">${d.servicio}</p>
    </div>
    <div style="padding:28px 32px;">
      <table style="width:100%;border-collapse:collapse;">
        ${row('Nombre', d.nombre)}
        ${row('Inmobiliaria', d.inmobiliaria)}
        ${row('Teléfono', d.telefono)}
        ${row('Email', d.email)}
        ${row('Servicio', d.servicio)}
        ${row('Mensaje', d.mensaje)}
      </table>
      <a href="https://wa.me/${wa}" style="display:inline-block;margin-top:22px;background:#22c55e;color:#fff;padding:11px 26px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">Responder por WhatsApp →</a>
    </div>
  </div>
</body></html>`
  await send(ALERT_EMAIL, `🔔 Solicitud: ${d.servicio} — ${d.nombre}`, html)
}

export async function sendTrialEndingEmail(to: string, businessName: string, daysLeft: number) {
  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#FAFAF9;margin:0;padding:40px 20px;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;border:1px solid #E8E8E4;padding:40px;">
    <h2 style="color:#1a1a1a;font-size:20px;margin:0 0 12px;">Tu prueba termina en ${daysLeft} ${daysLeft === 1 ? "día" : "días"}</h2>
    <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 24px;">
      El agente IA de <strong>${businessName}</strong> dejará de atender llamadas cuando expire la prueba.
      Activa tu plan para que no se interrumpa el servicio.
    </p>
    <a href="https://allostudios.net/billing"
      style="display:inline-block;background:#5B5BD6;color:#fff;padding:12px 28px;border-radius:10px;font-size:14px;font-weight:600;text-decoration:none;">
      Activar plan →
    </a>
  </div>
</body>
</html>`
  await send(to, `Tu prueba de AlloStudios termina en ${daysLeft} ${daysLeft === 1 ? "día" : "días"}`, html)
}
