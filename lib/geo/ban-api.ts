import { isDepartementInIdf } from "@/lib/geo/idf"

const BAN_SEARCH_URL = "https://api-adresse.data.gouv.fr/search/"

export type AddressGeocodeHit = {
  label: string
  lat: number
  lng: number
  postcode: string
  city: string
  departementCode: string
  score: number
}

type BanSearchResponse = {
  features?: Array<{
    geometry?: { coordinates?: [number, number] }
    properties?: {
      label?: string
      postcode?: string
      city?: string
      depcode?: string
      score?: number
    }
  }>
}

function mapFeature(
  feature: NonNullable<BanSearchResponse["features"]>[number]
): AddressGeocodeHit | null {
  const props = feature.properties
  const coords = feature.geometry?.coordinates
  if (!props?.label || !coords?.length || coords.length < 2) return null

  const departementCode = props.depcode ?? props.postcode?.slice(0, 2) ?? ""
  if (!departementCode || !isDepartementInIdf(departementCode)) return null

  return {
    label: props.label,
    lat: coords[1]!,
    lng: coords[0]!,
    postcode: props.postcode ?? "",
    city: props.city ?? "",
    departementCode,
    score: props.score ?? 0,
  }
}

const BAN_FETCH_LIMIT = 50

/** Recherche d'adresses via la Base Adresse Nationale (API publique, sans clé). */
export async function searchBanAddresses(
  query: string,
  limit = 8,
  signal?: AbortSignal
): Promise<AddressGeocodeHit[]> {
  const q = query.trim()
  if (q.length < 3) return []

  const params = new URLSearchParams({
    q,
    limit: String(BAN_FETCH_LIMIT),
    autocomplete: "1",
  })

  const postcodeInQuery = q.match(/\b(75|77|78|91|92|93|94|95)\d{3}\b/)?.[0]
  if (postcodeInQuery) {
    params.set("postcode", postcodeInQuery)
  }

  const res = await fetch(`${BAN_SEARCH_URL}?${params.toString()}`, {
    headers: { Accept: "application/json" },
    signal,
  })

  if (!res.ok) {
    throw new Error(`BAN API error: ${res.status}`)
  }

  const data = (await res.json()) as BanSearchResponse
  const hits: AddressGeocodeHit[] = []

  for (const feature of data.features ?? []) {
    const hit = mapFeature(feature)
    if (hit) hits.push(hit)
    if (hits.length >= limit) break
  }

  return hits
}
