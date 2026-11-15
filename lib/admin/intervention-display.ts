/** Libellés affichage admin (cahier Admin V2) pour les statuts métier. */

export const STATUT_INTERVENTION_AFFICHE: Record<string, string> = {
  en_cours_programmation: "À planifier",
  programme: "Planifiée",
  realisee: "Réalisée",
  annulee: "Annulée",
  passage_a_vide: "Passage à vide",
}

export function statutInterventionAffiche(code: string): string {
  return STATUT_INTERVENTION_AFFICHE[code] ?? code
}

export function statutCommandeAsIntervention(code: string, paymentStatus: string | null): string {
  if (code === "brouillon") return "Brouillon"
  if (code === "confirmee" && paymentStatus === "paid") return "À planifier"
  if (code === "en_cours") return "En cours"
  if (code === "livree") return "Livrée"
  if (code === "annulee") return "Annulée"
  return code
}

export function statutInterventionBadgeClass(code: string): string {
  switch (code) {
    case "en_cours_programmation":
      return "bg-amber-100 text-amber-900"
    case "programme":
      return "bg-blue-100 text-blue-900"
    case "realisee":
      return "bg-emerald-100 text-emerald-900"
    case "annulee":
      return "bg-destructive/10 text-destructive"
    case "passage_a_vide":
      return "bg-violet-100 text-violet-900"
    default:
      return "bg-muted text-muted-foreground"
  }
}