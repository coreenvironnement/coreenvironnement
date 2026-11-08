import type { BenneFamily } from "@/lib/prestations"

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
  /** Fichier dans `public/images/` */
  imageFile: string
  /** Famille tarifaire / filtre forfaits (backend inchangé). */
  family: BenneFamily
}

function wasteImageSrc(imageFile: string): string {
  return `/images/${encodeURIComponent(imageFile)}`
}

const PARTICULIER_WASTE_OPTIONS_RAW: readonly ParticulierWasteOption[] = [
  {
    id: "gravats",
    title: "Gravats",
    description: "Béton, briques, tuiles, carrelage.",
    cardSubtitle: "Pour les gravats propres",
    imageFile: "Tas de gravats de rénovation résidentielle-3_5.webp",
    family: "gravats_propres",
  },
  {
    id: "meubles_encombrants",
    title: "Meubles et encombrants",
    description: "Pour vider une maison, une cave ou un garage.",
    cardSubtitle: "Pour les meubles et encombrants",
    imageFile: "Grand débarras de meubles à domicile-1_1.webp",
    family: "melange_dnd",
  },
  {
    id: "dechets_jardin",
    title: "Déchets de jardin",
    description: "Branches, tailles de haies, feuilles.",
    cardSubtitle: "Pour les déchets de jardin",
    imageFile: "Grand tas de déchets verts-5_3.webp",
    family: "melange_dnd",
  },
  {
    id: "travaux_melange",
    title: "Déchets de travaux en mélange",
    description: "Plusieurs matériaux à évacuer après vos travaux.",
    cardSubtitle: "Pour les déchets de travaux en mélange",
    imageFile: "Grand tas de déchets de rénovation-4_2.webp",
    family: "gravats_melanges",
  },
  {
    id: "terre_cailloux",
    title: "Terre et cailloux",
    description: "Pour vos travaux de terrassement.",
    cardSubtitle: "Pour la terre et les cailloux (gravats propres)",
    imageFile: "Tas de terre excavée au jardin-6_6.webp",
    family: "gravats_propres",
  },
  {
    id: "bois",
    title: "Bois",
    description: "Planches, parquet, éléments en bois.",
    cardSubtitle: "Pour le bois (mélange DND)",
    imageFile: "Tas de bois de rénovation résidentielle-2_4.webp",
    family: "melange_dnd",
  },
] satisfies readonly ParticulierWasteOption[]

export const PARTICULIER_WASTE_OPTIONS: ReadonlyArray<
  ParticulierWasteOption & { imageSrc: string }
> = PARTICULIER_WASTE_OPTIONS_RAW.map((opt) => ({
  ...opt,
  imageSrc: wasteImageSrc(opt.imageFile),
}))

export function particulierWasteOptionById(
  id: ParticulierWasteOptionId
): (typeof PARTICULIER_WASTE_OPTIONS)[number] | undefined {
  return PARTICULIER_WASTE_OPTIONS.find((o) => o.id === id)
}
