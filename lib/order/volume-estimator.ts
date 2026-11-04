import type { BenneFamily } from "@/lib/prestations"
import { prestationsByFamily } from "@/lib/prestations"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"

export const LITERS_PER_M3 = 1000

export function roundVolumeM3(value: number): number {
  if (!Number.isFinite(value) || value < 0) return 0
  return Math.round(value * 10) / 10
}

export function volumeFromDimensionsM3(
  lengthM: number,
  widthM: number,
  heightM: number
): number {
  return roundVolumeM3(lengthM * widthM * heightM)
}

export function volumeFromBagsM3(bagCount: number, litersPerBag: number): number {
  if (bagCount <= 0 || litersPerBag <= 0) return 0
  return roundVolumeM3((bagCount * litersPerBag) / LITERS_PER_M3)
}

export function availableVolumesForFamily(family: BenneFamily): number[] {
  const volumes = prestationsByFamily(family).map((p) => p.volumeM3)
  return [...new Set(volumes)].sort((a, b) => a - b)
}

export function isHeavyParticulierWaste(id: ParticulierWasteOptionId): boolean {
  return (
    id === "gravats" ||
    id === "terre_cailloux" ||
    id === "travaux_melange"
  )
}

/** Flux pro : gravats / terre = matériaux lourds (même logique que particulier). */
export function isHeavyBenneFamily(family: BenneFamily): boolean {
  return family === "gravats_propres" || family === "gravats_melanges"
}

export const DEFAULT_PARTICULIER_VOLUME_MARGIN_PERCENT = 10

export function recommendedMarginPercentForFamily(
  _family: BenneFamily
): number {
  return DEFAULT_PARTICULIER_VOLUME_MARGIN_PERCENT
}

/** Marge de prudence recommandée selon le type de déchet (particulier). */
export function recommendedMarginPercentForWaste(
  wasteId: ParticulierWasteOptionId
): number {
  if (wasteId === "terre_cailloux") return 20
  return DEFAULT_PARTICULIER_VOLUME_MARGIN_PERCENT
}

/** Marge appliquée à l’estimation (minimum type de déchet pour terre et cailloux). */
export function effectiveMarginPercentForRecommendation(
  wasteId: ParticulierWasteOptionId,
  userMarginPercent: number
): number {
  const floor = recommendedMarginPercentForWaste(wasteId)
  if (wasteId === "terre_cailloux") {
    return Math.max(Math.max(0, userMarginPercent), floor)
  }
  return Math.max(0, userMarginPercent)
}

function effectiveMarginPercentForFamilyRecommendation(
  _family: BenneFamily,
  userMarginPercent: number
): number {
  return Math.max(0, userMarginPercent)
}

export type VolumeRecommendation = {
  estimatedM3: number
  withMarginM3: number
  recommendedVolumeM3: number | null
  weightLimited: boolean
  note: string | null
  /** Nombre de bennes en plus de la première lorsque le volume avec marge dépasse le max catalogue. */
  extraBennesNeeded: number | null
  extraBennesMessage: string | null
}

/** Bennes supplémentaires au-delà de la première (0 si une seule benne max suffit). */
export function extraBennesNeededForVolume(
  withMarginM3: number,
  maxCatalogVolumeM3: number
): number {
  if (
    !Number.isFinite(withMarginM3) ||
    withMarginM3 <= 0 ||
    !Number.isFinite(maxCatalogVolumeM3) ||
    maxCatalogVolumeM3 <= 0
  ) {
    return 0
  }
  if (withMarginM3 <= maxCatalogVolumeM3) return 0
  return Math.ceil(withMarginM3 / maxCatalogVolumeM3) - 1
}

export function extraBennesMessageForCount(count: number): string | null {
  if (!Number.isFinite(count) || count <= 0) return null
  const label = count > 1 ? "bennes supplémentaires" : "benne supplémentaire"
  return `D'après le volume, il faudra prévoir ${count} ${label} pour évacuer la totalité de vos déchets`
}

/** Choisit la plus petite benne du catalogue familial qui couvre le volume + marge. */
export function recommendBenneVolume(
  estimatedM3: number,
  family: BenneFamily,
  wasteId: ParticulierWasteOptionId | null,
  marginPercent: number
): VolumeRecommendation {
  const available = availableVolumesForFamily(family)
  const heavy = wasteId
    ? isHeavyParticulierWaste(wasteId)
    : isHeavyBenneFamily(family)
  const effectiveMargin = wasteId
    ? effectiveMarginPercentForRecommendation(wasteId, marginPercent)
    : effectiveMarginPercentForFamilyRecommendation(family, marginPercent)
  const withMarginM3 = roundVolumeM3(
    estimatedM3 * (1 + effectiveMargin / 100)
  )

  if (estimatedM3 <= 0 || available.length === 0) {
    return {
      estimatedM3,
      withMarginM3,
      recommendedVolumeM3: null,
      weightLimited: heavy,
      note: "Indiquez des dimensions ou un nombre de sacs pour obtenir une estimation.",
      extraBennesNeeded: null,
      extraBennesMessage: null,
    }
  }

  const sorted = [...available].sort((a, b) => a - b)
  const maxCatalogVolumeM3 = sorted[sorted.length - 1]!
  const extraCount = extraBennesNeededForVolume(
    withMarginM3,
    maxCatalogVolumeM3
  )
  const extraMessage = extraBennesMessageForCount(extraCount)

  let recommended =
    sorted.find((v) => v >= withMarginM3) ?? maxCatalogVolumeM3

  let note: string | null = null
  let weightLimited = false

  if (heavy) {
    weightLimited = true
    note =
      "Gravats, terre ou mélange de chantier : le poids limite souvent la benne avant le volume. Une capacité plus grande n’est pas toujours adaptée."
    if (withMarginM3 > maxCatalogVolumeM3 * 0.85) {
      note +=
        " Votre estimation est élevée pour des matériaux lourds : plusieurs rotations ou un conseil téléphonique peuvent être nécessaires."
    }
  } else if (withMarginM3 > maxCatalogVolumeM3 * 0.92) {
    note =
      "Votre estimation approche la plus grande benne disponible pour ce flux : prévoyez une marge ou contactez-nous."
  }

  if (recommended < sorted[0]!) recommended = sorted[0]!

  return {
    estimatedM3: roundVolumeM3(estimatedM3),
    withMarginM3,
    recommendedVolumeM3: recommended,
    weightLimited,
    note,
    extraBennesNeeded: extraCount > 0 ? extraCount : null,
    extraBennesMessage: extraMessage,
  }
}

export function prestationIdForFamilyVolume(
  family: BenneFamily,
  volumeM3: number
): string | null {
  const match = prestationsByFamily(family).find((p) => p.volumeM3 === volumeM3)
  return match?.id ?? null
}
