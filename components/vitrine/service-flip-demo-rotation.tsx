import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, ReloadIcon } from "@hugeicons/core-free-icons"

import { VITRINE_ICON_STROKE } from "./icons"

const BASE_PATH = "/images/core-environnement-benne-verte-chantier"
const FALLBACK_SRC = `${BASE_PATH}-960.webp`
const IMAGE_WIDTH = 960
const IMAGE_HEIGHT = 600

const MEDIA_ALT =
  "Benne verte Core Environnement pleine de gravats devant un chantier en construction, illustrant une rotation de benne."

const MEDIA_SIZES =
  "(max-width: 430px) min(100vw - 3.5rem, 18.75rem), (max-width: 639px) min(100vw - 3.5rem, 20rem), 280px"

const AVIF_SRC_SET = [
  `${BASE_PATH}-480.avif 480w`,
  `${BASE_PATH}-720.avif 720w`,
  `${BASE_PATH}-960.avif 960w`,
].join(", ")

const WEBP_SRC_SET = [
  `${BASE_PATH}-480.webp 480w`,
  `${BASE_PATH}-720.webp 720w`,
  `${BASE_PATH}-960.webp 960w`,
].join(", ")

export function ServiceFlipDemoRotation({
  className = "",
}: {
  className?: string
}) {
  return (
    <div className={`service-flip-demo-rotation ${className}`.trim()}>
      <div className="service-flip-demo-rotation__media">
        <picture className="service-flip-demo-rotation__picture">
          <source type="image/avif" srcSet={AVIF_SRC_SET} sizes={MEDIA_SIZES} />
          <source type="image/webp" srcSet={WEBP_SRC_SET} sizes={MEDIA_SIZES} />
          <Image
            src={FALLBACK_SRC}
            alt={MEDIA_ALT}
            width={IMAGE_WIDTH}
            height={IMAGE_HEIGHT}
            loading="lazy"
            sizes={MEDIA_SIZES}
            className="service-flip-demo-rotation__img"
          />
        </picture>
      </div>
      <div className="service-flip-demo-rotation__meta-row" aria-hidden>
        <div className="service-flip-demo-rotation__meta-copy min-w-0">
          <p className="service-flip-demo-rotation__chantier">
            Chantier en cours
          </p>
          <p className="service-flip-demo-rotation__spec">Benne DIB · 15 m³</p>
        </div>
        <span className="service-flip-demo-rotation__badge">En place</span>
      </div>
      <span
        className="service-flip-demo-rotation__mock-action"
        role="presentation"
        aria-hidden
      >
        <HugeiconsIcon
          icon={ReloadIcon}
          size={14}
          strokeWidth={VITRINE_ICON_STROKE}
          className="service-flip-demo-rotation__mock-action-icon shrink-0"
          aria-hidden
        />
        Demander une rotation
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size={14}
          strokeWidth={VITRINE_ICON_STROKE}
          className="service-flip-demo-rotation__mock-action-icon shrink-0"
          aria-hidden
        />
      </span>
    </div>
  )
}