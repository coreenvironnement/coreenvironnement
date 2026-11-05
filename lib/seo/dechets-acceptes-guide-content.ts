/** Titre document exact (sans suffixe automatique). */
export const DECHETS_ACCEPTES_GUIDE_TITLE =
  "Déchets acceptés dans une benne : guide | CORE Environnement"

export const DECHETS_ACCEPTES_GUIDE_DESCRIPTION =
  "Gravats, terre, bois, plâtre, encombrants : découvrez les points à vérifier avant de remplir votre benne et les déchets nécessitant une collecte spécifique."

export const DECHETS_ACCEPTES_GUIDE_INTRO =
  "Vous préparez une rénovation, des travaux ou un débarras ? Identifier vos déchets avant de réserver vous aide à choisir la bonne offre et à préparer le chargement. Retrouvez les points à vérifier pour vos gravats, votre terre, vos encombrants et les autres matériaux à évacuer."

export const DECHETS_ACCEPTES_GUIDE_CALLOUT =
  "La règle à retenir : déposez uniquement les déchets acceptés dans l’offre choisie lors de votre commande. Une benne pour gravats propres et une benne pour déchets mélangés ne se remplissent pas de la même façon."

export const DECHETS_ACCEPTES_GUIDE_TOC = [
  { href: "#identifier-dechets", label: "Identifier mes déchets" },
  {
    href: "#collecte-specifique",
    label: "Repérer les déchets à collecter séparément",
  },
  { href: "#preparer-chargement", label: "Préparer le chargement" },
  { href: "#conseil-dechets", label: "Demander conseil avant de réserver" },
] as const

export const DECHETS_ACCEPTES_GUIDE_TABLE_ROWS = [
  {
    category: "Gravats",
    examples: "Béton, briques, tuiles, carrelage",
    verify:
      "Vérifiez les matériaux acceptés dans l’offre « gravats propres ». N’y ajoutez pas automatiquement du plâtre, du bois ou des emballages.",
  },
  {
    category: "Terre et cailloux",
    examples: "Terre issue de travaux, pierres, cailloux",
    verify:
      "Choisissez une offre qui accepte explicitement ces matériaux. La terre n’est pas automatiquement admise avec tous les gravats.",
  },
  {
    category: "Bois",
    examples: "Planches, palettes, éléments de mobilier",
    verify:
      "Vérifiez les types de bois acceptés. Signalez tout bois traité ou susceptible de contenir des substances dangereuses.",
  },
  {
    category: "Emballages",
    examples: "Cartons, films et emballages plastiques",
    verify:
      "Vérifiez qu’ils sont acceptés dans l’offre. Gardez à part les emballages de produits chimiques.",
  },
  {
    category: "Encombrants",
    examples: "Meubles et objets issus d’un débarras",
    verify:
      "Vérifiez les objets acceptés. Les appareils électriques, les piles et les batteries nécessitent une collecte séparée.",
  },
  {
    category: "Plâtre et isolants",
    examples: "Plaques de plâtre, chutes d’isolants",
    verify:
      "Faites confirmer leur acceptation avant de commander. Ne les ajoutez pas automatiquement aux gravats propres.",
  },
  {
    category: "Déchets verts",
    examples: "Branches, tailles de haies, végétaux",
    verify:
      "Vérifiez que l’offre accepte les déchets verts. Ne les mélangez pas à d’autres matériaux sans confirmation.",
  },
] as const

export const DECHETS_ACCEPTES_COLLECTE_LIST = [
  "Les matériaux contenant de l’amiante ou suspectés d’en contenir.",
  "Les restes de peintures, solvants, décapants et autres produits chimiques.",
  "Les emballages de produits chimiques, même vides ou souillés.",
  "Les piles et les batteries.",
  "Les appareils électriques et électroniques : réfrigérateur, lave-linge, téléviseur, ordinateur ou outillage électrique.",
] as const

export const DECHETS_ACCEPTES_CHARGEMENT_STEPS = [
  {
    title: "Regroupez les déchets prévus dans votre commande",
    text: "Préparez les matériaux correspondant à l’offre choisie et gardez les autres à part. Cela vous permet de remplir la benne plus simplement le jour de la livraison.",
  },
  {
    title: "Vérifiez avant d’ajouter un autre matériau",
    text: "Si vous découvrez du plâtre, un isolant ou un objet que vous n’aviez pas prévu d’évacuer, consultez les déchets acceptés dans votre offre. En cas de doute, contactez-nous avant de le charger.",
  },
  {
    title: "Respectez le volume et le poids autorisés",
    text: "Ne dépassez pas le haut des parois et respectez la limite de poids indiquée pour votre benne. Pour les gravats et la terre, le poids peut limiter le chargement avant que toute la place disponible soit utilisée.",
  },
] as const

export const DECHETS_ACCEPTES_ADEME_AMIANTE_HREF =
  "https://quefairedemesdechets.ademe.fr/dechet/amiante/"
export const DECHETS_ACCEPTES_ADEME_COLLECTE_HREF =
  "https://quefairedemesdechets.ademe.fr/"
export const DECHETS_ACCEPTES_VOLUME_GUIDE_HREF = "/location-benne/volume"
export const DECHETS_ACCEPTES_ORDER_CTA_HREF = "https://core-environnement.fr/#parcours"
export const DECHETS_ACCEPTES_PHONE_DISPLAY = "07 53 70 57 27"
export const DECHETS_ACCEPTES_PHONE_HREF = "tel:+33753705727"
