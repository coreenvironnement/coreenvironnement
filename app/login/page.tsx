import { Suspense } from "react"

import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { LoginForm } from "@/components/login-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Connexion · Espace client",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <VitrinePublicShell hideChrome withMobileActionBar>
      <AuthPageShell
        desktopTitle="Retrouvez vos commandes"
        desktopIntro="Consultez l’état de vos commandes et les dates de livraison prévues."
      >
        <Suspense fallback={<p className="text-sm text-brand-muted">Chargement…</p>}>
          <LoginForm />
        </Suspense>
      </AuthPageShell>
    </VitrinePublicShell>
  )
}