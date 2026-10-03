import {
  DEFAULT_VARIANT,
  HOME_GEO_PHRASE,
  HOME_GEO_TOKEN,
  type SeoVariant,
} from "@/lib/seo/landing-variants"

export type LocalPageType = "departement" | "ville" | "longtail"

/** Dataset géo uniquement — aucun texte commercial ville par ville. */
export type LocalPage = {
  slug: string
  type: LocalPageType
  nom: string
  city?: string
  departementCode: string
  departementNom: string
  departementSlug: string
  villesPrincipales?: string[]
}

export const LOCAL_SEO_WHITELIST_FIELDS = [
  "title",
  "description",
  "h1Line1",
  "chipLabel",
  "canonicalPath",
  "relatedCityLinks",
  "departementLink",
] as const

function departmentWithArticle(code: string, nom: string): string {
  switch (code) {
    case "75":
      return "Paris"
    case "77":
      return "la Seine-et-Marne"
    case "78":
      return "les Yvelines"
    case "91":
      return "l'Essonne"
    case "92":
      return "les Hauts-de-Seine"
    case "93":
      return "la Seine-Saint-Denis"
    case "94":
      return "le Val-de-Marne"
    case "95":
      return "le Val-d'Oise"
    default:
      return nom
  }
}

function isCityScoped(page: LocalPage): boolean {
  return Boolean(page.city)
}

export function geoCoverageLabel(page: LocalPage): string {
  if (isCityScoped(page) && page.city) {
    if (page.departementCode === "75") return page.city
    return `${page.city} et ${departmentWithArticle(page.departementCode, page.departementNom)}`
  }
  return page.departementNom
}

export function geoPrepositionalPhrase(page: LocalPage): string {
  if (isCityScoped(page) && page.city) {
    return `à ${page.city}`
  }
  if (page.departementCode === "75") {
    return "à Paris"
  }
  return `en ${page.departementNom}`
}

export function buildLocalTitle(page: LocalPage): string {
  if (page.departementCode === "75" && !isCityScoped(page)) {
    return "Location de benne à Paris (75)"
  }
  if (isCityScoped(page) && page.city) {
    if (page.departementCode === "75" && page.city === "Paris") {
      return "Location de benne à Paris (75)"
    }
    return `Location de benne à ${page.city} (${page.departementCode})`
  }
  return `Location de benne en ${page.departementNom} (${page.departementCode})`
}

export function buildLocalDescription(page: LocalPage): string {
  const replacement = isCityScoped(page)
    ? `à ${geoCoverageLabel(page)}`
    : page.departementCode === "75"
      ? "à Paris"
      : `en ${page.departementNom}`
  return DEFAULT_VARIANT.description.replace(HOME_GEO_PHRASE, replacement)
}

export function buildLocalH1(page: LocalPage): string {
  return DEFAULT_VARIANT.h1Line1.replace(HOME_GEO_PHRASE, geoPrepositionalPhrase(page))
}

export function buildLocalChip(page: LocalPage): string {
  return DEFAULT_VARIANT.chipLabel.replace(HOME_GEO_TOKEN, geoCoverageLabel(page))
}

export function buildLocalSeoVariant(
  page: LocalPage,
  extras: Pick<SeoVariant, "relatedCityLinks" | "departementLink">,
): SeoVariant {
  return {
    intent: "default",
    title: buildLocalTitle(page),
    description: buildLocalDescription(page),
    h1Line1: buildLocalH1(page),
    h1Line2: DEFAULT_VARIANT.h1Line2,
    intro: DEFAULT_VARIANT.intro,
    chipLabel: buildLocalChip(page),
    canonicalPath: `/location-benne/${page.slug}`,
    relatedCityLinks: extras.relatedCityLinks,
    departementLink: extras.departementLink,
  }
}

export function stripGeoTokens(text: string, page: LocalPage): string {
  const tokens = [
    geoCoverageLabel(page),
    page.city,
    page.nom,
    page.departementNom,
    departmentWithArticle(page.departementCode, page.departementNom),
    page.departementCode,
  ].filter((token): token is string => Boolean(token))

  const unique = [...new Set(tokens)].sort((a, b) => b.length - a.length)
  let next = text
  for (const token of unique) {
    next = next.split(token).join(HOME_GEO_TOKEN)
  }
  next = next.replace(/à Île-de-France/g, HOME_GEO_PHRASE)
  next = next.replace(/en Île-de-France et Île-de-France/g, HOME_GEO_PHRASE)
  next = next.replace(/à Île-de-France et Île-de-France/g, HOME_GEO_PHRASE)
  return next
}
