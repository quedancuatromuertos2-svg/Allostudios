import { SignIn } from "@clerk/nextjs"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
            <div className="w-9 h-9 rounded-xl bg-violet-600 flex items-center justify-center text-white text-sm">
              V
            </div>
            VoiceFlow AI
          </div>
          <p className="text-gray-500 text-sm">Accede a tu panel de control</p>
        </div>
        <SignIn
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full shadow-none border border-gray-100 dark:border-gray-800 rounded-2xl",
              formButtonPrimary: "bg-violet-600 hover:bg-violet-700",
            },
          }}
        />
      </div>
    </div>
  )
}
