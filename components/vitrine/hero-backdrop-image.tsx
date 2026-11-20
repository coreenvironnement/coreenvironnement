import { getImageProps } from "next/image"

import { SITE_IMAGES } from "@/lib/media/site-images"
import { cn } from "@/lib/utils"

/** Dimensions « cible » pour l’optimiseur Next (ratio ≈ hero WebP export). */
const HERO_MOBILE_WIDTH = 750
const HERO_MOBILE_HEIGHT = 1000
const HERO_DESKTOP_WIDTH = 1920
const HERO_DESKTOP_HEIGHT = 1080

type HeroBackdropImageProps = {
  alt: string
  isParticulier: boolean
}

/**
 * Fond hero : art direction via <picture> (Next 15).
 * Pas de `priority` (évite doubles preloads) - `fetchPriority` + `loading="eager"` sur l’img.
 */
export function HeroBackdropImage({ alt, isParticulier }: HeroBackdropImageProps) {
  const quality = 75

  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    alt: "",
    src: SITE_IMAGES.hero.desktop,
    width: HERO_DESKTOP_WIDTH,
    height: HERO_DESKTOP_HEIGHT,
    sizes: "(min-width: 768px) 100vw",
    quality,
  })

  const { props: mobileImgProps } = getImageProps({
    alt,
    src: SITE_IMAGES.hero.mobile,
    width: HERO_MOBILE_WIDTH,
    height: HERO_MOBILE_HEIGHT,
    sizes: "(max-width: 767px) 100vw, 1px",
    quality,
  })

  return (
    <picture className="absolute inset-0 z-0 block h-full w-full">
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
      <img
        {...mobileImgProps}
        alt={alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className={cn(
          "h-full w-full object-cover",
          isParticulier
            ? "object-center md:object-[62%_center]"
            : "object-center md:object-[55%_center]"
        )}
      />
    </picture>
  )
}