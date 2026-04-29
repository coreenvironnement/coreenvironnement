/** Familles alignées sur les forfaits tarifaires Core Environnement. */
export type BenneFamily =
  | "melange_dnd"
  | "gravats_melanges"
  | "gravats_propres"

export type BenneSystem = "chaine" | "ampliroll"

export type Prestation = {
  id: string
  family: BenneFamily
  /** Titre court pour les cartes UI */
  label: string
  volumeM3: number
  system: BenneSystem
  /** Prix forfait H.T. (€) */
  priceHt: number
  tonnageMax: number
  /** Facturation complémentaire H.T. par tonne dépassant */
  surchargePerTonHt: number
  acceptedSummary: string
  excludedSummary: string
}

export const FAMILY_LABELS: Record<
  BenneFamily,
  { title: string; description: string }
> = {
  melange_dnd: {
    title: "Mélange déchets non dangereux",
    description:
      "Gravats, plâtre, bois A/B, carton, papier, ferraille, plastique. Jamais de DND.",
  },
  gravats_melanges: {
    title: "Gravats mélangés",
    description: "Mélange principalement composé de gravats non dangereux.",
  },
  gravats_propres: {
    title: "Gravats propres",
    description:
      "Gravats, tuiles, terre non polluée, briques, béton, parpaings. Hors plâtre.",
  },
}

/** Forfaits bennes (zone livraison 20 km autour d’Élancourt : transport non affiché au client). */
export const PRESTATIONS: Prestation[] = [
  {
    id: "dnd-ch-8",
    family: "melange_dnd",
    label: "Benne à chaîne 8 m³, mélange DND",
    volumeM3: 8,
    system: "chaine",
    priceHt: 440,
    tonnageMax: 2,
    surchargePerTonHt: 185,
    acceptedSummary:
      "Mélange de déchets non dangereux : gravats, plâtre, bois A et B, carton, papier, ferraille, plastique.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "dnd-ch-10",
    family: "melange_dnd",
    label: "Benne à chaîne 10 m³, mélange DND",
    volumeM3: 10,
    system: "chaine",
    priceHt: 530,
    tonnageMax: 2.5,
    surchargePerTonHt: 185,
    acceptedSummary:
      "Mélange de déchets non dangereux : gravats, plâtre, bois A et B, carton, papier, ferraille, plastique.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "dnd-ch-15",
    family: "melange_dnd",
    label: "Benne à chaîne 15 m³, mélange DND",
    volumeM3: 15,
    system: "chaine",
    priceHt: 580,
    tonnageMax: 3,
    surchargePerTonHt: 185,
    acceptedSummary:
      "Mélange de déchets non dangereux : gravats, plâtre, bois A et B, carton, papier, ferraille, plastique.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "dnd-am-20",
    family: "melange_dnd",
    label: "Benne ampliroll 20 m³, mélange DND",
    volumeM3: 20,
    system: "ampliroll",
    priceHt: 730,
    tonnageMax: 4,
    surchargePerTonHt: 185,
    acceptedSummary:
      "Mélange de déchets non dangereux : gravats, plâtre, bois A et B, carton, papier, ferraille, plastique.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "dnd-am-30",
    family: "melange_dnd",
    label: "Benne ampliroll 30 m³, mélange DND",
    volumeM3: 30,
    system: "ampliroll",
    priceHt: 1050,
    tonnageMax: 6,
    surchargePerTonHt: 185,
    acceptedSummary:
      "Mélange de déchets non dangereux : gravats, plâtre, bois A et B, carton, papier, ferraille, plastique.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "gm-ch-8",
    family: "gravats_melanges",
    label: "Benne à chaîne 8 m³, gravats mélangés",
    volumeM3: 8,
    system: "chaine",
    priceHt: 440,
    tonnageMax: 6,
    surchargePerTonHt: 125,
    acceptedSummary:
      "Mélange de déchets non dangereux composé principalement de gravats.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "gm-ch-10",
    family: "gravats_melanges",
    label: "Benne à chaîne 10 m³, gravats mélangés",
    volumeM3: 10,
    system: "chaine",
    priceHt: 530,
    tonnageMax: 7,
    surchargePerTonHt: 125,
    acceptedSummary:
      "Mélange de déchets non dangereux composé principalement de gravats.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "gm-ch-15",
    family: "gravats_melanges",
    label: "Benne à chaîne 15 m³, gravats mélangés",
    volumeM3: 15,
    system: "chaine",
    priceHt: 580,
    tonnageMax: 8,
    surchargePerTonHt: 125,
    acceptedSummary:
      "Mélange de déchets non dangereux composé principalement de gravats.",
    excludedSummary: "Tous déchets dangereux sont strictement exclus.",
  },
  {
    id: "gp-ch-8",
    family: "gravats_propres",
    label: "Benne à chaîne 8 m³, gravats propres",
    volumeM3: 8,
    system: "chaine",
    priceHt: 330,
    tonnageMax: 9,
    surchargePerTonHt: 29,
    acceptedSummary:
      "Gravats propres : gravats, tuiles, terre non polluée, briques, béton, parpaings.",
    excludedSummary: "Plâtre et tout déchet dangereux exclus.",
  },
  {
    id: "gp-ch-10",
    family: "gravats_propres",
    label: "Benne à chaîne 10 m³, gravats propres",
    volumeM3: 10,
    system: "chaine",
    priceHt: 360,
    tonnageMax: 9,
    surchargePerTonHt: 29,
    acceptedSummary:
      "Gravats propres : gravats, tuiles, terre non polluée, briques, béton, parpaings.",
    excludedSummary: "Plâtre et tout déchet dangereux exclus.",
  },
]

export function prestationsByFamily(family: BenneFamily): Prestation[] {
  return PRESTATIONS.filter((p) => p.family === family)
}

export function prestationById(id: string): Prestation | undefined {
  return PRESTATIONS.find((p) => p.id === id)
}

export function systemLabel(system: BenneSystem): string {
  return system === "chaine" ? "Chaîne" : "Ampliroll"
}
