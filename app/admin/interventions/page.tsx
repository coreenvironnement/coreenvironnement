import Link from "next/link"

import { AdminCommandesBrouillonPanel } from "@/components/admin/admin-commandes-brouillon-panel"
import { AdminInterventionsOpsList } from "@/components/admin/admin-interventions-ops-list"
import { AdminInterventionsList } from "@/components/admin/admin-interventions-list"
import { AdminCommandesList, type AdminCommandeListItem } from "@/components/admin/admin-commandes-list"
import { Input } from "@/components/ui/input"
import { buttonVariants } from "@/components/ui/button"
import { requireAdmin } from "@/lib/auth/require-admin"
import {
  INTERVENTION_VUES,
  interventionsHref,
  loadAdminUnifiedInterventions,
  parseInterventionVue,
  type InterventionVue,
} from "@/lib/admin/interventions-data"
import type { CommandeAudienceFilter } from "@/lib/commande/audience"
import { cn } from "@/lib/utils"

export const metadata = {
  title: "Interventions · Admin",
}

type AudienceFilter = CommandeAudienceFilter

type PageProps = {
  searchParams: Promise<{ q?: string; vue?: string; audience?: string; ok?: string; error?: string }>
}

function parseAudience(raw: string | undefined): AudienceFilter {
  if (raw === "professionnel") return "professionnel"
  if (raw === "particulier") return "particulier"
  return "all"
}

const AUDIENCE_PILLS: { id: AudienceFilter; label: string }[] = [
  { id: "particulier", label: "Particuliers" },
  { id: "professionnel", label: "Professionnels" },
  { id: "all", label: "Toutes" },
]

function audienceHref(audience: AudienceFilter, vue: InterventionVue, q: string) {
  return interventionsHref(vue, q, audience)
}

export default async function AdminInterventionsPage({ searchParams }: PageProps) {
  const {
    q: qParam,
    vue: vueParam,
    audience: audienceParam,
    ok: okParam,
    error: errorParam,
  } = await searchParams
  const q = qParam?.trim() ?? ""
  const vue = parseInterventionVue(vueParam)
  const audience = parseAudience(audienceParam)
  const { supabase } = await requireAdmin()

  const { rows, counts } = await loadAdminUnifiedInterventions(supabase, { q, vue, audience })

  const commandeOnly =
    vue === "a-traiter" ||
    vue === "brouillon" ||
    vue === "en-cours" ||
    vue === "livrees" ||
    vue === "annulees" ||
    vue === "remboursees"

  const commandeRows = rows
    .map((r) => r.commande)
    .filter(Boolean) as AdminCommandeListItem[]

  const aTraiter = rows.filter(
    (r) => r.kind === "commande" && r.statutLabel === "À planifier"
  ).length

  const returnTo = interventionsHref(vue, q, audience)

  const opsListVue =
    vue === "a-planifier" || vue === "planifiees" ? vue : null

  const flashOk =
    okParam === "planned"
      ? "Créneau enregistré et client notifié par e-mail."
      : okParam === "rescheduled"
        ? "Créneau reporté et client notifié."
        : okParam === "deleted"
      ? "Brouillon supprimé."
      : okParam?.startsWith("deleted_")
        ? (() => {
            const parts = okParam.split("_")
            const n = Number(parts[1])
            if (!Number.isFinite(n) || n <= 0) return null
            const skipped = okParam.includes("skipped")
              ? Number(parts[3])
              : 0
            if (skipped > 0) {
              return `${n} brouillon${n > 1 ? "s" : ""} supprimé${n > 1 ? "s" : ""}, ${skipped} ignoré${skipped > 1 ? "s" : ""}.`
            }
            return `${n} brouillon${n > 1 ? "s" : ""} supprimé${n > 1 ? "s" : ""}.`
          })()
        : null

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Interventions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {aTraiter > 0 ? (
              <strong className="text-brand-navy">{aTraiter} à traiter</strong>
            ) : (
              "Demandes web et interventions chantier"
            )}
            {" · "}
            {rows.length} ligne{rows.length === 1 ? "" : "s"} affichée{rows.length === 1 ? "" : "s"}
          </p>
        </div>
        <Link
          href={`/api/admin/export/interventions?${new URLSearchParams({
            ...(vue !== "a-traiter" ? { vue } : {}),
            ...(q ? { q } : {}),
            ...(audience !== "all" ? { audience } : {}),
          }).toString()}`}
          className={cn(buttonVariants({ variant: "outline" }), "border-[#35A238]/25")}
        >
          Exporter Excel
        </Link>
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

      <div className="flex flex-wrap gap-2">
        {INTERVENTION_VUES.map((item) => {
          const active = vue === item.code
          const emphasize = item.code === "a-traiter" || item.code === "a-planifier"
          return (
            <Link
              key={item.code}
              href={interventionsHref(item.code, q, audience)}
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
                {counts[item.code] ?? 0}
              </span>
            </Link>
          )
        })}
      </div>

      <form action="/admin/interventions" method="get" className="flex flex-col gap-2 sm:flex-row">
        {vue !== "a-traiter" ? <input type="hidden" name="vue" value={vue} /> : null}
        {audience !== "all" ? <input type="hidden" name="audience" value={audience} /> : null}
        <Input
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Référence, client, chantier, e-mail"
          className="h-10 border-[#35A238]/20 sm:max-w-md"
          aria-label="Rechercher"
        />
        <button
          type="submit"
          className={cn(buttonVariants({ variant: "outline" }), "h-10 border-[#35A238]/25")}
        >
          Rechercher
        </button>
      </form>

      {errorParam ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {errorParam}
        </p>
      ) : null}
      {flashOk ? (
        <p className="rounded-lg border border-[#35A238]/30 bg-[#ECF4E9] px-4 py-3 text-sm text-brand-navy">
          {flashOk}
        </p>
      ) : null}

      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-[#35A238]/25 bg-white p-10 text-center text-sm text-muted-foreground">
          Aucune intervention pour ce filtre{q ? ` ou « ${q} »` : ""}.
        </p>
      ) : opsListVue && rows.length > 0 ? (
        <AdminInterventionsOpsList rows={rows} returnTo={returnTo} mode={opsListVue} />
      ) : commandeOnly && commandeRows.length === rows.length ? (
        vue === "brouillon" ? (
          <AdminCommandesBrouillonPanel
            commandes={commandeRows}
            returnTo={returnTo}
            detailBasePath="/admin/interventions"
          />
        ) : (
          <AdminCommandesList commandes={commandeRows} detailBasePath="/admin/interventions" />
        )
      ) : (
        <AdminInterventionsList rows={rows} />
      )}
    </div>
  )
}