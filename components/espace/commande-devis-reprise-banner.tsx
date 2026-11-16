import Link from "next/link"
import { ExternalLink, FileText } from "lucide-react"

import type { ParticulierDevisBrouillonCard } from "@/lib/espace/particulier-devis-brouillons"
import { formatOrderReference } from "@/lib/commande/reference"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function formatShortDate(isoDate: string | null) {
  if (!isoDate) return null
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })
}

function formatTtc(amount: number | null) {
  if (amount == null) return null
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount)
}

type Props = {
  items: ParticulierDevisBrouillonCard[]
  className?: string
}

export function CommandeDevisRepriseBanner({ items, className }: Props) {
  if (items.length === 0) return null

  const primary = items[0]
  const resumeHref = primary.resumeHref
  const devisPdfHref = primary.devisPdfHref
  const priceLabel = formatTtc(primary.priceTtc)
  const deliveryLabel = formatShortDate(primary.date_livraison)

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl border border-[#35A238]/35 bg-gradient-to-br from-[#ECF4E9] via-white to-white p-4 shadow-sm sm:p-5",
        className
      )}
      aria-labelledby="devis-reprise-heading"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#35A238]/15 text-[#35A238]"
            aria-hidden
          >
            <FileText className="size-5" />
          </span>
          <div className="min-w-0 space-y-1">
            <p
              id="devis-reprise-heading"
              className="text-base font-semibold text-brand-navy sm:text-lg"
            >
              {primary.devis_sent_at
                ? "Votre devis vous attend"
                : "Commande en cours"}
            </p>
            <p className="text-sm text-brand-navy/85">
              <span className="font-mono text-xs font-semibold">
                {formatOrderReference(primary.id)}
              </span>
              {primary.prestation_label ? (
                <>
                  {" · "}
                  {primary.prestation_label}
                </>
              ) : null}
              {priceLabel ? (
                <>
                  {" · "}
                  <strong>{priceLabel} TTC</strong>
                </>
              ) : null}
              {deliveryLabel ? (
                <span className="block text-xs text-muted-foreground sm:inline sm:before:content-['_·_']">
                  Livraison souhaitée : {deliveryLabel}
                </span>
              ) : null}
            </p>
            <p className="text-xs text-muted-foreground">
              Reprenez là où vous vous êtes arrêté : vos informations sont déjà enregistrées.
            </p>
            {items.length > 1 ? (
              <p className="text-xs font-medium text-[#35A238]">
                {items.length} commandes à finaliser
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[240px]">
          {resumeHref ? (
            <Link href={resumeHref} className="w-full">
              <Button
                size="lg"
                className="h-12 w-full bg-[#35A238] text-base font-semibold shadow-md hover:bg-[#2d8a30]"
              >
                Reprendre ma commande
              </Button>
            </Link>
          ) : (
            <p className="text-xs text-muted-foreground">
              Reprise indisponible : utilisez le lien dans votre e-mail de devis ou contactez-nous.
            </p>
          )}
          {devisPdfHref ? (
            <a href={devisPdfHref} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full border-[#35A238]/45 text-base font-semibold text-brand-navy hover:bg-[#ECF4E9]"
              >
                Consulter le devis
                <ExternalLink className="ml-2 size-4 shrink-0 opacity-70" aria-hidden />
              </Button>
            </a>
          ) : null}
        </div>
      </div>
    </section>
  )
}