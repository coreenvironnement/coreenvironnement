import Image from "next/image"

import { SITE_IMAGES } from "@/lib/media/site-images"
import { cn } from "@/lib/utils"

const LOGO_ALT = "CORE ENVIRONNEMENT"

const LOGO_DEFAULT = SITE_IMAGES.logo.headerBrand

const HEADER_LOGO_BRAND = {
  src: SITE_IMAGES.logo.headerBrand,
  width: 2172,
  height: 724,
} as const

const HEADER_LOGO_ON_DARK = {
  src: SITE_IMAGES.logo.headerOnDark,
  width: 1983,
  height: 793,
} as const

type VitrineLogoProps = {
  className?: string
  priority?: boolean
  /** Header vitrine - logo lisible sans alourdir la barre (~160–178 px) */
  variant?: "default" | "header" | "footer" | "login"
  /** État hero : barre transparente (logo bleu, identique à la variante scrollée). */
  transparent?: boolean
}

export function VitrineLogo({
  className,
  priority,
  variant = "default",
  transparent: _transparent = false,
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
          src={HEADER_LOGO_BRAND.src}
          alt={LOGO_ALT}
          width={HEADER_LOGO_BRAND.width}
          height={HEADER_LOGO_BRAND.height}
          sizes="148px"
          priority={priority}
          className="absolute inset-0 h-full w-full origin-center object-contain object-center lg:origin-left lg:object-left"
        />
      </span>
    )
  }

  const footerLogo = HEADER_LOGO_ON_DARK

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
        width={variant === "footer" ? footerLogo.width : HEADER_LOGO_BRAND.width}
        height={variant === "footer" ? footerLogo.height : HEADER_LOGO_BRAND.height}
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