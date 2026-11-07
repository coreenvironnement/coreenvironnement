const PARIS_TZ = "Europe/Paris"

export const ROTATION_MIN_LEAD_MS = 6 * 60 * 60 * 1000

export const ROTATION_TOO_SOON_MESSAGE =
  "La rotation doit être demandée au moins 6 heures avant l'horaire souhaité (fuseau Europe/Paris)."

function formatParisLocal(ms: number): { date: string; time: string } {
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(ms))

  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: PARIS_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date(ms))

  const hour = parts.find((p) => p.type === "hour")?.value ?? "00"
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00"

  return { date, time: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}` }
}

/** Instant UTC (ms) pour une date + heure civile Europe/Paris. */
export function parisLocalToUtcMs(dateYmd: string, timeHm: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateYmd)
  const t = /^(\d{1,2}):(\d{2})$/.exec(timeHm)
  if (!m || !t) return null

  const targetDate = dateYmd
  const targetTime = `${t[1].padStart(2, "0")}:${t[2]}`

  let ms = Date.parse(`${dateYmd}T12:00:00.000Z`)

  for (let i = 0; i < 64; i++) {
    const got = formatParisLocal(ms)
    if (got.date === targetDate && got.time === targetTime) return ms

    const [gy, gm, gd] = got.date.split("-").map(Number)
    const [ty, tm, td] = targetDate.split("-").map(Number)
    const [gh, gmin] = got.time.split(":").map(Number)
    const [th, tmin] = targetTime.split(":").map(Number)

    const gotSlot = Date.UTC(gy, gm - 1, gd, gh, gmin)
    const wantSlot = Date.UTC(ty, tm - 1, td, th, tmin)
    ms += wantSlot - gotSlot
  }

  return null
}

export function isRotationAtLeast6hAhead(
  dateYmd: string,
  timeHm: string,
  nowMs: number = Date.now()
): boolean {
  const target = parisLocalToUtcMs(dateYmd, timeHm)
  if (target == null) return false
  return target - nowMs >= ROTATION_MIN_LEAD_MS
}
