/**
 * Mentions légales — informations d'identification de CORE ENVIRONNEMENT.
 */

import { SITE_PHONE_DISPLAY } from "@/lib/site"

export const LEGAL_COMPANY = {
  name: "CORE ENVIRONNEMENT",
  legalForm: "SASU (société par actions simplifiée unipersonnelle)",
  address: "129 boulevard Robert Ballanger, 93420 Villepinte",
  siren: "101 465 839",
  siret: "101 465 839 00013",
  rcs: "101 465 839 R.C.S. Bobigny",
  rcsNote: "inscrite au greffe de Bobigny le 23/02/2026",
  tva: "FR83101465839",
  capital: "1 000,00 €",
  naf: "82.99Z — Autres activités de soutien aux entreprises n.c.a.",
  director: "le président de CORE ENVIRONNEMENT",
  email: "contact@coreenvironnement.fr",
  phone: SITE_PHONE_DISPLAY,
  host: "Vercel Inc., 440 Terry Avenue North, Seattle, WA 98109, États-Unis (https://vercel.com)",
} as const

export const mentionsLegalesSections = [
  {
    title: "Éditeur du site",
    paragraphs: [
      `Le site est édité par ${LEGAL_COMPANY.name}, ${LEGAL_COMPANY.legalForm}.`,
      `Siège social : ${LEGAL_COMPANY.address}.`,
      `SIREN : ${LEGAL_COMPANY.siren}.`,
      `SIRET : ${LEGAL_COMPANY.siret}.`,
      `RCS : ${LEGAL_COMPANY.rcs} (${LEGAL_COMPANY.rcsNote}).`,
      `N° TVA intracommunautaire : ${LEGAL_COMPANY.tva}.`,
      `Capital social : ${LEGAL_COMPANY.capital}.`,
      `Code NAF / APE : ${LEGAL_COMPANY.naf}`,
      `Directeur de la publication : ${LEGAL_COMPANY.director}.`,
      `Contact : ${LEGAL_COMPANY.email} — ${LEGAL_COMPANY.phone}.`,
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

/** Conditions Générales de Vente officielles — texte fourni par le client, sans modification de fond. */
export const cgvSections = [
  {
    title: "ARTICLE\u00A01 – IDENTIFICATION DE LA SOCIÉTÉ",
    paragraphs: [
      "La société CORE ENVIRONNEMENT, société par actions simplifiée au capital de 1\u00A0000\u00A0euros, immatriculée au Registre du Commerce et des Sociétés de Bobigny sous le numéro 101\u00A0465\u00A0839, dont le siège social est situé 129\u00A0Boulevard Robert Ballanger, 93420\u00A0Villepinte, exerce une activité de mise en relation, de coordination et d’organisation de prestations de collecte, de transport, de tri, de traitement et de valorisation de déchets réalisées par des opérateurs tiers dûment habilités, ci-après désignés les «\u00A0Prestataires\u00A0».",
    ],
  },
  {
    title: "ARTICLE\u00A02 – OBJET",
    paragraphs: [
      "Les présentes Conditions Générales de Vente ont pour objet de définir les conditions dans lesquelles CORE ENVIRONNEMENT organise, pour le compte de ses Clients, des prestations de gestion de déchets réalisées par des Prestataires partenaires.",
      "CORE ENVIRONNEMENT intervient exclusivement en qualité d’intermédiaire organisateur. Elle ne réalise aucune mission de collecte, de transport, de tri, de traitement ou de valorisation en son nom propre et ne devient à aucun moment propriétaire, détenteur, transporteur ou exploitant des déchets concernés.",
    ],
  },
  {
    title: "ARTICLE\u00A03 – ACCEPTATION DES CONDITIONS GÉNÉRALES",
    paragraphs: [
      "Toute commande de prestation implique l’acceptation pleine et entière des présentes Conditions Générales de Vente par le Client, sans restriction ni réserve. Cette acceptation intervient notamment lors de la signature d’un devis, de la validation d’une commande ou du règlement d’une prestation.",
      "CORE ENVIRONNEMENT est tenue à une obligation de moyens dans l’organisation des prestations confiées.",
    ],
  },
  {
    title: "ARTICLE\u00A04 – PROCESSUS DE COMMANDE",
    paragraphs: [
      "Afin de permettre la bonne organisation des prestations, le Client s’engage à transmettre à CORE ENVIRONNEMENT l’ensemble des informations nécessaires à l’exécution de la prestation, notamment celles relatives à son identité, aux coordonnées de facturation, à la nature des déchets concernés, à leur volume estimé, aux contraintes techniques et d’accès du site d’intervention ainsi qu’à la date souhaitée de réalisation.",
      "Le Client garantit l’exactitude, la sincérité et l’exhaustivité des informations communiquées. Ces éléments constituent la base sur laquelle CORE ENVIRONNEMENT organise la prestation auprès d’un Prestataire.",
      "Toute erreur, omission ou imprécision dans les informations fournies pourra entraîner une adaptation des conditions d’intervention ou une facturation complémentaire si cela engendre des contraintes techniques, logistiques ou réglementaires particulières.",
      "La commande est réputée ferme et définitive à compter de la validation du devis, du paiement de la prestation, de la validation des modalités de règlement ou de la mise en place d’une garantie de paiement.",
      "CORE ENVIRONNEMENT se réserve le droit de refuser ou d’adapter l’organisation d’une prestation lorsque les informations communiquées par le Client sont manifestement insuffisantes, inexactes ou incompatibles avec les conditions normales d’intervention.",
    ],
  },
  {
    title: "ARTICLE\u00A05 – NATURE DES PRESTATIONS ORGANISÉES",
    paragraphs: [
      "CORE ENVIRONNEMENT organise, pour le compte du Client, des prestations de gestion de déchets réalisées par des Prestataires tiers habilités, en fonction des besoins exprimés par le Client et des informations communiquées lors de la commande.",
      "Ces prestations peuvent comprendre la mise à disposition temporaire de contenants destinés à recevoir les déchets, leur livraison sur le site indiqué par le Client, leur enlèvement après remplissage ainsi que leur transport vers une installation adaptée en vue de leur traitement ou de leur valorisation. La durée de mise à disposition du contenant est définie lors de la commande et doit être respectée par le Client.",
      "Les prestations peuvent également consister en l’organisation de l’admission des déchets dans un centre de tri ou de traitement, auquel cas CORE ENVIRONNEMENT organise uniquement la réception et le traitement des déchets par le Prestataire, le transport et le déchargement demeurant à la charge du Client.",
      "Les modalités d’exécution des prestations, notamment les délais d’intervention, les contraintes techniques et les conditions d’accès, dépendent des disponibilités et des capacités opérationnelles des Prestataires. CORE ENVIRONNEMENT ne saurait garantir un créneau horaire précis d’intervention.",
    ],
  },
  {
    title: "ARTICLE\u00A06 – CONFORMITÉ DES DÉCHETS",
    paragraphs: [
      "Le Client s’engage à déclarer de manière précise et complète la nature des déchets confiés, leur composition, leur volume ainsi que toute caractéristique susceptible d’avoir une incidence sur leur collecte, leur transport ou leur traitement.",
      "Le Client garantit que les déchets remis correspondent strictement à ceux déclarés lors de la commande et qu’ils sont conformes à la réglementation en vigueur.",
      "La présence de déchets non déclarés ou incompatibles avec la filière prévue, notamment des déchets liquides, dangereux, explosifs, radioactifs, toxiques ou issus d’activités de soins, pourra entraîner un refus de prise en charge, un déclassement, une réorientation vers une filière adaptée ou la mise en œuvre de procédures spécifiques.",
      "Dans une telle hypothèse, les coûts supplémentaires engendrés par la gestion de ces déchets, y compris les frais de transport, de tri, de traitement ou d’immobilisation, seront intégralement supportés par le Client.",
    ],
  },
  {
    title: "ARTICLE\u00A07 – RESPONSABILITÉ DU CLIENT",
    paragraphs: [
      "Le Client demeure, en sa qualité de producteur ou détenteur des déchets, responsable de ceux-ci jusqu’à leur élimination ou valorisation finale, conformément aux dispositions du Code de l’environnement.",
      "À ce titre, le Client garantit que les déchets confiés sont conformes à la réglementation applicable, correctement identifiés et conditionnés, et qu’ils ne présentent aucun risque particulier non déclaré susceptible d’affecter les conditions de collecte, de transport ou de traitement.",
      "Le Client est seul responsable des conséquences résultant d’une déclaration inexacte, incomplète ou erronée relative à la nature ou aux caractéristiques des déchets remis.",
      "Le Client s’engage également à respecter l’ensemble des obligations réglementaires applicables en matière de stockage temporaire, d’accès au site et de préparation des déchets en vue de leur prise en charge.",
      "Toute conséquence, notamment technique, financière ou réglementaire, résultant d’un manquement du Client à ses obligations restera à sa charge.",
    ],
  },
  {
    title: "ARTICLE\u00A08 – ACCESSIBILITÉ ET CONDITIONS DU SITE",
    paragraphs: [
      "Le Client s’engage à garantir des conditions d’accès au site permettant l’intervention du Prestataire dans des conditions normales de sécurité et d’exploitation. À ce titre, il lui appartient de s’assurer que les voies d’accès sont dégagées, praticables et compatibles avec les contraintes techniques des véhicules et équipements nécessaires à la réalisation de la prestation.",
      "Le Client doit également veiller à obtenir l’ensemble des autorisations administratives requises, notamment en cas d’occupation du domaine public, et à mettre en place, le cas échéant, toute signalisation ou mesure de sécurité nécessaire.",
      "Le Client est seul responsable des conditions de stockage temporaire des déchets ainsi que du respect de la réglementation applicable en la matière.",
      "Toute impossibilité d’intervention imputable au Client, notamment en raison d’un défaut d’accès, d’une absence d’autorisation, d’un site non préparé ou de conditions de sécurité insuffisantes, pourra entraîner l’application de frais complémentaires, incluant notamment des frais de passage à vide correspondant à la mobilisation inutile des moyens du Prestataire.",
      "CORE ENVIRONNEMENT ne pourra être tenue responsable d’une impossibilité d’intervention liée aux conditions du site.",
    ],
  },
  {
    title: "ARTICLE\u00A09 – GARDE DES CONTENANTS",
    paragraphs: [
      "Dès leur mise à disposition sur le site du Client, les contenants restent sous la garde de ce dernier, qui en assume la responsabilité jusqu’à leur enlèvement par le Prestataire.",
      "Le Client s’engage à utiliser les contenants conformément à leur destination et à en assurer la conservation dans des conditions normales d’utilisation et de sécurité.",
      "En cas de détérioration, de destruction, de perte ou de vol du contenant survenu pendant la période de mise à disposition, le Client en supportera les conséquences financières. Les frais de réparation ou de remplacement du contenant endommagé, ainsi que tout coût lié à son immobilisation ou à son indisponibilité, pourront être facturés au Client.",
    ],
  },
  {
    title: "ARTICLE\u00A010 – ALÉAS D’EXPLOITATION",
    paragraphs: [
      "Tout événement rendant l’exécution de la prestation impossible, incomplète ou plus complexe que prévu pourra entraîner une facturation complémentaire au Client. Il en est notamment ainsi lorsque l’intervention ne peut être réalisée dans des conditions normales en raison d’un accès impraticable, d’une absence du Client ou de son représentant sur site, d’un chargement non terminé, d’une surcharge du contenant, de la présence de déchets non conformes à ceux déclarés lors de la commande ou de toute autre situation imputable au Client.",
      "Dans ces hypothèses, CORE ENVIRONNEMENT se réserve le droit d’appliquer des frais de passage à vide correspondant à la mobilisation inutile des moyens du Prestataire, même en l’absence de réalisation effective de la prestation.",
      "Toute non-conformité des déchets, telle que la présence de matières ou substances non prévues, pourra entraîner un déclassement du chargement, une réorientation vers une filière adaptée ou un refus de prise en charge. Les coûts supplémentaires résultant de ces situations seront intégralement supportés par le Client.",
      "De même, tout dépassement de poids constaté lors de la prise en charge du contenant pourra donner lieu à une facturation complémentaire.",
      "Enfin, toute détection anormale, notamment radiologique, lors de l’admission des déchets dans un centre de traitement pourra entraîner l’application de procédures spécifiques et de frais additionnels qui resteront à la charge du Client.",
    ],
  },
  {
    title: "ARTICLE\u00A011 – PLANIFICATION",
    paragraphs: [
      "Les dates d’intervention sont fixées lors de la commande sur la base des informations communiquées par le Client et des disponibilités des Prestataires. Les dates communiquées ont un caractère indicatif et ne constituent pas un engagement ferme d’intervention.",
      "Toute demande de modification de la date d’intervention devra être formulée par le Client au moins quarante-huit heures ouvrées avant la date initialement prévue. À défaut de respect de ce délai, CORE ENVIRONNEMENT ne pourra garantir la prise en compte de la modification demandée et se réserve le droit de maintenir la planification initiale.",
      "En cas d’annulation tardive, d’absence du Client ou de toute situation empêchant la réalisation de la prestation à la date convenue pour un motif imputable au Client, des frais pourront être facturés, notamment au titre du passage à vide ou de la mobilisation des moyens du Prestataire.",
      "Toute demande de prolongation de la durée de mise à disposition d’un contenant devra être sollicitée préalablement par le Client et pourra faire l’objet d’une facturation complémentaire. À défaut de demande préalable, CORE ENVIRONNEMENT se réserve le droit d’appliquer les frais correspondants à la prolongation ou à l’immobilisation du matériel.",
    ],
  },
  {
    title: "ARTICLE\u00A012 – RESPONSABILITÉ DE CORE ENVIRONNEMENT",
    paragraphs: [
      "CORE ENVIRONNEMENT intervient exclusivement en qualité d’intermédiaire organisateur de prestations réalisées par des Prestataires tiers et ne saurait, à ce titre, être tenue responsable de l’exécution matérielle des opérations de collecte, de transport, de manutention, de tri ou de traitement des déchets.",
      "La responsabilité de CORE ENVIRONNEMENT ne pourra être engagée en cas de mauvaise exécution ou d’inexécution de la prestation imputable au Prestataire, notamment en cas de retard, d’impossibilité d’intervention, de refus de prise en charge des déchets, de contraintes techniques ou de toute circonstance indépendante de sa volonté.",
      "CORE ENVIRONNEMENT ne pourra être tenue responsable des dommages directs ou indirects, pertes d’exploitation, pertes financières, préjudices commerciaux ou atteintes à l’image, notamment lorsque ceux-ci résultent de conditions d’accès inadaptées, d’une déclaration inexacte des déchets, d’une non-conformité des chargements ou, plus généralement, de toute faute imputable au Client.",
      "En toute hypothèse, la responsabilité de CORE ENVIRONNEMENT est strictement limitée au rôle d’organisation et de mise en relation qu’elle assure et ne saurait être engagée au-delà du montant de la prestation concernée.",
    ],
  },
  {
    title: "ARTICLE\u00A013 – CONDITIONS TARIFAIRES ET FACTURATION",
    paragraphs: [
      "Les tarifs applicables aux prestations sont ceux indiqués dans le devis ou la proposition commerciale validée par le Client. Les prix sont établis sur la base des informations fournies par le Client lors de la commande, notamment en ce qui concerne la nature, le volume et les caractéristiques des déchets, ainsi que les conditions d’accès au site.",
      "Toute modification de ces éléments, toute non-conformité des déchets, tout surpoids constaté ou toute difficulté particulière rencontrée lors de l’exécution de la prestation pourra entraîner une facturation complémentaire.",
      "Les prix peuvent inclure la Taxe Générale sur les Activités Polluantes lorsque celle-ci est applicable. Toute évolution de cette taxe ou de toute autre contribution réglementaire sera automatiquement répercutée au Client.",
      "Les frais supplémentaires résultant notamment d’aléas d’exploitation, de passages à vide, de déclassements, de prolongation de mise à disposition de contenants ou de toute intervention rendue nécessaire par des circonstances imputables au Client feront l’objet d’une facturation additionnelle.",
    ],
  },
  {
    title: "ARTICLE\u00A014 – RÉVISION DES PRIX",
    paragraphs: [
      "Les tarifs applicables aux prestations pourront être révisés afin de tenir compte de l’évolution des conditions économiques et réglementaires impactant la gestion des déchets. Cette révision pourra intervenir notamment en cas de variation des coûts liés au transport, au tri, au traitement, à la valorisation des déchets, aux conditions tarifaires pratiquées par les Prestataires ou les centres de traitement, ainsi qu’en cas de modification des obligations réglementaires applicables.",
      "En cas d’ajustement tarifaire, le Client en sera informé préalablement et disposera de la faculté d’accepter ou de refuser les nouveaux tarifs proposés. En cas de refus, CORE ENVIRONNEMENT pourra ne pas poursuivre l’organisation des prestations concernées. La poursuite des prestations après notification vaudra acceptation des nouveaux tarifs.",
      "Toutefois, les évolutions résultant de modifications légales ou réglementaires, notamment celles relatives à la fiscalité environnementale ou à la Taxe Générale sur les Activités Polluantes (TGAP), seront automatiquement répercutées au Client et ne pourront faire l’objet d’aucun refus.",
    ],
  },
  {
    title: "ARTICLE\u00A015 – CONDITIONS DE PAIEMENT",
    paragraphs: [
      "Les prestations font l’objet d’une facturation conformément au devis accepté par le Client. Sauf stipulation contraire figurant sur le devis ou les conditions particulières, les factures sont payables à trente (30) jours à compter de leur date d’émission, sans escompte.",
      "CORE ENVIRONNEMENT se réserve la faculté d’exiger le paiement total ou partiel des prestations à la commande, notamment en cas de première relation commerciale, de volume important ou de risque particulier identifié.",
      "Tout retard de paiement entraînera de plein droit, sans qu’un rappel soit nécessaire, l’application de pénalités calculées sur la base du taux d’intérêt légal majoré, ainsi que d’une indemnité forfaitaire pour frais de recouvrement d’un montant de quarante (40)\u00A0euros, conformément aux dispositions légales en vigueur.",
      "En cas de retard de paiement, CORE ENVIRONNEMENT se réserve le droit de suspendre l’organisation des prestations en cours ou à venir, sans que cette suspension ne puisse être considérée comme une inexécution fautive.",
      "Le Client ne pourra opposer aucune compensation ou retenue, pour quelque cause que ce soit, sans l’accord préalable et écrit de CORE ENVIRONNEMENT.",
      "Toute contestation relative à une facture devra être formulée par écrit dans un délai de huit (8) jours à compter de sa réception. À défaut, la facture sera réputée acceptée sans réserve.",
    ],
  },
  {
    title: "ARTICLE\u00A016 – RÉSILIATION",
    paragraphs: [
      "En cas de manquement par l’une des Parties à l’une quelconque de ses obligations contractuelles, et notamment en cas de non-paiement d’une facture à son échéance, l’autre Partie pourra résilier de plein droit la relation contractuelle issue du devis accepté, après mise en demeure adressée par écrit et restée sans effet pendant un délai de quinze (15) jours.",
      "La résiliation interviendra sans préjudice des sommes déjà dues au titre des prestations réalisées ou engagées, lesquelles resteront intégralement exigibles.",
      "En cas de résiliation imputable au Client, notamment pour défaut de paiement, communication d’informations inexactes, non-respect de ses obligations ou impossibilité d’exécution des prestations de son fait, CORE ENVIRONNEMENT se réserve le droit de facturer l’ensemble des frais engagés, des prestations réalisées, ainsi que toute mobilisation de moyens rendue inutile.",
      "La résiliation ne pourra donner lieu à aucun remboursement des sommes déjà versées au titre des prestations organisées ou en cours d’organisation.",
      "Par ailleurs, CORE ENVIRONNEMENT se réserve la faculté de résilier ou de refuser toute nouvelle organisation de prestation en cas de comportement du Client incompatible avec les conditions normales d’exécution des prestations, notamment en cas de non-respect des obligations réglementaires, de risques identifiés ou de manquements répétés.",
      "La résiliation prendra effet sans préjudice de l’application des stipulations relatives à la responsabilité, aux paiements dus et aux conséquences financières des prestations engagées.",
    ],
  },
  {
    title: "ARTICLE\u00A017 – FORCE MAJEURE",
    paragraphs: [
      "Aucune des Parties ne pourra être tenue responsable de l’inexécution ou du retard dans l’exécution de ses obligations résultant d’un événement de force majeure tel que défini par l’article 1218 du Code civil et par la jurisprudence des juridictions françaises.",
      "Sont notamment considérés comme des cas de force majeure, sans que cette liste soit limitative, les catastrophes naturelles, intempéries exceptionnelles, incendies, inondations, grèves, blocages des réseaux de transport ou d’approvisionnement, défaillance des réseaux de communication, décisions administratives, restrictions réglementaires, pandémies, ou tout autre événement échappant au contrôle raisonnable des Parties et rendant impossible l’exécution des prestations dans des conditions normales.",
      "En cas de survenance d’un tel événement, l’exécution des obligations affectées sera suspendue pendant la durée de celui-ci, sans que la responsabilité de CORE ENVIRONNEMENT ne puisse être engagée.",
      "Si l’empêchement se prolonge au-delà d’une durée raisonnable rendant impossible la poursuite de l’organisation des prestations, chacune des Parties pourra mettre fin à la relation contractuelle issue du devis accepté, sans indemnité de part et d’autre, sous réserve du paiement des prestations déjà réalisées ou des frais engagés.",
    ],
  },
  {
    title: "ARTICLE\u00A018 – DROIT APPLICABLE",
    paragraphs: [
      "Les présentes Conditions Générales de Vente sont régies par le droit français. Elles sont rédigées en langue française. Dans l’hypothèse où elles seraient traduites dans une ou plusieurs langues, seul le texte français ferait foi en cas de litige.",
    ],
  },
  {
    title: "ARTICLE\u00A019 – ATTRIBUTION DE COMPÉTENCE",
    paragraphs: [
      "Tout litige relatif à la formation, l’interprétation, l’exécution ou la cessation des prestations organisées par CORE ENVIRONNEMENT, ainsi qu’à l’application des présentes Conditions Générales de Vente, qui ne pourrait être résolu à l’amiable, sera soumis à la compétence exclusive des tribunaux du ressort du siège social de CORE ENVIRONNEMENT, y compris en cas de pluralité de défendeurs ou d’appel en garantie.",
    ],
  },
] as const

export const politiqueConfidentialiteSections = [
  {
    title: "Responsable du traitement",
    paragraphs: [
      `${LEGAL_COMPANY.name}, ${LEGAL_COMPANY.legalForm}, ${LEGAL_COMPANY.address}.`,
      `SIRET : ${LEGAL_COMPANY.siret} — N° TVA : ${LEGAL_COMPANY.tva}.`,
      `Contact données personnelles : ${LEGAL_COMPANY.email} — ${LEGAL_COMPANY.phone}.`,
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
