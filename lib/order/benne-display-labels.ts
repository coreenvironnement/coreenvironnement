import type { BenneFamily } from "@/lib/prestations"
import { FAMILY_LABELS } from "@/lib/prestations"
import {
  particulierWasteOptionById,
  type ParticulierWasteOptionId,
} from "@/lib/order/particulier-waste-options"

const LABEL_SEPARATORS = [", ", " — "] as const

/** Partie « flux » d’un libellé forfait catalogue (ex. « gravats mélangés »). */
export function wasteTailFromPrestationLabel(label: string): string {
  for (const sep of LABEL_SEPARATORS) {
    const idx = label.indexOf(sep)
    if (idx >= 0) return label.slice(idx + sep.length).trim()
  }
  return ""
}

/** Sous-titre carte forfait (pro) dérivé du libellé catalogue. */
export function subtitleFromPrestationLabel(label: string): string {
  const tail = wasteTailFromPrestationLabel(label)
  if (!tail) return ""
  if (tail.startsWith("gravats")) return `Pour les ${tail}`
  if (tail.startsWith("mélange")) return `Pour le ${tail}`
  return `Pour ${tail}`
}

/** Intitulé flux pour récap tunnel particulier (aligné sur le choix étape 2). */
export function tunnelFluxRecapName(
  family: BenneFamily,
  wasteId?: ParticulierWasteOptionId | null
): string {
  if (wasteId) {
    const opt = particulierWasteOptionById(wasteId)
    if (opt) {
      if (wasteId === "gravats") return "Gravats propres"
      return opt.title
    }
  }
  return FAMILY_LABELS[family].title
}

/** Sous-titre carte benne (particulier) ou famille (pro sans option UI). */
export function tunnelFluxCardSubtitle(
  family: BenneFamily,
  wasteId?: ParticulierWasteOptionId | null
): string {
  if (wasteId) {
    const opt = particulierWasteOptionById(wasteId)
    if (opt?.cardSubtitle) return opt.cardSubtitle
  }
  return subtitleFromFamily(family)
}

function subtitleFromFamily(family: BenneFamily): string {
  switch (family) {
    case "melange_dnd":
      return "Pour le mélange de déchets non dangereux"
    case "gravats_melanges":
      return "Pour les gravats mélangés"
    case "gravats_propres":
      return "Pour les gravats propres"
  }
}

/** Titre recommandation / volume connu (particulier). */
export function benneLabelForVolume(
  family: BenneFamily,
  volumeM3: number,
  wasteId?: ParticulierWasteOptionId | null
): string {
  const flux = tunnelFluxRecapName(family, wasteId)
  return `Benne de ${volumeM3} m³, ${flux}`
}
