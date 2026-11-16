/** Message renvoyé quand un brouillon référencé côté tunnel a été supprimé côté admin. */
export const BROUILLON_COMMANDE_SUPPRIME_MESSAGE =
  "Ce brouillon n'existe plus. Vous pouvez continuer votre commande."

export function isBrouillonSupprimeError(message: string): boolean {
  return message === BROUILLON_COMMANDE_SUPPRIME_MESSAGE
}