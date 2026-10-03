import type { LocalPage } from "@/lib/seo/local-copy"

type DeptRef = {
  code: string
  nom: string
  slug: string
}

type CityRef = {
  name: string
  dept: DeptRef
}

const DEPTS: Record<string, DeptRef> = {
  "75": { code: "75", nom: "Paris", slug: "75-paris" },
  "77": { code: "77", nom: "Seine-et-Marne", slug: "77-seine-et-marne" },
  "78": { code: "78", nom: "Yvelines", slug: "78-yvelines" },
  "91": { code: "91", nom: "Essonne", slug: "91-essonne" },
  "92": { code: "92", nom: "Hauts-de-Seine", slug: "92-hauts-de-seine" },
  "93": { code: "93", nom: "Seine-Saint-Denis", slug: "93-seine-saint-denis" },
  "94": { code: "94", nom: "Val-de-Marne", slug: "94-val-de-marne" },
  "95": { code: "95", nom: "Val-d'Oise", slug: "95-val-d-oise" },
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/['']/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

const MAJOR_CITIES: CityRef[] = [
  { name: "Paris", dept: DEPTS["75"] },
  { name: "Nanterre", dept: DEPTS["92"] },
  { name: "Boulogne-Billancourt", dept: DEPTS["92"] },
  { name: "Colombes", dept: DEPTS["92"] },
  { name: "Courbevoie", dept: DEPTS["92"] },
  { name: "Rueil-Malmaison", dept: DEPTS["92"] },
  { name: "Versailles", dept: DEPTS["78"] },
  { name: "Sartrouville", dept: DEPTS["78"] },
  { name: "Saint-Germain-en-Laye", dept: DEPTS["78"] },
  { name: "Poissy", dept: DEPTS["78"] },
  { name: "Créteil", dept: DEPTS["94"] },
  { name: "Vitry-sur-Seine", dept: DEPTS["94"] },
  { name: "Saint-Maur-des-Fossés", dept: DEPTS["94"] },
  { name: "Vincennes", dept: DEPTS["94"] },
  { name: "Saint-Denis", dept: DEPTS["93"] },
  { name: "Montreuil", dept: DEPTS["93"] },
  { name: "Aubervilliers", dept: DEPTS["93"] },
  { name: "Drancy", dept: DEPTS["93"] },
  { name: "Meaux", dept: DEPTS["77"] },
  { name: "Melun", dept: DEPTS["77"] },
  { name: "Massy", dept: DEPTS["91"] },
  { name: "Évry-Courcouronnes", dept: DEPTS["91"] },
  { name: "Corbeil-Essonnes", dept: DEPTS["91"] },
  { name: "Argenteuil", dept: DEPTS["95"] },
  { name: "Cergy", dept: DEPTS["95"] },
  { name: "Sarcelles", dept: DEPTS["95"] },
  { name: "Issy-les-Moulineaux", dept: DEPTS["92"] },
  { name: "Antony", dept: DEPTS["92"] },
  { name: "Neuilly-sur-Seine", dept: DEPTS["92"] },
  { name: "Levallois-Perret", dept: DEPTS["92"] },
]

type LongTailRule = {
  slugPrefix: string
  cities?: CityRef[]
  departments?: DeptRef[]
}

const TOP_12 = MAJOR_CITIES.slice(0, 12)
const TOP_10 = MAJOR_CITIES.slice(0, 10)
const TOP_8 = MAJOR_CITIES.slice(0, 8)
const INNER_10 = MAJOR_CITIES.filter((c) =>
  ["75", "92", "93", "94"].includes(c.dept.code)
).slice(0, 10)
const KEY_DEPTS = [DEPTS["75"], DEPTS["92"], DEPTS["93"], DEPTS["94"], DEPTS["77"], DEPTS["78"], DEPTS["91"], DEPTS["95"]]
const SUBURB_DEPTS = [DEPTS["77"], DEPTS["78"], DEPTS["91"], DEPTS["95"]]

const LONGTAIL_SLUG_RULES: LongTailRule[] = [
  { slugPrefix: "gravats", cities: TOP_12, departments: KEY_DEPTS },
  { slugPrefix: "dib", cities: TOP_8, departments: KEY_DEPTS },
  { slugPrefix: "deblais", cities: TOP_8 },
  { slugPrefix: "encombrants", cities: TOP_8, departments: SUBURB_DEPTS },
  { slugPrefix: "chantier", cities: TOP_10, departments: KEY_DEPTS },
  { slugPrefix: "particulier", cities: TOP_10, departments: SUBURB_DEPTS },
  { slugPrefix: "professionnel", cities: TOP_8, departments: SUBURB_DEPTS },
  { slugPrefix: "benne-8m3", cities: TOP_10 },
  { slugPrefix: "benne-10m3", cities: TOP_8 },
  { slugPrefix: "livraison-24h", cities: INNER_10 },
  { slugPrefix: "pas-cher", cities: TOP_8, departments: SUBURB_DEPTS },
  { slugPrefix: "urgence", cities: INNER_10.slice(0, 8) },
  {
    slugPrefix: "enlevement-gravats",
    cities: [
      MAJOR_CITIES.find((c) => c.name === "Versailles")!,
      MAJOR_CITIES.find((c) => c.name === "Nanterre")!,
      MAJOR_CITIES.find((c) => c.name === "Créteil")!,
      MAJOR_CITIES.find((c) => c.name === "Saint-Denis")!,
      MAJOR_CITIES.find((c) => c.name === "Massy")!,
      MAJOR_CITIES.find((c) => c.name === "Meaux")!,
      MAJOR_CITIES.find((c) => c.name === "Argenteuil")!,
      MAJOR_CITIES.find((c) => c.name === "Paris")!,
    ],
  },
]

function buildLongTailPages(): LocalPage[] {
  const pages: LocalPage[] = []
  const seenSlugs = new Set<string>()

  for (const rule of LONGTAIL_SLUG_RULES) {
    if (rule.cities) {
      for (const city of rule.cities) {
        const slug = `${rule.slugPrefix}-${slugify(city.name)}`
        if (seenSlugs.has(slug)) continue
        seenSlugs.add(slug)
        pages.push({
          slug,
          type: "longtail",
          nom: city.name,
          city: city.name,
          departementCode: city.dept.code,
          departementNom: city.dept.nom,
          departementSlug: city.dept.slug,
        })
      }
    }

    if (rule.departments) {
      for (const dept of rule.departments) {
        const slug = `${rule.slugPrefix}-${dept.slug}`
        if (seenSlugs.has(slug)) continue
        seenSlugs.add(slug)
        pages.push({
          slug,
          type: "longtail",
          nom: dept.nom,
          departementCode: dept.code,
          departementNom: dept.nom,
          departementSlug: dept.slug,
        })
      }
    }
  }

  return pages
}

export const LONGTAIL_PAGES: LocalPage[] = buildLongTailPages()

export function getLongTailPageCount(): number {
  return LONGTAIL_PAGES.length
}
