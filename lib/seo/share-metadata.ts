import { getSiteUrl } from "@/lib/seo/site-url"

/** Optimized for WhatsApp/Facebook (<300 KB, 1200×630). */
export const SHARE_IMAGE_PATH = "/images/og-social.jpg"
export const SHARE_IMAGE_WIDTH = 1200
export const SHARE_IMAGE_HEIGHT = 630
export const SHARE_IMAGE_TYPE = "image/jpeg"

export const DEFAULT_SHARE_IMAGE_ALT =
  "Location de benne en Île-de-France - CORE ENVIRONNEMENT"

export function getShareImageUrl() {
  return `${getSiteUrl()}${SHARE_IMAGE_PATH}`
}

export function buildShareOpenGraphImages(
  imagePath: string,
  width: number,
  height: number,
  alt: string,
  type: string = SHARE_IMAGE_TYPE,
) {
  const url = `${getSiteUrl()}${imagePath}`
  return [
    {
      url,
      secureUrl: url,
      width,
      height,
      alt,
      type,
    },
  ]
}

export function buildShareTwitterImages(imagePath: string) {
  return [`${getSiteUrl()}${imagePath}`]
}

export function getShareOpenGraphImages(alt = DEFAULT_SHARE_IMAGE_ALT) {
  return buildShareOpenGraphImages(
    SHARE_IMAGE_PATH,
    SHARE_IMAGE_WIDTH,
    SHARE_IMAGE_HEIGHT,
    alt,
    SHARE_IMAGE_TYPE,
  )
}

export function getShareTwitterImages() {
  return buildShareTwitterImages(SHARE_IMAGE_PATH)
}
