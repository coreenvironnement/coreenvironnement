import type { LocalPage } from "@/lib/seo/local-copy"

export const DEPARTMENT_GUIDE_SLUGS = [
  "78-yvelines",
  "92-hauts-de-seine",
  "93-seine-saint-denis",
] as const

export type DepartmentGuideSlug = (typeof DEPARTMENT_GUIDE_SLUGS)[number]

export type DepartmentGuideCopy = {
  lead: string
  tarif: string
  particuliers: string
  pose: string
}

const GUIDES: Record<DepartmentGuideSlug, DepartmentGuideCopy> = {
  "92-hauts-de-seine": {
    lead: "Pour des travaux, une rénovation ou un débarras à Nanterre, Boulogne-Billancourt ou ailleurs dans le département : choisissez le volume et le type de déchets du catalogue, puis commandez en ligne. Le prix affiché dans le tunnel est TTC, TVA 20 % comprise.",
    tarif:
      "Le montant dépend du forfait choisi. Le récapitulatif détaille le HT, la TVA 20 % et le total TTC avant paiement. Aucun tarif unique n’est affiché ici : le prix réel apparaît dans la commande.",
    particuliers:
      "Gravats propres, mélange non dangereux, bois, végétaux et plâtre : uniquement les catégories déjà proposées. Indiquez l’adresse, l’accès camion et une date à partir de 24 h.",
    pose: "Précisez l’emplacement, la largeur de rue, un portail ou le stationnement. En cas de doute, appelez avant de valider. Les démarches éventuelles dépendent du lieu exact : elles ne sont pas généralisées ici.",
  },
  "78-yvelines": {
    lead: "Location de benne en Yvelines : Versailles, Sartrouville, Poissy, Mantes-la-Jolie et les communes desservies. Commande en ligne, forfait du catalogue, prix TTC visible avant paiement.",
    tarif:
      "Pour un tarif, ouvrez le tunnel : le récapitulatif montre le HT, la TVA 20 % et le TTC du forfait choisi. Il n’existe pas un seul prix départemental.",
    particuliers:
      "Travaux, rénovation ou débarras : décrivez les déchets selon les catégories CORE, le volume estimé et l’adresse de livraison. La date minimale est 24 h après la commande.",
    pose: "Indiquez où la benne peut être déposée et les contraintes d’accès. Une occupation du domaine public peut nécessiter une vérification locale selon l’emplacement : contactez CORE ou le service compétent si besoin.",
  },
  "93-seine-saint-denis": {
    lead: "Saint-Denis, Montreuil, Aubervilliers et les autres communes du 93 : même parcours de commande, mêmes catégories de déchets, même affichage HT / TVA / TTC dans le tunnel.",
    tarif:
      "Le prix n’est pas forfaitaire pour tout le département. Il correspond au volume et au flux choisis, avec TVA 20 % dans le total TTC.",
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
