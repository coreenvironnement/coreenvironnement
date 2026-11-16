/** Utilitaires brouillon particulier — sans dépendance Node (OK côté client). */

export function commandeDevisPdfHref(commandeId: string) {
  return `/api/espace/commandes/${encodeURIComponent(commandeId)}/devis`
}

export function isResumableParticulierBrouillon(commande: {
  audience: string | null
  statut: string
  payment_status: string | null
}): boolean {
  return (
    commande.audience !== "professionnel" &&
    commande.statut === "brouillon" &&
    commande.payment_status === "pending"
  )
}