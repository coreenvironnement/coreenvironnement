import type { SeoLink } from "@/lib/seo/landing-variants"
import type { LocalPage } from "@/lib/seo/local-copy"
import {
  getCityPagesForDepartement,
  getFeaturedCityPagesForDepartement,
} from "@/lib/seo/local-pages"

/** Liens locaux visibles sous le hero sur l’accueil particulier. */
export const HOME_EARLY_LOCAL_LINKS: SeoLink[] = [
  { href: "/location-benne/75-paris", label: "Paris" },
  { href: "/location-benne/meaux", label: "Meaux (77)" },
  { href: "/location-benne/versailles", label: "Versailles (78)" },
  { href: "/location-benne/nanterre", label: "Nanterre (92)" },
  { href: "/location-benne/saint-denis", label: "Saint-Denis (93)" },
  { href: "/location-benne/creteil", label: "Créteil (94)" },
  { href: "/location-benne/argenteuil", label: "Argenteuil (95)" },
  { href: "/location-benne", label: "Toutes les communes" },
  { href: "/location-benne/volume", label: "Quel volume choisir ?" },
]

export function getEarlyLocalLinksForPage(page: LocalPage): SeoLink[] {
  const links: SeoLink[] = [
    { href: "/location-benne", label: "Index communes IDF" },
    {
      href: `/location-benne/${page.departementSlug}`,
      label: `Benne ${page.departementNom}`,
    },
    { href: "/location-benne/volume", label: "Guide volumes" },
  ]

  const featured = getFeaturedCityPagesForDepartement(page.departementSlug)
  for (const city of featured) {
    if (page.type === "ville" && city.slug === page.slug) continue
    if (links.some((l) => l.href === `/location-benne/${city.slug}`)) continue
    links.push({
      href: `/location-benne/${city.slug}`,
      label: city.nom,
    })
    if (links.length >= 8) break
  }

  if (page.type === "longtail" && page.city) {
    const parent = getCityPagesForDepartement(page.departementSlug).find(
      (city) => city.nom === page.city
    )
    if (parent) {
      links.splice(2, 0, {
        href: `/location-benne/${parent.slug}`,
        label: `Location benne ${parent.nom}`,
      })
    }
  }

  return links
}
