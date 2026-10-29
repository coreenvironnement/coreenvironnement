import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineHome } from "@/components/vitrine/vitrine-home"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import { withBrandTitle } from "@/lib/seo/page-title"
import { getSiteUrl } from "@/lib/seo/site-url"

const HUB_TITLE = "Location de benne en Île-de-France · communes desservies"
const HUB_DESCRIPTION =
  "Dès 330 € HT, tarif selon adresse et déchet, commande en 2 minutes. Paris, petite et grande couronne : commande en ligne CORE ENVIRONNEMENT."

export const metadata: Metadata = {
  title: { absolute: withBrandTitle(HUB_TITLE) },
  description: HUB_DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/location-benne` },
  openGraph: {
    title: withBrandTitle(HUB_TITLE),
    description: HUB_DESCRIPTION,
    url: `${getSiteUrl()}/location-benne`,
    siteName: "CORE ENVIRONNEMENT",
    locale: "fr_FR",
    type: "website",
    images: getShareOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: withBrandTitle(HUB_TITLE),
    description: HUB_DESCRIPTION,
    images: getShareTwitterImages(),
  },
  robots: { index: true, follow: true },
}

export default function LocationBenneHubPage() {
  return (
    <>
      <VitrineJsonLd />
      <VitrineHome
        hubPage
        seoVariant={{
          intent: "default",
          title: HUB_TITLE,
          description: HUB_DESCRIPTION,
          h1Line1: "Location de benne en Île-de-France",
          h1Line2: "Commande en ligne, tarif avant validation",
          intro:
            "Dès 330 € HT · tarif selon adresse et déchet · commande en 2 minutes.",
          chipLabel: "Gestion des déchets · Île-de-France",
          canonicalPath: "/location-benne",
        }}
      />
    </>
  )
}
