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

function truncateTitle(title: string, max = 60): string {
  if (title.length <= max) return title
  const cut = title.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(" ")
  return (lastSpace > 30 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…"
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

type LongTailContent = {
  nom: string
  title: string
  description: string
  h1Line1: string
  h1Line2: string
  intro: string
  chipLabel: string
}

type LongTailPage = LongTailContent & {
  slug: string
  type: "longtail"
  departementCode: string
  departementNom: string
  departementSlug: string
}

type ServiceTemplate = {
  slugPrefix: string
  cities?: CityRef[]
  departments?: DeptRef[]
  buildCity: (city: CityRef) => LongTailContent
  buildDept: (dept: DeptRef) => LongTailContent
}

/** ~150 combinaisons ciblées (pas de produit cartésien complet) */
const TOP_12 = MAJOR_CITIES.slice(0, 12)
const TOP_10 = MAJOR_CITIES.slice(0, 10)
const TOP_8 = MAJOR_CITIES.slice(0, 8)
const INNER_10 = MAJOR_CITIES.filter((c) =>
  ["75", "92", "93", "94"].includes(c.dept.code)
).slice(0, 10)
const KEY_DEPTS = [DEPTS["75"], DEPTS["92"], DEPTS["93"], DEPTS["94"], DEPTS["77"], DEPTS["78"], DEPTS["91"], DEPTS["95"]]
const SUBURB_DEPTS = [DEPTS["77"], DEPTS["78"], DEPTS["91"], DEPTS["95"]]

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    slugPrefix: "gravats",
    cities: TOP_12,
    departments: KEY_DEPTS,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Location benne gravats ${city.name} — 24h`),
      description: `Louez une benne gravats à ${city.name} (${city.dept.nom}). Évacuation rapide, tri et valorisation. Commande en ligne CORE ENVIRONNEMENT.`,
      h1Line1: `Location benne gravats à ${city.name} :`,
      h1Line2: "Évacuation & tri sous 24 h",
      intro: `Vous cherchez une benne gravats à ${city.name} ? CORE ENVIRONNEMENT livre sur votre chantier dans le ${city.dept.nom} (${city.dept.code}) : commande en 3 minutes, enlèvement sous 24 h et traçabilité jusqu'au centre de tri.`,
      chipLabel: `Benne gravats · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Location benne gravats ${dept.nom} (${dept.code})`),
      description: `Location de benne gravats en ${dept.nom} (${dept.code}). Livraison sous 24 h, tri et recyclage. Commande en ligne CORE ENVIRONNEMENT.`,
      h1Line1: `Benne gravats en ${dept.nom} (${dept.code}) :`,
      h1Line2: "Livraison rapide & suivi digital",
      intro: `Besoin d'évacuer des gravats en ${dept.nom} ? CORE ENVIRONNEMENT couvre tout le département (${dept.code}) : bennes adaptées aux déchets inertes, intervention sous 24 h et documents de traçabilité.`,
      chipLabel: `Benne gravats · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "dib",
    cities: TOP_8,
    departments: KEY_DEPTS,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne DIB ${city.name} — Location & enlèvement`),
      description: `Location benne DIB à ${city.name} (${city.dept.nom}). Déchets industriels banals, livraison 24 h et BSD fournis. CORE ENVIRONNEMENT.`,
      h1Line1: `Location benne DIB à ${city.name} :`,
      h1Line2: "Déchets industriels banals",
      intro: `Pour vos déchets industriels banals à ${city.name}, CORE ENVIRONNEMENT propose des bennes DIB avec livraison dans le ${city.dept.nom} (${city.dept.code}). Commande en ligne, enlèvement rapide et traçabilité complète.`,
      chipLabel: `Benne DIB · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne DIB ${dept.nom} (${dept.code}) — Location`),
      description: `Benne DIB en ${dept.nom} (${dept.code}). Collecte déchets industriels banals, BSD et suivi digital. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne DIB en ${dept.nom} (${dept.code}) :`,
      h1Line2: "Collecte & traçabilité",
      intro: `Professionnels et artisans en ${dept.nom} : louez une benne DIB avec CORE ENVIRONNEMENT. Couverture du ${dept.code}, intervention sous 24 h et documents réglementaires inclus.`,
      chipLabel: `Benne DIB · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "deblais",
    cities: TOP_8,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne déblais ${city.name} — Évacuation chantier`),
      description: `Location benne déblais à ${city.name}. Terre, gravats et démolition légère. Livraison 24 h en ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne déblais à ${city.name} :`,
      h1Line2: "Terre & démolition légère",
      intro: `Évacuez vos déblais à ${city.name} avec une benne adaptée. CORE ENVIRONNEMENT intervient dans le ${city.dept.nom} (${city.dept.code}) : terre, gravats et déchets de démolition, livraison sous 24 h.`,
      chipLabel: `Benne déblais · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne déblais ${dept.nom} (${dept.code})`),
      description: `Location benne déblais en ${dept.nom} (${dept.code}). Terre, gravats et démolition. Livraison rapide CORE ENVIRONNEMENT.`,
      h1Line1: `Benne déblais en ${dept.nom} :`,
      h1Line2: `Intervention ${dept.code} sous 24 h`,
      intro: `Chantier de terrassement ou démolition en ${dept.nom} ? CORE ENVIRONNEMENT livre des bennes déblais sur tout le ${dept.code} avec suivi digital de l'évacuation.`,
      chipLabel: `Benne déblais · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "encombrants",
    cities: TOP_8,
    departments: SUBURB_DEPTS,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne encombrants ${city.name} — Enlèvement`),
      description: `Benne encombrants à ${city.name} (${city.dept.nom}). Meubles, déchets volumineux. Livraison 24 h. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne encombrants à ${city.name} :`,
      h1Line2: "Meubles & déchets volumineux",
      intro: `Vous devez évacuer des encombrants à ${city.name} ? CORE ENVIRONNEMENT livre une benne adaptée dans le ${city.dept.nom} (${city.dept.code}) : commande en ligne, enlèvement rapide et tri responsable.`,
      chipLabel: `Encombrants · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne encombrants ${dept.nom} (${dept.code})`),
      description: `Location benne encombrants en ${dept.nom}. Meubles et déchets volumineux. Livraison 24 h CORE ENVIRONNEMENT.`,
      h1Line1: `Benne encombrants en ${dept.nom} :`,
      h1Line2: "Enlèvement volumineux",
      intro: `Particuliers et pros en ${dept.nom} : louez une benne encombrants avec CORE ENVIRONNEMENT. Couverture du ${dept.code}, intervention sous 24 h.`,
      chipLabel: `Encombrants · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "chantier",
    cities: TOP_10,
    departments: KEY_DEPTS,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne chantier ${city.name} — Location BTP`),
      description: `Location benne chantier à ${city.name}. BTP, rénovation et gros œuvre. Livraison 24 h en ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne chantier à ${city.name} :`,
      h1Line2: "BTP & rénovation",
      intro: `Votre chantier à ${city.name} a besoin d'une benne fiable ? CORE ENVIRONNEMENT livre dans le ${city.dept.nom} (${city.dept.code}) : volumes 8 à 30 m³, rotation rapide et espace client pour le suivi.`,
      chipLabel: `Benne chantier · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne chantier ${dept.nom} (${dept.code}) — BTP`),
      description: `Location benne chantier en ${dept.nom} (${dept.code}). Professionnels BTP, livraison 24 h. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne chantier en ${dept.nom} :`,
      h1Line2: "Professionnels du BTP",
      intro: `Artisans et entreprises du BTP en ${dept.nom} : CORE ENVIRONNEMENT assure la location de bennes chantier sur tout le ${dept.code} avec facturation pro et suivi digital.`,
      chipLabel: `Benne chantier · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "particulier",
    cities: TOP_10,
    departments: SUBURB_DEPTS,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Location benne particulier ${city.name}`),
      description: `Louez une benne particulier à ${city.name}. Travaux maison, jardin, déménagement. Prix clairs, livraison 24 h. CORE ENVIRONNEMENT.`,
      h1Line1: `Location benne particulier à ${city.name} :`,
      h1Line2: "Travaux maison & jardin",
      intro: `Vous êtes particulier à ${city.name} et cherchez une benne pour vos travaux ? CORE ENVIRONNEMENT livre dans le ${city.dept.nom} (${city.dept.code}) : commande simple en ligne, tarifs transparents et intervention sous 24 h.`,
      chipLabel: `Particulier · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne particulier ${dept.nom} (${dept.code})`),
      description: `Location benne pour particuliers en ${dept.nom}. Travaux, rénovation, jardin. Livraison 24 h CORE ENVIRONNEMENT.`,
      h1Line1: `Benne particulier en ${dept.nom} :`,
      h1Line2: "Travaux & rénovation",
      intro: `Particuliers en ${dept.nom} : louez une benne pour vos travaux avec CORE ENVIRONNEMENT. Couverture du ${dept.code}, commande en 3 minutes et prix affichés en ligne.`,
      chipLabel: `Particulier · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "professionnel",
    cities: TOP_8,
    departments: SUBURB_DEPTS,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne professionnel ${city.name} — Compte pro`),
      description: `Location benne professionnel à ${city.name}. Compte pro, facturation centralisée, BTP. CORE ENVIRONNEMENT ${city.dept.nom}.`,
      h1Line1: `Benne professionnel à ${city.name} :`,
      h1Line2: "Compte pro & facturation",
      intro: `Entreprises et artisans à ${city.name} : CORE ENVIRONNEMENT propose un compte professionnel avec bennes chantier, facturation mensuelle et interlocuteur dédié dans le ${city.dept.nom} (${city.dept.code}).`,
      chipLabel: `Professionnel · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne pro ${dept.nom} (${dept.code}) — BTP`),
      description: `Location benne professionnel en ${dept.nom}. Compte pro, multi-chantiers, BSD. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne pro en ${dept.nom} (${dept.code}) :`,
      h1Line2: "Multi-chantiers & BSD",
      intro: `Professionnels du BTP en ${dept.nom} : bénéficiez d'un compte pro CORE ENVIRONNEMENT avec gestion multi-chantiers, BSD automatiques et livraison sous 24 h sur tout le ${dept.code}.`,
      chipLabel: `Professionnel · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "benne-8m3",
    cities: TOP_10,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne 8m3 ${city.name} — Livraison rapide`),
      description: `Louez une benne 8 m³ à ${city.name}. Idéale petits travaux et jardin. Livraison 24 h en ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne 8 m³ à ${city.name} :`,
      h1Line2: "Petits travaux & jardin",
      intro: `La benne 8 m³ est parfaite pour vos travaux à ${city.name}. CORE ENVIRONNEMENT livre sous 24 h dans le ${city.dept.nom} (${city.dept.code}) : compacte, maniable et adaptée aux gravats et encombrants.`,
      chipLabel: `Benne 8 m³ · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne 8m3 ${dept.nom} (${dept.code})`),
      description: `Location benne 8 m³ en ${dept.nom}. Petits chantiers et jardin. Livraison 24 h CORE ENVIRONNEMENT.`,
      h1Line1: `Benne 8 m³ en ${dept.nom} :`,
      h1Line2: "Volume compact & maniable",
      intro: `Besoin d'un volume compact en ${dept.nom} ? La benne 8 m³ CORE ENVIRONNEMENT convient aux petits chantiers et travaux de jardin sur tout le ${dept.code}.`,
      chipLabel: `Benne 8 m³ · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "benne-10m3",
    cities: TOP_8,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne 10m3 ${city.name} — Location 24h`),
      description: `Location benne 10 m³ à ${city.name}. Rénovation et démolition légère. Livraison rapide ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne 10 m³ à ${city.name} :`,
      h1Line2: "Rénovation & démolition",
      intro: `Pour une rénovation à ${city.name}, la benne 10 m³ offre le bon volume. CORE ENVIRONNEMENT livre dans le ${city.dept.nom} (${city.dept.code}) sous 24 h avec suivi digital.`,
      chipLabel: `Benne 10 m³ · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne 10m3 ${dept.nom} (${dept.code})`),
      description: `Louez une benne 10 m³ en ${dept.nom}. Rénovation et chantier. Livraison 24 h CORE ENVIRONNEMENT.`,
      h1Line1: `Benne 10 m³ en ${dept.nom} :`,
      h1Line2: "Volume polyvalent",
      intro: `La benne 10 m³ est le choix polyvalent pour vos chantiers en ${dept.nom}. CORE ENVIRONNEMENT couvre le ${dept.code} avec livraison sous 24 h.`,
      chipLabel: `Benne 10 m³ · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "livraison-24h",
    cities: INNER_10,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne livraison 24h ${city.name}`),
      description: `Location benne livraison 24 h à ${city.name}. Commande en ligne, pose rapide en ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne livraison 24 h à ${city.name} :`,
      h1Line2: "Commande en ligne rapide",
      intro: `Besoin d'une benne en urgence à ${city.name} ? CORE ENVIRONNEMENT garantit une livraison sous 24 h dans le ${city.dept.nom} (${city.dept.code}) : commande en 3 minutes, pose sur votre adresse.`,
      chipLabel: `Livraison 24 h · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne livraison 24h ${dept.nom} (${dept.code})`),
      description: `Location benne livraison 24 h en ${dept.nom}. Intervention rapide sur tout le ${dept.code}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne livraison 24 h en ${dept.nom} :`,
      h1Line2: "Intervention express",
      intro: `CORE ENVIRONNEMENT livre vos bennes sous 24 h dans tout le ${dept.nom} (${dept.code}). Commande en ligne, créneau de pose adapté à votre chantier.`,
      chipLabel: `Livraison 24 h · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "pas-cher",
    cities: TOP_8,
    departments: SUBURB_DEPTS,
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Location benne pas cher ${city.name}`),
      description: `Location benne pas cher à ${city.name}. Tarifs transparents, sans frais cachés. Livraison ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne pas cher à ${city.name} :`,
      h1Line2: "Tarifs transparents en ligne",
      intro: `Vous cherchez une location de benne pas chère à ${city.name} ? CORE ENVIRONNEMENT affiche ses prix en ligne dans le ${city.dept.nom} (${city.dept.code}) : pas de surprise, livraison sous 24 h incluse.`,
      chipLabel: `Pas cher · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne pas cher ${dept.nom} (${dept.code})`),
      description: `Location benne pas cher en ${dept.nom} (${dept.code}). Prix clairs, commande en ligne. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne pas cher en ${dept.nom} :`,
      h1Line2: "Prix affichés en ligne",
      intro: `Comparez et commandez votre benne au meilleur tarif en ${dept.nom}. CORE ENVIRONNEMENT propose des prix transparents sur tout le ${dept.code}, sans frais cachés.`,
      chipLabel: `Pas cher · ${dept.nom}`,
    }),
  },
  {
    slugPrefix: "urgence",
    cities: INNER_10.slice(0, 8),
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Benne urgence ${city.name} — Intervention rapide`),
      description: `Location benne urgence à ${city.name}. Intervention rapide, livraison express ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne urgence à ${city.name} :`,
      h1Line2: "Intervention express",
      intro: `Chantier bloqué à ${city.name} ? CORE ENVIRONNEMENT intervient en urgence dans le ${city.dept.nom} (${city.dept.code}) : benne livrée sous 24 h, commande en ligne même le week-end.`,
      chipLabel: `Urgence · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Benne urgence ${dept.nom} (${dept.code})`),
      description: `Location benne urgence en ${dept.nom}. Intervention express sur le ${dept.code}. CORE ENVIRONNEMENT.`,
      h1Line1: `Benne urgence en ${dept.nom} :`,
      h1Line2: "Livraison express",
      intro: `Besoin urgent d'une benne en ${dept.nom} ? CORE ENVIRONNEMENT priorise votre demande sur tout le ${dept.code} avec livraison sous 24 h.`,
      chipLabel: `Urgence · ${dept.nom}`,
    }),
  },
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
    buildCity: (city) => ({
      nom: city.name,
      title: truncateTitle(`Enlèvement gravats ${city.name} — Chantier`),
      description: `Enlèvement gravats chantier à ${city.name}. Benne livrée, collecte et tri. ${city.dept.nom}. CORE ENVIRONNEMENT.`,
      h1Line1: `Enlèvement gravats chantier à ${city.name} :`,
      h1Line2: "Livraison, collecte & tri",
      intro: `Pour l'enlèvement de gravats sur votre chantier à ${city.name}, CORE ENVIRONNEMENT livre la benne, récupère les déchets inertes et assure le tri en ${city.dept.nom} (${city.dept.code}).`,
      chipLabel: `Enlèvement gravats · ${city.name}`,
    }),
    buildDept: (dept) => ({
      nom: dept.nom,
      title: truncateTitle(`Enlèvement gravats ${dept.nom} (${dept.code})`),
      description: `Enlèvement gravats chantier en ${dept.nom}. Benne, collecte et valorisation. CORE ENVIRONNEMENT.`,
      h1Line1: `Enlèvement gravats en ${dept.nom} :`,
      h1Line2: "Chantier BTP & rénovation",
      intro: `CORE ENVIRONNEMENT gère l'enlèvement de gravats sur vos chantiers en ${dept.nom} (${dept.code}) : livraison benne, rotation et traçabilité jusqu'au centre de tri.`,
      chipLabel: `Enlèvement gravats · ${dept.nom}`,
    }),
  },
]

function buildLongTailPages(): LongTailPage[] {
  const pages: LongTailPage[] = []
  const seenSlugs = new Set<string>()

  for (const template of SERVICE_TEMPLATES) {
    if (template.cities) {
      for (const city of template.cities) {
        const slug = `${template.slugPrefix}-${slugify(city.name)}`
        if (seenSlugs.has(slug)) continue
        seenSlugs.add(slug)

        const content = template.buildCity(city)
        pages.push({
          slug,
          type: "longtail",
          departementCode: city.dept.code,
          departementNom: city.dept.nom,
          departementSlug: city.dept.slug,
          ...content,
        })
      }
    }

    if (template.departments) {
      for (const dept of template.departments) {
        const slug = `${template.slugPrefix}-${dept.slug}`
        if (seenSlugs.has(slug)) continue
        seenSlugs.add(slug)

        const content = template.buildDept(dept)
        pages.push({
          slug,
          type: "longtail",
          departementCode: dept.code,
          departementNom: dept.nom,
          departementSlug: dept.slug,
          ...content,
        })
      }
    }
  }

  return pages
}

export const LONGTAIL_PAGES: LongTailPage[] = buildLongTailPages()

export function getLongTailPageCount(): number {
  return LONGTAIL_PAGES.length
}
