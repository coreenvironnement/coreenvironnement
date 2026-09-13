import { MODES_PAIEMENT_PRO } from "@/lib/cdc/referentiels"

export const STATUTS_COMPTE_PRO = [
  { code: "pending", label: "En attente de validation" },
  { code: "approved", label: "Compte validé" },
  { code: "rejected", label: "Demande refusée" },
] as const

export type StatutComptePro = (typeof STATUTS_COMPTE_PRO)[number]["code"]

export function statutCompteProLabel(code: string): string {
  return STATUTS_COMPTE_PRO.find((s) => s.code === code)?.label ?? code
}

export function paymentModeLabel(code: string | null): string {
  if (!code) return "—"
  return MODES_PAIEMENT_PRO.find((m) => m.code === code)?.label ?? code
}
