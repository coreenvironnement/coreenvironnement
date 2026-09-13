import { getSiteUrl } from "@/lib/seo/site-url"

export const SHARE_IMAGE_PATH = "/images/social.png"
export const SHARE_IMAGE_WIDTH = 1774
export const SHARE_IMAGE_HEIGHT = 887
export const SHARE_IMAGE_TYPE = "image/png"

export const DEFAULT_SHARE_IMAGE_ALT =
  "Location de benne en Île-de-France — CORE ENVIRONNEMENT"

export function getShareImageUrl() {
  return `${getSiteUrl()}${SHARE_IMAGE_PATH}`
}

export function getShareOpenGraphImages(alt = DEFAULT_SHARE_IMAGE_ALT) {
  return [
    {
      url: getShareImageUrl(),
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
