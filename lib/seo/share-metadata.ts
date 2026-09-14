import { getSiteUrl } from "@/lib/seo/site-url"

/** Optimized for WhatsApp/Facebook (<300 KB, 1200×630). */
export const SHARE_IMAGE_PATH = "/images/og-social.jpg"
export const SHARE_IMAGE_WIDTH = 1200
export const SHARE_IMAGE_HEIGHT = 630
export const SHARE_IMAGE_TYPE = "image/jpeg"

export const DEFAULT_SHARE_IMAGE_ALT =
  "Location de benne en Île-de-France — CORE ENVIRONNEMENT"

export function getShareImageUrl() {
  return `${getSiteUrl()}${SHARE_IMAGE_PATH}`
}

export function getShareOpenGraphImages(alt = DEFAULT_SHARE_IMAGE_ALT) {
  const url = getShareImageUrl()
  return [
    {
      url,
      secureUrl: url,
      width: SHARE_IMAGE_WIDTH,
      height: SHARE_IMAGE_HEIGHT,
      alt,
      type: SHARE_IMAGE_TYPE,
    },
  ]
}

export function getShareTwitterImages() {
  return [getShareImageUrl()]
}
