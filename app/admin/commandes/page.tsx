import Link from "next/link"

import { AdminCommandesList, type AdminCommandeListItem } from "@/components/admin/admin-commandes-list"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth/require-admin"
import { matchesCommandeSearch } from "@/lib/commande/admin-search"
import {
  COMMANDES_VUES,
  isCommandeATraiter,
  matchesCommandeVue,
  parseCommandeVue,
  type CommandeVue,
} from "@/lib/commande/labels"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Commandes · Admin",
}

type PageProps = {
  searchParams: Promise<{ q?: string; vue?: string }>
}

function commandesHref(vue: CommandeVue, q: string) {
  const params = new URLSearchParams()
  if (vue !== "a-traiter") params.set("vue", vue)
  if (q.trim()) params.set("q", q.trim())
  const query = params.toString()
  return query ? `/admin/commandes?${query}` : "/admin/commandes"
}

export default async function AdminCommandesPage({ searchParams }: PageProps) {
  const { q: qParam, vue: vueParam } = await searchParams
  const q = qParam?.trim() ?? ""
  const vue = parseCommandeVue(vueParam)
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
      contact_telephone,
      date_creation,
      dechets_types ( nom, code )
    `
    )
    .order("date_creation", { ascending: false })

  const rows = (commandes ?? []) as unknown as AdminCommandeListItem[]
  const aTraiter = rows.filter((c) => isCommandeATraiter(c.statut, c.payment_status)).length
  const counts = Object.fromEntries(
    COMMANDES_VUES.map((item) => [
      item.code,
      item.code === "toutes"
        ? rows.length
        : rows.filter((c) => matchesCommandeVue(c, item.code)).length,
    ])
  ) as Record<CommandeVue, number>

  const filtered = rows.filter(
    (c) => matchesCommandeVue(c, vue) && matchesCommandeSearch(c, q)
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-navy">Commandes benne</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          File opérationnelle ·{" "}
          {aTraiter > 0 ? (
            <strong className="text-brand-navy">{aTraiter} à traiter</strong>
          ) : (
            "aucune commande payée en attente"
          )}
          {" · "}
          <Link href={commandesHref("toutes", q)} className="text-primary hover:underline">
            Voir toutes
          </Link>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {COMMANDES_VUES.map((item) => {
            const active = vue === item.code
            const emphasize = item.code === "a-traiter"
            return (
              <Link
                key={item.code}
                href={commandesHref(item.code, q)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                  active && emphasize && "border-primary bg-primary text-primary-foreground",
                  active && !emphasize && "border-brand-navy bg-brand-navy text-white",
                  !active && emphasize && "border-primary/40 bg-primary/12 text-brand-navy",
                  !active && !emphasize && "border-border bg-background text-brand-navy hover:bg-muted"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                    active ? "bg-white/20" : "bg-muted text-muted-foreground"
                  )}
                >
                  {counts[item.code]}
                </span>
              </Link>
            )
          })}
        </div>

        <form action="/admin/commandes" method="get" className="flex flex-col gap-2 sm:flex-row">
          {vue !== "a-traiter" ? <input type="hidden" name="vue" value={vue} /> : null}
          <Input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Référence CE-, nom, téléphone, e-mail"
            className="h-10 sm:max-w-md"
            aria-label="Rechercher une commande"
          />
          <button type="submit" className={cn(buttonVariants({ variant: "outline" }), "h-10")}>
            Rechercher
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-navy/20 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          Aucune commande pour le moment. Les commandes passées sur la page d&apos;accueil
          apparaîtront ici.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-brand-navy/20 bg-muted/20 p-10 text-center text-sm text-muted-foreground">
          Aucune commande pour ce filtre
          {q ? ` ou cette recherche « ${q} »` : ""}.{" "}
          <Link href="/admin/commandes?vue=toutes" className="text-primary hover:underline">
            Voir toutes
          </Link>
        </p>
      ) : (
        <AdminCommandesList commandes={filtered} />
      )}
    </div>
  )
}
