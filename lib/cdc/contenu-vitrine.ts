/**
 * Contenu page d'accueil — source : cahier des charges client.
 * Mois 3 : intégration UI. Fichier posé dès maintenant comme référence unique.
 */

export const hero = {
  titre1:
    "Location de Benne en Île-de-France : Intervention 24h & Suivi Digital",
  titre2:
    "CORE ENVIRONNEMENT : Partenaire de vos chantiers. Traçabilité et suivi digital de la première dépose jusqu'au recyclage de vos déchets sur toute l'Île-de-France.",
  cta: "Commander une benne",
  imageAlt:
    "Camion transportant une benne avec Paris et la Tour Eiffel en arrière-plan",
} as const

export const services = [
  {
    titre: "Location de benne déchets non dangereux",
    points: [
      "de 8 m³ à 30 m³",
      "DIB, Gravats, Bois, Végétaux, Plâtres etc.",
      "Intervention en 24h",
      "Commander en 3 minutes",
      "Toute l'Île-de-France",
    ],
  },
  {
    titre: "Accès aux déchetteries professionnelles",
    points: [
      "Tarif unique",
      "5 déchetteries (en cours de développement)",
      "Ouverts de 7h à 15h30",
      "Sans rendez-vous",
      "Contact unique",
    ],
  },
  {
    titre: "Traitement des déchets dangereux",
    points: [
      "Location contenants ADR",
      "Aérosols, Emballages souillés, Huiles noires etc.",
      "Gestion administrative, CAP, trackdéchets",
    ],
  },
  {
    titre: "Opérations sur mesure",
    points: [
      "Débarras de chantier, bureaux, locaux etc.",
      "Mise à disposition de manutentionnaire",
    ],
  },
] as const

export const engagements = [
  {
    titre: "Réactivité et intervention en 24h",
    texte:
      "Une rotation à planifier ou une benne pleine à évacuer en urgence ? Notre service logistique assure une intervention rapide sur vos chantiers en Île-de-France. Pour toute commande passée avant midi, un chauffeur intervient dès le lendemain (hors week-ends et jours fériés) pour garantir la continuité de vos travaux.",
  },
  {
    titre: "Transparence et Suivi digital",
    texte:
      "Fini les appels inutiles pour le suivi de vos collectes. Grâce à votre espace client digital, pilotez votre gestion des déchets 24h/24 : suivez l'avancée de la prestation en temps réel et téléchargez instantanément vos bons d'intervention ainsi que vos bons de pesée certifiés. Une traçabilité numérique totale pour une logistique sans faille.",
  },
  {
    titre: "Conformité et traçabilité",
    texte:
      "La gestion des déchets est parfois lourde. On vous simplifie la vie. On édite vos Bordereaux de Suivi de Déchets (BSD) à la demande. Vous êtes couvert vis-à-vis des contrôles, sans passer des heures dans l'administratif.",
  },
  {
    titre: "+90 % de valorisation et recyclage",
    texte:
      "Ne vous contentez plus d'évacuer vos encombrants, transformez-les en ressources. Nous nous engageons à rediriger plus de 90 % des déchets collectés vers des filières de tri et de valorisation agréées en Île-de-France. Qu'il s'agisse de gravats, bois, métaux ou DIB, nous maximisons le taux de recyclage pour réduire l'empreinte carbone de vos chantiers.",
  },
] as const

export const commentCaFonctionne = {
  titre: "Louez votre benne en 3 minutes chrono",
  intro:
    "CORE ENVIRONNEMENT simplifie vos chantiers. Plus besoin d'attendre un devis : commandez votre benne directement sur notre plateforme sécurisée.",
  particulier: {
    titre: "Vous êtes un particulier",
    accroche: "Louez votre benne en quelques clics, sans stress.",
    etapes: [
      "Flux : Choisissez le type de déchets que vous souhaitez évacuer (DIB, gravats, bois, encombrants, etc.).",
      "Volume : Sélectionnez le volume de la benne adaptée à vos besoins.",
      "Date et Lieu : Indiquez la date et l'adresse d'intervention en Île-de-France",
      "Paiement : Réglez votre forfait via notre interface de paiement 100% sécurisée.",
    ],
    suite:
      "Dès la validation, vous recevez un e-mail de confirmation. Un expert déchets vous rappelle immédiatement pour valider les conditions d'accès et l'horaire de pose et s'occupe de tout le suivi nécessaire jusqu'au recyclage final des déchets",
  },
  professionnel: {
    titre: "Vous êtes un professionnel",
    accroche: "Optimisez la gestion de vos chantiers avec un compte PRO.",
    etapesIntro:
      "Pour bénéficier du paiement différé à 30 jours et d'une facturation centralisée, suivez ces deux étapes :",
    etapesCompte: [
      "Demande de création de compte : Remplissez le formulaire dans votre espace client et joignez vos documents (KBIS de moins de 3 mois et RIB).",
      "Validation sous 24h : Après vérification, votre compte sera activé. Vous recevrez un lien par e-mail pour configurer votre mot de passe et passer vos commandes sur facture.",
    ],
    etapesCommande: [
      "Flux : Choisissez le type de déchets (DIB, gravats, bois, encombrants).",
      "Volume : Sélectionnez la taille de benne adaptée à vos besoins.",
      "Date et Lieu : Indiquez la date et l'adresse d'intervention en Île-de-France",
    ],
    lienClient: "Déjà client ? Identifiez-vous ici",
  },
} as const

