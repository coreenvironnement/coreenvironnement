import type { SeoLink } from "@/lib/seo/landing-variants"
import type { LocalPage } from "@/lib/seo/local-copy"
import { getLocalPageBySlug } from "@/lib/seo/local-pages"
import { LONGTAIL_PAGES } from "@/lib/seo/longtail-pages"

/** Lot 1 — gravats, DIB, enlèvement gravats (44 URLs catalogue). */
export const PRESTATION_MESH_LOT1_PREFIXES = [
  "gravats",
  "dib",
  "enlevement-gravats",
] as const

export type PrestationMeshLot1Prefix = (typeof PRESTATION_MESH_LOT1_PREFIXES)[number]

const LOT1_LONGTAILS = LONGTAIL_PAGES.filter((p) =>
  PRESTATION_MESH_LOT1_PREFIXES.some(
    (prefix) => p.slug === prefix || p.slug.startsWith(`${prefix}-`),
  ),
)

function longtailExists(slug: string): boolean {
  const page = getLocalPageBySlug(slug)
  return page?.type === "longtail"
}

function labelForPrefix(
  prefix: PrestationMeshLot1Prefix,
  geo: { kind: "ville"; name: string } | { kind: "dept"; nom: string; code: string },
): string {
  switch (prefix) {
    case "gravats":
      return geo.kind === "ville"
        ? `Benne gravats à ${geo.name}`
        : `Benne gravats en ${geo.nom} (${geo.code})`
    case "dib":
      return geo.kind === "ville"
        ? `Benne DIB à ${geo.name}`
        : `Benne DIB en ${geo.nom} (${geo.code})`
    case "enlevement-gravats":
      return geo.kind === "ville"
        ? `Enlèvement gravats à ${geo.name}`
        : `Enlèvement gravats en ${geo.nom} (${geo.code})`
    default:
      return ""
  }
}

function linkForSlug(
  slug: string,
  prefix: PrestationMeshLot1Prefix,
  geo: Parameters<typeof labelForPrefix>[1],
): SeoLink | null {
  if (!longtailExists(slug)) return null
  return {
    href: `/location-benne/${slug}`,
    label: labelForPrefix(prefix, geo),
  }
}

/** Liens à afficher sur une page ville (variantes rattachées à la commune). */
export function getPrestationMeshLinksForCityPage(page: LocalPage): SeoLink[] {
  if (page.type !== "ville") return []

  const cityName = page.city ?? page.nom
  const geo = { kind: "ville" as const, name: cityName }
  const links: SeoLink[] = []

  for (const prefix of PRESTATION_MESH_LOT1_PREFIXES) {
    const slug = `${prefix}-${page.slug}`
    const link = linkForSlug(slug, prefix, geo)
    if (link) links.push(link)
  }

  return links
}

/** Liens à afficher sur une page département (longtails ciblant le département). */
export function getPrestationMeshLinksForDepartmentPage(page: LocalPage): SeoLink[] {
  if (page.type !== "departement") return []

  const geo = {
    kind: "dept" as const,
    nom: page.departementNom,
    code: page.departementCode,
  }
  const links: SeoLink[] = []

  for (const prefix of PRESTATION_MESH_LOT1_PREFIXES) {
    const slug = `${prefix}-${page.slug}`
    const link = linkForSlug(slug, prefix, geo)
    if (link) links.push(link)
  }

  return links
}

export function getPrestationMeshLot1Inventory(): Array<{
  longtailSlug: string
  intent: PrestationMeshLot1Prefix
  city: string | null
  departementSlug: string
}> {
  return LOT1_LONGTAILS.map((p) => {
    const intent =
      PRESTATION_MESH_LOT1_PREFIXES.find((prefix) =>
        p.slug.startsWith(`${prefix}-`),
      ) ?? "gravats"
    return {
      longtailSlug: p.slug,
      intent,
      city: p.city ?? null,
      departementSlug: p.departementSlug,
    }
  })
}