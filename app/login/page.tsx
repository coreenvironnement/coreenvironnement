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
      <section className="bg-brand-bg-alt py-12 sm:py-16 lg:py-20">
        <div className="container-x">
          <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div className="pt-2 lg:pt-6">
              <p className="section-eyebrow">Espace client</p>
              <h1 className="mt-4 max-w-2xl text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] text-brand-navy">
                Votre espace client
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-[1.75] text-brand-muted sm:text-[18px]">
                Après une commande particulier, un compte est créé avec votre e-mail.
                Confirmez-le puis connectez-vous pour retrouver vos commandes.
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-brand-muted sm:text-[16px]">
                Vous n’avez pas encore de mot de passe ? Utilisez le lien magique par
                e-mail ci-contre. Les comptes chantier professionnels conservent l’accès
                dashboard habituel.
              </p>
            </div>

            <div className="w-full">
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
