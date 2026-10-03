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
  { code: "refunded", label: "Remboursée" },
  { code: "refund_pending", label: "Remboursement en cours" },
  { code: "refund_failed", label: "Échec du remboursement" },
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

export function paymentStatusBadgeClass(code: string | null): string {
  switch (code) {
    case "paid":
      return "bg-primary/15 text-brand-navy"
    case "pending":
      return "bg-amber-100 text-amber-900"
    case "failed":
    case "refund_failed":
      return "bg-destructive/10 text-destructive"
    case "refunded":
      return "bg-emerald-100 text-emerald-900"
    case "refund_pending":
      return "bg-orange-100 text-orange-900"
    case "waived":
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function statutCommandeBadgeClass(code: string): string {
  switch (code) {
    case "confirmee":
      return "bg-primary/15 text-brand-navy"
    case "en_cours":
      return "bg-blue-100 text-blue-900"
    case "livree":
      return "bg-emerald-100 text-emerald-900"
    case "annulee":
      return "bg-destructive/10 text-destructive"
    default:
      return "bg-muted text-muted-foreground"
  }
}

export function isCommandeATraiter(statut: string, paymentStatus: string | null): boolean {
  return statut === "confirmee" && paymentStatus === "paid"
}

export function isCommandeNouvelle(dateCreation: string | null | undefined): boolean {
  if (!dateCreation) return false
  const created = new Date(dateCreation).getTime()
  if (Number.isNaN(created)) return false
  return Date.now() - created < 24 * 60 * 60 * 1000
}

export const COMMANDES_VUES = [
  { code: "toutes", label: "Toutes" },
  { code: "a-traiter", label: "À traiter" },
  { code: "en-cours", label: "En cours" },
  { code: "livrees", label: "Livrées" },
  { code: "annulees", label: "Annulées" },
  { code: "remboursees", label: "Remboursées" },
] as const

export type CommandeVue = (typeof COMMANDES_VUES)[number]["code"]

export function parseCommandeVue(raw: string | undefined): CommandeVue {
  return COMMANDES_VUES.some((v) => v.code === raw) ? (raw as CommandeVue) : "a-traiter"
}

export function matchesCommandeVue(
  commande: { statut: string; payment_status: string | null },
  vue: CommandeVue
): boolean {
  switch (vue) {
    case "a-traiter":
      return isCommandeATraiter(commande.statut, commande.payment_status)
    case "en-cours":
      return commande.statut === "en_cours"
    case "livrees":
      return commande.statut === "livree"
    case "annulees":
      return commande.statut === "annulee"
    case "remboursees":
      return commande.payment_status === "refunded"
    case "toutes":
    default:
      return true
  }
}

export function commandeTelHref(telephone: string): string {
  return `tel:${telephone.replace(/[^\d+]/g, "")}`
}

export function commandeMailtoHref(email: string): string {
  return `mailto:${email.trim()}`
}
