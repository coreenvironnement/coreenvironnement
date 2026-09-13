"use client"

import { useState, useTransition } from "react"
import { CreditCard, Loader2, Settings2 } from "lucide-react"
import Link from "next/link"

import { openBillingPortal, startProSubscription } from "@/app/pro/stripe-actions"
import { ABONNEMENT_PRO_HT } from "@/lib/cdc/referentiels"
import { paymentModeLabel } from "@/lib/compte-pro/labels"
import { Button } from "@/components/ui/button"

type Props = {
  subscriptionActive: boolean
  subscriptionStatus: string | null
  periodEndLabel: string | null
  paymentMode: string | null
  stripeConfigured: boolean
}

export function SubscriptionPanel({
  subscriptionActive,
  subscriptionStatus,
  periodEndLabel,
  paymentMode,
  stripeConfigured,
}: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function runAction(action: () => Promise<{ error: string } | never>) {
    setError(null)
    startTransition(async () => {
      const result = await action()
      if (result && "error" in result && result.error) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/10 p-8 space-y-4">
      <div>
        <p className="text-lg font-semibold text-brand-navy">Compte professionnel validé</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Mode de règlement prestations : {paymentModeLabel(paymentMode)}
        </p>
      </div>

      <div className="rounded-xl border border-brand-navy/10 bg-background/80 p-4 text-sm">
        <p className="font-medium text-brand-navy">
          Abonnement espace client · {ABONNEMENT_PRO_HT} € HT / mois
        </p>
        {subscriptionActive ? (
          <p className="mt-2 text-muted-foreground">
            Abonnement actif
            {subscriptionStatus ? ` (${subscriptionStatus})` : null}
            {periodEndLabel ? ` · prochaine échéance ${periodEndLabel}` : null}
          </p>
        ) : (
          <p className="mt-2 text-muted-foreground">
            Activez l&apos;abonnement pour finaliser l&apos;accès à l&apos;espace client pro.
            {stripeConfigured
              ? " Paiement sécurisé par Stripe."
              : " Le paiement en ligne sera disponible dès configuration Stripe."}
          </p>
        )}
      </div>

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {subscriptionActive ? (
          <>
            <Link href="/dashboard">
              <Button>Accéder à mon espace client</Button>
            </Link>
            {stripeConfigured ? (
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => runAction(openBillingPortal)}
                className="gap-1.5"
              >
                {isPending ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : (
                  <Settings2 className="size-4" aria-hidden />
                )}
                Gérer l&apos;abonnement
              </Button>
            ) : null}
          </>
        ) : stripeConfigured ? (
          <Button
            type="button"
            disabled={isPending}
            onClick={() => runAction(startProSubscription)}
            className="gap-1.5"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <CreditCard className="size-4" aria-hidden />
            )}
            Activer l&apos;abonnement ({ABONNEMENT_PRO_HT} € HT / mois)
          </Button>
        ) : (
          <Link href="/dashboard">
            <Button variant="secondary">Accéder à l&apos;espace client</Button>
          </Link>
        )}
      </div>
    </div>
  )
}
