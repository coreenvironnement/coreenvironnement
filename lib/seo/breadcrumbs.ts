import type { LocalPage } from "@/lib/seo/local-copy"

export type BreadcrumbItem = { href: string; label: string }

export function buildLocalBreadcrumbs(page: LocalPage): BreadcrumbItem[] {
  const items: BreadcrumbItem[] = [
    { href: "/", label: "Accueil" },
    { href: "/location-benne", label: "Location benne IDF" },
  ]

  if (page.type === "departement") {
    items.push({
      href: `/location-benne/${page.slug}`,
      label: `${page.departementNom} (${page.departementCode})`,
    })
    return items
  }

  items.push({
    href: `/location-benne/${page.departementSlug}`,
    label: page.departementNom,
  })

  if (page.type === "ville" || (page.type === "longtail" && page.city)) {
    items.push({
      href: `/location-benne/${page.slug}`,
      label: page.city ?? page.nom,
    })
  } else if (page.type === "longtail") {
    items.push({
      href: `/location-benne/${page.slug}`,
      label: page.nom,
    })
  }

  return items
}
