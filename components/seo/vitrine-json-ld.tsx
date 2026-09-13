import { faq } from "@/lib/cdc/contenu-vitrine"
import type { LocalPage } from "@/lib/seo/local-pages"
import { getSiteUrl } from "@/lib/seo/site-url"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

function buildFaqSchema() {
  const mainEntity = faq.flatMap((section) =>
    section.questions.map((item) => ({
      "@type": "Question" as const,
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: item.r,
      },
    }))
  )

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  }
}

function buildLocalBusinessSchema(siteUrl: string, localPage?: LocalPage) {
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

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${pageUrl}#organization`,
    name: "CORE ENVIRONNEMENT",
    url: pageUrl,
    telephone: SITE_PHONE_HREF.replace("tel:", ""),
    description: localPage?.description ??
      "Location de bennes et gestion des déchets en Île-de-France. Commande en ligne, intervention sous 24 h et suivi digital.",
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
      itemOffered: {
        "@type": "Service",
        name: "Location de benne",
        description:
          "Location de bennes pour gravats, DIB et déchets de chantier en Île-de-France.",
        areaServed: localPage
          ? `${localPage.nom}, Île-de-France`
          : "Île-de-France",
      },
    },
  }
}

function buildWebSiteSchema(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "CORE ENVIRONNEMENT",
    description:
      "Location de bennes en Île-de-France avec commande en ligne et suivi digital.",
    inLanguage: "fr-FR",
  }
}

export function VitrineJsonLd({ localPage }: { localPage?: LocalPage } = {}) {
  const siteUrl = getSiteUrl()
  const schemas = [
    buildWebSiteSchema(siteUrl),
    buildLocalBusinessSchema(siteUrl, localPage),
    buildFaqSchema(),
  ]

  return (
    <>
      {schemas.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
