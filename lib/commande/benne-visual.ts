import { prestationById } from "@/lib/prestations"

/** Visuels forfait — mapping par volume (aligné tunnel). */
export const BENNE_VISUAL_BY_VOLUME: Record<number, string> = {
  8: "/images/benne-8m3.png",
  10: "/images/benne-10m3.png",
  15: "/images/benne-15m3.png",
  20: "/images/benne-20m3.png",
  30: "/images/benne-30m3.png",
}

const DEFAULT_BENNE_IMAGE = "/images/benne-10m3.png"

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
