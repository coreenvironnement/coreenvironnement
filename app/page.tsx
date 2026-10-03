import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineHome } from "@/components/vitrine/vitrine-home"
import { DEFAULT_VARIANT } from "@/lib/seo/landing-variants"
import { withBrandTitle } from "@/lib/seo/page-title"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import { getSiteUrl } from "@/lib/seo/site-url"

type PageProps = {
  searchParams: Promise<{ order?: string; intent?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl()
  const pageTitle = withBrandTitle(DEFAULT_VARIANT.title)

  return {
    title: { absolute: pageTitle },
    description: DEFAULT_VARIANT.description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: pageTitle,
      description: DEFAULT_VARIANT.description,
      url: siteUrl,
      siteName: "CORE ENVIRONNEMENT",
      locale: "fr_FR",
      type: "website",
      images: getShareOpenGraphImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: DEFAULT_VARIANT.description,
      images: getShareTwitterImages(),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function HomePage({ searchParams }: PageProps) {
  const { order: orderParam } = await searchParams

  return (
    <>
      <VitrineJsonLd />
      <VitrineHome orderParam={orderParam} />
    </>
  )
}
