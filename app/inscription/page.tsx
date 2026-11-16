import { Suspense } from "react"

import { AuthBackLink } from "@/components/auth/auth-back-link"
import { SignupForm } from "@/components/auth/signup-form"
import { VitrineLogo } from "@/components/vitrine/logo"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Créer un compte · CORE Environnement",
  robots: { index: false, follow: false },
}

export default function InscriptionPage() {
  return (
    <VitrinePublicShell hideChrome withMobileActionBar>
      <section className="bg-[#ECF4E9] pt-6 pb-10 sm:py-14 lg:py-20">
        <div className="container-x">
          <div className="mb-4 pt-[env(safe-area-inset-top,0px)] sm:mb-6">
            <AuthBackLink />
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="hidden pt-2 lg:block lg:pt-6">
              <p className="section-eyebrow">Espace client</p>
              <h1 className="mt-4 max-w-xl text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.12] text-brand-navy">
                Créez votre compte CORE
              </h1>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-brand-muted">
                Retrouvez vos commandes et suivez leur avancement depuis votre espace
                client.
              </p>
            </div>

            <div className="w-full max-lg:mx-auto max-lg:max-w-md">
              <div className="mb-8 flex justify-center sm:mb-10">
                <VitrineLogo priority variant="login" />
              </div>
              <Suspense
                fallback={<p className="text-sm text-brand-muted">Chargement…</p>}
              >
                <SignupForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </VitrinePublicShell>
  )
}
