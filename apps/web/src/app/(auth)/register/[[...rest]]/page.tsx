import { SignUp } from "@clerk/nextjs"
import { LogoFull } from "@/components/Logo"

export default function RegisterPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: "#FAFAF9" }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute w-[600px] h-[500px] rounded-full blur-[140px] -top-1/4 -right-1/4 opacity-[0.06] pointer-events-none"
        style={{ background: "radial-gradient(circle, #5B5BD6 0%, transparent 65%)" }}
      />
      <div
        className="absolute w-[400px] h-[350px] rounded-full blur-[120px] bottom-0 -left-1/4 opacity-[0.05] pointer-events-none"
        style={{ background: "radial-gradient(circle, #7C7CE8 0%, transparent 65%)" }}
      />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <a href="/" className="mb-4">
            <LogoFull size="lg" />
          </a>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold tracking-[0.08em] uppercase mb-3"
            style={{ background: "rgba(34,197,94,0.06)", borderColor: "rgba(34,197,94,0.2)", color: "#16a34a" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
            7 días gratis · Sin compromiso
          </div>
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-[-0.025em]">
            Crea tu cuenta
          </h1>
          <p className="text-dim text-[0.9rem] mt-1.5">
            Tu asistente IA estará listo en 2 minutos
          </p>
        </div>

        {/* Clerk SignUp */}
        <SignUp
          appearance={{
            variables: {
              colorPrimary: "#5B5BD6",
              colorBackground: "#FFFFFF",
              colorInputBackground: "#F4F3F1",
              colorText: "#18181B",
              colorTextSecondary: "#706D69",
              colorDanger: "#ef4444",
              borderRadius: "0.75rem",
              fontFamily: "Inter, system-ui, sans-serif",
              spacingUnit: "1rem",
            },
            elements: {
              rootBox: "w-full",
              card: {
                background: "white",
                border: "1px solid #E8E6E3",
                borderRadius: "1.5rem",
                boxShadow: "0 4px 24px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)",
                padding: "2rem",
              },
              headerTitle: { display: "none" },
              headerSubtitle: { display: "none" },
              socialButtonsBlockButton: {
                border: "1px solid #E8E6E3",
                borderRadius: "0.75rem",
                background: "#F4F3F1",
                color: "#18181B",
                fontWeight: "500",
                transition: "all 0.2s",
              },
              dividerLine: { background: "#E8E6E3" },
              dividerText: { color: "#A09D99", fontSize: "12px" },
              formFieldLabel: {
                color: "#18181B",
                fontWeight: "500",
                fontSize: "13.5px",
              },
              formFieldInput: {
                background: "#F4F3F1",
                border: "1.5px solid #E8E6E3",
                borderRadius: "0.625rem",
                color: "#18181B",
                fontSize: "14px",
                transition: "all 0.2s",
              },
              formButtonPrimary: {
                background: "#5B5BD6",
                borderRadius: "0.75rem",
                fontWeight: "600",
                fontSize: "14px",
                letterSpacing: "-0.01em",
                transition: "all 0.2s",
              },
              footerActionLink: { color: "#5B5BD6", fontWeight: "500" },
              identityPreviewText: { color: "#18181B" },
              identityPreviewEditButton: { color: "#5B5BD6" },
            },
          }}
        />

        {/* Trust indicators */}
        <div className="mt-6 flex items-center justify-center gap-5">
          {[
            { icon: "🔒", text: "Datos seguros" },
            { icon: "💳", text: "Sin tarjeta ahora" },
            { icon: "✕", text: "Cancela cuando quieras" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-1.5">
              <span className="text-[13px]">{item.icon}</span>
              <span className="text-[11.5px] text-muted">{item.text}</span>
            </div>
          ))}
        </div>

        <p className="text-center text-[12px] text-muted mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/login" className="text-accent font-medium hover:text-accent-dark transition-colors">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  )
}
