/** Pack visuels `/location-benne/volume` (WebP responsive). */
export const VOLUME_GUIDE_PACK_BASE = "/images/guides/volume"

export const VOLUME_GUIDE_IMAGE_WIDTH = 1672
export const VOLUME_GUIDE_IMAGE_HEIGHT = 941

/** max-w-3xl article : pleine largeur mobile, colonne étroite desktop */
export const VOLUME_GUIDE_IMAGE_SIZES =
  "(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 768px"

export const VOLUME_GUIDE_PACK_IMAGES = {
  comparatifBennes: `${VOLUME_GUIDE_PACK_BASE}/comparatif-bennes-8-10-15-20-30-m3-1672.webp`,
  volumePoids: `${VOLUME_GUIDE_PACK_BASE}/volume-poids-bennes-cartons-gravats-1672.webp`,
  calculTas: `${VOLUME_GUIDE_PACK_BASE}/calcul-volume-tas-dechets-m3-1672.webp`,
  equivalenceSacs: `${VOLUME_GUIDE_PACK_BASE}/equivalence-sacs-100-litres-4-m3-1672.webp`,
} as const

export const VOLUME_GUIDE_PACK_ALTS = {
  comparatifBennes:
    "Comparatif illustré de bennes de 8, 10, 15, 20 et 30 m³, avec différentes capacités de déchets",
  volumePoids:
    "Deux bennes de volume identique contenant des cartons ou des gravats, dont le poids diffère",
  calculTas:
    "Schéma d’estimation du volume d’un tas : longueur 4 m, largeur 2 m, hauteur 1,2 m, soit environ 9,6 m³",
  equivalenceSacs:
    "Infographie indiquant que 40 sacs de 100 litres remplis représentent environ 4 m³",
} as const

export const VOLUME_GUIDE_PACK_CAPTIONS = {
  comparatifBennes:
    "Comparatif illustratif des bennes de 8 à 30 m³ : les capacités disponibles dépendent du type de déchets et de votre secteur.",
  volumePoids:
    "Un même volume ne signifie pas un même poids : la charge maximale dépend des matériaux.",
  calculTas:
    "Calcul indicatif pour un tas de forme régulière : longueur × largeur × hauteur.",
  equivalenceSacs:
    "40 × 100 L = 4 000 L = 4 m³, hors effet du tassement et sous réserve des limites de poids.",
} as const