import type { Metadata } from "next"

import { ProWaitlistForm } from "@/components/pro/pro-waitlist-form"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"
import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { publicPageMetadata } from "@/lib/seo/public-page"

export const metadata: Metadata = publicPageMetadata(
  "Compte professionnel — bientôt disponible",
  "L'espace professionnel CORE ENVIRONNEMENT arrive bientôt. Laissez les coordonnées de votre entreprise pour être recontacté, sans création de compte ni paiement.",
  "/pro",
)

export default function ProPage() {
  return (
    <VitrinePublicShell
      heroContent={
        <>
          <div className="flex flex-wrap items-center gap-3">
            <p className="section-eyebrow section-eyebrow--inverse">
              Espace professionnel
            </p>
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/[0.1] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-md">
              Bientôt disponible
            </span>
          </div>
          <h1 className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] text-white [text-shadow:0_1px_28px_rgba(24,53,116,0.28)]">
            {comptePro.titre}
          </h1>
          <p className="mt-5 max-w-[540px] text-[17px] leading-[1.75] text-white/95 [text-shadow:0_1px_22px_rgba(24,53,116,0.22)] sm:text-[18px]">
            {comptePro.sousTitre}
          </p>
          <p className="mt-4 max-w-[540px] text-[15px] leading-[1.75] text-white/88 sm:text-[16px]">
            {comptePro.description}
          </p>
        </>
      }
    >
      <section className="bg-brand-bg-alt py-12 sm:py-16">
        <div className="container-x max-w-3xl space-y-6">
          <p className="text-[15px] leading-relaxed text-brand-muted">
            La connexion, la création de compte, le paiement et l&apos;abonnement ne
            sont pas encore ouverts. Déposez simplement vos coordonnées : nous vous
            prévenons à l&apos;ouverture.
          </p>

          <div className="card-vitrine p-6 sm:p-8">
            <h2 className="text-xl text-brand-navy">{comptePro.reassurance.titre}</h2>
            <p className="mt-1.5 text-sm text-brand-muted">
              Avantages prévus pour les entreprises partenaires
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
              {comptePro.reassurance.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="card-vitrine p-6 sm:p-8">
            <h2 className="text-xl text-brand-navy">Être recontacté</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
              Formulaire entreprise uniquement. Aucun compte n&apos;est créé, aucun
              paiement n&apos;est demandé.
            </p>
            <div className="mt-6">
              <ProWaitlistForm />
            </div>
          </div>
        </div>
      </section>
    </VitrinePublicShell>
  )
}
