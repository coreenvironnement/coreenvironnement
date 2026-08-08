/**
 * Règle métier valorisation — réponse client (juillet 2026)
 */

export const REGLE_VALORISATION = {
  titre: "Taux de valorisation global",
  etapes: [
    "Multiplier le poids de chaque type de déchet par son taux de valorisation (celui du prestataire choisi). Ex : 10 t de DIB à 90 % = 9 t valorisées.",
    "Additionner toutes les tonnes valorisées.",
    "Diviser ce total par le poids total des déchets du chantier ou du client, puis multiplier par 100.",
  ],
  noteAnuelle:
    "Chaque prestataire a un taux différent par typologie. Ces taux varient annuellement (généralement en fin d'année).",
} as const

/** Exemple tableau client 2026 — aligné migration 005 */
export const EXEMPLE_TAUX_2026 = [
  {
    prestataire: "Paprec",
    taux: { dib: 90, gravats: 100, plastique: 50, platre: 90 },
  },
  {
    prestataire: "Veolia",
    taux: { dib: 86, gravats: 100, plastique: 37, platre: 45 },
  },
  {
    prestataire: "Bennes services",
    taux: { dib: 75, gravats: 100, plastique: 0, platre: 80 },
  },
  {
    prestataire: "4g environnement",
    taux: { dib: 93, gravats: 100, plastique: 20, platre: 100 },
  },
] as const
