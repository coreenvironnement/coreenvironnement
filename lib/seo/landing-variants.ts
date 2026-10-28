export type SeoIntent = "default"

export type SeoLink = {
  href: string
  label: string
}

export type SeoVariant = {
  intent: SeoIntent
  title: string
  description: string
  h1Line1: string
  h1Line2: string
  intro: string
  chipLabel: string
  canonicalPath?: string
  relatedCityLinks?: SeoLink[]
  departementLink?: SeoLink
}

/** Contenu homepage — source unique. Aucune variante commerciale. */
export const DEFAULT_VARIANT: SeoVariant = {
  intent: "default",
  title: "Location de benne en Île-de-France",
  description:
    "Location de bennes en Île-de-France. Commande en 3 minutes, intervention sous 24 h, confirmation par e-mail et rappel pour la pose.",
  h1Line1: "Location de benne en Île-de-France : intervention 24h & commande en ligne",
  h1Line2: "",
  intro:
    "Commandez votre benne en ligne. Le prix s'affiche avant le paiement. Vous recevez un e-mail de confirmation, puis un rappel pour caler la pose.",
  chipLabel: "Gestion des déchets · Île-de-France",
}

export const HOME_GEO_TOKEN = "Île-de-France"
export const HOME_GEO_PHRASE = "en Île-de-France"

export function parseSeoIntent(_raw?: string): SeoIntent {
  return "default"
}

export function getSeoVariant(_intent?: SeoIntent): SeoVariant {
  return DEFAULT_VARIANT
}

export function getDefaultSeoVariant(): SeoVariant {
  return DEFAULT_VARIANT
}
