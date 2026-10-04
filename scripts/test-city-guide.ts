import { readFileSync } from "node:fs"
import { resolve } from "node:path"

import { CITY_OFFICIAL_INFO } from "../lib/seo/city-official-info"
import {
  getAllLocalPageSlugs,
  getLocalPageBySlug,
  getLocalPageCount,
} from "../lib/seo/local-pages"

const OFFICIAL_HOSTS = new Set([
  "www.paris.fr",
  "www.versailles.fr",
  "www.montreuil.fr",
  "www.montfortlamaury.fr",
])

const errors: string[] = []
const counts = getLocalPageCount()
const allSlugs = getAllLocalPageSlugs()
const sourcedSlugs = new Set<string>()

if (
  counts.total !== 482 ||
  counts.departements !== 8 ||
  counts.villes !== 318 ||
  counts.longtail !== 156 ||
  allSlugs.length !== 482
) {
  errors.push("Le nombre de routes SEO existantes a changé.")
}

for (const info of CITY_OFFICIAL_INFO) {
  if (sourcedSlugs.has(info.citySlug)) {
    errors.push(`${info.citySlug}: source locale dupliquée.`)
  }
  sourcedSlugs.add(info.citySlug)

  const page = getLocalPageBySlug(info.citySlug)
  if (!page || page.type !== "ville") {
    errors.push(`${info.citySlug}: la source ne correspond pas à une ville connue.`)
  }

  if (
    !info.content.trim() ||
    !info.summary.trim() ||
    !info.sourceTitle.trim() ||
    info.verifiedAt !== "2026-10-04"
  ) {
    errors.push(`${info.citySlug}: source locale incomplète.`)
  }

  try {
    const url = new URL(info.sourceUrl)
    if (url.protocol !== "https:" || !OFFICIAL_HOSTS.has(url.hostname)) {
      errors.push(`${info.citySlug}: domaine source non officiel ou URL non HTTPS.`)
    }
  } catch {
    errors.push(`${info.citySlug}: URL source invalide.`)
  }
}

const guideSource = readFileSync(
  resolve(process.cwd(), "components/vitrine/vitrine-city-guide.tsx"),
  "utf8",
)
const homeSource = readFileSync(
  resolve(process.cwd(), "components/vitrine/vitrine-home.tsx"),
  "utf8",
)
const routeSource = readFileSync(
  resolve(process.cwd(), "app/location-benne/[slug]/page.tsx"),
  "utf8",
)

if (/<h1[\s>]/i.test(guideSource)) {
  errors.push("Le guide ville ne doit ajouter aucun H1.")
}
if (!homeSource.includes('localSeoData?.type === "ville"')) {
  errors.push("Le guide doit rester limité aux pages ville.")
}
if (!routeSource.includes("const canonical = `${siteUrl}/location-benne/${page.slug}`")) {
  errors.push("La formule canonical des pages locales a changé.")
}
if (CITY_OFFICIAL_INFO.some(({ citySlug }) => getLocalPageBySlug(citySlug)?.type === "longtail")) {
  errors.push("Une page long-tail contient un enrichissement local.")
}

if (errors.length > 0) {
  console.error(errors.join("\n"))
  process.exit(1)
}

console.log(
  `OK guide-ville routes=${counts.total} villes-sourcees=${CITY_OFFICIAL_INFO.length} fallback=${counts.villes - CITY_OFFICIAL_INFO.length}`,
)
