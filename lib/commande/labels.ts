export const STATUTS_COMMANDE = [
  { code: "brouillon", label: "Brouillon" },
  { code: "confirmee", label: "Confirmée" },
  { code: "en_cours", label: "En cours" },
  { code: "livree", label: "Livrée" },
  { code: "annulee", label: "Annulée" },
] as const

export const PAYMENT_STATUSES = [
  { code: "pending", label: "En attente" },
  { code: "paid", label: "Payée" },
  { code: "waived", label: "Sur facture" },
  { code: "failed", label: "Échec" },
] as const

export type StatutCommande = (typeof STATUTS_COMMANDE)[number]["code"]
export type PaymentStatusCommande = (typeof PAYMENT_STATUSES)[number]["code"]

export function statutCommandeLabel(code: string): string {
  return STATUTS_COMMANDE.find((s) => s.code === code)?.label ?? code
}

export function paymentStatusLabel(code: string | null): string {
  if (!code) return "—"
  return PAYMENT_STATUSES.find((s) => s.code === code)?.label ?? code
}

export function audienceCommandeLabel(code: string | null): string {
  if (code === "particulier") return "Particulier"
  if (code === "professionnel") return "Professionnel"
  return "—"
}
