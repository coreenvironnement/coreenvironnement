/**
 * Contenu page d'accueil — source : cahier des charges client.
 * Mois 3 : intégration UI. Fichier posé dès maintenant comme référence unique.
 */

export const hero = {
  titre1Ligne1: "Location de Benne en Île-de-France :",
  titre1Ligne2: "Intervention 24h & Suivi Digital",
  titre2:
    "Commandez votre benne en ligne. Le prix s'affiche avant le paiement, puis un e-mail confirme la demande et un rappel cale la pose.",
  cta: "Commander une benne",
  imageAlt:
    "Camion transportant une benne avec Paris et la Tour Eiffel en arrière-plan",
} as const

export const servicesSection = {
  intro:
    "De la mise à disposition d'une benne au traitement de déchets spécifiques, CORE ENVIRONNEMENT simplifie la gestion de vos déchets avec un interlocuteur unique en Île-de-France.",
} as const

export const services = [
  {
    titre: "Location de benne déchets non dangereux",
    accroche:
      "Mise à disposition et enlèvement, avec un interlocuteur unique de la première dépose jusqu'au traitement.",
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
    accroche:
      "Un accès simple à un réseau de centres professionnels, sans rendez-vous, avec un tarif unique et un contact unique.",
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
    accroche:
      "Collecte, conditionnement et traitement sécurisés, avec conformité administrative et traçabilité exigées.",
    points: [
      "Location contenants ADR",
      "Aérosols, Emballages souillés, Huiles noires etc.",
      "Gestion administrative, CAP, trackdéchets",
    ],
  },
  {
    titre: "Opérations sur mesure",
    accroche:
      "Des interventions calibrées à vos contraintes de site, d'équipe et de planning — au-delà de la simple benne.",
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
    titre: "Transparence et suivi de la commande",
    texte:
      "Après la commande, vous recevez un e-mail de confirmation. Un membre de l'équipe vous rappelle pour caler la pose et reste votre interlocuteur jusqu'à l'enlèvement. Les documents de traçabilité sont transmis lorsqu'ils sont disponibles.",
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
        r: "Oui. Les documents réglementaires (BSD, bons de pesée, bons d'intervention) sont transmis par l'équipe lorsqu'ils sont disponibles. Le téléchargement en libre-service n'est pas encore ouvert.",
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
    categorie: "Prix et commande en ligne",
    emoji: "💶",
    questions: [
      {
        q: "Combien coûte une benne 8 m³ en Île-de-France ?",
        r: "Le forfait le plus accessible est la benne 8 m³ gravats propres : dès 330 € HT, soit 396 € TTC pour un particulier. Les autres volumes et types de déchets sont plus élevés. Le montant exact s'affiche dans le tunnel avant validation.",
      },
      {
        q: "Faut-il téléphoner pour connaître le prix ?",
        r: "Non. Indiquez votre adresse et votre type de déchet en ligne : le tarif du forfait choisi s'affiche avant le paiement. Vous pouvez appeler si vous préférez être accompagné.",
      },
      {
        q: "En combien de temps puis-je obtenir un tarif ?",
        r: "En quelques minutes : profil, adresse, type de déchet, choix de la benne, puis récapitulatif. La commande complète est pensée pour rester courte.",
      },
    ],
  },
  {
    categorie: "Paiement et offre PRO",
    emoji: "💳",
    questions: [
      {
        q: "Quelles sont les modalités de paiement ?",
        r: "Aujourd'hui, la commande en ligne se règle par carte bancaire de façon sécurisée. L'espace professionnel (facturation centralisée, règlement différé) n'est pas encore ouvert : les entreprises peuvent laisser leurs coordonnées sur /pro pour être recontactées au lancement, sans création de compte.",
      },
      {
        q: "Comment rejoindre l'offre professionnelle ?",
        r: "L'espace PRO est en pré-lancement : aucun compte n'est créé pour le moment, et aucun KBIS n'est demandé. Déposez simplement les coordonnées de votre entreprise sur la page /pro ; nous vous prévenons dès l'ouverture.",
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
        q: "Qu'est-ce qui est inclus dans le prix ?",
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
        r: "Oui. Un interlocuteur peut suivre plusieurs adresses. L'espace en ligne pour les piloter soi-même n'est pas encore ouvert.",
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

/** Parcours particulier — accueil court (hero inchangé). */
export const particulierAccueil = {
  parcours: {
    eyebrow: "Comment ça se passe",
    titre: "On livre la benne, vous remplissez, on évacue pour vous",
    intro:
      "Ce n’est pas seulement une « location » : un chauffeur pose la benne chez vous, vous chargez vos déchets autorisés, puis nous repassons pour l’enlèvement et le traitement en centre agréé.",
    etapes: [
      {
        num: "01",
        titre: "Vous commandez en ligne",
        texte:
          "Adresse, type de déchet, volume (notre estimateur vous aide), benne et paiement. Le tarif s’affiche avant de valider.",
      },
      {
        num: "02",
        titre: "Un chauffeur pose la benne",
        texte:
          "Livraison à l’adresse indiquée. Nous vous rappelons si besoin pour caler la pose et vérifier l’accès.",
      },
      {
        num: "03",
        titre: "Vous remplissez",
        texte:
          "Gravats, encombrants ou déchets autorisés pour le forfait choisi — sans dépasser le bord de la benne.",
      },
      {
        num: "04",
        titre: "On enlève et on traite",
        texte:
          "Le chauffeur repart avec la benne. CORE ENVIRONNEMENT assure l’évacuation et le traitement : pas de trajet déchetterie pour vous.",
      },
    ],
  },
  conseils: {
    eyebrow: "Avant de commander",
    titre: "Conseils pratiques",
    cartes: [
      {
        id: "volume",
        titre: "Quel volume de benne ?",
        texte:
          "Estimez l’espace occupé (longueur × largeur × hauteur en mètres). Gravats et terre : le poids compte autant que le volume.",
        cta: "Utiliser l’estimateur dans la commande",
        ctaHint:
          "Après l’adresse et le type de déchet, l’outil vous propose une capacité indicative (sans garantie).",
      },
      {
        id: "voie-publique",
        titre: "Benne dans la rue ou sur le trottoir ?",
        texte:
          "Sur voie publique, une autorisation mairie (AOT) peut être obligatoire. Déposer des déchets sans benne ou en dehors du cadre légal expose à des amendes et des nuisances pour le voisinage.",
      },
      {
        id: "tri",
        titre: "Que mettre dans la benne ?",
        texte:
          "Respectez le type de déchet choisi à la commande (pas de mélange interdit, pas de produits dangereux). En cas de doute, appelez-nous avant de charger.",
      },
    ],
  },
  faqTitre: "Questions fréquentes",
  faqIntro: "Les réponses essentielles avant de commander en ligne.",
  switchPro: {
    label: "Vous gérez des chantiers ou des volumes réguliers ?",
    href: "/professionnels",
    link: "Découvrir l’offre professionnelle",
  },
  switchParticulier: {
    label: "Particulier : commande en ligne en quelques minutes",
    href: "/",
    link: "Retour à l’accueil particulier",
  },
} as const

/** FAQ courte affichée sur l’accueil particulier (pas de jargon pro). */
export const particulierFaq = [
  {
    q: "Quels sont vos délais de livraison ?",
    r: "Livraison possible sous 24 h en Île-de-France selon l’heure de commande et les disponibilités. Un rappel téléphonique peut caler la pose avec le chauffeur.",
  },
  {
    q: "Combien coûte une benne pour un particulier ?",
    r: "Le tarif dépend de l’adresse, du type de déchet et du volume. Le montant TTC s’affiche dans le tunnel avant le paiement (ex. gravats propres 8 m³ dès 396 € TTC).",
  },
  {
    q: "Faut-il téléphoner pour commander ?",
    r: "Non : vous pouvez tout faire en ligne. Le téléphone reste disponible si vous préférez être guidé.",
  },
  {
    q: "Comment choisir la taille de la benne ?",
    r: "Dans la commande, après le type de déchet, utilisez l’estimateur de volume ou indiquez la capacité si vous la connaissez déjà. Prévoyez une petite marge.",
  },
  {
    q: "Que se passe-t-il après le paiement ?",
    r: "Vous recevez un e-mail de confirmation. L’équipe vous rappelle pour confirmer l’accès et l’horaire de pose. Le chauffeur livre, puis repasse pour l’enlèvement une fois la benne remplie.",
  },
  {
    q: "Quels déchets sont interdits ?",
    r: "Amiante, produits chimiques, peintures liquides, batteries, gaz, pneus, etc. Ils ne vont pas dans une benne classique. Demandez-nous conseil en cas de doute.",
  },
  {
    q: "Dois-je être présent quand le chauffeur arrive ?",
    r: "Ce n’est pas obligatoire si l’accès est libre, mais un contact joignable par téléphone est recommandé pour guider la pose.",
  },
  {
    q: "Peut-on dépasser le bord de la benne ?",
    r: "Non : pour la sécurité, le chargement doit rester à ras bord. Un débordement peut entraîner un refus d’enlèvement ou des frais supplémentaires.",
  },
] as const

export const professionnelsPage = {
  eyebrow: "Professionnels",
  titre: "Location de benne et gestion des déchets pour vos chantiers",
  intro:
    "Services, volumes, conformité et suivi : l’offre CORE ENVIRONNEMENT pour les entreprises et artisans en Île-de-France. Commande en ligne sans paiement immédiat ou espace pro en préparation.",
} as const

export const finalCta = {
  eyebrow: "Votre chantier, notre priorité",
  titre: "Besoin d'une benne",
  titreSuite: "en Île-de-France ?",
  description:
    "Commandez votre benne en quelques minutes et laissez CORE ENVIRONNEMENT coordonner la suite, de la dépose jusqu'au traitement de vos déchets.",
  ctaPrimary: "Commander une benne",
  ctaSecondary: "Nous contacter",
  reassurance: [
    "Intervention sous 24h*",
    "E-mail de confirmation",
    "Traçabilité",
    "Toute l'Île-de-France",
  ],
  footnote: "*Selon disponibilités, hors week-ends et jours fériés.",
  journey: ["Commande", "Livraison", "Collecte", "Valorisation"],
  journeyTagline: "De la commande à la valorisation, un seul interlocuteur.",
} as const

export const espaceClientVitrine = {
  eyebrow: "Bientôt disponible",
  titre: "Le suivi en ligne arrive.",
  titreSuite: "Aujourd'hui, on vous rappelle.",
  description:
    "La commande est confirmée par e-mail. Un membre de l'équipe cale la pose avec vous. L'espace pour consulter les interventions et les documents n'est pas encore ouvert.",
  benefits: [
    "E-mail de confirmation",
    "Rappel pour la pose",
    "Documents transmis par l'équipe",
  ],
  reassurance: "L'aperçu à droite est illustratif. L'accès client n'est pas ouvert.",
  ctaPrimary: "Espace client — bientôt disponible",
  ctaSecondary: "Appeler",
} as const
