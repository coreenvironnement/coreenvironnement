import Image from "next/image"
import { Star } from "lucide-react"

import {
  SITE_GOOGLE_MAPS_PIN_SRC,
  SITE_GOOGLE_MAPS_URL,
  SITE_GOOGLE_RATING,
  SITE_GOOGLE_REVIEW_COUNT,
} from "@/lib/site"
import { cn } from "@/lib/utils"

type GoogleRatingBadgeProps = {
  className?: string
  /** Sur le hero sombre ou sur la carte claire du formulaire. */
  variant?: "hero" | "card"
  /** Texte court pour la zone de présentation du hero particulier. */
  compact?: boolean
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

  return (
    <a
      href={SITE_GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex max-w-full items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 backdrop-blur-md transition duration-300",
        isCard
          ? "border-brand-navy/10 bg-white/75 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_6px_20px_-10px_rgba(14,32,16,0.25)] hover:border-brand-green/25 hover:bg-white/90"
          : "border-white/22 bg-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_-14px_rgba(0,0,0,0.45)] hover:border-white/38 hover:bg-white/[0.14]",
        className
      )}
      aria-label={`Note Google ${ratingLabel} sur 5, ${SITE_GOOGLE_REVIEW_COUNT} avis — voir sur Google Maps`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm">
        <Image
          src={SITE_GOOGLE_MAPS_PIN_SRC}
          alt=""
          width={28}
          height={28}
          className="size-7 object-contain"
          aria-hidden
        />
      </span>
      <span className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
        {compact ? (
          <span
            className={cn(
              "text-left text-[13px] font-semibold leading-snug sm:text-[14px]",
              isCard ? "text-brand-navy" : "text-white"
            )}
          >
            {ratingLabel}/5 sur Google · {SITE_GOOGLE_REVIEW_COUNT} avis
          </span>
        ) : (
          <>
            <span className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="size-3.5 shrink-0 fill-amber-400 text-amber-400 sm:size-4"
                />
              ))}
            </span>
            <span
              className={cn(
                "text-left text-[13px] font-semibold leading-snug sm:text-[14px]",
                isCard ? "text-brand-navy" : "text-white"
              )}
            >
              Note Google {ratingLabel}{" "}
              <span
                className={cn(
                  "font-medium",
                  isCard ? "text-brand-muted" : "text-white/88"
                )}
              >
                ({SITE_GOOGLE_REVIEW_COUNT} avis)
              </span>
            </span>
          </>
        )}
      </span>
    </a>
  )
}
