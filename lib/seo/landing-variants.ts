export type SeoIntent =
  | "default"
  | "paris"
  | "gravats"
  | "dib"
  | "pro"
  | "75"
  | "77"
  | "78"
  | "91"
  | "92"
  | "93"
  | "94"
  | "95"

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
  /** Paragraphe hero local (pages SEO) ; sinon contenu CDC par défaut */
  intro?: string
  chipLabel?: string
  canonicalPath?: string
  relatedCityLinks?: SeoLink[]
  departementLink?: SeoLink
}

const DEFAULT_VARIANT: SeoVariant = {
  intent: "default",
  title: "Location de benne Île-de-France — Intervention 24h",
  description:
    "Location de bennes en Île-de-France. Commande en 3 minutes, intervention sous 24 h, suivi digital et traçabilité de vos déchets.",
  h1Line1: "Location de Benne en Île-de-France :",
  h1Line2: "Intervention 24h & Suivi Digital",
}

const VARIANTS: Record<Exclude<SeoIntent, "default">, SeoVariant> = {
  paris: {
    intent: "paris",
    title: "Location benne Paris (75) — Livraison sous 24h",
    description:
      "Location de benne à Paris et petite couronne. Livraison rapide, commande en ligne, traçabilité et recyclage de vos déchets de chantier.",
    h1Line1: "Location de benne à Paris :",
    h1Line2: "Livraison 24h & suivi digital",
  },
  gravats: {
    intent: "gravats",
    title: "Benne gravats Île-de-France — Devis en ligne",
    description:
      "Louez une benne gravats en Île-de-France. Évacuation chantier, tri et valorisation. Commande en ligne en quelques minutes.",
    h1Line1: "Location benne gravats",
    h1Line2: "en Île-de-France",
  },
  dib: {
    intent: "dib",
    title: "Benne DIB Île-de-France — Location & enlèvement",
    description:
      "Benne pour déchets industriels banals (DIB) en Île-de-France. Intervention sous 24 h, documents de traçabilité fournis.",
    h1Line1: "Location benne DIB",
    h1Line2: "sur toute l'Île-de-France",
  },
  pro: {
    intent: "pro",
    title: "Benne chantier BTP — Compte professionnel IDF",
    description:
      "Location de bennes pour professionnels du BTP en Île-de-France. Facturation centralisée, espace client et interlocuteur dédié.",
    h1Line1: "Location benne professionnelle",
    h1Line2: "pour vos chantiers en IDF",
  },
  "75": {
    intent: "75",
    title: "Location benne Paris (75)",
    description:
      "Location de benne dans Paris (75). Livraison sous 24 h, commande en ligne et suivi digital CORE ENVIRONNEMENT.",
    h1Line1: "Location de benne à Paris (75) :",
    h1Line2: "Intervention rapide & traçabilité",
  },
  "77": {
    intent: "77",
    title: "Location benne Seine-et-Marne (77)",
    description:
      "Louez une benne en Seine-et-Marne (77). Livraison IDF, gravats, DIB et déchets de chantier avec suivi digital.",
    h1Line1: "Location de benne en Seine-et-Marne (77) :",
    h1Line2: "Livraison sous 24 h",
  },
  "78": {
    intent: "78",
    title: "Location benne Yvelines (78)",
    description:
      "Location de benne dans les Yvelines (78). Commande en ligne, intervention rapide et traçabilité des déchets.",
    h1Line1: "Location de benne dans les Yvelines (78) :",
    h1Line2: "Partenaire de vos chantiers",
  },
  "91": {
    intent: "91",
    title: "Location benne Essonne (91)",
    description:
      "Benne à louer en Essonne (91). Gravats, DIB et déchets non dangereux — livraison Île-de-France.",
    h1Line1: "Location de benne en Essonne (91) :",
    h1Line2: "Commande en 3 minutes",
  },
  "92": {
    intent: "92",
    title: "Location benne Hauts-de-Seine (92)",
    description:
      "Location de benne dans les Hauts-de-Seine (92). Intervention sous 24 h et recyclage garanti en Île-de-France.",
    h1Line1: "Location de benne Hauts-de-Seine (92) :",
    h1Line2: "Suivi digital inclus",
  },
  "93": {
    intent: "93",
    title: "Location benne Seine-Saint-Denis (93)",
    description:
      "Louez une benne en Seine-Saint-Denis (93). Livraison rapide, traçabilité et filières de recyclage agréées.",
    h1Line1: "Location de benne Seine-Saint-Denis (93) :",
    h1Line2: "Intervention 24h en IDF",
  },
  "94": {
    intent: "94",
    title: "Location benne Val-de-Marne (94)",
    description:
      "Location de benne dans le Val-de-Marne (94). Gravats et déchets de chantier — commande en ligne.",
    h1Line1: "Location de benne Val-de-Marne (94) :",
    h1Line2: "Recyclage & traçabilité",
  },
  "95": {
    intent: "95",
    title: "Location benne Val-d'Oise (95)",
    description:
      "Benne à louer dans le Val-d'Oise (95). CORE ENVIRONNEMENT : livraison IDF et suivi digital.",
    h1Line1: "Location de benne Val-d'Oise (95) :",
    h1Line2: "Un interlocuteur unique",
  },
}

const VALID_INTENTS = new Set<string>(Object.keys(VARIANTS))

export function parseSeoIntent(raw: string | undefined): SeoIntent {
  if (!raw) return "default"
  const normalized = raw.trim().toLowerCase()
  if (VALID_INTENTS.has(normalized)) {
    return normalized as Exclude<SeoIntent, "default">
  }
  return "default"
}

export function getSeoVariant(intent: SeoIntent): SeoVariant {
  if (intent === "default") return DEFAULT_VARIANT
  return VARIANTS[intent]
}

export function getDefaultSeoVariant(): SeoVariant {
  return DEFAULT_VARIANT
}
