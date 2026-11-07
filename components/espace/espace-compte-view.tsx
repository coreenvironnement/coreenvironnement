import Link from "next/link"

import { CompteProForm } from "@/components/pro/compte-pro-form"
import { ProAuthPanel } from "@/components/pro/pro-auth-panel"
import { SubscriptionPanel } from "@/components/pro/subscription-panel"
import { CompteProSeatsPanel } from "@/components/espace/compte-pro-seats-panel"
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import { statutCompteProLabel } from "@/lib/compte-pro/labels"
import type { CompteProSeatRow } from "@/lib/compte-pro/seats"
import { ABONNEMENT_PRO_HT } from "@/lib/cdc/referentiels"
import { formatDateFr } from "@/lib/format/date"

type CompteRow = {
  status: string
  raison_sociale: string
  contact_email: string | null
  subscription_active: boolean | null
  subscription_status: string | null
  subscription_current_period_end: string | null
  payment_mode: string | null
  review_notes: string | null
}

type Props = {
  user: { email?: string | null }
  compte: CompteRow | null
  seats: CompteProSeatRow[]
  stripeConfigured: boolean
  subscriptionBanner?: "success" | "cancelled" | null
  reason?: string | null
}

export function EspaceCompteView({
  user,
  compte,
  seats,
  stripeConfigured,
  subscriptionBanner,
  reason,
}: Props) {
  const canManageSeats = Boolean(compte && compte.status === "approved")

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <EspacePageHeader
        title="Entreprise & abonnement"
        meta={`${ABONNEMENT_PRO_HT} € HT / mois par utilisateur`}
      />

      {subscriptionBanner === "success" ? (
        <p className="rounded-xl border border-[#35A238]/30 bg-[#ECF4E9] px-3 py-2 text-sm">
          Paiement reçu — activation en cours.
        </p>
      ) : subscriptionBanner === "cancelled" ? (
        <p className="rounded-xl border border-brand-navy/10 bg-white px-3 py-2 text-sm text-muted-foreground">
          Paiement annulé.
        </p>
      ) : null}

      {reason === "dashboard_subscription" ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm">
          Abonnement actif requis pour le suivi chantier et les documents.
        </p>
      ) : null}

      {compte ? (
        <CompteProSeatsPanel
          seats={seats}
          canManage={canManageSeats}
          ownerEmail={compte.contact_email ?? user.email ?? null}
        />
      ) : null}

      <EspacePanel>
        {!user ? (
          <ProAuthPanel />
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
          <div className="space-y-2 text-sm">
            <p className="text-lg font-semibold text-brand-navy">
              {statutCompteProLabel("pending")}
            </p>
            <p className="text-muted-foreground">
              Entreprise : <strong>{compte.raison_sociale}</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="font-medium text-brand-navy">Dossier professionnel</p>
            <CompteProForm
              defaultEmail={compte?.contact_email ?? user.email ?? undefined}
              isResubmit={compte?.status === "rejected"}
              previousNotes={compte?.review_notes}
            />
          </div>
        )}
      </EspacePanel>

      {compte?.status === "approved" && compte.subscription_active ? (
        <p className="text-center text-sm text-muted-foreground">
          <Link href="/espace/chantier" className="font-medium text-[#35A238] hover:underline">
            Ouvrir le suivi chantier
          </Link>
        </p>
      ) : null}
    </div>
  )
}
