"use client"

import { useState, useTransition } from "react"
import { CreditCard, Loader2 } from "lucide-react"

import { openBillingPortal } from "@/app/pro/stripe-actions"
import { Button } from "@/components/ui/button"

type Props = {
  stripeBillingAvailable: boolean
  hasStripeCustomer: boolean
}

export function ProfilPaymentPanel({
  stripeBillingAvailable,
  hasStripeCustomer,
}: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function openPortal() {
    setError(null)
    startTransition(async () => {
      const result = await openBillingPortal("/espace/profil")
      if (result && "error" in result) {
        setError(result.error)
      }
    })
  }

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 text-sm font-medium text-brand-navy">
        <CreditCard className="size-4 text-[#35A238]" aria-hidden />
        Moyens de paiement
      </p>

      {hasStripeCustomer && stripeBillingAvailable ? (
        <>
          <p className="text-sm text-muted-foreground">
            Gérez vos cartes et votre abonnement entreprise via le portail sécurisé Stripe.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            className="gap-1.5 border-[#35A238]/30"
            onClick={openPortal}
          >
            {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
            Ouvrir le portail Stripe
          </Button>
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          {stripeBillingAvailable
            ? "Gérer vos cartes lors du prochain paiement ou après activation de l'abonnement entreprise."
            : "Le portail de facturation sera disponible dès la configuration du paiement en ligne."}
        </p>
      )}

      {error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}