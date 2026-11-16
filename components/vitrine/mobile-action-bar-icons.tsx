import { cn } from "@/lib/utils"

type MobileBarIconProps = {
  className?: string
}

const ICON_BASE = "shrink-0 object-contain"

const MOBILE_BAR_ICON_SRC = {
  estimer: "/images/mobile-bar/estimer-volume.webp",
  commander: "/images/mobile-bar/commander-benne-white.webp",
  appeler: "/images/mobile-bar/appeler.webp",
  compte: "/images/mobile-bar/mon-compte.webp",
} as const

function MobileBarRasterIcon({
  src,
  className,
  rasterSize = 20,
}: MobileBarIconProps & { src: string; rasterSize?: number }) {
  return (
    <img
      src={src}
      alt=""
      width={rasterSize}
      height={rasterSize}
      decoding="async"
      aria-hidden
      className={cn(ICON_BASE, className)}
    />
  )
}

/** Cube isométrique + repères — action Estimer */
export function MobileBarEstimateIcon({ className }: MobileBarIconProps) {
  return <MobileBarRasterIcon src={MOBILE_BAR_ICON_SRC.estimer} className={className} />
}

/** Benne de chantier — action Commander (blanc sur CTA vert) */
export function MobileBarCommanderIcon({ className }: MobileBarIconProps) {
  return (
    <MobileBarRasterIcon
      src={MOBILE_BAR_ICON_SRC.commander}
      className={className}
      rasterSize={24}
    />
  )
}

/** Combiné + onde — action Appeler */
export function MobileBarPhoneIcon({ className }: MobileBarIconProps) {
  return <MobileBarRasterIcon src={MOBILE_BAR_ICON_SRC.appeler} className={className} />
}

/** Profil utilisateur — Mon compte */
export function MobileBarAccountIcon({ className }: MobileBarIconProps) {
  return <MobileBarRasterIcon src={MOBILE_BAR_ICON_SRC.compte} className={className} />
}