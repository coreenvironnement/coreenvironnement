import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineVolumeGuide } from "@/components/vitrine/vitrine-volume-guide"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import { getSiteUrl } from "@/lib/seo/site-url"
import {
  VOLUME_GUIDE_DESCRIPTION,
  VOLUME_GUIDE_TITLE,
} from "@/lib/seo/volume-guide-content"
import { withBrandTitle } from "@/lib/seo/page-title"

export const metadata: Metadata = {
  title: { absolute: VOLUME_GUIDE_TITLE },
  description: VOLUME_GUIDE_DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}/location-benne/volume` },
  openGraph: {
    title: VOLUME_GUIDE_TITLE,
    description: VOLUME_GUIDE_DESCRIPTION,
    url: `${getSiteUrl()}/location-benne/volume`,
    siteName: "CORE ENVIRONNEMENT",
    locale: "fr_FR",
    type: "article",
    images: getShareOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: withBrandTitle(VOLUME_GUIDE_TITLE),
    description: VOLUME_GUIDE_DESCRIPTION,
    images: getShareTwitterImages(),
  },
  robots: { index: true, follow: true },
}

export default function VolumeGuidePage() {
  return (
    <>
      <VitrineJsonLd
        faqSource="none"
        description={VOLUME_GUIDE_DESCRIPTION}
        includeAggregateRating={false}
      />
      <VitrineVolumeGuide />
    </>
  )
}
