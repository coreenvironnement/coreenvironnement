import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineDechetsAcceptesGuide } from "@/components/vitrine/vitrine-dechets-acceptes-guide"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import { getSiteUrl } from "@/lib/seo/site-url"
import {
  DECHETS_ACCEPTES_GUIDE_DESCRIPTION,
  DECHETS_ACCEPTES_GUIDE_TITLE,
} from "@/lib/seo/dechets-acceptes-guide-content"

export const metadata: Metadata = {
  title: { absolute: DECHETS_ACCEPTES_GUIDE_TITLE },
  description: DECHETS_ACCEPTES_GUIDE_DESCRIPTION,
  alternates: {
    canonical: `${getSiteUrl()}/location-benne/dechets-acceptes`,
  },
  openGraph: {
    title: DECHETS_ACCEPTES_GUIDE_TITLE,
    description: DECHETS_ACCEPTES_GUIDE_DESCRIPTION,
    url: `${getSiteUrl()}/location-benne/dechets-acceptes`,
    siteName: "CORE ENVIRONNEMENT",
    locale: "fr_FR",
    type: "article",
    images: getShareOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: DECHETS_ACCEPTES_GUIDE_TITLE,
    description: DECHETS_ACCEPTES_GUIDE_DESCRIPTION,
    images: getShareTwitterImages(),
  },
  robots: { index: true, follow: true },
}

export default function DechetsAcceptesGuidePage() {
  return (
    <>
      <VitrineJsonLd
        faqSource="none"
        description={DECHETS_ACCEPTES_GUIDE_DESCRIPTION}
        includeAggregateRating={false}
      />
      <VitrineDechetsAcceptesGuide />
    </>
  )
}
