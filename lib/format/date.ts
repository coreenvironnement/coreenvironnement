const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

const orderDatePickerFormatter = new Intl.DateTimeFormat("fr-FR", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
})

function parseIsoDate(value: string): Date | null {
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return null
  return date
}

export function formatDateFr(value: string | null | undefined): string {
  if (!value) return "—"
  const date = parseIsoDate(value)
  if (!date) return "—"
  return dateFormatter.format(date)
}

/** Affichage tunnel commande — ex. « mer. 29 oct. 2026 » */
export function formatOrderDatePicker(value: string | null | undefined): string {
  if (!value) return ""
  const date = parseIsoDate(value)
  if (!date) return ""
  const formatted = orderDatePickerFormatter.format(date)
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
