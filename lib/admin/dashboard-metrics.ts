import type { SupabaseClient } from "@supabase/supabase-js"

export type AdminDashboardMetrics = {
  chantiersActifs: number
  chantiersTotal: number
  interventionsAPlanifier: number
  interventionsPlanifiees: number
  comptesProPending: number
  comptesProActifs: number
  brouillons: number
  aPlanifierRows: APlanifierRow[]
  planifieesRows: PlanifieeRow[]
  aTraiter: ATraiterItem[]
}

export type APlanifierRow = {
  id: string
  kind: "commande" | "intervention"
  label: string
  client: string
  dateSort: string
  href: string
}

export type PlanifieeRow = {
  id: string
  numero: string
  chantier: string
  datePrevue: string | null
  href: string
}

export type ATraiterItem = {
  id: string
  kind: "doc_manquant" | "tonnage_vide" | "date_depassee"
  label: string
  href: string
}

export async function loadAdminDashboardMetrics(
  supabase: SupabaseClient
): Promise<AdminDashboardMetrics> {
  const today = new Date().toISOString().slice(0, 10)

  const [
    { count: chantiersTotal },
    { count: chantiersActifs },
    { count: aPlanifierInt },
    { count: planifiees },
    { count: comptesProPending },
    { count: comptesProActifs },
    { count: brouillons },
    { count: commandesATraiter },
    { data: interventionsAPlanifier },
    { data: commandesPlanifiees },
    { data: interventionsPlanifiees },
    { data: realiseesSansPoids },
    { data: programmeesDepassees },
  ] = await Promise.all([
    supabase.from("chantiers").select("*", { count: "exact", head: true }),
    supabase.from("chantiers").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("interventions")
      .select("*", { count: "exact", head: true })
      .eq("statut", "en_cours_programmation"),
    supabase.from("interventions").select("*", { count: "exact", head: true }).eq("statut", "programme"),
    supabase.from("comptes_pro").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("comptes_pro").select("*", { count: "exact", head: true }).eq("status", "approved"),
    supabase.from("commandes").select("*", { count: "exact", head: true }).eq("statut", "brouillon"),
    supabase
      .from("commandes")
      .select("*", { count: "exact", head: true })
      .eq("statut", "confirmee")
      .eq("payment_status", "paid"),
    supabase
      .from("interventions")
      .select(
        `
        id,
        numero,
        date_demande,
        chantiers ( nom )
      `
      )
      .eq("statut", "en_cours_programmation")
      .order("date_demande", { ascending: true })
      .limit(8),
    supabase
      .from("commandes")
      .select("id, contact_nom, contact_email, date_creation, prestation_label")
      .eq("statut", "confirmee")
      .eq("payment_status", "paid")
      .order("date_creation", { ascending: true })
      .limit(8),
    supabase
      .from("interventions")
      .select(
        `
        id,
        numero,
        date_souhaitee,
        date_reelle,
        chantiers ( nom )
      `
      )
      .eq("statut", "programme")
      .order("date_souhaitee", { ascending: true, nullsFirst: false })
      .limit(8),
    supabase
      .from("interventions")
      .select("id, numero")
      .eq("statut", "realisee")
      .is("poids_reel_kg", null)
      .limit(20),
    supabase
      .from("interventions")
      .select("id, numero, date_souhaitee")
      .eq("statut", "programme")
      .lt("date_souhaitee", today)
      .limit(20),
  ])

  const aPlanifierRows: APlanifierRow[] = []

  for (const c of commandesPlanifiees ?? []) {
    aPlanifierRows.push({
      id: c.id,
      kind: "commande",
      label: c.prestation_label ?? "Commande web",
      client: c.contact_nom ?? c.contact_email ?? "—",
      dateSort: c.date_creation,
      href: `/admin/interventions/${c.id}`,
    })
  }

  for (const i of interventionsAPlanifier ?? []) {
    const chantier = i.chantiers as unknown as { nom: string } | null
    aPlanifierRows.push({
      id: i.id,
      kind: "intervention",
      label: i.numero,
      client: chantier?.nom ?? "—",
      dateSort: i.date_demande,
      href: `/admin/interventions/${i.id}`,
    })
  }

  aPlanifierRows.sort((a, b) => a.dateSort.localeCompare(b.dateSort))

  const planifieesRows: PlanifieeRow[] = (interventionsPlanifiees ?? []).map((i) => {
    const chantier = i.chantiers as unknown as { nom: string } | null
    return {
      id: i.id,
      numero: i.numero,
      chantier: chantier?.nom ?? "—",
      datePrevue: i.date_souhaitee ?? i.date_reelle,
      href: `/admin/interventions/${i.id}`,
    }
  })

  const aTraiter: ATraiterItem[] = []

  for (const i of realiseesSansPoids ?? []) {
    aTraiter.push({
      id: `poids-${i.id}`,
      kind: "tonnage_vide",
      label: `${i.numero} — tonnage réalisé non renseigné`,
      href: `/admin/interventions/${i.id}`,
    })
  }

  for (const i of programmeesDepassees ?? []) {
    aTraiter.push({
      id: `date-${i.id}`,
      kind: "date_depassee",
      label: `${i.numero} — date souhaitée dépassée`,
      href: `/admin/interventions/${i.id}`,
    })
  }

  return {
    chantiersActifs: chantiersActifs ?? 0,
    chantiersTotal: chantiersTotal ?? 0,
    interventionsAPlanifier: (aPlanifierInt ?? 0) + (commandesATraiter ?? 0),
    interventionsPlanifiees: planifiees ?? 0,
    comptesProPending: comptesProPending ?? 0,
    comptesProActifs: comptesProActifs ?? 0,
    brouillons: brouillons ?? 0,
    aPlanifierRows: aPlanifierRows.slice(0, 10),
    planifieesRows,
    aTraiter,
  }
}