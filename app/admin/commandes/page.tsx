import Link from "next/link"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  audienceCommandeLabel,
  paymentStatusLabel,
  statutCommandeLabel,
} from "@/lib/commande/labels"
import { departementLabel } from "@/lib/geo/idf"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Commandes · Admin",
}

type DechetEmbed = { nom: string; code: string | null } | null

export default async function AdminCommandesPage() {
  const { supabase } = await requireAdmin()

  const { data: commandes } = await supabase
    .from("commandes")
    .select(
      `
      id,
      adresse_complete,
      statut,
      payment_status,
      audience,
      prestation_label,
      price_ht,
      date_livraison,
      departement_code,
      contact_email,
      contact_nom,
      date_creation,
      dechets_types ( nom, code )
    `
    )
    .order("date_creation", { ascending: false })

  const aTraiter =
    commandes?.filter((c) => c.statut === "confirmee" && c.payment_status === "paid")
      .length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Commandes benne</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Commandes reçues via le tunnel particulier ·{" "}
          {aTraiter > 0 ? (
            <strong className="text-brand-navy">{aTraiter} à traiter</strong>
          ) : (
            "aucune commande payée en attente"
          )}
        </p>
      </div>

      {commandes?.length ? (
        <div className="overflow-x-auto rounded-xl border border-brand-navy/12 bg-background shadow-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
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
                const dechet = c.dechets_types as unknown as DechetEmbed
                return (
                  <tr key={c.id} className="border-b border-border/40">
                    <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                      {formatDateFr(c.date_creation)}
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium text-brand-navy">
                        {c.contact_nom ?? audienceCommandeLabel(c.audience)}
                      </p>
                      <p className="text-xs text-muted-foreground">{c.contact_email ?? "—"}</p>
                      <p className="mt-0.5 max-w-[220px] truncate text-xs text-muted-foreground">
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
                    <td className="px-3 py-3 whitespace-nowrap">{formatEuro(c.price_ht)}</td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          c.payment_status === "paid" && "bg-primary/15 text-brand-navy",
                          c.payment_status === "pending" && "bg-amber-100 text-amber-900",
                          c.payment_status === "failed" && "bg-destructive/10 text-destructive",
                          c.payment_status === "waived" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {paymentStatusLabel(c.payment_status)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          c.statut === "confirmee" && "bg-primary/15 text-brand-navy",
                          c.statut === "en_cours" && "bg-blue-100 text-blue-900",
                          c.statut === "livree" && "bg-emerald-100 text-emerald-900",
                          c.statut === "annulee" && "bg-destructive/10 text-destructive",
                          c.statut === "brouillon" && "bg-muted text-muted-foreground"
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
      ) : (
        <p className="rounded-xl border border-dashed border-brand-navy/20 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          Aucune commande pour le moment. Les commandes passées sur la page d&apos;accueil
          apparaîtront ici.
        </p>
      )}
    </div>
  )
}
