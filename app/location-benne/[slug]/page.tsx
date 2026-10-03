import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineHome } from "@/components/vitrine/vitrine-home"
import { buildLocalDescription, buildLocalTitle } from "@/lib/seo/local-copy"
import { getAllLocalPageSlugs, getLocalPageBySlug } from "@/lib/seo/local-pages"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import { withBrandTitle } from "@/lib/seo/page-title"
import { getSiteUrl } from "@/lib/seo/site-url"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ order?: string }>
}

export async function generateStaticParams() {
  return getAllLocalPageSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = getLocalPageBySlug(slug)
  if (!page) return {}

  const siteUrl = getSiteUrl()
  const canonical = `${siteUrl}/location-benne/${page.slug}`
  const title = buildLocalTitle(page)
  const description = buildLocalDescription(page)
  const pageTitle = withBrandTitle(title)

  return {
    title: { absolute: pageTitle },
    description,
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
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
    robots: { index: true, follow: true },
  }
}

export default async function LocationBenneLocalPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { order: orderParam } = await searchParams
  const page = getLocalPageBySlug(slug)

  if (!page) {
    notFound()
  }

  return (
    <>
      <VitrineJsonLd localPage={page} />
      <VitrineHome orderParam={orderParam} localSeoData={page} />
    </>
  )
}
