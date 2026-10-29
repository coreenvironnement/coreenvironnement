import type { LocalPage } from "@/lib/seo/local-copy"

export const DEPARTMENT_GUIDE_SLUGS = [
  "75-paris",
  "77-seine-et-marne",
  "78-yvelines",
  "91-essonne",
  "92-hauts-de-seine",
  "93-seine-saint-denis",
  "94-val-de-marne",
  "95-val-d-oise",
] as const

export type DepartmentGuideSlug = (typeof DEPARTMENT_GUIDE_SLUGS)[number]

export type DepartmentGuideCopy = {
  title: string
  description: string
  lead: string
  tarif: string
  particuliers: string
  pose: string
}

const FROM_PRICE =
  "Dès 330 € pour une benne 8 m³ gravats propres. Tarif selon adresse et déchet, commande en ligne."

const TARIF_BLOCK =
  "Le forfait le plus accessible est la benne 8 m³ gravats propres : dès 330 € HT, soit 396 € TTC pour un particulier. Les autres volumes et déchets sont plus élevés. Le récapitulatif affiche le montant avant validation."

const GUIDES: Record<DepartmentGuideSlug, DepartmentGuideCopy> = {
  "75-paris": {
    title: "Location de benne Paris dès 330 €",
    description: `${FROM_PRICE} Paris et arrondissements desservis.`,
    lead:
      "Travaux, rénovation ou débarras à Paris : dès 330 € pour une benne 8 m³ gravats propres. Tarif selon adresse et déchet, livraison sous 24 h selon disponibilité.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Commande en ligne en quelques minutes. Choisissez le type de déchet, le volume et la date à partir de 24 h après votre demande.",
    pose:
      "Précisez l’accès camion et l’emplacement de pose. Sur voie publique, vérifiez les règles locales avant de valider.",
  },
  "77-seine-et-marne": {
    title: "Location de benne 77 dès 330 €",
    description: `${FROM_PRICE} Seine-et-Marne : Meaux, Melun, Chelles et communes voisines.`,
    lead:
      "Meaux, Melun, Chelles et le reste du 77 : dès 330 € pour une benne 8 m³ gravats propres. Même catalogue, tarif en ligne selon adresse et déchet.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Particuliers et pros : décrivez vos déchets via les catégories du site, puis validez adresse et date.",
    pose:
      "Indiquez rue, accès et stationnement. En cas de doute, contactez CORE avant la livraison.",
  },
  "78-yvelines": {
    title: "Location de benne 78 dès 330 €",
    description: `${FROM_PRICE} Yvelines : Versailles, Sartrouville, Poissy, Mantes-la-Jolie.`,
    lead:
      "Versailles, Sartrouville, Poissy, Mantes-la-Jolie : dès 330 € pour une benne 8 m³ gravats propres. Tarif selon adresse et déchet, livraison suivie.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Travaux, rénovation ou débarras : choisissez le flux dans le tunnel, puis indiquez l’adresse et la date souhaitée.",
    pose:
      "Signalez l’emplacement prévu et les contraintes d’accès. Les règles de voirie dépendent de la commune.",
  },
  "91-essonne": {
    title: "Location de benne 91 dès 330 €",
    description: `${FROM_PRICE} Essonne : Massy, Évry-Courcouronnes, Corbeil-Essonnes.`,
    lead:
      "Massy, Évry-Courcouronnes, Corbeil-Essonnes et l’Essonne : dès 330 € pour une benne 8 m³ gravats propres. Tarif calculé en ligne, sans appeler pour un premier prix.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Le tunnel vous guide vers les forfaits disponibles. Date minimale : 24 h après la commande.",
    pose:
      "Décrivez où la benne peut être déposée et la largeur disponible pour le camion.",
  },
  "92-hauts-de-seine": {
    title: "Location de benne 92 dès 330 €",
    description: `${FROM_PRICE} Hauts-de-Seine : Nanterre, Boulogne-Billancourt et communes voisines.`,
    lead:
      "Nanterre, Boulogne-Billancourt ou ailleurs dans le 92 : dès 330 € pour une benne 8 m³ gravats propres. Tarif selon adresse et déchet, commande en 2 minutes.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Gravats, mélange non dangereux et autres flux du catalogue : adresse, accès et date dans le formulaire en ligne.",
    pose:
      "Précisez emplacement, largeur de rue et stationnement. Appelez si l’accès est incertain.",
  },
  "93-seine-saint-denis": {
    title: "Location de benne 93 dès 330 €",
    description: `${FROM_PRICE} Seine-Saint-Denis : Saint-Denis, Montreuil, Aubervilliers.`,
    lead:
      "Saint-Denis, Montreuil, Aubervilliers et le 93 : dès 330 € pour une benne 8 m³ gravats propres. Tarif selon adresse et déchet, suivi de livraison.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Identifiez le type de déchets, le volume et l’adresse. Les flux acceptés sont ceux affichés dans le tunnel.",
    pose:
      "Indiquez accès camion et emplacement. Les contraintes de voirie varient selon l’adresse exacte.",
  },
  "94-val-de-marne": {
    title: "Location de benne 94 dès 330 €",
    description: `${FROM_PRICE} Val-de-Marne : Créteil, Vitry-sur-Seine, Saint-Maur-des-Fossés.`,
    lead:
      "Créteil, Vitry-sur-Seine, Vincennes ou ailleurs dans le 94 : dès 330 € pour une benne 8 m³ gravats propres. Prix affiché avant validation en ligne.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Rénovation, travaux ou débarras : sélectionnez la famille de déchets, puis complétez adresse et date.",
    pose:
      "Précisez la pose prévue et les obstacles éventuels (portail, rue étroite).",
  },
  "95-val-d-oise": {
    title: "Location de benne 95 dès 330 €",
    description: `${FROM_PRICE} Val-d'Oise : Argenteuil, Cergy, Sarcelles.`,
    lead:
      "Argenteuil, Cergy, Sarcelles et le Val-d'Oise : dès 330 € pour une benne 8 m³ gravats propres. Tarif en ligne selon adresse et déchet.",
    tarif: TARIF_BLOCK,
    particuliers:
      "Commande particulier ou demande pro : même point de départ en ligne, montant TTC visible pour les particuliers au récapitulatif.",
    pose:
      "Signalez l’accès et l’emplacement. Contactez CORE si la rue ou le stationnement est complexe.",
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
