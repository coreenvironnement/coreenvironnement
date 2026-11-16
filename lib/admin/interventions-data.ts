import type { SupabaseClient } from "@supabase/supabase-js"

import { matchesCommandeSearch } from "@/lib/commande/admin-search"
import {
  COMMANDES_VUES,
  isCommandeATraiter,
  matchesCommandeVue,
  parseCommandeVue,
  type CommandeVue,
} from "@/lib/commande/labels"
import { matchesCommandeAudience, type CommandeAudienceFilter } from "@/lib/commande/audience"
import {
  statutCommandeAsIntervention,
  statutInterventionAffiche,
} from "@/lib/admin/intervention-display"
import type { AdminCommandeListItem } from "@/components/admin/admin-commandes-list"

export type InterventionVue =
  | CommandeVue
  | "a-planifier"
  | "planifiees"
  | "realisees"
  | "interventions"

export type AdminUnifiedRow = {
  id: string
  kind: "commande" | "intervention"
  reference: string
  clientLabel: string
  chantierLabel: string | null
  statutCode: string
  statutLabel: string
  typeLabel: string | null
  dateSort: string
  audience: string | null
  href: string
  /** Données commande pour export / liste riche */
  commande?: AdminCommandeListItem
}

export function parseInterventionVue(raw: string | undefined): InterventionVue {
  if (
    raw === "a-planifier" ||
    raw === "planifiees" ||
    raw === "realisees" ||
    raw === "interventions"
  ) {
    return raw
  }
  return parseCommandeVue(raw)
}

export function interventionsHref(
  vue: InterventionVue,
  q: string,
  audience: CommandeAudienceFilter
) {
  const params = new URLSearchParams()
  if (vue !== "a-traiter") params.set("vue", vue)
  if (q.trim()) params.set("q", q.trim())
  if (audience !== "all") params.set("audience", audience)
  const query = params.toString()
  return query ? `/admin/interventions?${query}` : "/admin/interventions"
}

const INTERVENTION_VUES: { code: InterventionVue; label: string }[] = [
  { code: "a-traiter", label: "À traiter" },
  { code: "brouillon", label: "Brouillons" },
  { code: "a-planifier", label: "À planifier" },
  { code: "planifiees", label: "Planifiées" },
  { code: "realisees", label: "Réalisées" },
  { code: "toutes", label: "Toutes" },
]

export { INTERVENTION_VUES }

export async function loadAdminUnifiedInterventions(
  supabase: SupabaseClient,
  options: {
    q: string
    vue: InterventionVue
    audience: CommandeAudienceFilter
  }
): Promise<{ rows: AdminUnifiedRow[]; counts: Record<string, number> }> {
  const { q, vue, audience } = options

  const [{ data: commandes }, { data: interventions }] = await Promise.all([
    supabase
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
      .order("date_creation", { ascending: false }),
    supabase
      .from("interventions")
      .select(
        `
        id,
        numero,
        statut,
        date_demande,
        date_souhaitee,
        date_reelle,
        commande_id,
        chantiers ( id, nom ),
        types_intervention ( label ),
        dechets_types ( nom )
      `
      )
      .order("date_demande", { ascending: false }),
  ])

  const commandeRows = (commandes ?? []) as unknown as AdminCommandeListItem[]
  const byAudience = commandeRows.filter((c) =>
    matchesCommandeAudience(
      c.audience === "particulier" || c.audience === "professionnel" ? c.audience : null,
      audience
    )
  )

  const linkedCommandeIds = new Set(
    (interventions ?? [])
      .map((i) => i.commande_id as string | null)
      .filter(Boolean) as string[]
  )

  const unified: AdminUnifiedRow[] = []

  for (const c of byAudience) {
    if (linkedCommandeIds.has(c.id) && c.statut !== "brouillon") continue
    unified.push({
      id: c.id,
      kind: "commande",
      reference: c.id.slice(0, 8).toUpperCase(),
      clientLabel: c.contact_nom ?? c.contact_email ?? "—",
      chantierLabel: c.adresse_complete || null,
      statutCode: c.statut,
      statutLabel: statutCommandeAsIntervention(c.statut, c.payment_status),
      typeLabel: c.prestation_label,
      dateSort: c.date_creation,
      audience: c.audience,
      href: `/admin/interventions/${c.id}`,
      commande: c,
    })
  }

  for (const i of interventions ?? []) {
    const chantier = i.chantiers as unknown as { id: string; nom: string } | null
    const type = i.types_intervention as unknown as { label: string } | null
    const dechet = i.dechets_types as unknown as { nom: string } | null
    unified.push({
      id: i.id,
      kind: "intervention",
      reference: i.numero,
      clientLabel: chantier?.nom ?? "—",
      chantierLabel: chantier?.nom ?? null,
      statutCode: i.statut,
      statutLabel: statutInterventionAffiche(i.statut),
      typeLabel: type?.label ?? dechet?.nom ?? null,
      dateSort: i.date_souhaitee ?? i.date_demande,
      audience: null,
      href: `/admin/interventions/${i.id}`,
    })
  }

  const countFor = (v: InterventionVue) => {
    if (v === "a-planifier") {
      return unified.filter(
        (r) =>
          (r.kind === "intervention" && r.statutCode === "en_cours_programmation") ||
          (r.kind === "commande" && isCommandeATraiter(r.statutCode, r.commande?.payment_status ?? null))
      ).length
    }
    if (v === "planifiees") {
      return unified.filter((r) => r.kind === "intervention" && r.statutCode === "programme").length
    }
    if (v === "realisees") {
      return unified.filter((r) => r.kind === "intervention" && r.statutCode === "realisee").length
    }
    if (COMMANDES_VUES.some((cv) => cv.code === v)) {
      return byAudience.filter((c) => matchesCommandeVue(c, v as CommandeVue)).length
    }
    return unified.length
  }

  const counts = Object.fromEntries(INTERVENTION_VUES.map((v) => [v.code, countFor(v.code)]))

  const filtered = unified
    .filter((r) => {
      if (vue === "a-planifier") {
        return (
          (r.kind === "intervention" && r.statutCode === "en_cours_programmation") ||
          (r.kind === "commande" &&
            isCommandeATraiter(r.statutCode, r.commande?.payment_status ?? null))
        )
      }
      if (vue === "planifiees") {
        return r.kind === "intervention" && r.statutCode === "programme"
      }
      if (vue === "realisees") {
        return r.kind === "intervention" && r.statutCode === "realisee"
      }
      if (vue === "toutes") return true
      if (vue === "interventions") return r.kind === "intervention"
      if (r.kind === "commande" && r.commande) {
        return matchesCommandeVue(r.commande, vue as CommandeVue)
      }
      return false
    })
  const filteredWithSearch = filtered.filter((r) => {
    if (!q.trim()) return true
    if (r.kind === "commande" && r.commande) {
      return matchesCommandeSearch(r.commande, q)
    }
    const needle = q.trim().toLowerCase()
    return (
      r.reference.toLowerCase().includes(needle) ||
      r.clientLabel.toLowerCase().includes(needle) ||
      (r.chantierLabel?.toLowerCase().includes(needle) ?? false)
    )
  })

  filteredWithSearch.sort((a, b) => b.dateSort.localeCompare(a.dateSort))

  return { rows: filteredWithSearch, counts }
}