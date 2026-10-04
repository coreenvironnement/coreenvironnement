export type CityOfficialInfo = {
  citySlug: string
  content: string
  summary: string
  sourceTitle: string
  sourceUrl: string
  verifiedAt: "2026-10-04"
}

const PARIS_SOURCE = {
  content:
    "La Ville de Paris indique qu’une benne à gravats installée sur l’espace public relève d’une demande d’emprise de chantier via le service CITE. La règle concerne aussi les particuliers.",
  summary:
    "Si la benne doit être installée sur l’espace public, vérifiez la démarche d’emprise de chantier auprès de la Ville de Paris avant de fixer la pose.",
  sourceTitle: "Ville de Paris — Demande d’emprise sur l’espace public (CITE)",
  sourceUrl: "https://www.paris.fr/pages/demande-d-emprise-sur-l-espace-public-cite-30288",
  verifiedAt: "2026-10-04",
} as const

const PARIS_ARRONDISSEMENT_SLUGS = Array.from(
  { length: 20 },
  (_, index) => `paris-${index + 1}${index === 0 ? "er" : "e"}`,
)

export const CITY_OFFICIAL_INFO: readonly CityOfficialInfo[] = [
  ...PARIS_ARRONDISSEMENT_SLUGS.map((citySlug) => ({
    citySlug,
    ...PARIS_SOURCE,
  })),
  {
    citySlug: "versailles",
    content:
      "La Ville de Versailles précise que l’installation d’une benne à gravats sur le domaine public nécessite une autorisation préalable. La demande doit être formulée au minimum un mois avant la date d’occupation prévue.",
    summary:
      "Si l’emplacement envisagé se trouve sur le domaine public, anticipez la demande d’autorisation auprès de la Ville de Versailles.",
    sourceTitle: "Ville de Versailles — Occupation du domaine public",
    sourceUrl:
      "https://www.versailles.fr/1035/urbanisme-architecture-foncier/urbanisme/occupation-du-domaine-public.htm",
    verifiedAt: "2026-10-04",
  },
  {
    citySlug: "montreuil",
    content:
      "La Ville de Montreuil classe l’installation d’une benne parmi les occupations de l’espace public soumises à autorisation préalable, sous la forme d’un permis de stationnement lorsqu’il n’y a pas d’emprise au sol.",
    summary:
      "Pour une benne prévue sur l’espace public, consultez la démarche d’autorisation de la Ville de Montreuil avant la pose.",
    sourceTitle: "Ville de Montreuil — Stationnement et travaux",
    sourceUrl: "https://www.montreuil.fr/venir-et-se-deplacer/stationnement-parking",
    verifiedAt: "2026-10-04",
  },
  {
    citySlug: "montfort-l-amaury",
    content:
      "La mairie de Montfort-l’Amaury indique que la mise en place d’une benne sur la voie publique nécessite une demande préalable d’occupation du domaine public auprès de la mairie.",
    summary:
      "Si la benne doit occuper la voie publique, effectuez au préalable la démarche indiquée par la mairie de Montfort-l’Amaury.",
    sourceTitle: "Mairie de Montfort-l’Amaury — Urbanisme",
    sourceUrl:
      "https://www.montfortlamaury.fr/services-en-ligne/mes-demarches-en-ligne/urbanisme/",
    verifiedAt: "2026-10-04",
  },
]

const CITY_OFFICIAL_INFO_BY_SLUG = new Map(
  CITY_OFFICIAL_INFO.map((item) => [item.citySlug, item]),
)

export function getCityOfficialInfo(citySlug: string): CityOfficialInfo | undefined {
  return CITY_OFFICIAL_INFO_BY_SLUG.get(citySlug)
}
