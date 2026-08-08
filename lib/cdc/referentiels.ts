/**
 * Référentiels métier — source : cahier des charges client.
 * Utilisés par l'espace client, l'admin et le formulaire de commande.
 */

export const ZONE_INTERVENTION = "Île-de-France" as const

export const DEPARTEMENTS_IDF = [
  { code: "75", nom: "Paris" },
  { code: "77", nom: "Seine-et-Marne" },
  { code: "78", nom: "Yvelines" },
  { code: "91", nom: "Essonne" },
  { code: "92", nom: "Hauts-de-Seine" },
  { code: "93", nom: "Seine-Saint-Denis" },
  { code: "94", nom: "Val-de-Marne" },
  { code: "95", nom: "Val-d'Oise" },
] as const

export const TYPES_INTERVENTION = [
  { code: "depose", label: "Dépose" },
  { code: "rotation", label: "Rotation" },
  { code: "retrait", label: "Retrait" },
  { code: "chargement_sur_place", label: "Chargement sur place" },
  { code: "deplacement", label: "Déplacement" },
] as const

export const STATUTS_INTERVENTION = [
  { code: "en_cours_programmation", label: "En cours de programmation" },
  { code: "programme", label: "Programmé" },
  { code: "annulee", label: "Annulée" },
  { code: "realisee", label: "Réalisée" },
  { code: "passage_a_vide", label: "Passage à vide" },
] as const

export const TYPES_CONTENANTS = [
  { code: "benne_8m3", label: "Benne 8 m³" },
  { code: "benne_10m3", label: "Benne 10 m³" },
  { code: "benne_15m3", label: "Benne 15 m³" },
  { code: "benne_20m3", label: "Benne 20 m³" },
  { code: "benne_30m3", label: "Benne 30 m³" },
  { code: "caisse_palette_600l", label: "Caisse palette 600 litres" },
  { code: "fut_200l", label: "Fut 200 litres" },
] as const

export const DECHETS_NON_DANGEREUX = [
  "Déchets non dangereux en mélange (DIB)",
  "Gravats propres",
  "Bois A",
  "Bois B",
  "Plâtres",
  "Plastiques",
  "Déchets ultimes",
  "Ferrailles",
  "Carton & papiers",
] as const

export const DECHETS_DANGEREUX = [
  "Aérosols",
  "Emballages standards souillés",
  "Matériels standards souillés",
  "Peinture",
  "Pâteux",
  "Huiles noires",
  "Huiles claires",
] as const

export const TYPES_DOCUMENTS = [
  { code: "bon_intervention", label: "Bon d'intervention" },
  { code: "bon_pesee", label: "Bon de pesée" },
  { code: "bsd", label: "Bordereau de suivi des déchets" },
] as const

export const MODES_PAIEMENT_PRO = [
  { code: "cb_required", label: "Paiement par CB obligatoire" },
  { code: "invoice", label: "Paiement sur facture (30 j fin de mois)" },
] as const

export const ABONNEMENT_PRO_HT = 35

export const COLONNES_HISTORIQUE = [
  "N° de demande d'intervention",
  "Date de la demande d'intervention",
  "Type d'intervention",
  "Contenant",
  "Déchets",
  "Date souhaitée d'intervention",
  "Statut de l'intervention",
  "Date réelle d'intervention",
  "Commentaire",
  "Bon d'intervention",
  "Bon de pesée",
  "Bordereau de suivi des déchets",
] as const

export type TypeInterventionCode = (typeof TYPES_INTERVENTION)[number]["code"]
export type StatutInterventionCode = (typeof STATUTS_INTERVENTION)[number]["code"]
export type TypeContenantCode = (typeof TYPES_CONTENANTS)[number]["code"]
export type TypeDocumentCode = (typeof TYPES_DOCUMENTS)[number]["code"]
export type ModePaiementProCode = (typeof MODES_PAIEMENT_PRO)[number]["code"]
