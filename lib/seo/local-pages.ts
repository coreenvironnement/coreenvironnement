import type { SeoVariant } from "@/lib/seo/landing-variants"

export type LocalPageType = "departement" | "ville"

export type LocalPage = {
  slug: string
  type: LocalPageType
  nom: string
  departementCode: string
  departementNom: string
  departementSlug: string
  title: string
  description: string
  h1Line1: string
  h1Line2: string
  intro: string
  chipLabel: string
  villesPrincipales?: string[]
}

type DepartementDef = {
  code: string
  nom: string
  slug: string
  villesPrincipales: string[]
  cities: string[]
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

function buildDepartementPage(def: DepartementDef): LocalPage {
  const { code, nom, slug, villesPrincipales } = def
  const villesList = villesPrincipales.slice(0, 6).join(", ")

  return {
    slug,
    type: "departement",
    nom,
    departementCode: code,
    departementNom: nom,
    departementSlug: slug,
    title: `Location benne ${nom} (${code}) — Livraison 24h`,
    description: `Location de benne en ${nom} (${code}). Livraison sous 24 h à ${villesList} et communes voisines. Commande en ligne, gravats, DIB et suivi digital.`,
    h1Line1: `Location de benne en ${nom} (${code}) :`,
    h1Line2: "Intervention 24h & suivi digital",
    intro: `CORE ENVIRONNEMENT livre des bennes dans tout le ${nom} (${code}) : ${villesList} et alentours. Gravats, DIB et déchets de chantier — commande en 3 minutes, traçabilité jusqu'au recyclage.`,
    chipLabel: `Location benne · ${nom} (${code})`,
    villesPrincipales,
  }
}

function buildVillePage(def: DepartementDef, cityName: string): LocalPage {
  const citySlug = slugify(cityName)
  const { code, nom: deptNom, slug: deptSlug } = def

  return {
    slug: citySlug,
    type: "ville",
    nom: cityName,
    departementCode: code,
    departementNom: deptNom,
    departementSlug: deptSlug,
    title: `Location benne ${cityName} (${code}) — Livraison 24h`,
    description: `Louez une benne à ${cityName} (${deptNom}, ${code}). Livraison rapide, gravats et déchets de chantier. Commande en ligne CORE ENVIRONNEMENT.`,
    h1Line1: `Location de benne à ${cityName} :`,
    h1Line2: `Intervention en ${deptNom} (${code})`,
    intro: `Besoin d'une benne à ${cityName} ? CORE ENVIRONNEMENT intervient dans le ${deptNom} (${code}) : livraison sous 24 h, suivi digital et traçabilité de vos déchets de chantier.`,
    chipLabel: `${cityName} · ${deptNom} (${code})`,
  }
}

const DEPARTEMENTS: DepartementDef[] = [
  {
    code: "75",
    nom: "Paris",
    slug: "75-paris",
    villesPrincipales: [
      "Paris 1er",
      "Paris 11e",
      "Paris 15e",
      "Paris 18e",
      "Paris 20e",
    ],
    cities: [
      "Paris 1er",
      "Paris 2e",
      "Paris 3e",
      "Paris 4e",
      "Paris 5e",
      "Paris 6e",
      "Paris 7e",
      "Paris 8e",
      "Paris 9e",
      "Paris 10e",
      "Paris 11e",
      "Paris 12e",
      "Paris 13e",
      "Paris 14e",
      "Paris 15e",
      "Paris 16e",
      "Paris 17e",
      "Paris 18e",
      "Paris 19e",
      "Paris 20e",
    ],
  },
  {
    code: "77",
    nom: "Seine-et-Marne",
    slug: "77-seine-et-marne",
    villesPrincipales: ["Meaux", "Melun", "Chelles", "Pontault-Combault", "Fontainebleau"],
    cities: [
      "Meaux",
      "Melun",
      "Chelles",
      "Pontault-Combault",
      "Fontainebleau",
      "Savigny-le-Temple",
      "Champs-sur-Marne",
      "Torcy",
      "Lagny-sur-Marne",
      "Combs-la-Ville",
      "Brie-Comte-Robert",
      "Montereau-Fault-Yonne",
      "Coulommiers",
      "Provins",
    ],
  },
  {
    code: "78",
    nom: "Yvelines",
    slug: "78-yvelines",
    villesPrincipales: ["Versailles", "Sartrouville", "Saint-Germain-en-Laye", "Poissy", "Mantes-la-Jolie"],
    cities: [
      "Versailles",
      "Sartrouville",
      "Saint-Germain-en-Laye",
      "Poissy",
      "Mantes-la-Jolie",
      "Conflans-Sainte-Honorine",
      "Les Mureaux",
      "Trappes",
      "Montigny-le-Bretonneux",
      "Plaisir",
      "Rambouillet",
      "Houilles",
      "Chatou",
      "Le Chesnay-Rocquencourt",
    ],
  },
  {
    code: "91",
    nom: "Essonne",
    slug: "91-essonne",
    villesPrincipales: ["Évry-Courcouronnes", "Massy", "Corbeil-Essonnes", "Palaiseau", "Savigny-sur-Orge"],
    cities: [
      "Évry-Courcouronnes",
      "Massy",
      "Corbeil-Essonnes",
      "Palaiseau",
      "Savigny-sur-Orge",
      "Sainte-Geneviève-des-Bois",
      "Viry-Châtillon",
      "Yerres",
      "Draveil",
      "Longjumeau",
      "Brétigny-sur-Orge",
      "Étampes",
      "Arpajon",
      "Montgeron",
    ],
  },
  {
    code: "92",
    nom: "Hauts-de-Seine",
    slug: "92-hauts-de-seine",
    villesPrincipales: ["Nanterre", "Boulogne-Billancourt", "Colombes", "Courbevoie", "Rueil-Malmaison"],
    cities: [
      "Nanterre",
      "Boulogne-Billancourt",
      "Colombes",
      "Courbevoie",
      "Rueil-Malmaison",
      "Neuilly-sur-Seine",
      "Levallois-Perret",
      "Issy-les-Moulineaux",
      "Clamart",
      "Antony",
      "Asnières-sur-Seine",
      "Clichy",
      "Gennevilliers",
      "Suresnes",
      "Meudon",
    ],
  },
  {
    code: "93",
    nom: "Seine-Saint-Denis",
    slug: "93-seine-saint-denis",
    villesPrincipales: ["Saint-Denis", "Montreuil", "Aubervilliers", "Drancy", "Noisy-le-Grand"],
    cities: [
      "Saint-Denis",
      "Montreuil",
      "Aubervilliers",
      "Drancy",
      "Noisy-le-Grand",
      "Pantin",
      "Bobigny",
      "Le Raincy",
      "Bondy",
      "Aulnay-sous-Bois",
      "Sevran",
      "Livry-Gargan",
      "Épinay-sur-Seine",
      "Stains",
    ],
  },
  {
    code: "94",
    nom: "Val-de-Marne",
    slug: "94-val-de-marne",
    villesPrincipales: ["Créteil", "Vitry-sur-Seine", "Champigny-sur-Marne", "Saint-Maur-des-Fossés", "Vincennes"],
    cities: [
      "Créteil",
      "Vitry-sur-Seine",
      "Champigny-sur-Marne",
      "Saint-Maur-des-Fossés",
      "Vincennes",
      "Fontenay-sous-Bois",
      "Villejuif",
      "L'Haÿ-les-Roses",
      "Maisons-Alfort",
      "Ivry-sur-Seine",
      "Alfortville",
      "Thiais",
      "Orly",
      "Fresnes",
    ],
  },
  {
    code: "95",
    nom: "Val-d'Oise",
    slug: "95-val-d-oise",
    villesPrincipales: ["Argenteuil", "Cergy", "Sarcelles", "Garges-lès-Gonesse", "Pontoise"],
    cities: [
      "Argenteuil",
      "Cergy",
      "Sarcelles",
      "Garges-lès-Gonesse",
      "Pontoise",
      "Franconville",
      "Bezons",
      "Ermont",
      "Goussainville",
      "Montmorency",
      "Taverny",
      "Herblay-sur-Seine",
      "Deuil-la-Barre",
      "Enghien-les-Bains",
    ],
  },
]

const LOCAL_PAGES: LocalPage[] = DEPARTEMENTS.flatMap((def) => {
  const deptPage = buildDepartementPage(def)
  const cityPages = def.cities.map((city) => buildVillePage(def, city))
  return [deptPage, ...cityPages]
})

const LOCAL_PAGE_BY_SLUG = new Map(LOCAL_PAGES.map((page) => [page.slug, page]))

export function getAllLocalPageSlugs(): string[] {
  return LOCAL_PAGES.map((page) => page.slug)
}

export function getLocalPageBySlug(slug: string): LocalPage | undefined {
  return LOCAL_PAGE_BY_SLUG.get(slug)
}

export function getDepartementPages(): LocalPage[] {
  return LOCAL_PAGES.filter((page) => page.type === "departement")
}

export function getCityPagesForDepartement(departementSlug: string): LocalPage[] {
  return LOCAL_PAGES.filter(
    (page) => page.type === "ville" && page.departementSlug === departementSlug
  )
}

export function localPageToSeoVariant(page: LocalPage): SeoVariant {
  const relatedCityLinks =
    page.type === "departement"
      ? getCityPagesForDepartement(page.slug).map((city) => ({
          href: `/location-benne/${city.slug}`,
          label: city.nom,
        }))
      : undefined

  return {
    intent: "default",
    title: page.title,
    description: page.description,
    h1Line1: page.h1Line1,
    h1Line2: page.h1Line2,
    intro: page.intro,
    chipLabel: page.chipLabel,
    canonicalPath: `/location-benne/${page.slug}`,
    relatedCityLinks,
    departementLink:
      page.type === "ville"
        ? { href: `/location-benne/${page.departementSlug}`, label: page.departementNom }
        : undefined,
  }
}

export function getLocalPageCount() {
  return {
    departements: DEPARTEMENTS.length,
    villes: LOCAL_PAGES.filter((p) => p.type === "ville").length,
    total: LOCAL_PAGES.length,
  }
}
