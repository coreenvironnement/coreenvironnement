import { parisLocalToUtcMs } from "@/lib/chantier/rotation-datetime"

const PARIS_TZ = "Europe/Paris"

export type ParsedCreneau = {
  atUtc: string
  dateYmd: string
  timeHm: string
}

export function parseAdminCreneauForm(formData: FormData): ParsedCreneau | { error: string } {
  const dateYmd = String(formData.get("date") ?? formData.get("plan_date") ?? "").trim()
  const timeHm = String(formData.get("time") ?? formData.get("plan_time") ?? "").trim()

  if (!dateYmd || !timeHm) {
    return { error: "Indiquez la date et l’heure du créneau." }
  }

  const ms = parisLocalToUtcMs(dateYmd, timeHm)
  if (ms == null) {
    return { error: "Date ou heure invalide." }
  }

  return {
    atUtc: new Date(ms).toISOString(),
    dateYmd,
    timeHm: timeHm.includes(":") ? timeHm : `${timeHm}:00`,
  }
}

export function formatCreneauFr(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null

  const datePart = new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS_TZ,
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d)

  const timePart = new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d)

  return `${datePart} · ${timePart}`
}

export function formatCreneauFrShort(iso: string | null | undefined): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null

  const datePart = new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS_TZ,
    day: "numeric",
    month: "short",
  }).format(d)

  const timePart = new Intl.DateTimeFormat("fr-FR", {
    timeZone: PARIS_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d)

  return `${datePart} à ${timePart}`
}

export function commandeSmsHref(telephone: string, body: string): string {
  const digits = telephone.replace(/[^\d+]/g, "")
  const encoded = encodeURIComponent(body)
  return `sms:${digits}?body=${encoded}`
}

export function defaultSmsPlanificationBody(input: {
  reference: string
  creneauLabel: string
  isReport?: boolean
}): string {
  if (input.isReport) {
    return `Bonjour, CORE Environnement. Concernant votre demande ${input.reference}, nous reportons la livraison au ${input.creneauLabel}. Merci de nous confirmer votre disponibilité.`
  }
  return `Bonjour, CORE Environnement. Votre livraison ${input.reference} est planifiée le ${input.creneauLabel}. L'équipe reste joignable pour toute question.`
}