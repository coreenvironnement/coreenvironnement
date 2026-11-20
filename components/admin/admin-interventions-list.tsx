import Link from "next/link"

import type { AdminUnifiedRow } from "@/lib/admin/interventions-data"
import { statutInterventionBadgeClass } from "@/lib/admin/intervention-display"
import {
  audienceCommandeLabel,
  commandeDevisEnvoye,
  commandeDevisEnvoyeBadgeClass,
} from "@/lib/commande/labels"
import { formatDateFr } from "@/lib/format/date"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type Props = {
  rows: AdminUnifiedRow[]
}

export function AdminInterventionsList({ rows }: Props) {
  return (
  <>
    <ul className="space-y-3 lg:hidden">
      {rows.map((r) => (
        <li key={`${r.kind}-${r.id}`} className="rounded-xl border border-[#35A238]/20 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-brand-navy">{r.reference}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-[11px] font-medium",
                r.kind === "intervention"
                  ? statutInterventionBadgeClass(r.statutCode)
                  : "bg-primary/15 text-brand-navy"
              )}
            >
              {r.statutLabel}
            </span>
            {r.kind === "commande" && commandeDevisEnvoye(r.commande?.devis_sent_at) ? (
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-medium",
                  commandeDevisEnvoyeBadgeClass(true)
                )}
              >
                Devis envoyé
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{r.clientLabel}</p>
          {r.typeLabel ? <p className="text-xs text-muted-foreground">{r.typeLabel}</p> : null}
          <p className="mt-2 text-xs text-muted-foreground">{formatDateFr(r.dateSort.slice(0, 10))}</p>
          <Link href={r.href} className={cn(buttonVariants({ size: "sm", variant: "outline" }), "mt-3")}>
            Ouvrir
          </Link>
        </li>
      ))}
    </ul>

    <div className="hidden overflow-x-auto rounded-xl border border-[#35A238]/20 bg-white shadow-sm lg:block">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-[#35A238]/10 bg-[#ECF4E9]/50 text-muted-foreground">
            <th className="px-4 py-3 font-medium">Référence</th>
            <th className="px-4 py-3 font-medium">Client / chantier</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 font-medium">Devis</th>
            <th className="px-4 py-3 font-medium">Date</th>
            <th className="px-4 py-3 font-medium" />
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.kind}-${r.id}`} className="border-b border-[#35A238]/8">
              <td className="px-4 py-3 font-medium text-brand-navy">{r.reference}</td>
              <td className="px-4 py-3">
                <p>{r.clientLabel}</p>
                {r.audience ? (
                  <p className="text-xs text-muted-foreground">{audienceCommandeLabel(r.audience)}</p>
                ) : null}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{r.typeLabel ?? "-"}</td>
              <td className="px-4 py-3">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    r.kind === "intervention"
                      ? statutInterventionBadgeClass(r.statutCode)
                      : "bg-primary/15 text-brand-navy"
                  )}
                >
                  {r.statutLabel}
                </span>
              </td>
              <td className="px-4 py-3">
                {r.kind === "commande" && commandeDevisEnvoye(r.commande?.devis_sent_at) ? (
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium",
                      commandeDevisEnvoyeBadgeClass(true)
                    )}
                  >
                    Devis envoyé
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">{formatDateFr(r.dateSort.slice(0, 10))}</td>
              <td className="px-4 py-3 text-right">
                <Link href={r.href} className={cn(buttonVariants({ size: "sm", variant: "outline" }))}>
                  Détail
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
  )
}