import { SITE_IMAGES, benneVolumeImageAlt } from "@/lib/media/site-images"
import { prestationById } from "@/lib/prestations"

/** Visuels forfait — mapping par volume (aligné tunnel). */
export const BENNE_VISUAL_BY_VOLUME: Record<number, string> = {
  8: SITE_IMAGES.benneByVolume[8],
  10: SITE_IMAGES.benneByVolume[10],
  15: SITE_IMAGES.benneByVolume[15],
  20: SITE_IMAGES.benneByVolume[20],
  30: SITE_IMAGES.benneByVolume[30],
}

const DEFAULT_BENNE_IMAGE = SITE_IMAGES.benneDefault

export function benneImageForVolume(volumeM3: number | null | undefined): string {
  if (volumeM3 == null || Number.isNaN(volumeM3)) {
    return DEFAULT_BENNE_IMAGE
  }
  return BENNE_VISUAL_BY_VOLUME[volumeM3] ?? DEFAULT_BENNE_IMAGE
}

export function benneImageAltForVolume(volumeM3: number | null | undefined): string {
  if (volumeM3 == null || Number.isNaN(volumeM3)) {
    return benneVolumeImageAlt(10)
  }
  if (BENNE_VISUAL_BY_VOLUME[volumeM3]) {
    return benneVolumeImageAlt(volumeM3)
  }
  return benneVolumeImageAlt(10)
}

export function benneImageForPrestationId(prestationId: string | null | undefined): string {
  if (!prestationId) return DEFAULT_BENNE_IMAGE
  const p = prestationById(prestationId)
  if (!p) return DEFAULT_BENNE_IMAGE
  return benneImageForVolume(p.volumeM3)
}
