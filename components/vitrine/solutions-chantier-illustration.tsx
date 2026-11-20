import Image from "next/image"

const ILLUSTRATION_SRC = "/images/core-environnement-solutions-dechets-chantier.png"
const ILLUSTRATION_WIDTH = 1024
const ILLUSTRATION_HEIGHT = 576

const ILLUSTRATION_ALT =
  "Solutions de gestion des déchets de chantier proposées par Core Environnement : déchetterie, flux réglementés et manutention"

const RESPONSIVE_WIDTHS = [640, 960, 1024] as const
const BASE_PATH = "/images/core-environnement-solutions-dechets-chantier"

function widthSuffix(width: number) {
  return width === 1024 ? "" : `-${width}`
}

function buildSrcSet(ext: "webp" | "avif") {
  return RESPONSIVE_WIDTHS.map(
    (w) => `${BASE_PATH}${widthSuffix(w)}.${ext} ${w}w`,
  ).join(", ")
}

const WEBP_SRC_SET = buildSrcSet("webp")
const AVIF_SRC_SET = buildSrcSet("avif")
const ILLUSTRATION_SIZES =
  "(max-width: 639px) min(100vw - 3.5rem, 18.75rem), (max-width: 1023px) min(50vw - 2rem, 20rem), 280px"

export function SolutionsChantierIllustration({
  className = "",
}: {
  className?: string
}) {
  return (
    <figure
      className={`solutions-chantier-illustration ${className}`.trim()}
    >
      <picture className="solutions-chantier-illustration__picture">
        <source
          type="image/avif"
          srcSet={AVIF_SRC_SET}
          sizes={ILLUSTRATION_SIZES}
        />
        <source
          type="image/webp"
          srcSet={WEBP_SRC_SET}
          sizes={ILLUSTRATION_SIZES}
        />
        <Image
          src={ILLUSTRATION_SRC}
          alt={ILLUSTRATION_ALT}
          width={ILLUSTRATION_WIDTH}
          height={ILLUSTRATION_HEIGHT}
          loading="lazy"
          sizes={ILLUSTRATION_SIZES}
          className="solutions-chantier-illustration__img"
        />
      </picture>
    </figure>
  )
}