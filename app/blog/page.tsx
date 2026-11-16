import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineBlogHub } from "@/components/vitrine/vitrine-blog-hub"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import {
  BLOG_HUB_DESCRIPTION,
  BLOG_HUB_TITLE,
} from "@/lib/seo/blog-hub-content"
import { getSiteUrl } from "@/lib/seo/site-url"

const CANONICAL_PATH = "/blog"

export const metadata: Metadata = {
  title: { absolute: BLOG_HUB_TITLE },
  description: BLOG_HUB_DESCRIPTION,
  alternates: { canonical: `${getSiteUrl()}${CANONICAL_PATH}` },
  openGraph: {
    title: BLOG_HUB_TITLE,
    description: BLOG_HUB_DESCRIPTION,
    url: `${getSiteUrl()}${CANONICAL_PATH}`,
    siteName: "CORE ENVIRONNEMENT",
    locale: "fr_FR",
    type: "website",
    images: getShareOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title: BLOG_HUB_TITLE,
    description: BLOG_HUB_DESCRIPTION,
    images: getShareTwitterImages(),
  },
  robots: { index: true, follow: true },
}

export default function BlogHubPage() {
  return (
    <>
      <VitrineJsonLd
        faqSource="none"
        description={BLOG_HUB_DESCRIPTION}
        includeAggregateRating={false}
      />
      <VitrineBlogHub />
    </>
  )
}