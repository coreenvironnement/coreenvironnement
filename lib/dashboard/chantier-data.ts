import type { SupabaseClient } from "@supabase/supabase-js"

import {
  calculateValorisationGlobale,
  type ValorisationResult,
} from "@/lib/valorisation/calculate"

export type ChantierSummary = {
  id: string
  nom: string
  adresse: string | null
}

export type TonnageChartRow = {
  dechetTypeId: string
  nom: string
  tonnageT: number
  partPct: number
}

export type ChantierDashboardData = {
  chantier: ChantierSummary & {
    prestataireId: string | null
    prestataireNom: string | null
  }
  tonnages: TonnageChartRow[]
  valorisation: ValorisationResult
  anneeTaux: number
}

export type InterventionHistoryRow = {
  id: string
  numero: string
  dateDemande: string | null
  typeLabel: string
  contenantLabel: string
  dechetNom: string
  dateSouhaitee: string | null
  statut: string
  statutLabel: string
  dateReelle: string | null
  commentaire: string | null
  documents: {
    id: string
    documentType: string
    fileName: string
    label: string
  }[]
}

const ANNEE_DEFAUT = new Date().getFullYear()

export async function getUserChantiers(
  supabase: SupabaseClient,
  userId: string
): Promise<ChantierSummary[]> {
  const { data: membreships } = await supabase
    .from("chantier_membres")
    .select("chantier_id, chantiers(id, nom, adresse, is_active)")
    .eq("profile_id", userId)

  const raw =
    membreships
      ?.map((m) => m.chantiers)
      .flat()
      .filter(
        (c) =>
          c &&
          typeof c === "object" &&
          "id" in c &&
          (c as { is_active?: boolean }).is_active !== false
      ) ?? []

  return raw.map((c) => {
    const chantier = c as { id: string; nom: string; adresse: string | null }
    return { id: chantier.id, nom: chantier.nom, adresse: chantier.adresse }
  })
}

export async function userHasChantierAccess(
  supabase: SupabaseClient,
  userId: string,
  chantierId: string
): Promise<boolean> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single()

  if (profile?.role === "admin") return true

  const { data: member } = await supabase
    .from("chantier_membres")
    .select("id")
    .eq("chantier_id", chantierId)
    .eq("profile_id", userId)
    .maybeSingle()

  return Boolean(member)
}

export async function loadChantierDashboard(
  supabase: SupabaseClient,
  chantierId: string,
  annee = ANNEE_DEFAUT
): Promise<ChantierDashboardData | null> {
  const { data: chantier } = await supabase
    .from("chantiers")
    .select("id, nom, adresse, prestataire_id, prestataires(id, nom)")
    .eq("id", chantierId)
    .single()

  if (!chantier) return null

  const prestataire = chantier.prestataires as unknown as { id: string; nom: string } | null

  const [{ data: statsDechets }, { data: dechetsTypes }] = await Promise.all([
    supabase
      .from("chantier_stats_dechets")
      .select("dechet_type_id, tonnage_t")
      .eq("chantier_id", chantierId),
    supabase.from("dechets_types").select("id, code, nom").order("sort_order"),
  ])

  const dechetMap = new Map(
    (dechetsTypes ?? []).map((d) => [d.id, { code: d.code, nom: d.nom }])
  )

  const tonnagesInput =
    statsDechets?.map((s) => {
      const meta = dechetMap.get(s.dechet_type_id)
      return {
        dechetTypeId: s.dechet_type_id,
        dechetCode: meta?.code,
        dechetNom: meta?.nom,
        tonnageT: Number(s.tonnage_t),
      }
    }) ?? []

  let tauxParType: { dechetTypeId: string; tauxPct: number }[] = []

  if (chantier.prestataire_id) {
    const { data: tauxRows } = await supabase
      .from("prestataire_taux_valorisation")
      .select("dechet_type_id, taux_pct")
      .eq("prestataire_id", chantier.prestataire_id)
      .eq("annee", annee)

    tauxParType =
      tauxRows?.map((t) => ({
        dechetTypeId: t.dechet_type_id,
        tauxPct: Number(t.taux_pct),
      })) ?? []
  }

  const valorisation = calculateValorisationGlobale(tonnagesInput, tauxParType, annee)

  const tonnages: TonnageChartRow[] = valorisation.details.map((d) => ({
    dechetTypeId: d.dechetTypeId,
    nom: d.dechetNom ?? dechetMap.get(d.dechetTypeId)?.nom ?? "Déchet",
    tonnageT: d.tonnageT,
    partPct: d.partPct,
  }))

  return {
    chantier: {
      id: chantier.id,
      nom: chantier.nom,
      adresse: chantier.adresse,
      prestataireId: chantier.prestataire_id,
      prestataireNom: prestataire?.nom ?? null,
    },
    tonnages,
    valorisation,
    anneeTaux: annee,
  }
}

export async function loadChantierInterventions(
  supabase: SupabaseClient,
  chantierId: string,
  statutLabels: Record<string, string>,
  documentLabels: Record<string, string>
): Promise<InterventionHistoryRow[]> {
  const { data: interventions } = await supabase
    .from("interventions")
    .select(
      `
      id, numero, statut, date_demande, date_souhaitee, date_reelle, commentaire,
      types_intervention(label),
      types_contenants(label),
      dechets_types(nom),
      intervention_documents(id, document_type, file_name)
    `
    )
    .eq("chantier_id", chantierId)
    .order("date_demande", { ascending: false })

  return (interventions ?? []).map((row) => {
    const docs = (row.intervention_documents ?? []) as {
      id: string
      document_type: string
      file_name: string
    }[]

    return {
      id: row.id,
      numero: row.numero,
      dateDemande: row.date_demande,
      typeLabel:
        (row.types_intervention as unknown as { label: string } | null)?.label ?? "—",
      contenantLabel:
        (row.types_contenants as unknown as { label: string } | null)?.label ?? "—",
      dechetNom: (row.dechets_types as unknown as { nom: string } | null)?.nom ?? "—",
      dateSouhaitee: row.date_souhaitee,
      statut: row.statut,
      statutLabel: statutLabels[row.statut] ?? row.statut,
      dateReelle: row.date_reelle,
      commentaire: row.commentaire,
      documents: docs.map((d) => ({
        id: d.id,
        documentType: d.document_type,
        fileName: d.file_name,
        label: documentLabels[d.document_type] ?? d.document_type,
      })),
    }
  })
}
