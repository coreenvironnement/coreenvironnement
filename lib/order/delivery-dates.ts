const PARIS_TZ = "Europe/Paris"

/** Date calendaire (YYYY-MM-DD) la plus tôt autorisée : maintenant + 24 h en Europe/Paris. */
export function minDeliveryDateISO(nowMs: number = Date.now()): string {
  const minMs = nowMs + 24 * 60 * 60 * 1000
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(minMs))
}

export function isValidDeliveryDate(iso: string, nowMs: number = Date.now()): boolean {
  if (!iso.length) return false
  return iso >= minDeliveryDateISO(nowMs)
}

export function isValidPickupDate(
  deliveryIso: string,
  pickupIso: string,
  nowMs: number = Date.now()
): boolean {
  if (!pickupIso.length) return true
  if (!isValidDeliveryDate(deliveryIso, nowMs)) return false
  return pickupIso >= deliveryIso
}
