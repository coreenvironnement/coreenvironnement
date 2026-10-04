import { Suspense } from "react"

import { LoginForm } from "@/components/login-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Espace client — bientôt disponible",
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
                Espace client — bientôt disponible
              </h1>
              <p className="mt-5 max-w-xl text-[17px] leading-[1.75] text-brand-muted sm:text-[18px]">
                Le suivi digital de vos commandes sera bientôt disponible depuis votre
                espace client.
              </p>
              <p className="mt-4 max-w-xl text-[15px] leading-[1.75] text-brand-muted sm:text-[16px]">
                En attendant, vous restez informé par e-mail de votre commande et de son
                état. Un expert CORE Environnement vous contactera également par téléphone
                pour organiser et confirmer votre livraison.
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
