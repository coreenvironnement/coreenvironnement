import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineHome } from "@/components/vitrine/vitrine-home"
import { getSeoVariant, parseSeoIntent } from "@/lib/seo/landing-variants"
import { getSiteUrl } from "@/lib/seo/site-url"

type PageProps = {
  searchParams: Promise<{ order?: string; intent?: string }>
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const { intent } = await searchParams
  const variant = getSeoVariant(parseSeoIntent(intent))
  const siteUrl = getSiteUrl()

  return {
    title: variant.title,
    description: variant.description,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: variant.title,
      description: variant.description,
      url: siteUrl,
      siteName: "CORE ENVIRONNEMENT",
      locale: "fr_FR",
      type: "website",
      images: [
        {
          url: "/images/hero-paris-truck-desktop.png",
          width: 1200,
          height: 630,
          alt: "Location de benne en Île-de-France — CORE ENVIRONNEMENT",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: variant.title,
      description: variant.description,
      images: ["/images/hero-paris-truck-desktop.png"],
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function HomePage({ searchParams }: PageProps) {
  const { order: orderParam, intent } = await searchParams
  const seoVariant = getSeoVariant(parseSeoIntent(intent))

  return (
    <>
      <VitrineJsonLd />
      <VitrineHome orderParam={orderParam} seoVariant={seoVariant} />
    </>
  )
}
