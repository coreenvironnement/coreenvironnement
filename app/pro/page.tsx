import Link from "next/link"

import { CompteProForm } from "@/components/pro/compte-pro-form"
import { ProAuthPanel } from "@/components/pro/pro-auth-panel"
import { SubscriptionPanel } from "@/components/pro/subscription-panel"
import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { statutCompteProLabel } from "@/lib/compte-pro/labels"
import { formatDateFr } from "@/lib/format/date"
import { createClient } from "@/lib/supabase/server"
import { isStripeConfigured } from "@/lib/stripe/server"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata = {
  title: "Compte professionnel",
  description: comptePro.description,
}

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
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wider text-primary">
          Espace professionnel
        </p>
        <h1 className="text-3xl font-bold text-brand-navy">{comptePro.titre}</h1>
        <p className="text-lg text-muted-foreground">{comptePro.sousTitre}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{comptePro.description}</p>
      </div>

      {subscriptionParam === "success" ? (
        <p className="mt-6 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-brand-navy">
          Paiement reçu. Votre abonnement sera activé dans quelques instants après confirmation
          Stripe.
        </p>
      ) : subscriptionParam === "cancelled" ? (
        <p className="mt-6 rounded-xl border border-border/60 bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          Paiement annulé. Vous pouvez réessayer quand vous le souhaitez.
        </p>
      ) : null}

      <Card className="mt-8 border-brand-navy/12">
        <CardHeader>
          <CardTitle>{comptePro.reassurance.titre}</CardTitle>
          <CardDescription>Abonnement {comptePro.abonnement}</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            {comptePro.reassurance.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="mt-10">
        {!user ? (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Créez un accès ou connectez-vous pour déposer votre dossier (KBIS + RIB).
            </p>
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
          <div className="rounded-2xl border border-brand-navy/15 bg-muted/30 p-8 text-center">
            <p className="text-lg font-semibold text-brand-navy">
              {statutCompteProLabel("pending")}
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              {comptePro.reassurance.footer}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Entreprise : <strong>{compte.raison_sociale}</strong>
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <CompteProForm
              defaultEmail={compte?.contact_email ?? user.email ?? undefined}
              isResubmit={compte?.status === "rejected"}
              previousNotes={compte?.review_notes}
            />
          </div>
        )}
      </div>

      {user ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link href="/dashboard" className="text-primary underline-offset-2 hover:underline">
            Retour à l&apos;espace client
          </Link>
        </p>
      ) : null}
    </div>
  )
}
