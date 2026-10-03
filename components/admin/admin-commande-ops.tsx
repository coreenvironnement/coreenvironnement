"use client"

import { useState, useTransition } from "react"

import { cancelAndRefundCommande, cancelCommande } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"

type AdminCommandeOpsProps = {
  commandeId: string
  refundAmountLabel: string
  statut: string
  paymentStatus: string
}

export function AdminCommandeOps({
  commandeId,
  refundAmountLabel,
  statut,
  paymentStatus,
}: AdminCommandeOpsProps) {
  const [isPending, startTransition] = useTransition()
  const [locked, setLocked] = useState(false)
  const busy = isPending || locked

  const isCancelled = statut === "annulee"
  const isPaid = paymentStatus === "paid"
  const isRefundPending = paymentStatus === "refund_pending"
  const isRefunded = paymentStatus === "refunded"
  const showCancelAndRefund = !isCancelled && isPaid
  const showRefundOnly = isCancelled && isPaid

  function requestRefund(confirmMessage: string) {
    if (busy) return
    if (!window.confirm(confirmMessage)) {
      return
    }
    setLocked(true)
    startTransition(async () => {
      await cancelAndRefundCommande(commandeId)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {!isCancelled ? (
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={busy}
          onClick={() => {
            if (busy) return
            if (
              !window.confirm(
                "Annuler cette commande ? Cette action ne rembourse pas le client."
              )
            ) {
              return
            }
            setLocked(true)
            startTransition(async () => {
              await cancelCommande(commandeId)
            })
          }}
        >
          Annuler
        </Button>
      ) : null}

      {showCancelAndRefund ? (
        <Button
          type="button"
          variant="destructive"
          size="lg"
          disabled={busy}
          onClick={() =>
            requestRefund(
              `Annuler et rembourser ${refundAmountLabel} ? Le statut « Remboursée » n’apparaîtra qu’après confirmation Stripe.`
            )
          }
        >
          Annuler et rembourser {refundAmountLabel}
        </Button>
      ) : null}

      {showRefundOnly ? (
        <Button
          type="button"
          variant="destructive"
          size="lg"
          disabled={busy}
          onClick={() =>
            requestRefund(
              `Rembourser le paiement (${refundAmountLabel}) ? Le statut « Remboursée » n’apparaîtra qu’après confirmation Stripe.`
            )
          }
        >
          Rembourser le paiement
        </Button>
      ) : null}

      {isRefundPending ? (
        <Button type="button" variant="outline" size="lg" disabled>
          Remboursement en cours…
        </Button>
      ) : null}

      {isRefunded ? (
        <p className="text-sm font-medium text-emerald-800">Remboursée</p>
      ) : null}
    </div>
  )
}
