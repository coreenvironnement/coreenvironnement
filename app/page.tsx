import type { Metadata } from "next"

import { VitrineJsonLd } from "@/components/seo/vitrine-json-ld"
import { VitrineHome } from "@/components/vitrine/vitrine-home"
import {
  getShareOpenGraphImages,
  getShareTwitterImages,
} from "@/lib/seo/share-metadata"
import { getSiteUrl } from "@/lib/seo/site-url"

/** Métadonnées document homepage uniquement (H1 / contenu visuel inchangés). */
const HOME_PAGE_DOCUMENT_TITLE =
  "Location de benne en Île-de-France dès 330 € | CORE ENVIRONNEMENT"
const HOME_PAGE_META_DESCRIPTION =
  "Dès 330 € pour une benne 8 m³ gravats propres. Prix affiché avant paiement, avec le suivi de votre livraison en Île-de-France."

type PageProps = {
  searchParams: Promise<{ order?: string; intent?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const siteUrl = getSiteUrl()

  return {
    title: { absolute: HOME_PAGE_DOCUMENT_TITLE },
    description: HOME_PAGE_META_DESCRIPTION,
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: HOME_PAGE_DOCUMENT_TITLE,
      description: HOME_PAGE_META_DESCRIPTION,
      url: siteUrl,
      siteName: "CORE ENVIRONNEMENT",
      locale: "fr_FR",
      type: "website",
      images: getShareOpenGraphImages(),
    },
    twitter: {
      card: "summary_large_image",
      title: HOME_PAGE_DOCUMENT_TITLE,
      description: HOME_PAGE_META_DESCRIPTION,
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
