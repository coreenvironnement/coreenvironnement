import type { MetadataRoute } from "next"

import { getAllLocalPageSlugs, getLocalPageBySlug } from "@/lib/seo/local-pages"
import { getSiteUrl } from "@/lib/seo/site-url"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl()
  const lastModified = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: base,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${base}/pro`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/mentions-legales`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${base}/politique-confidentialite`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  const localPages: MetadataRoute.Sitemap = getAllLocalPageSlugs().map((slug) => {
    const page = getLocalPageBySlug(slug)
    return {
      url: `${base}/location-benne/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: page?.type === "departement" ? 0.9 : 0.7,
    }
  })

  return [...staticPages, ...localPages]
}
