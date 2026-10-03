import type { Metadata } from "next"

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
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "CORE ENVIRONNEMENT",
      locale: "fr_FR",
      type: "website",
      images: getShareOpenGraphImages(),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: getShareTwitterImages(),
    },
  }
}
