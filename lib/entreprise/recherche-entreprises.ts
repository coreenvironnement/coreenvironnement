const API_BASE = "https://recherche-entreprises.api.gouv.fr/search"

export type EntrepriseAdresseFormatee = {
  ligneVoie: string
  codePostal: string
  ville: string
  /** Une ligne pour champs type recherche adresse (BAN) */
  adresseUneLigne: string
  /** Plusieurs lignes pour textarea siège social */
  adresseMultiligne: string
}

export type EntrepriseLookupResult = {
  raisonSociale: string
  siret: string
  codeNaf: string | null
  adresseSiege: string | null
  ville: string | null
  codePostal: string | null
  adresse: EntrepriseAdresseFormatee
}

/** Découpe une adresse Sirene du type « 8 RUE X 75009 PARIS » sans doublonner CP/ville. */
export function formatAdresseFromSirene(
  adresse?: string | null,
  codePostal?: string | null,
  ville?: string | null
): EntrepriseAdresseFormatee {
  let ligne = (adresse ?? "").trim()
  let cp = (codePostal ?? "").trim()
  let v = (ville ?? "").trim()

  const inLine = ligne.match(/^(.*?)[\s,]+(\d{5})\s+(.+)$/)
  if (inLine) {
    ligne = inLine[1]!.trim().replace(/,\s*$/, "")
    if (!cp) cp = inLine[2]!
    if (!v) v = inLine[3]!.trim()
  }

  if (v.length === 5 && /^\d+$/.test(v) && !cp) {
    cp = v
    v = ""
  }

  const cpVille = [cp, v].filter(Boolean).join(" ")
  const adresseUneLigne =
    ligne && cpVille ? `${ligne}, ${cpVille}` : ligne || cpVille
  const adresseMultiligne =
    ligne && cpVille ? `${ligne}\n${cpVille}` : ligne || cpVille

  return {
    ligneVoie: ligne,
    codePostal: cp,
    ville: v,
    adresseUneLigne,
    adresseMultiligne,
  }
}

export function normalizeSiret(raw: string): string {
  return raw.replace(/[\s.-]/g, "").replace(/\D/g, "").slice(0, 14)
}

export function formatSiretDigits(digits: string): string {
  const d = normalizeSiret(digits)
  if (d.length !== 14) return digits.trim()
  return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6, 9)} ${d.slice(9, 14)}`
}

type ApiSiege = {
  siret?: string
  adresse?: string
  code_postal?: string
  libelle_commune?: string
  activite_principale?: string
}

type ApiResult = {
  nom_complet?: string
  nom_raison_sociale?: string
  siege?: ApiSiege
  matching_etablissements?: ApiSiege[]
  activite_principale?: string
}

type ApiResponse = {
  results?: ApiResult[]
}

function pickEtablissement(result: ApiResult, siret: string): ApiSiege | null {
  const match = result.matching_etablissements?.find((e) => e.siret === siret)
  if (match) return match
  if (result.siege?.siret === siret) return result.siege
  return result.siege ?? null
}

function toLookupResult(result: ApiResult, siret?: string): EntrepriseLookupResult | null {
  const digits = siret ? normalizeSiret(siret) : normalizeSiret(result.siege?.siret ?? "")
  const etab = digits.length === 14 ? pickEtablissement(result, digits) : result.siege
  const siretOut = etab?.siret ?? result.siege?.siret
  if (!siretOut) return null

  const raison =
    result.nom_complet?.trim() ||
    result.nom_raison_sociale?.trim() ||
    ""

  const adresse = formatAdresseFromSirene(
    etab?.adresse,
    etab?.code_postal,
    etab?.libelle_commune
  )

  return {
    raisonSociale: raison,
    siret: formatSiretDigits(siretOut),
    codeNaf: etab?.activite_principale ?? result.activite_principale ?? null,
    adresseSiege: adresse.adresseMultiligne || null,
    ville: adresse.ville || null,
    codePostal: adresse.codePostal || null,
    adresse,
  }
}

export async function fetchEntrepriseBySiret(siret: string): Promise<EntrepriseLookupResult | null> {
  const digits = normalizeSiret(siret)
  if (digits.length !== 14) return null

  const url = `${API_BASE}?q=${digits}&per_page=5`
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 86400 },
  })
  if (!res.ok) return null

  const data = (await res.json()) as ApiResponse
  for (const row of data.results ?? []) {
    const mapped = toLookupResult(row, digits)
    if (mapped && normalizeSiret(mapped.siret) === digits) return mapped
  }
  return null
}

export async function searchEntreprisesByName(
  query: string,
  limit = 8
): Promise<EntrepriseLookupResult[]> {
  const q = query.trim()
  if (q.length < 2) return []

  const url = `${API_BASE}?q=${encodeURIComponent(q)}&per_page=${Math.min(limit, 25)}`
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 3600 },
  })
  if (!res.ok) return []

  const data = (await res.json()) as ApiResponse
  const out: EntrepriseLookupResult[] = []
  for (const row of data.results ?? []) {
    const mapped = toLookupResult(row)
    if (mapped) out.push(mapped)
  }
  return out
}