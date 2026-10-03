import { formatOrderReference } from "@/lib/commande/reference"

type CommandeSearchFields = {
  id: string
  contact_nom: string | null
  contact_email: string | null
  contact_telephone: string | null
}

export function matchesCommandeSearch(commande: CommandeSearchFields, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true

  const reference = formatOrderReference(commande.id).toLowerCase()
  const haystack = [
    reference,
    commande.contact_nom,
    commande.contact_email,
    commande.contact_telephone,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

  if (haystack.includes(needle)) return true

  const queryDigits = needle.replace(/\D/g, "")
  const phoneDigits = (commande.contact_telephone ?? "").replace(/\D/g, "")
  return queryDigits.length >= 4 && phoneDigits.includes(queryDigits)
}
