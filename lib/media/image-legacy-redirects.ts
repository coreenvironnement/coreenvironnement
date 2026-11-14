import type { Redirect } from "next/dist/lib/load-custom-routes"

/**
 * Anciens chemins publics → WebP descriptifs.
 * `permanent: true` → réponse **308** (Next.js App Router).
 */
export function legacyImageRedirect(
  source: string,
  destination: string,
): Redirect {
  return { source, destination, permanent: true }
}

/** Aligné sur `scripts/optimize-site-images.mjs` (JOBS). */
export const IMAGE_LEGACY_REDIRECTS: Redirect[] = [
  legacyImageRedirect(
    "/images/hero-paris-truck-mobile.png",
    "/images/location-benne-camion-idf-hero-mobile.webp",
  ),
  legacyImageRedirect(
    "/images/hero-paris-truck-desktop.png",
    "/images/location-benne-camion-idf-hero-desktop.webp",
  ),
  legacyImageRedirect(
    "/vitrine-scroll/benne-vide.png",
    "/images/parcours-etape-01-choix-dechets-benne-vide.webp",
  ),
  legacyImageRedirect(
    "/images/parcours-etape-2.png",
    "/images/parcours-etape-02-camion-depose-benne.webp",
  ),
  legacyImageRedirect(
    "/images/parcours-etape-3.png",
    "/images/parcours-etape-03-benne-remplie-gravats.webp",
  ),
  legacyImageRedirect(
    "/images/parcours-etape-4.png",
    "/images/parcours-etape-04-enlevement-porte-benne.webp",
  ),
  legacyImageRedirect(
    "/images/Benne à gravats verte, vue trois-quarts-2.png",
    "/images/benne-gravats-vert-vue-trois-quarts.webp",
  ),
  legacyImageRedirect(
    "/images/Ampoule verte pour choisir la benne-1.png",
    "/images/illustration-choix-volume-benne-ampoule.webp",
  ),
  legacyImageRedirect(
    "/images/Combiné téléphonique vert stylisé-1.png",
    "/images/illustration-contact-telephone-estimation-volume.webp",
  ),
  legacyImageRedirect(
    "/images/Tas rectangulaire de gravats de chantier-2.png",
    "/images/volume-estimateur-tas-gravats-rectangulaire.webp",
  ),
  legacyImageRedirect(
    "/images/Tas de gravats de chantier-1.png",
    "/images/volume-estimateur-tas-gravats-irregulier.webp",
  ),
  legacyImageRedirect(
    "/images/Big bag rempli de gravats-3.png",
    "/images/volume-estimateur-big-bag-gravats.webp",
  ),
  legacyImageRedirect(
    "/images/Déchets inertes acceptés.png",
    "/images/dechets-inertes-acceptes-gravats-sprite.webp",
  ),
  legacyImageRedirect(
    "/images/Tas de gravats de rénovation résidentielle-3_5.webp",
    "/images/tunnel-dechets-tas-gravats-renovation.webp",
  ),
  legacyImageRedirect(
    "/images/Grand débarras de meubles à domicile-1_1.webp",
    "/images/tunnel-dechets-debarras-meubles-domicile.webp",
  ),
  legacyImageRedirect(
    "/images/Grand tas de déchets verts-5_3.webp",
    "/images/tunnel-dechets-verts-jardin.webp",
  ),
  legacyImageRedirect(
    "/images/Grand tas de déchets de rénovation-4_2.webp",
    "/images/tunnel-dechets-travaux-melange.webp",
  ),
  legacyImageRedirect(
    "/images/Tas de terre excavée au jardin-6_6.webp",
    "/images/tunnel-dechets-terre-excavee-jardin.webp",
  ),
  legacyImageRedirect(
    "/images/Tas de bois de rénovation résidentielle-2_4.webp",
    "/images/tunnel-dechets-bois-renovation.webp",
  ),
  legacyImageRedirect(
    "/images/core-benne-8m3.webp",
    "/images/location-benne-8m3.webp",
  ),
  legacyImageRedirect(
    "/images/core-benne-10m3.webp",
    "/images/location-benne-10m3.webp",
  ),
  legacyImageRedirect(
    "/images/core-benne-15m3.webp",
    "/images/location-benne-15m3.webp",
  ),
  legacyImageRedirect(
    "/images/core-benne-20m3.webp",
    "/images/location-benne-20m3.webp",
  ),
  legacyImageRedirect(
    "/images/core-benne-30m3.webp",
    "/images/location-benne-30m3.webp",
  ),
  legacyImageRedirect(
    "/images/core-icone-suivi.webp",
    "/images/core-icone-suivi-livraison-benne.webp",
  ),
  legacyImageRedirect(
    "/images/core-icone-prix.webp",
    "/images/core-icone-prix-location-benne.webp",
  ),
  legacyImageRedirect(
    "/images/core-icone-valorisation.webp",
    "/images/core-icone-valorisation-dechets.webp",
  ),
]