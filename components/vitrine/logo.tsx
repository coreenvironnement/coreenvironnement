import Image from "next/image"

import { cn } from "@/lib/utils"

const LOGO_ALT = "CORE ENVIRONNEMENT"

const LOGO_DEFAULT = "/images/stickyheaderlogo.png"

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
  variant?: "default" | "header" | "footer" | "login"
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
          "h-[2.375rem] w-[8.0625rem] sm:h-[2.6125rem] sm:w-[8.4375rem] lg:h-[2.73125rem] lg:w-[8.775rem]",
          className
        )}
      >
        <Image
          src={HEADER_LOGO_STICKY.src}
          alt={transparent ? "" : LOGO_ALT}
          width={HEADER_LOGO_STICKY.width}
          height={HEADER_LOGO_STICKY.height}
          sizes="148px"
          priority={priority}
          aria-hidden={transparent}
          className={cn(
            "absolute inset-0 h-full w-full origin-center object-contain object-center transition-opacity duration-500 ease-out lg:origin-left lg:object-left",
            transparent ? "opacity-0" : "opacity-100"
          )}
        />
        <Image
          src={HEADER_LOGO_TRANSPARENT.src}
          alt={transparent ? LOGO_ALT : ""}
          width={HEADER_LOGO_TRANSPARENT.width}
          height={HEADER_LOGO_TRANSPARENT.height}
          sizes="148px"
          priority={priority}
          aria-hidden={!transparent}
          style={{ scale: `${HEADER_LOGO_TRANSPARENT_SCALE}` }}
          className={cn(
            "absolute inset-0 h-full w-full origin-center object-contain object-center transition-opacity duration-500 ease-out lg:origin-left lg:object-left",
            transparent ? "opacity-100" : "opacity-0"
          )}
        />
      </span>
    )
  }

  const footerLogo = HEADER_LOGO_TRANSPARENT

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center",
        variant === "footer"
          ? "mx-auto h-10 w-[min(62vw,188px)] sm:h-11 sm:w-[200px] lg:mx-0"
          : variant === "login"
            ? "mx-auto h-11 w-[min(70vw,220px)] sm:h-12 sm:max-w-[240px]"
            : "h-9 max-w-[min(52vw,200px)] sm:h-10 sm:max-w-[220px]",
        className
      )}
    >
      <Image
        src={variant === "footer" ? footerLogo.src : LOGO_DEFAULT}
        alt={LOGO_ALT}
        width={variant === "footer" ? footerLogo.width : HEADER_LOGO_STICKY.width}
        height={variant === "footer" ? footerLogo.height : HEADER_LOGO_STICKY.height}
        sizes={variant === "footer" ? "200px" : "220px"}
        priority={priority}
        className={cn(
          "h-full w-full object-contain",
          variant === "footer"
            ? "object-center lg:object-left"
            : variant === "login"
              ? "origin-center object-center"
              : "object-left"
        )}
      />
    </span>
  )
}
