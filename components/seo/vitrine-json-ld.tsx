import {
  faq,
  particulierFaq,
  professionnelsFaqModalitesPaiement,
} from "@/lib/cdc/contenu-vitrine"
import { buildLocalBreadcrumbs } from "@/lib/seo/breadcrumbs"
import { DEFAULT_VARIANT } from "@/lib/seo/landing-variants"
import { buildLocalDescription } from "@/lib/seo/local-copy"
import type { LocalPage } from "@/lib/seo/local-pages"
import { getEntryPriceHt } from "@/lib/seo/pricing-snapshot"
import { getSiteUrl } from "@/lib/seo/site-url"
import {
  SITE_GOOGLE_RATING,
  SITE_GOOGLE_REVIEW_COUNT,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
} from "@/lib/site"

const PROFESSIONNELS_PAYMENT_QUESTION = "Quelles sont les modalités de paiement ?"

export type VitrineFaqSource = "general" | "particulier" | "professionnels" | "none"

function faqAnswerText(item: { r: string; linkLabel?: string; linkHref?: string }) {
  if (item.linkLabel && item.linkHref) {
    return `${item.r} ${item.linkLabel} : ${item.linkHref}`
  }
  return item.r
}

function buildGeneralFaqSchema() {
  const mainEntity = faq.flatMap((section) =>
    section.questions.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.r,
      },
    })),
  )

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}

function buildParticulierFaqSchema() {
  const mainEntity = particulierFaq.map((item) => ({
    "@type": "Question" as const,
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: faqAnswerText(item),
    },
  }))

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}

function buildProfessionnelsFaqSchema() {
  const mainEntity = faq.flatMap((section) =>
    section.questions.map((item) => {
      const answer =
        item.q === PROFESSIONNELS_PAYMENT_QUESTION
          ? professionnelsFaqModalitesPaiement
          : item.r
      return {
        "@type": "Question" as const,
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer" as const,
          text: answer,
        },
      }
    }),
  )

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}

function buildFaqSchema(source: VitrineFaqSource) {
  if (source === "none") return null
  if (source === "particulier") return buildParticulierFaqSchema()
  if (source === "professionnels") return buildProfessionnelsFaqSchema()
  return buildGeneralFaqSchema()
}

function buildBreadcrumbListSchema(siteUrl: string, localPage?: LocalPage) {
  if (!localPage) return null

  const items = buildLocalBreadcrumbs(localPage)

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http")
        ? item.href
        : `${siteUrl}${item.href === "/" ? "" : item.href}`,
    })),
  }
}

function buildLocalBusinessSchema(
  siteUrl: string,
  options: {
    localPage?: LocalPage
    description?: string
    includeAggregateRating: boolean
  },
) {
  const { localPage, description, includeAggregateRating } = options
  const pageUrl = localPage
    ? `${siteUrl}/location-benne/${localPage.slug}`
    : siteUrl

  const areaServed = localPage
    ? [
        { "@type": "AdministrativeArea", name: "Île-de-France" },
        {
          "@type": "AdministrativeArea",
          name: `${localPage.departementNom} (${localPage.departementCode})`,
        },
        ...(localPage.type === "ville"
          ? [{ "@type": "City", name: localPage.nom }]
          : [{ "@type": "City", name: localPage.nom }]),
      ]
    : [
        { "@type": "AdministrativeArea", name: "Île-de-France" },
        { "@type": "City", name: "Paris" },
      ]

  const entryHt = getEntryPriceHt()

  const businessDescription =
    description ??
    (localPage ? buildLocalDescription(localPage) : DEFAULT_VARIANT.description)

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${pageUrl}#organization`,
    name: "CORE ENVIRONNEMENT",
    url: pageUrl,
    telephone: SITE_PHONE_HREF.replace("tel:", ""),
    description: businessDescription,
    areaServed,
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 48.8566,
        longitude: 2.3522,
      },
      geoRadius: "80000",
    },
    priceRange: "€€",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_PHONE_DISPLAY,
      contactType: "customer service",
      areaServed: "FR",
      availableLanguage: "French",
    },
    makesOffer: {
      "@type": "Offer",
      price: entryHt,
      priceCurrency: "EUR",
      description: "Prix de départ pour une benne 8 m³ gravats propres (HT, zone standard).",
      itemOffered: {
        "@type": "Service",
        name: "Location de benne 8 m³ gravats propres",
        description:
          "Location de bennes pour gravats et déchets de chantier en Île-de-France.",
        areaServed: localPage
          ? `${localPage.nom}, Île-de-France`
          : "Île-de-France",
      },
    },
  }

  if (includeAggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: SITE_GOOGLE_RATING,
      reviewCount: SITE_GOOGLE_REVIEW_COUNT,
      bestRating: 5,
      worstRating: 1,
    }
  }

  return schema
}

function buildWebSiteSchema(siteUrl: string, websiteName: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: websiteName,
    description,
    inLanguage: "fr-FR",
  }
}

const DEFAULT_WEBSITE_NAME = "CORE ENVIRONNEMENT"

export function VitrineJsonLd({
  localPage,
  faqSource = "general",
  websiteName = DEFAULT_WEBSITE_NAME,
  description,
  includeAggregateRating = true,
}: {
  localPage?: LocalPage
  faqSource?: VitrineFaqSource
  websiteName?: string
  /** Aligne LocalBusiness / WebSite sur la meta description de la page. */
  description?: string
  /** Note Google : uniquement si le badge hero est affiché sur la page. */
  includeAggregateRating?: boolean
} = {}) {
  const siteUrl = getSiteUrl()
  const resolvedDescription =
    description ??
    (localPage ? buildLocalDescription(localPage) : DEFAULT_VARIANT.description)

  const schemas = [
    buildWebSiteSchema(siteUrl, websiteName, resolvedDescription),
    buildLocalBusinessSchema(siteUrl, {
      localPage,
      description: resolvedDescription,
      includeAggregateRating,
    }),
    buildFaqSchema(faqSource),
    buildBreadcrumbListSchema(siteUrl, localPage),
  ].filter((schema): schema is NonNullable<typeof schema> => schema !== null)

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`${schema["@type"]}-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
