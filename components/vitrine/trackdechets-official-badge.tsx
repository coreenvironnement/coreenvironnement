import Image from "next/image"

import { SITE_IMAGES, TRACKDECHETS_LOGO_ALT } from "@/lib/media/site-images"
import { SITE_TRACKDECHETS_URL } from "@/lib/site"
import { cn } from "@/lib/utils"

type TrackdechetsOfficialBadgeProps = {
  className?: string
  variant?: "card"
  compact?: boolean
  /** Segment intégré dans une bande de confiance (sans pill propre). */
  embedded?: boolean
}

export function TrackdechetsOfficialBadge({
  className,
  variant = "card",
  compact = false,
  embedded = false,
}: TrackdechetsOfficialBadgeProps) {
  const isCard = variant === "card"
  const textPrimary = isCard ? "text-brand-navy" : "text-white"
  const textSecondary = isCard ? "text-brand-muted" : "text-white/85"

  return (
    <a
      href={SITE_TRACKDECHETS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex max-w-full items-center justify-center gap-2.5 rounded-full border px-3.5 py-1.5 backdrop-blur-md transition duration-300",
        isCard
          ? "border-brand-navy/10 bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_20px_-10px_rgba(14,32,16,0.25)] hover:border-brand-green/25 hover:bg-white/90"
          : "border-white/22 bg-white/[0.1]",
        compact && "gap-2 px-3 py-1.5 sm:gap-2.5 sm:px-3.5",
        embedded &&
          "gap-1.5 border-0 bg-transparent px-0 py-0 shadow-none backdrop-blur-none hover:border-0 hover:bg-transparent",
        embedded && isCard && "min-h-0 items-center",
        compact &&
          !embedded &&
          "max-lg:gap-1.5 max-lg:border-0 max-lg:bg-transparent max-lg:px-0 max-lg:py-0 max-lg:shadow-none max-lg:backdrop-blur-none hover:max-lg:border-0 hover:max-lg:bg-transparent",
        compact &&
          !embedded &&
          isCard &&
          "max-lg:min-h-[1.75rem] max-lg:items-center max-lg:py-0",
        className
      )}
      aria-label="Traçabilité officielle Trackdéchets - ouvrir le site Trackdéchets"
    >
      <Image
        src={SITE_IMAGES.brand.trackdechetsLogo}
        alt=""
        width={108}
        height={119}
        className={cn(
          "h-9 w-auto shrink-0 object-contain sm:h-10",
          compact && !embedded && "max-lg:h-7 sm:h-9",
          embedded && "h-6 w-auto sm:h-6"
        )}
        aria-hidden
      />
      <span
        className={cn(
          "min-w-0 text-left text-[12px] font-semibold leading-none tracking-[-0.01em] sm:text-[13px]",
          textPrimary,
          compact && !embedded && "max-lg:text-[11px]",
          embedded && "text-[11px] font-medium"
        )}
      >
        <span className={cn(compact && !embedded && "max-lg:hidden", embedded && "hidden")}>
          Traçabilité officielle
          <span className={cn("block font-medium leading-snug", textSecondary)}>
            Trackdéchets
          </span>
        </span>
        <span
          className={cn(
            "hidden font-semibold leading-none",
            textPrimary,
            compact && !embedded && "max-lg:inline",
            embedded && "inline font-medium"
          )}
        >
          Trackdéchets
        </span>
      </span>
    </a>
  )
}

export function TrackdechetsLogoMark({
  className,
  size = "md",
}: {
  className?: string
  size?: "sm" | "md" | "lg"
}) {
  const heightClass =
    size === "sm" ? "h-12" : size === "lg" ? "h-[4.75rem] sm:h-20" : "h-14 sm:h-16"

  return (
    <Image
      src={SITE_IMAGES.brand.trackdechetsLogo}
      alt={TRACKDECHETS_LOGO_ALT}
      width={540}
      height={595}
      className={cn("w-auto shrink-0 object-contain object-left", heightClass, className)}
    />
  )
}