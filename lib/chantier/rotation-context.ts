import type { SupabaseClient } from "@supabase/supabase-js"

const ACTIVE_INTERVENTION_STATUTS = new Set([
  "en_cours_programmation",
  "programme",
])

const ROTATION_TYPE_CODES = new Set(["depose", "rotation"])

export type ChantierRotationContext = {
  canRequest: boolean
  blockedReason: string | null
  contenantId: string | null
  dechetTypeId: string | null
  contenantLabel: string | null
  dechetNom: string | null
  pendingDemande: {
    id: string
    souhaiteLe: string
    statut: string
  } | null
}

export async function loadChantierRotationContext(
  supabase: SupabaseClient,
  chantierId: string
): Promise<ChantierRotationContext> {
  const empty: ChantierRotationContext = {
    canRequest: false,
    blockedReason: "Aucune benne en place sur ce chantier.",
    contenantId: null,
    dechetTypeId: null,
    contenantLabel: null,
    dechetNom: null,
    pendingDemande: null,
  }

  const [{ data: pending }, { data: interventions }] = await Promise.all([
    supabase
      .from("demandes_rotation")
      .select("id, souhaite_le, statut")
      .eq("chantier_id", chantierId)
      .eq("statut", "en_attente")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("interventions")
      .select(
        `
        id, statut, date_demande, created_at,
        contenant_id, dechet_type_id,
        types_intervention(code),
        types_contenants(label),
        dechets_types(nom)
      `
      )
      .eq("chantier_id", chantierId)
      .order("date_demande", { ascending: false })
      .order("created_at", { ascending: false }),
  ])

  const pendingDemande = pending
    ? {
        id: pending.id,
        souhaiteLe: pending.souhaite_le,
        statut: pending.statut,
      }
    : null

  if (pendingDemande) {
    return {
      ...empty,
      pendingDemande,
      blockedReason: "Une demande de rotation est déjà en cours de traitement.",
    }
  }

  const rows = interventions ?? []
  const active = rows.find((row) => {
    const code =
      (row.types_intervention as unknown as { code: string } | null)?.code ?? ""
    return ROTATION_TYPE_CODES.has(code) && ACTIVE_INTERVENTION_STATUTS.has(row.statut)
  })

  if (!active) {
    return { ...empty, pendingDemande: null }
  }

  return {
    canRequest: true,
    blockedReason: null,
    contenantId: active.contenant_id,
    dechetTypeId: active.dechet_type_id,
    contenantLabel:
      (active.types_contenants as unknown as { label: string } | null)?.label ?? null,
    dechetNom:
      (active.dechets_types as unknown as { nom: string } | null)?.nom ?? null,
    pendingDemande: null,
  }
}
