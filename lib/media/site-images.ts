import type { LocalPage } from "@/lib/seo/local-copy"
import { geoPrepositionalPhrase } from "@/lib/seo/local-copy"

/** Chemins stables (noms descriptifs, WebP). */
export const SITE_IMAGES = {
  hero: {
    mobile: "/images/location-benne-camion-idf-hero-mobile.webp",
    desktop: "/images/location-benne-camion-idf-hero-desktop.webp",
  },
  parcours: {
    dechets: "/images/parcours-etape-01-choix-dechets-benne-vide.webp",
    volume: "/images/parcours-etape-02-camion-depose-benne.webp",
    dateLieu: "/images/parcours-etape-03-benne-remplie-gravats.webp",
    paiement: "/images/parcours-etape-04-enlevement-porte-benne.webp",
  },
  pourquoiIcone: {
    suivi: "/images/core-icone-suivi-livraison-benne.webp",
    prix: "/images/core-icone-prix-location-benne.webp",
    valorisation: "/images/core-icone-valorisation-dechets.webp",
  },
  tunnel: {
    benneGravatsVue: "/images/benne-gravats-vert-vue-trois-quarts.webp",
    ampouleVolume: "/images/illustration-choix-volume-benne-ampoule.webp",
    telephoneVolume: "/images/illustration-contact-telephone-estimation-volume.webp",
    volumeRectangulaire: "/images/volume-estimateur-tas-gravats-rectangulaire.webp",
    volumeIrregulier: "/images/volume-estimateur-tas-gravats-irregulier.webp",
    volumeBigBag: "/images/volume-estimateur-big-bag-gravats.webp",
    gravatsAcceptesSprite: "/images/dechets-inertes-acceptes-gravats-sprite.webp",
  },
  benneByVolume: {
    8: "/images/location-benne-8m3.webp",
    10: "/images/location-benne-10m3.webp",
    15: "/images/location-benne-15m3.webp",
    20: "/images/location-benne-20m3.webp",
    30: "/images/location-benne-30m3.webp",
  },
  benneDefault: "/images/location-benne-10m3.webp",
  waste: {
    gravats: "/images/tunnel-dechets-tas-gravats-renovation.webp",
    meubles: "/images/tunnel-dechets-debarras-meubles-domicile.webp",
    jardin: "/images/tunnel-dechets-verts-jardin.webp",
    melange: "/images/tunnel-dechets-travaux-melange.webp",
    terre: "/images/tunnel-dechets-terre-excavee-jardin.webp",
    bois: "/images/tunnel-dechets-bois-renovation.webp",
  },
} as const

const HERO_ALT_BASE =
  "Camion CORE Environnement transportant une benne — illustration pour la location de benne en Île-de-France"

/** Alt hero : suffixe local uniquement sur pages locales (offre, pas la photo). */
export function buildHeroImageAlt(localPage?: LocalPage): string {
  if (!localPage) return HERO_ALT_BASE
  return `${HERO_ALT_BASE} — prestation ${geoPrepositionalPhrase(localPage)}`
}

export const PARCOURS_STEP_IMAGE_ALT = {
  dechets: "Benne vide prête à recevoir vos déchets de chantier",
  volume: "Camion déposant une benne vide sur votre adresse",
  dateLieu: "Benne verte remplie de gravats sur le lieu de pose",
  paiement: "Camion porte-benne chargé de gravats — enlèvement",
} as const

export function buildParcoursStepImageAlt(
  step: keyof typeof PARCOURS_STEP_IMAGE_ALT,
): string {
  return PARCOURS_STEP_IMAGE_ALT[step]
}

export function benneVolumeImageAlt(volumeM3: number): string {
  return `Benne de location de ${volumeM3} m³`
}