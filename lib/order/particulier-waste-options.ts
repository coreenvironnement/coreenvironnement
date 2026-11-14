import type { BenneFamily } from "@/lib/prestations"
import { SITE_IMAGES } from "@/lib/media/site-images"

/** Identifiants UI étape 2 particulier (ordre affiché). */
export type ParticulierWasteOptionId =
  | "gravats"
  | "meubles_encombrants"
  | "dechets_jardin"
  | "travaux_melange"
  | "terre_cailloux"
  | "bois"

export type ParticulierWasteOption = {
  id: ParticulierWasteOptionId
  title: string
  description: string
  /** Sous-titre carte benne (étape forfait particulier). */
  cardSubtitle: string
  imageSrc: string
  imageAlt: string
  /** Famille tarifaire / filtre forfaits (backend inchangé). */
  family: BenneFamily
}

const PARTICULIER_WASTE_OPTIONS_RAW: readonly ParticulierWasteOption[] = [
  {
    id: "gravats",
    title: "Gravats",
    description: "Béton, briques, tuiles, carrelage.",
    cardSubtitle: "Pour les gravats propres",
    imageSrc: SITE_IMAGES.waste.gravats,
    imageAlt:
      "Tas de gravats de rénovation — photo pour le choix « gravats » dans la location de benne",
    family: "gravats_propres",
  },
  {
    id: "meubles_encombrants",
    title: "Meubles et encombrants",
    description: "Pour vider une maison, une cave ou un garage.",
    cardSubtitle: "Pour les meubles et encombrants",
    imageSrc: SITE_IMAGES.waste.meubles,
    imageAlt: "Meubles et encombrants lors d’un débarras à domicile",
    family: "melange_dnd",
  },
  {
    id: "dechets_jardin",
    title: "Déchets de jardin",
    description: "Branches, tailles de haies, feuilles.",
    cardSubtitle: "Pour les déchets de jardin",
    imageSrc: SITE_IMAGES.waste.jardin,
    imageAlt: "Tas de déchets verts de jardin (branchages et végétaux)",
    family: "melange_dnd",
  },
  {
    id: "travaux_melange",
    title: "Déchets de travaux en mélange",
    description: "Plusieurs matériaux à évacuer après vos travaux.",
    cardSubtitle: "Pour les déchets de travaux en mélange",
    imageSrc: SITE_IMAGES.waste.melange,
    imageAlt: "Tas de déchets de travaux en mélange sur un chantier",
    family: "gravats_melanges",
  },
  {
    id: "terre_cailloux",
    title: "Terre et cailloux",
    description: "Pour vos travaux de terrassement.",
    cardSubtitle: "Pour la terre et les cailloux (gravats propres)",
    imageSrc: SITE_IMAGES.waste.terre,
    imageAlt: "Terre excavée et cailloux pour benne gravats propres",
    family: "gravats_propres",
  },
  {
    id: "bois",
    title: "Bois",
    description: "Planches, parquet, éléments en bois.",
    cardSubtitle: "Pour le bois (mélange DND)",
    imageSrc: SITE_IMAGES.waste.bois,
    imageAlt: "Tas de planches et bois issus de travaux de rénovation",
    family: "melange_dnd",
  },
] satisfies readonly ParticulierWasteOption[]

export const PARTICULIER_WASTE_OPTIONS: ReadonlyArray<ParticulierWasteOption> =
  PARTICULIER_WASTE_OPTIONS_RAW

export function particulierWasteOptionById(
  id: ParticulierWasteOptionId
): (typeof PARTICULIER_WASTE_OPTIONS)[number] | undefined {
  return PARTICULIER_WASTE_OPTIONS.find((o) => o.id === id)
}
