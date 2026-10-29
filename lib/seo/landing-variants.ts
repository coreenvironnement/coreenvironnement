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
    "Location de bennes en Île-de-France. Dès 330 € HT, tarif selon adresse et déchet, commande en 2 minutes, livraison rapide sous 24 h.",
  h1Line1:
    "Location de benne au meilleur prix : livraison rapide 24 h en Île-de-France",
  h1Line2: "",
  intro:
    "Dès 330 € HT · tarif selon adresse et déchet · commande en 2 minutes.",
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
