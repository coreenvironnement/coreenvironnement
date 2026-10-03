import Link from "next/link"

import {
  audienceCommandeLabel,
  commandeMailtoHref,
  commandeTelHref,
  isCommandeNouvelle,
  paymentStatusBadgeClass,
  paymentStatusLabel,
  statutCommandeBadgeClass,
  statutCommandeLabel,
} from "@/lib/commande/labels"
import { formatOrderReference } from "@/lib/commande/reference"
import { departementLabel } from "@/lib/geo/idf"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type AdminCommandeListItem = {
  id: string
  adresse_complete: string
  statut: string
  payment_status: string | null
  audience: string | null
  prestation_label: string | null
  price_ht: number | string | null
  date_livraison: string | null
  departement_code: string | null
  contact_email: string | null
  contact_nom: string | null
  contact_telephone: string | null
  date_creation: string
  dechets_types: { nom: string; code: string | null } | null
}

function ContactLinks({
  email,
  telephone,
  className,
}: {
  email: string | null
  telephone: string | null
  className?: string
}) {
  if (!email && !telephone) {
    return <p className={cn("text-xs text-muted-foreground", className)}>—</p>
  }

  return (
    <p className={cn("flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs", className)}>
      {telephone ? (
        <a href={commandeTelHref(telephone)} className="text-primary hover:underline">
          {telephone}
        </a>
      ) : null}
      {email ? (
        <a href={commandeMailtoHref(email)} className="text-primary hover:underline">
          {email}
        </a>
      ) : null}
    </p>
  )
}

function NouvelleBadge({ dateCreation }: { dateCreation: string }) {
  if (!isCommandeNouvelle(dateCreation)) return null
  return (
    <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-sky-900">
      Nouvelle
    </span>
  )
}

function CommandeBadges({
  statut,
  paymentStatus,
}: {
  statut: string
  paymentStatus: string | null
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          paymentStatusBadgeClass(paymentStatus)
        )}
      >
        {paymentStatusLabel(paymentStatus)}
      </span>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          statutCommandeBadgeClass(statut)
        )}
      >
        {statutCommandeLabel(statut)}
      </span>
    </div>
  )
}

export function AdminCommandesList({ commandes }: { commandes: AdminCommandeListItem[] }) {
  return (
    <>
      <ul className="space-y-3 lg:hidden">
        {commandes.map((c) => {
          const dechet = c.dechets_types
          const reference = formatOrderReference(c.id)
          return (
            <li
              key={c.id}
              className="rounded-xl border border-brand-navy/12 bg-background p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-sm font-semibold text-brand-navy">{reference}</p>
                  <p className="mt-0.5 text-sm font-medium text-brand-navy">
                    {c.contact_nom ?? audienceCommandeLabel(c.audience)}
                  </p>
                </div>
                <NouvelleBadge dateCreation={c.date_creation} />
              </div>
              <ContactLinks
                className="mt-1"
                email={c.contact_email}
                telephone={c.contact_telephone}
              />
              <p className="mt-2 text-sm text-brand-navy">
                {c.prestation_label ?? dechet?.nom ?? "—"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.adresse_complete}
                {c.departement_code
                  ? ` · ${departementLabel(c.departement_code) ?? c.departement_code}`
                  : null}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">
                    Créée {formatDateFr(c.date_creation)} · Livr. {formatDateFr(c.date_livraison)}
                  </p>
                  <p className="text-sm font-medium text-brand-navy">
                    {formatEuro(c.price_ht == null ? null : Number(c.price_ht))}
                  </p>
                  <CommandeBadges statut={c.statut} paymentStatus={c.payment_status} />
                </div>
                <Link
                  href={`/admin/commandes/${c.id}`}
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Ouvrir
                </Link>
              </div>
            </li>
          )
        })}
      </ul>

      <div className="hidden overflow-x-auto rounded-xl border border-brand-navy/12 bg-background shadow-sm lg:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
              <th className="px-3 py-3 font-medium">Réf.</th>
              <th className="px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Client</th>
              <th className="px-3 py-3 font-medium">Prestation</th>
              <th className="px-3 py-3 font-medium">Livraison</th>
              <th className="px-3 py-3 font-medium">Montant HT</th>
              <th className="px-3 py-3 font-medium">Paiement</th>
              <th className="px-3 py-3 font-medium">Statut</th>
              <th className="px-3 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {commandes.map((c) => {
              const dechet = c.dechets_types
              const reference = formatOrderReference(c.id)
              return (
                <tr key={c.id} className="border-b border-border/40">
                  <td className="px-3 py-3">
                    <p className="font-mono text-xs font-semibold text-brand-navy">{reference}</p>
                    <NouvelleBadge dateCreation={c.date_creation} />
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateFr(c.date_creation)}
                  </td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-brand-navy">
                      {c.contact_nom ?? audienceCommandeLabel(c.audience)}
                    </p>
                    <ContactLinks email={c.contact_email} telephone={c.contact_telephone} />
                    <p className="mt-0.5 max-w-[240px] truncate text-xs text-muted-foreground">
                      {c.adresse_complete}
                      {c.departement_code
                        ? ` · ${departementLabel(c.departement_code) ?? c.departement_code}`
                        : null}
                    </p>
                  </td>
                  <td className="px-3 py-3">
                    <p>{c.prestation_label ?? dechet?.nom ?? "—"}</p>
                    {dechet?.nom && c.prestation_label ? (
                      <p className="text-xs text-muted-foreground">{dechet.nom}</p>
                    ) : null}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatDateFr(c.date_livraison)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatEuro(c.price_ht == null ? null : Number(c.price_ht))}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        paymentStatusBadgeClass(c.payment_status)
                      )}
                    >
                      {paymentStatusLabel(c.payment_status)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        statutCommandeBadgeClass(c.statut)
                      )}
                    >
                      {statutCommandeLabel(c.statut)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/admin/commandes/${c.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
