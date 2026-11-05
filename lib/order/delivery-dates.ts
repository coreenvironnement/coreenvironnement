const PARIS_TZ = "Europe/Paris"

export const DELIVERY_DATE_INVALID_MESSAGE =
  "La date de livraison doit être au minimum le lendemain (fuseau Europe/Paris). Les dates passées et le jour même ne sont pas acceptées."

/** Date calendaire YYYY-MM-DD du jour civil en Europe/Paris. */
export function calendarDateParis(nowMs: number = Date.now()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(nowMs))
}

function addCalendarDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map((part) => Number.parseInt(part, 10))
  const shifted = Date.UTC(y, m - 1, d + days, 12, 0, 0)
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(shifted))
}

/** Date calendaire (YYYY-MM-DD) la plus tôt autorisée : lendemain en Europe/Paris. */
export function minDeliveryDateISO(nowMs: number = Date.now()): string {
  return addCalendarDaysISO(calendarDateParis(nowMs), 1)
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
