import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrinePrixLocationBenneArticle } from "@/components/vitrine/vitrine-prix-location-benne-article"
import {
  buildShareOpenGraphImages,
  buildShareTwitterImages,
} from "@/lib/seo/share-metadata"
import {
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_ALT,
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT,
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH,
  SITE_IMAGES,
} from "@/lib/media/site-images"
import {
  PRIX_LOCATION_BENNE_ARTICLE_DESCRIPTION,
  PRIX_LOCATION_BENNE_ARTICLE_TITLE,
} from "@/lib/seo/prix-location-benne-article-content"
import { getSiteUrl } from "@/lib/seo/site-url"

const CANONICAL_PATH = "/blog/prix-location-benne"

export const metadata: Metadata = {
  title: { absolute: PRIX_LOCATION_BENNE_ARTICLE_TITLE },
  description: PRIX_LOCATION_BENNE_ARTICLE_DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}${CANONICAL_PATH}` },
  openGraph: {
    title: PRIX_LOCATION_BENNE_ARTICLE_TITLE,
    description: PRIX_LOCATION_BENNE_ARTICLE_DESCRIPTION,
    url: `${getSiteUrl()}${CANONICAL_PATH}`,
    siteName: "CORE ENVIRONNEMENT",
    locale: "fr_FR",
    type: "article",
    images: buildShareOpenGraphImages(
      SITE_IMAGES.prixLocationBenneArticle.cover,
      PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH,
      PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT,
      PRIX_LOCATION_BENNE_ARTICLE_IMAGE_ALT.cover,
      "image/webp",
    ),
  },
  twitter: {
    card: "summary_large_image",
    title: PRIX_LOCATION_BENNE_ARTICLE_TITLE,
    description: PRIX_LOCATION_BENNE_ARTICLE_DESCRIPTION,
    images: buildShareTwitterImages(SITE_IMAGES.prixLocationBenneArticle.cover),
  },
  robots: { index: true, follow: true },
}

export default function PrixLocationBenneArticlePage() {
  return (
    <>
      <VitrineJsonLd
        faqSource="none"
        description={PRIX_LOCATION_BENNE_ARTICLE_DESCRIPTION}
        includeAggregateRating={false}
      />
      <VitrinePrixLocationBenneArticle />
    </>
  )
}