import { Suspense } from "react"

import { LoginForm } from "@/components/login-form"

export const metadata = {
  title: "Connexion · Espace client",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center px-4 py-12">
      <Suspense fallback={<p className="text-sm text-muted-foreground">Chargement…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