export const comptePro = {
  titre: "Devenez Partenaire CORE ENVIRONNEMENT",
  sousTitre:
    "Simplifiez la gestion de vos chantiers avec l'ouverture d'un compte professionnel.",
  description:
    "Bénéficiez de conditions de règlement adaptées (30 jours fin de mois), d'une facturation centralisée et d'un interlocuteur dédié pour l'ensemble de vos chantiers en Île-de-France.",
  abonnement: "35 € HT / mois",
  sections: [
    {
      titre: "Informations Entreprise",
      champs: [
        "Raison Sociale",
        "Numéro SIRET",
        "Code NAF / Activité",
        "Adresse du Siège Social",
      ],
    },
    {
      titre: "Coordonnées de l'interlocuteur",
      champs: [
        "Nom et Prénom",
        "Fonction (Chef de chantier, Acheteur, Gérant...)",
        "Téléphone direct",
        "E-mail professionnel (pour l'envoi des factures et BSD)",
      ],
    },
    {
      titre: "Pièces à joindre (Upload)",
      champs: [
        "Kbis de moins de 3 mois",
        "RIB (Pour les prélèvements ou virements)",
      ],
    },
  ],
  reassurance: {
    titre: "Pourquoi ouvrir un compte pro ?",
    points: [
      "Paiement différé : Réglez vos prestations à 30 jours date de facture.",
      "Priorité logistique : Accès prioritaire sur les rotations de bennes en période de forte activité.",
      "Reporting simplifié : Un récapitulatif mensuel de vos volumes de déchets et de votre taux de valorisation pour vos dossiers RSE/Labels.",
    ],
    footer:
      "Une fois le formulaire soumis, notre service financier étudiera votre demande sous 24h. Vous recevrez une confirmation d'ouverture de compte par e-mail.",
  },
  validationAdmin:
    "Validation manuelle : l'admin active soit « paiement CB obligatoire », soit « paiement sur facture » après analyse du dossier.",
} as const

