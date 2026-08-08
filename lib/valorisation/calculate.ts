/**
 * Calcul du taux de valorisation global — règle client
 *
 * 1. tonnage_valorisé(type) = tonnage(type) × taux_prestataire(type) / 100
 * 2. total_valorisé = somme des tonnages valorisés
 * 3. taux_global = total_valorisé / tonnage_total × 100
 */

export type TonnageParType = {
  dechetTypeId: string
  dechetCode?: string
  dechetNom?: string
  tonnageT: number
}

export type TauxParType = {
  dechetTypeId: string
  tauxPct: number
}

export type ValorisationDetail = {
  dechetTypeId: string
  dechetCode?: string
  dechetNom?: string
  tonnageT: number
  tauxPct: number
  tonnageValoriseT: number
  partPct: number
}

export type ValorisationResult = {
  tonnageTotalT: number
  tonnageValoriseT: number
  tauxValorisationPct: number
  tauxEliminationPct: number
  details: ValorisationDetail[]
}

export function calculateValorisationGlobale(
  tonnages: TonnageParType[],
  tauxParType: TauxParType[],
  annee?: number
): ValorisationResult {
  void annee

  const tauxMap = new Map(tauxParType.map((t) => [t.dechetTypeId, t.tauxPct]))

  const details: ValorisationDetail[] = tonnages
    .filter((t) => t.tonnageT > 0)
    .map((t) => {
      const tauxPct = tauxMap.get(t.dechetTypeId) ?? 0
      const tonnageValoriseT = t.tonnageT * (tauxPct / 100)
      return {
        dechetTypeId: t.dechetTypeId,
        dechetCode: t.dechetCode,
        dechetNom: t.dechetNom,
        tonnageT: t.tonnageT,
        tauxPct,
        tonnageValoriseT,
        partPct: 0,
      }
    })

  const tonnageTotalT = details.reduce((sum, d) => sum + d.tonnageT, 0)
  const tonnageValoriseT = details.reduce((sum, d) => sum + d.tonnageValoriseT, 0)

  const withParts = details.map((d) => ({
    ...d,
    partPct: tonnageTotalT > 0 ? (d.tonnageT / tonnageTotalT) * 100 : 0,
  }))

  const tauxValorisationPct =
    tonnageTotalT > 0 ? (tonnageValoriseT / tonnageTotalT) * 100 : 0

  return {
    tonnageTotalT,
    tonnageValoriseT,
    tauxValorisationPct: round2(tauxValorisationPct),
    tauxEliminationPct: round2(100 - tauxValorisationPct),
    details: withParts.map((d) => ({
      ...d,
      tonnageT: round3(d.tonnageT),
      tonnageValoriseT: round3(d.tonnageValoriseT),
      partPct: round2(d.partPct),
      tauxPct: round2(d.tauxPct),
    })),
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100
}

function round3(n: number) {
  return Math.round(n * 1000) / 1000
}

/** Exemple client : 10 t DIB à 90 % → 9 t valorisées */
export function exempleClientDib(): ValorisationResult {
  return calculateValorisationGlobale(
    [{ dechetTypeId: "dib", dechetCode: "dib", dechetNom: "DIB", tonnageT: 10 }],
    [{ dechetTypeId: "dib", tauxPct: 90 }]
  )
}
