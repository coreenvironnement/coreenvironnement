/** Pack visuels `/location-benne/dechets-acceptes` (WebP + Lottie). */
export const DECHETS_ACCEPTES_PACK_BASE =
  "/images/dechets-acceptes/core-dechets-pack"

export const DECHETS_ACCEPTES_CARD_IMAGE_WIDTH = 230
export const DECHETS_ACCEPTES_CARD_IMAGE_HEIGHT = 185

export const DECHETS_ACCEPTES_BANNER_WIDTH = 1240
export const DECHETS_ACCEPTES_BANNER_HEIGHT = 408

export const DECHETS_ACCEPTES_CARD_IMAGE_SIZES =
  "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"

export const DECHETS_ACCEPTES_BANNER_SIZES =
  "(max-width: 768px) 100vw, 720px"

const CATEGORY_IMAGE_SLUG: Record<string, string> = {
  Gravats: "categorie-gravats",
  "Terre et cailloux": "categorie-terre-cailloux",
  Bois: "categorie-bois",
  Emballages: "categorie-emballages",
  Encombrants: "categorie-encombrants",
  "Plâtre et isolants": "categorie-platre-isolants",
  "Déchets verts": "categorie-dechets-verts",
}

export function dechetsAcceptesCategoryImageSrc(category: string): string {
  const slug = CATEGORY_IMAGE_SLUG[category]
  if (!slug) {
    return `${DECHETS_ACCEPTES_PACK_BASE}/images/banniere-matieres.webp`
  }
  return `${DECHETS_ACCEPTES_PACK_BASE}/images/${slug}.webp`
}

export function dechetsAcceptesCategoryImageAlt(category: string): string {
  return `Exemple illustratif : ${category.toLowerCase()}`
}

export const DECHETS_ACCEPTES_PACK_IMAGES = {
  banniereMatieres: `${DECHETS_ACCEPTES_PACK_BASE}/images/banniere-matieres.webp`,
  collecteSpecifique: `${DECHETS_ACCEPTES_PACK_BASE}/images/dechets-collecte-specifique.webp`,
  chargement: `${DECHETS_ACCEPTES_PACK_BASE}/images/chargement-correct-incorrect.webp`,
} as const

export const DECHETS_ACCEPTES_PACK_LOTTIE = {
  triDechets: `${DECHETS_ACCEPTES_PACK_BASE}/animations/tri-dechets.json`,
  chargementBenne: `${DECHETS_ACCEPTES_PACK_BASE}/animations/chargement-benne.json`,
} as const

export const DECHETS_ACCEPTES_CATEGORY_DISCLAIMER =
  "À vérifier avant la commande : la terre, certains bois, les emballages, le plâtre, les isolants et les déchets verts ne sont pas automatiquement acceptés avec les gravats propres."