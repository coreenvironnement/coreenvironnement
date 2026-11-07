import { Suspense } from "react"

import { LoginForm } from "@/components/login-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Connexion · Espace client",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <VitrinePublicShell>
      <section className="bg-[#ECF4E9] py-10 sm:py-14 lg:py-20">
        <div className="container-x">
          <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1fr] lg:gap-14">
            <div className="hidden pt-2 lg:block lg:pt-6">
              <p className="section-eyebrow">Espace client</p>
              <h1 className="mt-4 max-w-xl text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.12] text-brand-navy">
                Un seul accès à votre espace
              </h1>
              <p className="mt-4 max-w-md text-[16px] leading-relaxed text-brand-muted">
                Particulier ou professionnel : les mêmes identifiants. Après connexion, nous
                vous orientons vers le bon tableau de bord.
              </p>
            </div>

            <div className="w-full max-lg:mx-auto max-lg:max-w-md">
              <p className="mb-4 text-center text-sm font-medium text-brand-muted lg:hidden">
                Espace client CORE
              </p>
              <Suspense
                fallback={<p className="text-sm text-brand-muted">Chargement…</p>}
              >
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </VitrinePublicShell>
  )
}
