/**
 * Contenus légaux — placeholders à compléter par le client (SIRET, adresse, hébergeur…).
 */

export const LEGAL_COMPANY = {
  name: "CORE ENVIRONNEMENT",
  /** À compléter par le client */
  legalForm: "[Forme juridique à compléter]",
  address: "[Adresse du siège social à compléter]",
  siret: "[SIRET à compléter]",
  rcs: "[RCS à compléter]",
  tva: "[N° TVA intracommunautaire à compléter]",
  director: "[Nom du directeur de publication à compléter]",
  email: "[contact@coreenvironnement.fr à compléter]",
  host: "[Nom et adresse de l'hébergeur à compléter]",
} as const

export const mentionsLegalesSections = [
  {
    title: "Éditeur du site",
    paragraphs: [
      `Le site est édité par ${LEGAL_COMPANY.name}, ${LEGAL_COMPANY.legalForm}.`,
      `Siège social : ${LEGAL_COMPANY.address}.`,
      `SIRET : ${LEGAL_COMPANY.siret} — RCS : ${LEGAL_COMPANY.rcs}.`,
      `N° TVA intracommunautaire : ${LEGAL_COMPANY.tva}.`,
      `Directeur de la publication : ${LEGAL_COMPANY.director}.`,
      `Contact : ${LEGAL_COMPANY.email}.`,
    ],
  },
  {
    title: "Hébergement",
    paragraphs: [
      `Le site est hébergé par ${LEGAL_COMPANY.host}.`,
    ],
  },
  {
    title: "Propriété intellectuelle",
    paragraphs: [
      "L'ensemble des éléments du site (textes, visuels, logo, structure) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation sans autorisation préalable est interdite.",
    ],
  },
  {
    title: "Responsabilité",
    paragraphs: [
      `${LEGAL_COMPANY.name} s'efforce d'assurer l'exactitude des informations publiées. Toutefois, l'éditeur ne saurait être tenu responsable des erreurs, omissions ou indisponibilités temporaires du service.`,
    ],
  },
] as const

export const politiqueConfidentialiteSections = [
  {
    title: "Responsable du traitement",
    paragraphs: [
      `${LEGAL_COMPANY.name}, ${LEGAL_COMPANY.address}.`,
      `Contact données personnelles : ${LEGAL_COMPANY.email}.`,
    ],
  },
  {
    title: "Données collectées",
    paragraphs: [
      "Dans le cadre de la location de bennes et de l'espace client, nous pouvons collecter : identité, coordonnées, informations de commande, documents professionnels (KBIS, RIB) pour les comptes pro, et données de connexion.",
    ],
  },
  {
    title: "Finalités et bases légales",
    paragraphs: [
      "Les données sont traitées pour la gestion des commandes, la facturation, le suivi des prestations, la traçabilité des déchets et l'accès à l'espace client. Les bases légales incluent l'exécution du contrat, les obligations légales et, le cas échéant, votre consentement.",
    ],
  },
  {
    title: "Durée de conservation",
    paragraphs: [
      "Les données sont conservées pendant la durée nécessaire à la relation commerciale et aux obligations légales applicables (comptabilité, traçabilité des déchets, etc.).",
    ],
  },
  {
    title: "Vos droits",
    paragraphs: [
      "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité. Vous pouvez introduire une réclamation auprès de la CNIL.",
    ],
  },
  {
    title: "Cookies",
    paragraphs: [
      "Le site peut utiliser des cookies strictement nécessaires au fonctionnement (session, sécurité). Toute mesure d'audience ou cookie non essentiel fera l'objet d'un consentement préalable lorsque requis.",
    ],
  },
] as const
