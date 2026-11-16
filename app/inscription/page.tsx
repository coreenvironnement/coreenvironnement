import { Suspense } from "react"

import { AuthPageShell } from "@/components/auth/auth-page-shell"
import { SignupForm } from "@/components/auth/signup-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Créer un compte · CORE Environnement",
  robots: { index: false, follow: false },
}

export default function InscriptionPage() {
  return (
    <VitrinePublicShell hideChrome withMobileActionBar>
      <AuthPageShell
        desktopTitle="Créez votre compte CORE"
        desktopIntro="Retrouvez vos commandes et suivez leur avancement depuis votre espace client."
      >
        <Suspense fallback={<p className="text-sm text-brand-muted">Chargement…</p>}>
          <SignupForm />
        </Suspense>
      </AuthPageShell>
    </VitrinePublicShell>
  )
}