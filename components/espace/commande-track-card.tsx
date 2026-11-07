import Image from "next/image"
import { Radio } from "lucide-react"

import type { CommandeSnapshotRow } from "@/app/espace/commandes/actions"
import {
  paymentStatusBadgeClass,
  paymentStatusLabel,
} from "@/lib/commande/labels"
import { benneImageForPrestationId, benneImageForVolume } from "@/lib/commande/benne-visual"
import { formatOrderReference } from "@/lib/commande/reference"
import { buildCommandeTimeline } from "@/lib/commande/status-timeline"
import { cn } from "@/lib/utils"

function formatShortDate(isoDate: string | null) {
  if (!isoDate) return "—"
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  })
}

type Props = {
  commande: CommandeSnapshotRow
  variant?: "hero" | "compact"
}

export function CommandeTrackCard({ commande, variant = "compact" }: Props) {
  const imageSrc =
    commande.prestation_id != null
      ? benneImageForPrestationId(commande.prestation_id)
      : benneImageForVolume(commande.volume_m3)

  const { steps, terminalLabel, isTerminalError } = buildCommandeTimeline(
    commande.statut,
    commande.payment_status
  )

  const isHero = variant === "hero"

  return (
    <article
      className={cn(
        "overflow-hidden rounded-2xl border border-[#35A238]/25 bg-white shadow-sm transition-shadow",
        isHero ? "shadow-md" : ""
      )}
    >
      <div className={cn("flex gap-4", isHero ? "flex-col sm:flex-row sm:p-5 p-4" : "p-4")}>
        <div
          className={cn(
            "relative shrink-0 overflow-hidden rounded-xl bg-[#ECF4E9]",
            isHero ? "mx-auto h-40 w-full max-w-sm sm:mx-0 sm:h-44 sm:w-52" : "h-24 w-28"
          )}
        >
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes={isHero ? "208px" : "112px"}
            className="object-contain object-center p-2"
          />
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-mono text-xs font-semibold text-brand-navy">
                {formatOrderReference(commande.id)}
              </p>
              <p className={cn("font-medium text-brand-navy", isHero ? "text-lg" : "text-sm")}>
                {commande.prestation_label ?? "Benne"}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                {commande.adresse_complete}
              </p>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium",
                paymentStatusBadgeClass(commande.payment_status)
              )}
            >
              {paymentStatusLabel(commande.payment_status)}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            Livraison : <strong className="text-brand-navy">{formatShortDate(commande.date_livraison)}</strong>
          </p>

          {terminalLabel ? (
            <p
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                isTerminalError
                  ? "bg-destructive/10 text-destructive"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {terminalLabel}
            </p>
          ) : (
            <ol className="flex items-center gap-0 sm:gap-1" aria-label="Avancement">
              {steps.map((step, index) => {
                const Icon = step.icon
                return (
                  <li
                    key={step.code}
                    className={cn("flex flex-1 items-center", index < steps.length - 1 && "min-w-0")}
                  >
                    <div
                      className={cn(
                        "flex flex-col items-center gap-1 text-center",
                        step.state === "upcoming" && "opacity-40"
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-9 items-center justify-center rounded-full border-2 transition-colors",
                          step.state === "current" &&
                            "border-[#35A238] bg-[#35A238]/15 shadow-[0_0_0_4px_rgba(53,162,56,0.12)]",
                          step.state === "done" && "border-[#35A238] bg-[#35A238] text-white",
                          step.state === "upcoming" && "border-brand-navy/15 bg-[#ECF4E9]"
                        )}
                      >
                        <Icon
                          className={cn(
                            "size-4",
                            step.state === "done" ? "text-white" : "text-[#35A238]"
                          )}
                          aria-hidden
                        />
                      </span>
                      <span className="max-w-[4.5rem] text-[10px] font-medium leading-tight sm:text-[11px]">
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 ? (
                      <div
                        className={cn(
                          "mx-1 hidden h-0.5 flex-1 sm:block",
                          step.state === "done" ? "bg-[#35A238]" : "bg-brand-navy/10"
                        )}
                        aria-hidden
                      />
                    ) : null}
                  </li>
                )
              })}
            </ol>
          )}

        </div>
      </div>

      {commande.statut === "en_cours" ? (
        <div className="flex items-center gap-2 border-t border-[#35A238]/15 bg-[#ECF4E9]/80 px-4 py-2 text-xs text-brand-navy">
          <Radio className="size-3.5 animate-pulse text-[#35A238]" aria-hidden />
          Suivi actif — nous mettons à jour votre commande
        </div>
      ) : null}
    </article>
  )
}
