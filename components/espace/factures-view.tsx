"use client"

import { useState, useTransition } from "react"
import { Download, Loader2, Receipt } from "lucide-react"

import { getCommandeReceiptUrl } from "@/app/espace/factures/actions"
import { openBillingPortal } from "@/app/pro/stripe-actions"
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import { Button } from "@/components/ui/button"
import { formatOrderReference } from "@/lib/commande/reference"
import {
  paymentStatusBadgeClass,
  paymentStatusLabel,
} from "@/lib/commande/labels"
import { formatDateFr } from "@/lib/format/date"
import { cn } from "@/lib/utils"

export type FactureRow = {
  id: string
  date_creation: string
  prestation_label: string | null
  price_ht: number | null
  payment_status: string | null
  audience: string | null
  stripe_payment_intent_id: string | null
  statut: string
}

function formatEuro(ht: number | null) {
  if (ht == null) return "—"
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(ht)
}

function paymentHint(row: FactureRow): string {
  switch (row.payment_status) {
    case "waived":
      return "Règlement sur facture — échéance selon vos conditions pro."
    case "pending":
      return "En attente de règlement."
    case "paid":
      return row.stripe_payment_intent_id
        ? "Reçu carte bancaire disponible."
        : "Payée — reçu e-mail si applicable."
    default:
      return paymentStatusLabel(row.payment_status)
  }
}

function ReceiptButton({ commandeId }: { commandeId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onDownload() {
    setError(null)
    startTransition(async () => {
      const result = await getCommandeReceiptUrl(commandeId)
      if ("url" in result) {
        window.open(result.url, "_blank", "noopener,noreferrer")
      } else {
        setError(result.error)
      }
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={onDownload}
        className="gap-1.5 border-[#35A238]/30"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <Download className="size-4 text-[#35A238]" aria-hidden />
        )}
        Reçu
      </Button>
      {error ? <span className="text-[10px] text-destructive">{error}</span> : null}
    </div>
  )
}

type Props = {
  rows: FactureRow[]
  showBillingPortal?: boolean
}

export function FacturesView({ rows, showBillingPortal = false }: Props) {
  const [portalPending, startPortal] = useTransition()

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <EspacePageHeader title="Factures" meta="Prestations et règlements" />

      {showBillingPortal ? (
        <EspacePanel className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Factures d&apos;abonnement entreprise</p>
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={portalPending}
            className="gap-1.5"
            onClick={() =>
              startPortal(async () => {
                const result = await openBillingPortal()
                if (result && "error" in result) {
                  window.alert(result.error)
                }
              })
            }
          >
            {portalPending ? <Loader2 className="size-4 animate-spin" /> : null}
            Portail Stripe
          </Button>
        </EspacePanel>
      ) : null}

      {rows.length === 0 ? (
        <EspacePanel className="text-center text-sm text-muted-foreground">
          Aucune facture disponible.
        </EspacePanel>
      ) : (
        <EspacePanel className="overflow-hidden p-0">
          <ul className="divide-y divide-[#35A238]/10">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <Receipt className="mt-0.5 size-5 shrink-0 text-[#35A238]" aria-hidden />
                  <div>
                    <p className="font-mono text-xs font-semibold text-brand-navy">
                      {formatOrderReference(row.id)}
                    </p>
                    <p className="text-sm">
                      {row.prestation_label ?? "Benne"} ·{" "}
                      {formatDateFr(row.date_creation.slice(0, 10))}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{paymentHint(row)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">{formatEuro(row.price_ht)}</p>
                    <span
                      className={cn(
                        "mt-1 inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                        paymentStatusBadgeClass(row.payment_status)
                      )}
                    >
                      {paymentStatusLabel(row.payment_status)}
                    </span>
                  </div>
                  {row.payment_status === "paid" && row.stripe_payment_intent_id ? (
                    <ReceiptButton commandeId={row.id} />
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-[#35A238]/10 px-4 py-3 text-xs text-muted-foreground">
            Les factures PDF métier seront disponibles ici prochainement.
          </p>
        </EspacePanel>
      )}
    </div>
  )
}
