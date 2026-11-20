import Image from "next/image"

const BASE_PATH = "/images/core-environnement-contact-chantier"
const FALLBACK_SRC = `${BASE_PATH}-desktop-960.webp`
const DESKTOP_WIDTH = 960
const DESKTOP_HEIGHT = 480

const ILLUSTRATION_ALT =
  "Illustration d'un interlocuteur sur chantier coordonnant la gestion d'une benne Core Environnement."

const MOBILE_SIZES = "(max-width: 640px) 100vw"
const DESKTOP_SIZES = "(max-width: 1100px) 90vw, 320px"

const MOBILE_AVIF_SRC_SET = [
  `${BASE_PATH}-mobile-480.avif 480w`,
  `${BASE_PATH}-mobile-720.avif 720w`,
].join(", ")

const MOBILE_WEBP_SRC_SET = [
  `${BASE_PATH}-mobile-480.webp 480w`,
  `${BASE_PATH}-mobile-720.webp 720w`,
].join(", ")

const DESKTOP_AVIF_SRC_SET = [
  `${BASE_PATH}-desktop-960.avif 960w`,
  `${BASE_PATH}-desktop-1440.avif 1440w`,
].join(", ")

const DESKTOP_WEBP_SRC_SET = [
  `${BASE_PATH}-desktop-960.webp 960w`,
  `${BASE_PATH}-desktop-1440.webp 1440w`,
].join(", ")

export function ContactChantierIllustration({
  className = "",
}: {
  className?: string
}) {
  return (
    <figure
      className={`contact-chantier-illustration ${className}`.trim()}
    >
      <picture className="contact-chantier-illustration__picture">
        <source
          media="(max-width: 640px)"
          type="image/avif"
          srcSet={MOBILE_AVIF_SRC_SET}
          sizes={MOBILE_SIZES}
        />
        <source
          media="(max-width: 640px)"
          type="image/webp"
          srcSet={MOBILE_WEBP_SRC_SET}
          sizes={MOBILE_SIZES}
        />
        <source
          type="image/avif"
          srcSet={DESKTOP_AVIF_SRC_SET}
          sizes={DESKTOP_SIZES}
        />
        <source
          type="image/webp"
          srcSet={DESKTOP_WEBP_SRC_SET}
          sizes={DESKTOP_SIZES}
        />
        <Image
          src={FALLBACK_SRC}
          alt={ILLUSTRATION_ALT}
          width={DESKTOP_WIDTH}
          height={DESKTOP_HEIGHT}
          loading="lazy"
          sizes={DESKTOP_SIZES}
          className="contact-chantier-illustration__img"
        />
      </picture>
    </figure>
  )
}