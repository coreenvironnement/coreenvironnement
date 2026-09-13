import Image from "next/image"

import { cn } from "@/lib/utils"

const LOGO_DEFAULT = "/logocoreenvironnement.png"

const HEADER_LOGO_TRANSPARENT = {
  src: "/images/core-environnement-logo-header-transparent.png",
  width: 1983,
  height: 793,
} as const

const HEADER_LOGO_STICKY = {
  src: "/images/stickyheaderlogo.png",
  width: 2172,
  height: 724,
} as const

/** Compense l’écart de canvas entre les deux exports pour un rendu visuel identique */
const HEADER_LOGO_TRANSPARENT_SCALE =
  (HEADER_LOGO_STICKY.width / HEADER_LOGO_STICKY.height) /
  (HEADER_LOGO_TRANSPARENT.width / HEADER_LOGO_TRANSPARENT.height)

type VitrineLogoProps = {
  className?: string
  priority?: boolean
  /** Header vitrine — logo lisible sans alourdir la barre (~160–178 px) */
  variant?: "default" | "header" | "footer"
  /** Logo blanc/vert pour header transparent ou fond sombre */
  transparent?: boolean
}

export function VitrineLogo({
  className,
  priority,
  variant = "default",
  transparent = false,
}: VitrineLogoProps) {
  if (variant === "header") {
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0",
          "h-10 w-[136px] sm:h-11 sm:w-[142px] lg:h-[46px] lg:w-[148px]",
          className
        )}
      >
        <Image
          src={HEADER_LOGO_STICKY.src}
          alt=""
          width={HEADER_LOGO_STICKY.width}
          height={HEADER_LOGO_STICKY.height}
          sizes="148px"
          priority={priority}
          aria-hidden
          className={cn(
            "absolute inset-0 h-full w-full origin-left object-contain object-left transition-opacity duration-500 ease-out",
            transparent ? "opacity-0" : "opacity-100"
          )}
        />
        <Image
          src={HEADER_LOGO_TRANSPARENT.src}
          alt=""
          width={HEADER_LOGO_TRANSPARENT.width}
          height={HEADER_LOGO_TRANSPARENT.height}
          sizes="148px"
          priority={priority}
          aria-hidden
          style={{ scale: `${HEADER_LOGO_TRANSPARENT_SCALE}` }}
          className={cn(
            "absolute inset-0 h-full w-full origin-left object-contain object-left transition-opacity duration-500 ease-out",
            transparent ? "opacity-100" : "opacity-0"
          )}
        />
        <span className="sr-only">CORE ENVIRONNEMENT</span>
      </span>
    )
  }

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center",
        variant === "footer"
          ? "h-10 w-[min(62vw,188px)] sm:h-11 sm:w-[200px]"
          : "h-9 max-w-[min(52vw,200px)] sm:h-10 sm:max-w-[220px]",
        className
      )}
    >
      <Image
        src={LOGO_DEFAULT}
        alt="CORE ENVIRONNEMENT"
        width={260}
        height={72}
        sizes="220px"
        priority={priority}
        className="h-full w-full object-contain object-left"
      />
    </span>
  )
}
