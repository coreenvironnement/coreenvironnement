const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
})

export function formatDateFr(value: string | null | undefined): string {
  if (!value) return "—"
  const date = new Date(value.includes("T") ? value : `${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return "—"
  return dateFormatter.format(date)
}
