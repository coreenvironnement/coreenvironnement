export function formatOrderReference(commandeId: string, numero?: string | null) {
  const real = numero?.trim()
  if (real) return real
  const fragment = commandeId.replace(/-/g, "").slice(0, 6).toUpperCase()
  return fragment ? `CE-${fragment}` : "CE-——"
}
