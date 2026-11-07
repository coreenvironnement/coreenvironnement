import Image from "next/image"
import { Star } from "lucide-react"

import {
  SITE_GOOGLE_MAPS_PIN_SRC,
  SITE_GOOGLE_MAPS_URL,
  SITE_GOOGLE_RATING,
} from "@/lib/site"
import { cn } from "@/lib/utils"

type GoogleRatingBadgeProps = {
  className?: string
  /** Sur le hero sombre ou sur la carte claire du formulaire. */
  variant?: "hero" | "card"
  /** Texte court pour la zone de présentation du hero particulier. */
  compact?: boolean
}

function RatingStars({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center justify-center gap-0.5", className)} aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="size-3.5 shrink-0 fill-amber-400 text-amber-400 sm:size-4"
        />
      ))}
    </span>
  )
}

export function GoogleRatingBadge({
  className,
  variant = "hero",
  compact = false,
}: GoogleRatingBadgeProps) {
  const ratingLabel = SITE_GOOGLE_RATING.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  const isCard = variant === "card"
  const textPrimary = isCard ? "text-brand-navy" : "text-white"
  const textSecondary = isCard ? "text-brand-muted" : "text-white/85"

  return (
    <a
      href={SITE_GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex max-w-full items-center justify-center gap-2.5 rounded-full border px-3.5 py-1.5 backdrop-blur-md transition duration-300",
        isCard
          ? "border-brand-navy/10 bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_20px_-10px_rgba(14,32,16,0.25)] hover:border-brand-green/25 hover:bg-white/90"
          : "border-white/22 bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_-14px_rgba(0,0,0,0.45)] hover:border-white/38 hover:bg-white/[0.14]",
        compact && !isCard && "gap-2 px-3 py-1.5 sm:gap-2.5 sm:px-3.5",
        className
      )}
      aria-label={`Note Google ${ratingLabel} sur 5 — voir sur Google Maps`}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm sm:size-9">
        <Image
          src={SITE_GOOGLE_MAPS_PIN_SRC}
          alt=""
          width={28}
          height={28}
          className="size-6 object-contain sm:size-7"
          aria-hidden
        />
      </span>
      <span className="flex min-w-0 flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center">
        <RatingStars />
        <span
          className={cn(
            "text-[13px] font-semibold leading-snug tracking-[-0.01em] sm:text-[14px]",
            textPrimary
          )}
        >
          {ratingLabel} sur 5
          <span className={cn("font-medium", textSecondary)}>
            {" "}
            · Sur Google
          </span>
        </span>
      </span>
    </a>
  )
}
