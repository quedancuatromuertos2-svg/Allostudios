import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "#f5f2ec" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden" style={{ background: "#d41f1f" }}>
              <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, color: "#fff", fontSize: "1rem", fontStyle: "italic" }}>a</span>
            </div>
            <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.3rem", color: "#1a1614" }}>
              <span style={{ color: "#d41f1f" }}>allo</span>Studios
            </span>
          </div>
          <p style={{ color: "#7a6f68", fontSize: ".9rem" }}>Accede a tu panel de control</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none rounded-2xl",
              formButtonPrimary: "bg-red-600 hover:bg-red-700",
            },
          }}
        />
      </div>
    </div>
  )
}
