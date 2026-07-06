import { SignIn } from "@clerk/nextjs"
import { LogoFull } from "@/components/Logo"

export default function LoginPage() {
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
          <h1 className="text-[1.5rem] font-semibold text-ink tracking-[-0.025em] mt-1">
            Bienvenido de vuelta
          </h1>
          <p className="text-dim text-[0.9rem] mt-1.5">
            Accede a tu panel de control
          </p>
        </div>

        {/* Clerk SignIn */}
        <SignIn
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
              formFieldSuccessText: { color: "#22c55e" },
            },
          }}
        />

        {/* Footer */}
        <p className="text-center text-[12px] text-muted mt-6">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-accent font-medium hover:text-accent-dark transition-colors">
            Empieza gratis
          </a>
        </p>
      </div>
    </div>
  )
}
