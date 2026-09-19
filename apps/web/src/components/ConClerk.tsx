import { ClerkProvider } from "@clerk/nextjs"

/*  Envuelve las zonas con sesión (login, panel, dashboard, admin, onboarding, manual). Antes el
    ClerkProvider estaba en el layout raíz y cada página pública cargaba clerk.browser.js sin usarlo. */
export default function ConClerk({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      publishableKey="pk_live_Y2xlcmsuYWxsb3N0dWRpb3MubmV0JA"
      signInUrl="/login"
      signUpUrl="/register"
      afterSignInUrl="/panel"
      afterSignUpUrl="/panel"
    >
      {children}
    </ClerkProvider>
  )
}
