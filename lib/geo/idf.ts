import { DEPARTEMENTS_IDF } from "@/lib/cdc/referentiels"

const IDF_CODES = new Set<string>(DEPARTEMENTS_IDF.map((d) => d.code))

/** Extrait le département depuis un code postal IDF présent dans l'adresse. */
export function extractDepartementFromAddress(address: string): string | null {
  const matches = address.match(/\b(75|77|78|91|92|93|94|95)\d{3}\b/g)
  if (!matches?.length) return null
  return matches[matches.length - 1]!.slice(0, 2)
}

export function isAddressInIdf(address: string): boolean {
  const dept = extractDepartementFromAddress(address)
  return dept !== null && IDF_CODES.has(dept)
}

export function departementLabel(code: string): string | null {
  return DEPARTEMENTS_IDF.find((d) => d.code === code)?.nom ?? null
}
