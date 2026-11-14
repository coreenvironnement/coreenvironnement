import type { Redirect } from "next/dist/lib/load-custom-routes"

/** 301 — anciens noms publics → WebP descriptifs (indexation / liens externes). */
export const IMAGE_LEGACY_REDIRECTS: Redirect[] = [
  {
    source: "/images/hero-paris-truck-mobile.png",
    destination: "/images/location-benne-camion-idf-hero-mobile.webp",
    permanent: true,
  },
  {
    source: "/images/hero-paris-truck-desktop.png",
    destination: "/images/location-benne-camion-idf-hero-desktop.webp",
    permanent: true,
  },
  {
    source: "/vitrine-scroll/benne-vide.png",
    destination: "/images/parcours-etape-01-choix-dechets-benne-vide.webp",
    permanent: true,
  },
  {
    source: "/images/parcours-etape-2.png",
    destination: "/images/parcours-etape-02-camion-depose-benne.webp",
    permanent: true,
  },
  {
    source: "/images/parcours-etape-3.png",
    destination: "/images/parcours-etape-03-benne-remplie-gravats.webp",
    permanent: true,
  },
  {
    source: "/images/parcours-etape-4.png",
    destination: "/images/parcours-etape-04-enlevement-porte-benne.webp",
    permanent: true,
  },
  {
    source: "/images/core-benne-8m3.webp",
    destination: "/images/location-benne-8m3.webp",
    permanent: true,
  },
  {
    source: "/images/core-benne-10m3.webp",
    destination: "/images/location-benne-10m3.webp",
    permanent: true,
  },
  {
    source: "/images/core-benne-15m3.webp",
    destination: "/images/location-benne-15m3.webp",
    permanent: true,
  },
  {
    source: "/images/core-benne-20m3.webp",
    destination: "/images/location-benne-20m3.webp",
    permanent: true,
  },
  {
    source: "/images/core-benne-30m3.webp",
    destination: "/images/location-benne-30m3.webp",
    permanent: true,
  },
  {
    source: "/images/core-icone-suivi.webp",
    destination: "/images/core-icone-suivi-livraison-benne.webp",
    permanent: true,
  },
  {
    source: "/images/core-icone-prix.webp",
    destination: "/images/core-icone-prix-location-benne.webp",
    permanent: true,
  },
  {
    source: "/images/core-icone-valorisation.webp",
    destination: "/images/core-icone-valorisation-dechets.webp",
    permanent: true,
  },
]
