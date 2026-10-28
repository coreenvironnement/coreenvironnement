import type { LocalPage } from "@/lib/seo/local-copy"

export const DEPARTMENT_GUIDE_SLUGS = [
  "78-yvelines",
  "92-hauts-de-seine",
  "93-seine-saint-denis",
] as const

export type DepartmentGuideSlug = (typeof DEPARTMENT_GUIDE_SLUGS)[number]

export type DepartmentGuideCopy = {
  /** Titre Google, sans suffixe marque. */
  title: string
  /** Description Google : prix réel le plus bas + suivi. */
  description: string
  lead: string
  tarif: string
  particuliers: string
  pose: string
}

const FROM_PRICE =
  "Dès 396 € TTC pour une benne 8 m³ gravats propres. Le prix du forfait choisi s’affiche avant paiement, avec le suivi de votre livraison."

const GUIDES: Record<DepartmentGuideSlug, DepartmentGuideCopy> = {
  "92-hauts-de-seine": {
    title: "Location de benne 92 dès 396 € TTC",
    description: `${FROM_PRICE} Hauts-de-Seine : Nanterre, Boulogne-Billancourt et les communes desservies.`,
    lead: "Pour des travaux, une rénovation ou un débarras à Nanterre, Boulogne-Billancourt ou ailleurs dans le 92 : dès 396 € TTC pour une benne 8 m³ gravats propres. Vous voyez le prix TTC avant de payer, puis vous suivez la livraison.",
    tarif:
      "Le forfait le moins cher du catalogue est la benne 8 m³ gravats propres : 330 € HT, soit 396 € TTC. Les autres volumes et déchets sont plus élevés. Le récapitulatif détaille le HT, la TVA 20 % et le TTC avant paiement.",
    particuliers:
      "Gravats propres, mélange non dangereux, bois, végétaux et plâtre : uniquement les catégories déjà proposées. Indiquez l’adresse, l’accès camion et une date à partir de 24 h.",
    pose: "Précisez l’emplacement, la largeur de rue, un portail ou le stationnement. En cas de doute, appelez avant de valider. Les démarches éventuelles dépendent du lieu exact : elles ne sont pas généralisées ici.",
  },
  "78-yvelines": {
    title: "Location de benne 78 dès 396 € TTC",
    description: `${FROM_PRICE} Yvelines : Versailles, Sartrouville, Poissy, Mantes-la-Jolie.`,
    lead: "Location de benne en Yvelines, dès 396 € TTC pour une benne 8 m³ gravats propres. Versailles, Sartrouville, Poissy, Mantes-la-Jolie : le prix TTC est visible avant paiement, et la livraison est suivie.",
    tarif:
      "Le forfait le moins cher du catalogue est la benne 8 m³ gravats propres : 330 € HT, soit 396 € TTC. Le récapitulatif montre le HT, la TVA 20 % et le TTC du forfait choisi. Il n’existe pas un seul prix pour tout le 78.",
    particuliers:
      "Travaux, rénovation ou débarras : décrivez les déchets selon les catégories CORE, le volume estimé et l’adresse de livraison. La date minimale est 24 h après la commande.",
    pose: "Indiquez où la benne peut être déposée et les contraintes d’accès. Une occupation du domaine public peut nécessiter une vérification locale selon l’emplacement : contactez CORE ou le service compétent si besoin.",
  },
  "93-seine-saint-denis": {
    title: "Location de benne 93 dès 396 € TTC",
    description: `${FROM_PRICE} Seine-Saint-Denis : Saint-Denis, Montreuil, Aubervilliers.`,
    lead: "Saint-Denis, Montreuil, Aubervilliers et le reste du 93 : dès 396 € TTC pour une benne 8 m³ gravats propres. Même catalogue, prix TTC avant paiement, suivi de la livraison.",
    tarif:
      "Le forfait le moins cher du catalogue est la benne 8 m³ gravats propres : 330 € HT, soit 396 € TTC. Le prix suit le volume et le type de déchets, avec TVA 20 % dans le total TTC.",
    particuliers:
      "Un particulier prépare sa demande en identifiant le type de déchets, le volume, l’adresse et une date à J+24. Les flux acceptés restent ceux du catalogue.",
    pose: "Signalez l’accès camion, le stationnement et l’emplacement prévu. Aucune règle de voirie unique n’est affirmée pour tout le 93 : cela dépend de la rue.",
  },
}

export function isDepartmentGuideSlug(slug: string): slug is DepartmentGuideSlug {
  return (DEPARTMENT_GUIDE_SLUGS as readonly string[]).includes(slug)
}

export function getDepartmentGuideCopy(page: LocalPage): DepartmentGuideCopy | null {
  if (page.type !== "departement" || !isDepartmentGuideSlug(page.slug)) return null
  return GUIDES[page.slug]
}

export function getDepartmentGuideMeta(
  page: LocalPage,
): { title: string; description: string } | null {
  const copy = getDepartmentGuideCopy(page)
  if (!copy) return null
  return { title: copy.title, description: copy.description }
}
