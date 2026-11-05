import type { Metadata } from "next"
import Link from "next/link"

import { CompteProForm } from "@/components/pro/compte-pro-form"
import { ProAuthPanel } from "@/components/pro/pro-auth-panel"
import { SubscriptionPanel } from "@/components/pro/subscription-panel"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"
import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { statutCompteProLabel } from "@/lib/compte-pro/labels"
import { formatDateFr } from "@/lib/format/date"
import { publicPageMetadata } from "@/lib/seo/public-page"
import { createClient } from "@/lib/supabase/server"
import { isStripeConfigured } from "@/lib/stripe/server"

export const metadata: Metadata = publicPageMetadata(
  "Compte professionnel",
  comptePro.description,
  "/pro"
)

type PageProps = {
  searchParams: Promise<{ subscription?: string }>
}

export default async function ProPage({ searchParams }: PageProps) {
  const { subscription: subscriptionParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let compte = null
  if (user) {
    const { data } = await supabase
      .from("comptes_pro")
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle()
    compte = data
  }

  const stripeConfigured = isStripeConfigured()

  return (
    <VitrinePublicShell>
      <section className="bg-brand-bg-alt py-12 sm:py-16 lg:py-20">
        <div className="container-x max-w-3xl space-y-6">
          <div className="pb-2 sm:pb-4">
            <p className="section-eyebrow">Espace professionnel</p>
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

          {subscriptionParam === "success" ? (
            <p className="rounded-xl border border-brand-green/25 bg-brand-green-soft px-4 py-3 text-sm text-brand-navy">
              Paiement reçu. Votre abonnement sera activé dans quelques instants après
              confirmation Stripe.
            </p>
          ) : subscriptionParam === "cancelled" ? (
            <p className="rounded-xl border border-brand-navy/12 bg-muted/30 px-4 py-3 text-sm text-brand-muted">
              Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.
            </p>
          ) : null}

          <div className="card-vitrine p-6 sm:p-8">
            <h2 className="text-xl text-brand-navy">{comptePro.reassurance.titre}</h2>
            <p className="mt-1.5 text-sm text-brand-muted">
              Abonnement espace client : {comptePro.abonnement}
            </p>
            <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-brand-muted">
              {comptePro.reassurance.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="card-vitrine p-6 sm:p-8">
            {!user ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl text-brand-navy">Créer ou accéder à votre dossier</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-brand-muted">
                    Créez un accès ou connectez-vous pour déposer votre dossier (KBIS + RIB).
                    Après validation, activez l&apos;abonnement {comptePro.abonnement}.
                  </p>
                </div>
                <ProAuthPanel />
              </div>
            ) : compte?.status === "approved" ? (
              <SubscriptionPanel
                subscriptionActive={Boolean(compte.subscription_active)}
                subscriptionStatus={compte.subscription_status}
                periodEndLabel={
                  compte.subscription_current_period_end
                    ? formatDateFr(compte.subscription_current_period_end)
                    : null
                }
                paymentMode={compte.payment_mode}
                stripeConfigured={stripeConfigured}
              />
            ) : compte?.status === "pending" ? (
              <div className="text-center">
                <p className="text-lg font-semibold text-brand-navy">
                  {statutCompteProLabel("pending")}
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm text-brand-muted">
                  {comptePro.reassurance.footer}
                </p>
                <p className="mt-4 text-sm text-brand-muted">
                  Entreprise : <strong>{compte.raison_sociale}</strong>
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl text-brand-navy">Demande de compte professionnel</h2>
                  <p className="mt-1.5 text-sm text-brand-muted">
                    Complétez le formulaire ci-dessous. Notre service financier examine
                    chaque dossier sous 24 h ouvrées.
                  </p>
                </div>
                <CompteProForm
                  defaultEmail={compte?.contact_email ?? user.email ?? undefined}
                  isResubmit={compte?.status === "rejected"}
                  previousNotes={compte?.review_notes}
                />
              </div>
            )}
          </div>

          {user ? (
            <p className="text-center text-sm text-brand-muted">
              <Link href="/dashboard" className="text-brand-green underline-offset-2 hover:underline">
                Retour à l&apos;espace client
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    </VitrinePublicShell>
  )
}
