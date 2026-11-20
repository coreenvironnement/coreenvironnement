type DechetTypeEmbed = { code: string; nom: string }

export type PrestataireTauxRow = {
  prestataire_id: string
  annee: number
  taux_pct: number
  dechets_types: DechetTypeEmbed | DechetTypeEmbed[] | null
}

function normalizeDechetType(
  raw: PrestataireTauxRow["dechets_types"]
): DechetTypeEmbed | null {
  if (!raw) return null
  if (Array.isArray(raw)) return raw[0] ?? null
  return raw
}

export type PrestataireTauxParType = {
  code: string
  nom: string
  tauxPct: number
}

export type PrestataireTauxSummary = {
  annee: number
  valorisationMoyennePct: number
  eliminationMoyennePct: number
  parType: PrestataireTauxParType[]
}

function round1(n: number) {
  return Math.round(n * 10) / 10
}

function rowsForYear(
  byYear: Map<number, PrestataireTauxRow[]>,
  anneePreferee: number
): { annee: number; rows: PrestataireTauxRow[] } | null {
  const preferred = byYear.get(anneePreferee)
  if (preferred?.length) return { annee: anneePreferee, rows: preferred }

  let bestYear = -1
  for (const year of byYear.keys()) {
    if (year > bestYear) bestYear = year
  }
  if (bestYear < 0) return null
  const rows = byYear.get(bestYear) ?? []
  if (!rows.length) return null
  return { annee: bestYear, rows }
}

export function buildPrestataireTauxSummaries(
  rows: PrestataireTauxRow[],
  anneePreferee: number
): Map<string, PrestataireTauxSummary> {
  const byPrestataire = new Map<string, Map<number, PrestataireTauxRow[]>>()

  for (const row of rows) {
    const pct = Number(row.taux_pct)
    if (!Number.isFinite(pct)) continue
    const years = byPrestataire.get(row.prestataire_id) ?? new Map()
    const list = years.get(row.annee) ?? []
    list.push({ ...row, taux_pct: pct })
    years.set(row.annee, list)
    byPrestataire.set(row.prestataire_id, years)
  }

  const out = new Map<string, PrestataireTauxSummary>()

  for (const [prestataireId, byYear] of byPrestataire) {
    const picked = rowsForYear(byYear, anneePreferee)
    if (!picked) continue

    const parType: PrestataireTauxParType[] = picked.rows
      .map((r) => {
        const dechet = normalizeDechetType(r.dechets_types)
        if (!dechet) return null
        return {
          code: dechet.code,
          nom: dechet.nom,
          tauxPct: round1(Number(r.taux_pct)),
        }
      })
      .filter((x): x is PrestataireTauxParType => x !== null)
      .sort((a, b) => a.nom.localeCompare(b.nom, "fr"))

    if (!parType.length) continue

    const sum = parType.reduce((acc, t) => acc + t.tauxPct, 0)
    const moy = round1(sum / parType.length)

    out.set(prestataireId, {
      annee: picked.annee,
      valorisationMoyennePct: moy,
      eliminationMoyennePct: round1(100 - moy),
      parType,
    })
  }

  return out
}

export function formatTauxPctShort(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",")
}