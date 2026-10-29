import type { LocalPage } from "@/lib/seo/local-copy"

const PREFIX_LABELS: Record<string, string> = {
  gravats: "Benne gravats",
  dib: "Benne DIB",
  deblais: "Benne déblais",
  encombrants: "Benne encombrants",
  chantier: "Benne chantier",
  particulier: "Location benne particulier",
  professionnel: "Location benne professionnel",
  "benne-8m3": "Location benne 8 m³",
  "benne-10m3": "Location benne 10 m³",
  "livraison-24h": "Benne livraison 24 h",
  "pas-cher": "Location benne pas cher",
  urgence: "Location benne urgence",
  "enlevement-gravats": "Enlèvement gravats",
}

function longtailPrefix(slug: string): string | null {
  const sorted = Object.keys(PREFIX_LABELS).sort((a, b) => b.length - a.length)
  for (const prefix of sorted) {
    if (slug === prefix || slug.startsWith(`${prefix}-`)) {
      return prefix
    }
  }
  return null
}

export function buildLongtailTitle(page: LocalPage): string {
  const prefix = longtailPrefix(page.slug)
  const label = prefix ? PREFIX_LABELS[prefix] : "Location de benne"
  if (page.city) {
    return `${label} ${page.city} · benne et tarif en ligne`
  }
  return `${label} ${page.departementNom} · tarif en ligne`
}

export function buildLongtailDescription(page: LocalPage): string {
  const geo = page.city
    ? `à ${page.city} (${page.departementCode})`
    : `en ${page.departementNom} (${page.departementCode})`
  return `Service ${geo}. Dès 330 € HT, tarif selon adresse et déchet, commande en 2 minutes, livraison rapide sous 24 h.`
}
