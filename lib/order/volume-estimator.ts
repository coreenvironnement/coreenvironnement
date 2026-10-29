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

export type VolumeRecommendation = {
  estimatedM3: number
  withMarginM3: number
  recommendedVolumeM3: number | null
  weightLimited: boolean
  note: string | null
}

/** Choisit la plus petite benne du catalogue familial qui couvre le volume + marge. */
export function recommendBenneVolume(
  estimatedM3: number,
  family: BenneFamily,
  wasteId: ParticulierWasteOptionId,
  marginPercent: number
): VolumeRecommendation {
  const available = availableVolumesForFamily(family)
  const heavy = isHeavyParticulierWaste(wasteId)
  const withMarginM3 = roundVolumeM3(
    estimatedM3 * (1 + Math.max(0, marginPercent) / 100)
  )

  if (estimatedM3 <= 0 || available.length === 0) {
    return {
      estimatedM3,
      withMarginM3,
      recommendedVolumeM3: null,
      weightLimited: heavy,
      note: "Indiquez des dimensions ou un nombre de sacs pour obtenir une estimation.",
    }
  }

  const sorted = [...available].sort((a, b) => a - b)
  let recommended =
    sorted.find((v) => v >= withMarginM3) ?? sorted[sorted.length - 1]!

  let note: string | null = null
  let weightLimited = false

  if (heavy) {
    weightLimited = true
    note =
      "Gravats, terre ou mélange de chantier : le poids limite souvent la benne avant le volume. Une capacité plus grande n’est pas toujours adaptée."
    if (withMarginM3 > sorted[sorted.length - 1]! * 0.85) {
      note +=
        " Votre estimation est élevée pour des matériaux lourds : plusieurs rotations ou un conseil téléphonique peuvent être nécessaires."
    }
  } else if (withMarginM3 > sorted[sorted.length - 1]! * 0.92) {
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
  }
}

export function prestationIdForFamilyVolume(
  family: BenneFamily,
  volumeM3: number
): string | null {
  const match = prestationsByFamily(family).find((p) => p.volumeM3 === volumeM3)
  return match?.id ?? null
}
