import { getLocalPageBySlug } from "../lib/seo/local-pages"
import {
  getPrestationMeshLinksForCityPage,
  getPrestationMeshLinksForDepartmentPage,
  getPrestationMeshLot1Inventory,
} from "../lib/seo/prestation-mesh-lot1"

const inventory = getPrestationMeshLot1Inventory()
if (inventory.length !== 44) {
  console.error(`expected 44 lot1 longtails, got ${inventory.length}`)
  process.exit(1)
}

const linked = new Map<string, { source: string; placement: string }>()
const pending: { slug: string; reason: string }[] = []

for (const item of inventory) {
  if (item.city) {
    let cityPageSlug = item.longtailSlug
    if (item.longtailSlug.startsWith("enlevement-gravats-"))
      cityPageSlug = item.longtailSlug.slice("enlevement-gravats-".length)
    else if (item.longtailSlug.startsWith("gravats-"))
      cityPageSlug = item.longtailSlug.slice("gravats-".length)
    else if (item.longtailSlug.startsWith("dib-"))
      cityPageSlug = item.longtailSlug.slice("dib-".length)

    const cityPage = getLocalPageBySlug(cityPageSlug)
    if (!cityPage || cityPage.type !== "ville") {
      pending.push({
        slug: item.longtailSlug,
        reason: `Pas de page ville « ${item.city} » (slug attendu : ${cityPageSlug}).`,
      })
      continue
    }
    const links = getPrestationMeshLinksForCityPage(cityPage)
    const hit = links.find((l) => l.href === `/location-benne/${item.longtailSlug}`)
    if (!hit) {
      console.error(`missing link on ville ${cityPageSlug} -> ${item.longtailSlug}`)
      process.exit(1)
    }
    linked.set(item.longtailSlug, {
      source: `/location-benne/${cityPageSlug}`,
      placement: "VitrineCityGuide / Flux de déchets",
    })
  } else {
    const deptPage = getLocalPageBySlug(item.departementSlug)
    if (!deptPage) {
      console.error(`dept missing ${item.departementSlug}`)
      process.exit(1)
    }
    const links = getPrestationMeshLinksForDepartmentPage(deptPage)
    const hit = links.find((l) => l.href === `/location-benne/${item.longtailSlug}`)
    if (!hit) {
      console.error(`missing link on dept ${item.departementSlug} -> ${item.longtailSlug}`)
      process.exit(1)
    }
    linked.set(item.longtailSlug, {
      source: `/location-benne/${item.departementSlug}`,
      placement: "VitrineDepartmentGuide / Prestations",
    })
  }
}

const required = [
  ["nanterre", 2],
  ["meaux", 1],
  ["versailles", 3],
  ["77-seine-et-marne", 2],
] as const

for (const [slug, minCount] of required) {
  const page = getLocalPageBySlug(slug)
  if (!page) continue
  const count =
    page.type === "ville"
      ? getPrestationMeshLinksForCityPage(page).length
      : getPrestationMeshLinksForDepartmentPage(page).length
  if (count < minCount) {
    console.error(`expected >=${minCount} links on ${slug}, got ${count}`)
    process.exit(1)
  }
}

console.log(
  `OK lot1=${inventory.length} linked=${linked.size} pending=${pending.length}`,
)
if (pending.length > 0) {
  console.log("pending:", pending.map((p) => p.slug).join(", "))
}