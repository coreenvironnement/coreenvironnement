/**
 * Génère docs/seo-url-inventory.csv à partir de la logique local-pages + pages statiques.
 * Usage : npx tsx scripts/generate-seo-url-inventory.ts
 */
import { writeFileSync } from "node:fs"
import { resolve } from "node:path"

import {
  getAllLocalPageSlugs,
  getLocalPageBySlug,
  getLocalPageCount,
} from "../lib/seo/local-pages"

type Family =
  | "home"
  | "hub"
  | "guide"
  | "dept"
  | "ville"
  | "longtail"
  | "pro"
  | "legal"

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

function decisionForFamily(
  family: Family,
): { decision: string; rationale: string; priority: string } {
  switch (family) {
    case "home":
      return {
        decision: "améliorer",
        rationale: "Page conversion principale — copy pack prioritaire",
        priority: "P0",
      }
    case "hub":
      return {
        decision: "améliorer",
        rationale: "Maillage géo + ancrage sémantique IDF",
        priority: "P1",
      }
    case "guide":
      return {
        decision: "améliorer",
        rationale: "Guides volume / déchets — fort intent informationnel",
        priority: "P1",
      }
    case "dept":
      return {
        decision: "conserver",
        rationale: "8 pages piliers département — garder, enrichir contenu unique",
        priority: "P1",
      }
    case "ville":
      return {
        decision: "améliorer",
        rationale: "Template ville — risque thin duplicate ; enrichir guides locaux",
        priority: "P2",
      }
    case "longtail":
      return {
        decision: "améliorer",
        rationale: "Intent niche — fusionner seulement si cannibalisation GSC",
        priority: "P2",
      }
    case "pro":
      return {
        decision: "améliorer",
        rationale: "/professionnels vitrine ; /pro hors sitemap (onboarding)",
        priority: "P1",
      }
    case "legal":
      return {
        decision: "conserver",
        rationale: "Obligations légales — pas de refactor SEO",
        priority: "P3",
      }
  }
}

const rows: string[][] = [
  [
    "url",
    "family",
    "type",
    "slug",
    "decision_proposal",
    "destination_if_fusion",
    "rationale",
    "priority",
    "gsc_note",
  ],
]

const staticEntries: Array<{ path: string; family: Family; type: string; slug: string }> = [
  { path: "/", family: "home", type: "static", slug: "" },
  { path: "/location-benne", family: "hub", type: "static", slug: "location-benne" },
  {
    path: "/location-benne/volume",
    family: "guide",
    type: "guide",
    slug: "volume",
  },
  {
    path: "/location-benne/dechets-acceptes",
    family: "guide",
    type: "guide",
    slug: "dechets-acceptes",
  },
  { path: "/pro", family: "pro", type: "account", slug: "pro" },
  { path: "/professionnels", family: "pro", type: "vitrine", slug: "professionnels" },
  {
    path: "/politique-confidentialite",
    family: "legal",
    type: "legal",
    slug: "politique-confidentialite",
  },
  { path: "/cgv", family: "legal", type: "legal", slug: "cgv" },
  { path: "/mentions-legales", family: "legal", type: "legal", slug: "mentions-legales" },
]

for (const entry of staticEntries) {
  const { decision, rationale, priority } = decisionForFamily(entry.family)
  const sitemapNote =
    entry.slug === "pro"
      ? "retirer-sitemap (fait nov. 2026 — pas noindex)"
      : decision
  rows.push([
    entry.path,
    entry.family,
    entry.type,
    entry.slug,
    entry.slug === "pro" ? "retirer-sitemap" : decision,
    "",
    entry.slug === "pro"
      ? "Parcours création compte — indexable mais non prioritaire SEO"
      : rationale,
    priority,
    "statut GSC à importer",
  ])
  void sitemapNote
}

for (const slug of getAllLocalPageSlugs()) {
  const page = getLocalPageBySlug(slug)
  if (!page) continue
  const family: Family =
    page.type === "departement"
      ? "dept"
      : page.type === "ville"
        ? "ville"
        : "longtail"
  const { decision, rationale, priority } = decisionForFamily(family)
  rows.push([
    `/location-benne/${slug}`,
    family,
    page.type,
    slug,
    decision,
    "",
    rationale,
    priority,
    "statut GSC à importer",
  ])
}

const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n")
const outPath = resolve(process.cwd(), "docs/seo-url-inventory.csv")
writeFileSync(outPath, csv, "utf8")

const counts = getLocalPageCount()
console.log(`Écrit ${rows.length - 1} URLs → ${outPath}`)
console.log(
  `Local: ${counts.departements} dept, ${counts.villes} ville, ${counts.longtail} longtail (total local ${counts.total})`,
)
console.log(`Total inventaire: ${rows.length - 1} (static ${staticEntries.length} + local ${counts.total})`)
