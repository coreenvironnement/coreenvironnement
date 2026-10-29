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
    imageFile: "Tas de gravats de rénovation résidentielle-3_5.webp",
    family: "gravats_propres",
  },
  {
    id: "meubles_encombrants",
    title: "Meubles et encombrants",
    description: "Pour vider une maison, une cave ou un garage.",
    imageFile: "Grand débarras de meubles à domicile-1_1.webp",
    family: "melange_dnd",
  },
  {
    id: "dechets_jardin",
    title: "Déchets de jardin",
    description: "Branches, tailles de haies, feuilles.",
    imageFile: "Grand tas de déchets verts-5_3.webp",
    family: "melange_dnd",
  },
  {
    id: "travaux_melange",
    title: "Déchets de travaux en mélange",
    description: "Plusieurs matériaux à évacuer après vos travaux.",
    imageFile: "Grand tas de déchets de rénovation-4_2.webp",
    family: "gravats_melanges",
  },
  {
    id: "terre_cailloux",
    title: "Terre et cailloux",
    description: "Pour vos travaux de terrassement.",
    imageFile: "Tas de terre excavée au jardin-6_6.webp",
    family: "gravats_propres",
  },
  {
    id: "bois",
    title: "Bois",
    description: "Planches, parquet, éléments en bois.",
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
