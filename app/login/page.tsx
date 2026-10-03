import { Suspense } from "react"

import { LoginForm } from "@/components/login-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Espace client — bientôt disponible",
  robots: { index: false, follow: false },
}

export default function LoginPage() {
  return (
    <VitrinePublicShell
      heroContent={
        <>
          <p className="section-eyebrow section-eyebrow--inverse">Espace client</p>
          <h1 className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] text-white [text-shadow:0_1px_28px_rgba(24,53,116,0.28)]">
            Espace client — bientôt disponible
          </h1>
          <p className="mt-5 max-w-[540px] text-[17px] leading-[1.75] text-white/95 [text-shadow:0_1px_22px_rgba(24,53,116,0.22)] sm:text-[18px]">
            Le suivi digital de vos commandes sera bientôt disponible depuis votre
            espace client.
          </p>
          <p className="mt-4 max-w-[540px] text-[15px] leading-[1.75] text-white/88 sm:text-[16px]">
            En attendant, vous restez informé par e-mail de votre commande et de son
            état. Un expert CORE Environnement vous contactera également par téléphone
            pour organiser et confirmer votre livraison.
          </p>
        </>
      }
    >
      <section className="bg-brand-bg-alt py-12 sm:py-16">
        <div className="container-x">
          <div className="mx-auto w-full max-w-[440px]">
            <Suspense
              fallback={<p className="text-sm text-brand-muted">Chargement…</p>}
            >
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </section>
    </VitrinePublicShell>
  )
}
