export const INVOICE_DELAY_MS = 4 * 60 * 60 * 1000

export function invoiceAvailableAt(livreeAt: string | null | undefined): Date | null {
  if (!livreeAt) return null
  const base = new Date(livreeAt).getTime()
  if (Number.isNaN(base)) return null
  return new Date(base + INVOICE_DELAY_MS)
}

export function isInvoiceAvailable(
  livreeAt: string | null | undefined,
  now = Date.now()
): boolean {
  const at = invoiceAvailableAt(livreeAt)
  if (!at) return false
  return now >= at.getTime()
}

export function formatInvoiceAvailableHint(livreeAt: string | null | undefined): string | null {
  const at = invoiceAvailableAt(livreeAt)
  if (!at) return null
  return at.toLocaleString("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}