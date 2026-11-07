import Link from "next/link"

import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"

export const metadata = {
  title: "Nouveau mot de passe · Espace client",
  robots: { index: false, follow: false },
}

export default function ReinitialiserMotDePassePage() {
  return (
    <VitrinePublicShell>
      <section className="bg-[#ECF4E9] py-10 sm:py-14 lg:py-20">
        <div className="container-x">
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-2xl border border-[#35A238]/14 bg-white p-5 shadow-[0_8px_32px_-12px_rgb(14_32_16/0.12)] sm:p-7">
              <h1 className="text-lg font-semibold text-brand-navy">Choisir un nouveau mot de passe</h1>
              <p className="mt-1.5 text-sm leading-snug text-brand-muted">
                Vous arrivez ici depuis le lien de réinitialisation envoyé par e-mail.
              </p>
              <div className="mt-6">
                <ResetPasswordForm />
              </div>
              <p className="mt-5 text-center text-sm text-brand-muted">
                <Link href="/login" className="font-medium text-[#35A238] hover:underline">
                  Retour à la connexion
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </VitrinePublicShell>
  )
}
