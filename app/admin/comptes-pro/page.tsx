import Link from "next/link"

import { requireAdmin } from "@/lib/auth/require-admin"
import { paymentModeLabel, statutCompteProLabel } from "@/lib/compte-pro/labels"
import { formatDateFr } from "@/lib/format/date"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Comptes pro · Admin",
}

export default async function AdminComptesProPage() {
  const { supabase } = await requireAdmin()

  const { data: comptes } = await supabase
    .from("comptes_pro")
    .select(
      "id, raison_sociale, contact_nom, contact_email, status, payment_mode, created_at, siret"
    )
    .order("created_at", { ascending: false })

  const pendingCount = comptes?.filter((c) => c.status === "pending").length ?? 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Comptes professionnels</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Validation manuelle des dossiers (KBIS, RIB) ·{" "}
          {pendingCount > 0 ? (
            <strong className="text-amber-800">{pendingCount} en attente</strong>
          ) : (
            "aucune demande en attente"
          )}
        </p>
      </div>

      {comptes?.length ? (
        <div className="overflow-x-auto rounded-xl border border-brand-navy/12 bg-background shadow-sm">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
                <th className="px-3 py-3 font-medium">Entreprise</th>
                <th className="px-3 py-3 font-medium">Contact</th>
                <th className="px-3 py-3 font-medium">SIRET</th>
                <th className="px-3 py-3 font-medium">Statut</th>
                <th className="px-3 py-3 font-medium">Paiement</th>
                <th className="px-3 py-3 font-medium">Demande</th>
                <th className="px-3 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {comptes.map((c) => (
                <tr key={c.id} className="border-b border-border/40">
                  <td className="px-3 py-3 font-medium text-brand-navy">{c.raison_sociale}</td>
                  <td className="px-3 py-3">
                    <p>{c.contact_nom}</p>
                    <p className="text-xs text-muted-foreground">{c.contact_email}</p>
                  </td>
                  <td className="px-3 py-3 font-mono text-xs">{c.siret ?? "—"}</td>
                  <td className="px-3 py-3">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        c.status === "pending" && "bg-amber-100 text-amber-900",
                        c.status === "approved" && "bg-primary/15 text-brand-navy",
                        c.status === "rejected" && "bg-destructive/10 text-destructive"
                      )}
                    >
                      {statutCompteProLabel(c.status)}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs">{paymentModeLabel(c.payment_mode)}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-muted-foreground">
                    {formatDateFr(c.created_at)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href={`/admin/comptes-pro/${c.id}`}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                    >
                      Ouvrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-brand-navy/20 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          Aucune demande de compte pro pour le moment.
        </p>
      )}
    </div>
  )
}
