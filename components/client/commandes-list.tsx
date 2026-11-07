import {
  audienceCommandeLabel,
  paymentStatusBadgeClass,
  paymentStatusLabel,
  statutCommandeBadgeClass,
  statutCommandeLabel,
} from "@/lib/commande/labels"
import { formatOrderReference } from "@/lib/commande/reference"
import { cn } from "@/lib/utils"

export type CommandeListRow = {
  id: string
  statut: string
  payment_status: string | null
  prestation_label: string | null
  date_livraison: string | null
  adresse_complete: string | null
  audience: string | null
}

function formatShortDate(isoDate: string | null) {
  if (!isoDate) return "—"
  return new Date(`${isoDate}T12:00:00`).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function CommandeTable({ rows }: { rows: CommandeListRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#35A238]/20 bg-white">
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-brand-navy/8 bg-muted/40 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Réf.</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Prestation</th>
              <th className="px-4 py-3">Livraison</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Paiement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-navy/6">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-muted/20">
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs font-semibold">
                  {formatOrderReference(row.id)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-xs">
                  {audienceCommandeLabel(row.audience)}
                </td>
                <td className="max-w-[10rem] truncate px-4 py-3" title={row.prestation_label ?? undefined}>
                  {row.prestation_label ?? "Benne"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                  {formatShortDate(row.date_livraison)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      statutCommandeBadgeClass(row.statut)
                    )}
                  >
                    {statutCommandeLabel(row.statut)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                      paymentStatusBadgeClass(row.payment_status)
                    )}
                  >
                    {paymentStatusLabel(row.payment_status)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="divide-y divide-brand-navy/6 md:hidden">
        {rows.map((row) => (
          <div key={row.id} className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="font-mono text-xs font-semibold">{formatOrderReference(row.id)}</p>
              <span className="text-xs text-muted-foreground">
                {audienceCommandeLabel(row.audience)}
              </span>
            </div>
            <p className="text-sm font-medium">{row.prestation_label ?? "Benne"}</p>
            <p className="text-xs text-muted-foreground">{row.adresse_complete}</p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="text-muted-foreground">{formatShortDate(row.date_livraison)}</span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium",
                  statutCommandeBadgeClass(row.statut)
                )}
              >
                {statutCommandeLabel(row.statut)}
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-medium",
                  paymentStatusBadgeClass(row.payment_status)
                )}
              >
                {paymentStatusLabel(row.payment_status)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CommandesList({
  title,
  count,
  rows,
}: {
  title: string
  count: number
  rows: CommandeListRow[]
}) {
  if (rows.length === 0) return null
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold text-brand-navy">
        {title}{" "}
        <span className="font-normal text-muted-foreground">({count})</span>
      </h2>
      <CommandeTable rows={rows} />
    </section>
  )
}
