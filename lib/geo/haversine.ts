/** Centre opérationnel — Élancourt (Yvelines), aligné sur le schéma Supabase. */
export const ELIANCOURT_CENTER = {
  lat: 48.775,
  lng: 1.947,
} as const

export const DEFAULT_INTERVENTION_RADIUS_KM = 20

const EARTH_RADIUS_KM = 6371

function toRad(deg: number) {
  return (deg * Math.PI) / 180
}

/** Distance entre deux points WGS84 en kilomètres (formule de Haversine). */
export function haversineDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number }
): number {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

export function isWithinRadiusKm(
  point: { lat: number; lng: number },
  center: { lat: number; lng: number } = ELIANCOURT_CENTER,
  radiusKm: number = DEFAULT_INTERVENTION_RADIUS_KM
): boolean {
  return haversineDistanceKm(point, center) <= radiusKm
}
