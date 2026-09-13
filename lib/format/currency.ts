const euroFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
})

export function formatEuro(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return euroFormatter.format(value)
}
