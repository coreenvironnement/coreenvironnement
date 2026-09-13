import { DEPARTEMENTS_IDF } from "@/lib/cdc/referentiels"

const IDF_POSTCODE_PREFIX = /^(75|77|78|91|92|93|94|95)/
const IDF_POSTCODE_IN_TEXT = /\b(75|77|78|91|92|93|94|95)\d{3}\b/g

const IDF_CODES = new Set<string>(DEPARTEMENTS_IDF.map((d) => d.code))

export const IDF_DEPARTEMENT_CODES = DEPARTEMENTS_IDF.map((d) => d.code)

export function isDepartementInIdf(code: string): boolean {
  return IDF_CODES.has(code)
}

/** Extrait le département depuis un code postal à 5 chiffres. */
export function extractDepartementFromPostcode(postcode: string): string | null {
  const normalized = postcode.trim()
  if (!IDF_POSTCODE_PREFIX.test(normalized)) return null
  return normalized.slice(0, 2)
}

/** Extrait le département depuis un code postal IDF présent dans l'adresse. */
export function extractDepartementFromAddress(address: string): string | null {
  const matches = address.match(IDF_POSTCODE_IN_TEXT)
  if (!matches?.length) return null
  return matches[matches.length - 1]!.slice(0, 2)
}

export function isAddressInIdf(address: string): boolean {
  const dept = extractDepartementFromAddress(address)
  return dept !== null && IDF_CODES.has(dept)
}

export function isPostcodeInIdf(postcode: string): boolean {
  const dept = extractDepartementFromPostcode(postcode)
  return dept !== null && IDF_CODES.has(dept)
}

export function departementLabel(code: string): string | null {
  return DEPARTEMENTS_IDF.find((d) => d.code === code)?.nom ?? null
}