export const faq = [
  {
    categorie: "Logistique et Délais",
    emoji: "🚚",
    questions: [
      {
        q: "Quels sont vos délais de livraison ?",
        r: "Nous livrons nos bennes sous 24h dans toute l'Île-de-France (selon l'heure de commande et les disponibilités). Pour une urgence ou un créneau horaire précis, contactez-nous directement : nous faisons le maximum pour nous adapter à votre planning.",
      },
      {
        q: "Faut-il une autorisation de la mairie pour poser une benne ?",
        r: "Sur terrain privé : Aucune autorisation n'est nécessaire. Sur la voie publique : Une Autorisation d'Occupation Temporaire (AOT) est obligatoire. Nous pouvons vous accompagner dans vos démarches et vous fournir les informations techniques nécessaires.",
      },
      {
        q: "Combien de temps puis-je garder la benne ?",
        r: "La durée standard est de 7 jours, mais elle peut être prolongée selon vos besoins. Nous proposons aussi des solutions longue durée et des rotations régulières pour les chantiers importants.",
      },
    ],
  },
  {
    categorie: "Recyclage et Traçabilité",
    emoji: "♻️",
    questions: [
      {
        q: "Que deviennent les déchets une fois récupérés ?",
        r: "Ils sont acheminés vers le centre de tri agréé le plus proche de votre chantier en Île-de-France. Ils sont triés par catégorie, puis réinjectés dans des filières de valorisation. CORE ENVIRONNEMENT garantit un taux de recyclage minimum de 90%.",
      },
      {
        q: "Fournissez-vous des documents de traçabilité ?",
        r: "Oui. Tous les documents réglementaires (BSD, bons de pesée, bons d'intervention) sont fournis. Pour les clients PRO, ils sont disponibles 24h/24 en libre-service via votre espace client digital.",
      },
    ],
  },
  {
    categorie: "Guide de Commande et Zones",
    emoji: "📏",
    questions: [
      {
        q: "Quelles sont vos zones d'intervention ?",
        r: "Nous intervenons dans toute l'Île-de-France : Paris (75), Seine-et-Marne (77), Yvelines (78), Essonne (91), Hauts-de-Seine (92), Seine-Saint-Denis (93), Val-de-Marne (94) et Val-d'Oise (95).",
      },
      {
        q: "Comment choisir la bonne taille de benne ?",
        r: "Gravats (Terre, béton, tuiles) : Bennes de 8 m³ ou 10 m³ maximum (pour garantir le levage en toute sécurité). DIB & Encombrants : 8 m³ (petit débarras), 15 à 20 m³ (rénovation complète), 30 m³ (gros volumes légers).",
      },
      {
        q: "Quels déchets sont strictement interdits ?",
        r: "L'amiante, les produits chimiques, solvants, peintures, batteries, bouteilles de gaz et pneus sont interdits dans les bennes classiques. Contactez-nous pour une prise en charge spécifique de ces déchets dangereux.",
      },
    ],
  },
  {
    categorie: "Paiement et Compte PRO",
    emoji: "💳",
    questions: [
      {
        q: "Quelles sont les modalités de paiement ?",
        r: "Particuliers : Paiement sécurisé par carte bancaire lors de la commande en ligne. Professionnels : Paiement à la commande ou règlement différé à 30 jours (après validation de votre compte pro par notre service financier).",
      },
      {
        q: "Comment ouvrir un compte professionnel ?",
        r: "Remplissez le formulaire d'inscription pro et joignez votre KBIS et RIB. Votre compte est généralement validé sous 24h, vous donnant accès au paiement sur facture et à votre espace de gestion personnalisé.",
      },
    ],
  },
  {
    categorie: "Préparation et Accès",
    emoji: "🛠️",
    questions: [
      {
        q: "Quelles sont les dimensions du camion et l'espace nécessaire ?",
        r: "Nos camions nécessitent un passage d'environ 3 mètres de large et 4 mètres de hauteur. Pour la pose, prévoyez un espace dégagé de 10 à 12 mètres de long. En cas de doute (rue étroite, porche), nos experts font le point avec vous avant l'intervention.",
      },
      {
        q: "Dois-je être présent lors de la pose ou du retrait ?",
        r: "Ce n'est pas obligatoire si l'accès est libre. Cependant, il est fortement conseillé qu'un contact sur place soit joignable par téléphone pour guider le chauffeur et valider la pose.",
      },
      {
        q: 'Peut-on charger la benne au-dessus du bord (le "dôme") ?',
        r: "Non. Pour des raisons de sécurité routière, les déchets ne doivent pas dépasser les bords de la benne (chargement à ras). Un débordement peut entraîner un refus d'enlèvement ou des frais de remise en conformité.",
      },
    ],
  },
  {
    categorie: "Tarification et Imprévus",
    emoji: "💰",
    questions: [
      {
        q: "Qu'est-ce qui est inclus dans le prix du forfait ?",
        r: "La transparence est totale : la mise à disposition de la benne, le transport (pose/retrait), le traitement des déchets en centre agréé et l'édition des documents réglementaires (BSD).",
      },
      {
        q: "Y a-t-il des frais supplémentaires pour le poids ?",
        r: "Pour les bennes DIB, un poids limite est défini. Tout tonnage supplémentaire constaté lors de la pesée officielle est facturé au prorata. Pour les gravats propres, le prix est généralement fixe quel que soit le poids.",
      },
      {
        q: "Puis-je modifier ou annuler ma commande ?",
        r: "Oui, sans frais jusqu'à 24h avant l'intervention (jour ouvré). Passé ce délai, si le camion est déjà en route, des frais de déplacement à vide pourront être appliqués.",
      },
    ],
  },
  {
    categorie: "Expertise et Services Plus",
    emoji: "💼",
    questions: [
      {
        q: "Que se passe-t-il si je mélange des déchets interdits ?",
        r: "Le tri est essentiel. Si des polluants (amiante, peinture, pneus) sont découverts en centre de tri, des frais de dépollution importants seront appliqués. En cas de doute, demandez-nous conseil avant de charger !",
      },
      {
        q: "Proposez-vous des bennes spécifiques (portes, chaînes) ?",
        r: "Oui, nous pouvons fournir des bennes avec portes arrière pour faciliter le chargement à la brouette ou des modèles pour accès étroits. Précisez-le lors de votre commande.",
      },
      {
        q: "Pouvez-vous gérer plusieurs chantiers simultanément ?",
        r: "Absolument. Votre espace client pro vous permet de piloter plusieurs chantiers en parallèle avec une facturation distincte par chantier ou par code affaire.",
      },
    ],
  },
] as const

export const espaceClient = {
  abonnement: "35 € HT / mois",
  connexion: "Adresse e-mail + mot de passe",
  dashboardVide:
    "Le client arrive sur un dashboard vide et choisit son chantier dans une barre de sélection.",
  reglesAcces:
    "Un email peut être lié à plusieurs chantiers. Un chantier peut être géré par plusieurs emails. L'admin crée ces liens.",
  apresSelection: [
    "Diagramme : tonnage et % par typologie de déchets",
    "Camemberts : % valorisation et % élimination",
    "Bouton vers l'historique des prestations (export Excel/PDF — Mois 2)",
  ],
} as const
