import type { Metadata } from "next"

import { withBrandTitle } from "@/lib/seo/page-title"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import { getSiteUrl } from "@/lib/seo/site-url"

export function publicPageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  const url = `${getSiteUrl()}${path}`
  const pageTitle = withBrandTitle(title)
  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description,
      url,
      siteName: "CORE ENVIRONNEMENT",
      locale: "fr_FR",
      type: "website",
      images: getShareOpenGraphImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: getShareTwitterImages(),
    },
  }
}
