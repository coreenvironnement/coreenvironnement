import { Suspense } from "react"

import { SignupForm } from "@/components/auth/signup-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Créer un compte · CORE Environnement",
  robots: { index: false, follow: false },
}

export default function InscriptionPage() {
  return (
    <VitrinePublicShell>
      <section className="bg-[#ECF4E9] py-10 sm:py-14 lg:py-20">
        <div className="container-x">
          <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="hidden pt-2 lg:block lg:pt-6">
              <p className="section-eyebrow">Espace client</p>
              <h1 className="mt-4 max-w-xl text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.12] text-brand-navy">
                Particulier ou professionnel
              </h1>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-brand-muted">
                Un compte pour commander, suivre vos bennes et accéder à votre espace. Le
                parcours s’adapte au profil que vous choisissez.
              </p>
            </div>

            <div className="w-full max-lg:mx-auto max-lg:max-w-md">
              <p className="mb-4 text-center text-sm font-medium text-brand-muted lg:hidden">
                Nouveau sur CORE
              </p>
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
