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
    <VitrinePublicShell>
      <section className="bg-brand-bg-alt py-12 sm:py-16 lg:py-20">
        <div className="container-x max-w-3xl space-y-6">
          <div className="pb-2 sm:pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <p className="section-eyebrow">Espace professionnel</p>
              <span className="inline-flex items-center rounded-full border border-brand-green/25 bg-brand-green-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-green-dark">
                Bientôt disponible
              </span>
            </div>
            <h1 className="mt-4 text-[clamp(1.85rem,4.4vw,3rem)] leading-[1.1] text-brand-navy">
              {comptePro.titre}
            </h1>
            <p className="mt-5 max-w-2xl text-[17px] leading-[1.75] text-brand-muted sm:text-[18px]">
              {comptePro.sousTitre}
            </p>
            <p className="mt-4 max-w-2xl text-[15px] leading-[1.75] text-brand-muted sm:text-[16px]">
              {comptePro.description}
            </p>
          </div>

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
