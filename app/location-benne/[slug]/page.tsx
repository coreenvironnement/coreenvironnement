import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineHome } from "@/components/vitrine/vitrine-home"
import {
  getAllLocalPageSlugs,
  getLocalPageBySlug,
  localPageToSeoVariant,
} from "@/lib/seo/local-pages"
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

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical },
    openGraph: {
      title: page.title,
      description: page.description,
      url: canonical,
      siteName: "CORE ENVIRONNEMENT",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: "/images/hero-paris-truck-desktop.png",
          width: 1200,
          height: 630,
          alt: `Location de benne ${page.nom} — CORE ENVIRONNEMENT`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/images/hero-paris-truck-desktop.png"],
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

  const seoVariant = localPageToSeoVariant(page)

  return (
    <>
      <VitrineJsonLd localPage={page} />
      <VitrineHome orderParam={orderParam} seoVariant={seoVariant} />
    </>
  )
}
