import type { LocalPage } from "@/lib/seo/local-copy"
import { geoPrepositionalPhrase } from "@/lib/seo/local-copy"

/** Chemins stables (noms descriptifs, WebP). */
export const TRACKDECHETS_LOGO_ALT = "Logo Trackdéchets"

export const SITE_IMAGES = {
  logo: {
    /** Logo bleu/navy — header vitrine (hero transparent + barre scrollée). */
    headerBrand: "/images/stickyheaderlogo.png",
    /** Version claire — footer vitrine et fonds sombres. */
    headerOnDark: "/images/core-environnement-logo-header-transparent.png",
  },
  brand: {
    /** Signature officielle (Marianne + pisteurs), PNG transparent — FAQ Trackdéchets. */
    trackdechetsLogo: "/images/trackdechets-logo-officiel.png",
  },
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
  prixLocationBenneArticle: {
    cover: "/images/benne-chantier-allee-privee.webp",
    famillesDechets: "/images/benne-gravats-beton-briques.webp",
    volumePoids: "/images/benne-chargement-bois-carton-metal.webp",
  },
} as const

export const PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH = 1024
export const PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT = 682

export const PRIX_LOCATION_BENNE_ARTICLE_IMAGE_ALT = {
  cover: "Benne verte sur une allée privée devant une maison",
  famillesDechets: "Morceaux de béton et de briques dans une benne verte",
  volumePoids:
    "Benne contenant du bois, du carton et des éléments métalliques sous le rebord",
} as const

/** Sizes alignées sur `max-w-3xl` des guides vitrine (~768 px de colonne). */
export const VITRINE_GUIDE_ARTICLE_IMAGE_SIZES = "(max-width: 768px) 100vw, 768px"

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

export function benneImageForVolume(volumeM3: number): string {
  const volumes = SITE_IMAGES.benneByVolume
  if (volumeM3 in volumes) {
    return volumes[volumeM3 as keyof typeof volumes]
  }
  return SITE_IMAGES.benneDefault
}