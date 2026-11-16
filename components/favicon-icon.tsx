import Image from "next/image"

import { cn } from "@/lib/utils"

export const CORE_FAVICON_SRC = "/images/faviconcore-environnement.png"

type FaviconIconProps = {
  size?: number
  className?: string
  /** Icône décorative (aria-hidden, alt vide) — défaut true */
  decorative?: boolean
  alt?: string
}

export function FaviconIcon({
  size = 24,
  className,
  decorative = true,
  alt = "CORE Environnement",
}: FaviconIconProps) {
  return (
    <Image
      src={CORE_FAVICON_SRC}
      alt={decorative ? "" : alt}
      width={size}
      height={size}
      className={cn("shrink-0 object-contain", className)}
      aria-hidden={decorative ? true : undefined}
    />
  )
}