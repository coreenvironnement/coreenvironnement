import type { MetadataRoute } from "next"

import { getAllLocalPageSlugs, getLocalPageBySlug } from "@/lib/seo/local-pages"
import { getSiteUrl } from "@/lib/seo/site-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      changeFrequency: "weekly",
      priority: 1,
      lastModified,
    },
    {
      url: `${base}/location-benne`,
      changeFrequency: "weekly",
      priority: 0.95,
      lastModified,
    },
    {
      url: `${base}/pro`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/professionnels`,
      changeFrequency: "monthly",
      priority: 0.85,
      lastModified,
    },
    {
      url: `${base}/politique-confidentialite`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/cgv`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const localPages: MetadataRoute.Sitemap = getAllLocalPageSlugs().map((slug) => {
    const page = getLocalPageBySlug(slug)
    return {
      url: `${base}/location-benne/${slug}`,
      changeFrequency: "monthly" as const,
      priority:
        page?.type === "departement" ? 0.9 : page?.type === "longtail" ? 0.65 : 0.7,
      lastModified,
    }
  })

  return [...staticPages, ...localPages]
}
