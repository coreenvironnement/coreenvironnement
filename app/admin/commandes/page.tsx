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
import { matchesCommandeAudience, type CommandeAudienceFilter } from "@/lib/commande/audience"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Commandes · Admin",
}

type AudienceFilter = CommandeAudienceFilter

type PageProps = {
  searchParams: Promise<{ q?: string; vue?: string; audience?: string }>
}

function parseAudience(raw: string | undefined): AudienceFilter {
  if (raw === "professionnel") return "professionnel"
  if (raw === "particulier") return "particulier"
  return "all"
}

function commandesHref(vue: CommandeVue, q: string, audience: AudienceFilter) {
  const params = new URLSearchParams()
  if (vue !== "a-traiter") params.set("vue", vue)
  if (q.trim()) params.set("q", q.trim())
  if (audience !== "all") params.set("audience", audience)
  const query = params.toString()
  return query ? `/admin/commandes?${query}` : "/admin/commandes"
}

function audienceHref(audience: AudienceFilter, vue: CommandeVue, q: string) {
  return commandesHref(vue, q, audience)
}

const AUDIENCE_PILLS: { id: AudienceFilter; label: string }[] = [
  { id: "particulier", label: "Particuliers" },
  { id: "professionnel", label: "Professionnels" },
  { id: "all", label: "Toutes" },
]

export default async function AdminCommandesPage({ searchParams }: PageProps) {
  const { q: qParam, vue: vueParam, audience: audienceParam } = await searchParams
  const q = qParam?.trim() ?? ""
  const vue = parseCommandeVue(vueParam)
  const audience = parseAudience(audienceParam)
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
  const byAudience = rows.filter((c) =>
    matchesCommandeAudience(
      c.audience === "particulier" || c.audience === "professionnel" ? c.audience : null,
      audience
    )
  )
  const aTraiter = byAudience.filter((c) => isCommandeATraiter(c.statut, c.payment_status)).length
  const counts = Object.fromEntries(
    COMMANDES_VUES.map((item) => [
      item.code,
      item.code === "toutes"
        ? byAudience.length
        : byAudience.filter((c) => matchesCommandeVue(c, item.code)).length,
    ])
  ) as Record<CommandeVue, number>

  const filtered = byAudience.filter(
    (c) => matchesCommandeVue(c, vue) && matchesCommandeSearch(c, q)
  )

  const title =
    audience === "professionnel"
      ? "Commandes professionnelles"
      : audience === "particulier"
        ? "Commandes particuliers"
        : "Toutes les commandes"

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-brand-navy">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {aTraiter > 0 ? (
            <strong className="text-brand-navy">{aTraiter} à traiter</strong>
          ) : (
            "Aucune commande payée en attente"
          )}
          {" · "}
          {byAudience.length} commande{byAudience.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {AUDIENCE_PILLS.map((pill) => {
          const active = audience === pill.id
          return (
            <Link
              key={pill.id}
              href={audienceHref(pill.id, vue, q)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
                active
                  ? "border-[#35A238] bg-[#35A238] text-white"
                  : "border-[#35A238]/25 bg-white text-brand-navy hover:bg-[#ECF4E9]"
              )}
            >
              {pill.label}
            </Link>
          )
        })}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {COMMANDES_VUES.map((item) => {
            const active = vue === item.code
            const emphasize = item.code === "a-traiter"
            return (
              <Link
                key={item.code}
                href={commandesHref(item.code, q, audience)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition",
                  active && emphasize && "border-[#35A238] bg-[#35A238] text-white",
                  active && !emphasize && "border-[#35A238]/40 bg-[#ECF4E9] text-brand-navy",
                  !active && emphasize && "border-[#35A238]/30 bg-white text-brand-navy",
                  !active && !emphasize && "border-border bg-white text-brand-navy hover:bg-muted"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                    active ? "bg-white/25" : "bg-muted text-muted-foreground"
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
          {audience !== "all" ? <input type="hidden" name="audience" value={audience} /> : null}
          <Input
            name="q"
            type="search"
            defaultValue={q}
            placeholder="Référence CE-, nom, téléphone, e-mail"
            className="h-10 border-[#35A238]/20 sm:max-w-md"
            aria-label="Rechercher une commande"
          />
          <button
            type="submit"
            className={cn(buttonVariants({ variant: "outline" }), "h-10 border-[#35A238]/25")}
          >
            Rechercher
          </button>
        </form>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#35A238]/25 bg-white p-10 text-center text-sm text-muted-foreground">
          Aucune commande pour le moment.
        </p>
      ) : filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#35A238]/25 bg-white p-10 text-center text-sm text-muted-foreground">
          Aucune commande pour ce filtre
          {q ? ` ou « ${q} »` : ""}.
        </p>
      ) : (
        <AdminCommandesList commandes={filtered} />
      )}
    </div>
  )
}
