import { prestationById } from "@/lib/prestations"

/** Visuels forfait — mapping par volume (aligné tunnel). */
export const BENNE_VISUAL_BY_VOLUME: Record<number, string> = {
  8: "/images/core-benne-8m3.webp",
  10: "/images/core-benne-10m3.webp",
  15: "/images/core-benne-15m3.webp",
  20: "/images/core-benne-20m3.webp",
  30: "/images/core-benne-30m3.webp",
}

const DEFAULT_BENNE_IMAGE = "/images/core-benne-10m3.webp"

export function benneImageForVolume(volumeM3: number | null | undefined): string {
  if (volumeM3 == null || Number.isNaN(volumeM3)) {
    return DEFAULT_BENNE_IMAGE
  }
  return BENNE_VISUAL_BY_VOLUME[volumeM3] ?? DEFAULT_BENNE_IMAGE
}

export function benneImageForPrestationId(prestationId: string | null | undefined): string {
  if (!prestationId) return DEFAULT_BENNE_IMAGE
  const p = prestationById(prestationId)
  if (!p) return DEFAULT_BENNE_IMAGE
  return benneImageForVolume(p.volumeM3)
}
