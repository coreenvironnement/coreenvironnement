import { Star } from "lucide-react"

import {
  SITE_GOOGLE_MAPS_URL,
  SITE_GOOGLE_RATING,
  SITE_GOOGLE_REVIEW_COUNT,
} from "@/lib/site"
import { cn } from "@/lib/utils"

type GoogleReviewsReassuranceProps = {
  className?: string
}

export function GoogleReviewsReassurance({ className }: GoogleReviewsReassuranceProps) {
  return (
    <section
      aria-labelledby="google-reviews-reassurance-title"
      className={cn(
        "border-t border-brand-border bg-brand-bg-alt py-8 sm:py-10",
        className
      )}
    >
      <div className="container-x max-w-3xl">
        <div className="rounded-[var(--radius-card)] border border-brand-green/20 bg-white/80 px-5 py-5 text-center shadow-[var(--shadow-vitrine-soft)] sm:px-8 sm:py-6">
          <h2
            id="google-reviews-reassurance-title"
            className="sr-only"
          >
            Avis clients Google
          </h2>
          <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm font-medium text-brand-navy sm:text-base">
            <span className="flex items-center gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className="size-4 shrink-0 fill-amber-400 text-amber-400 sm:size-[1.125rem]"
                />
              ))}
            </span>
            <span className="font-semibold text-brand-green-dark">
              {SITE_GOOGLE_RATING}/5
            </span>
            <span className="text-brand-muted" aria-hidden>
              —
            </span>
            <span className="text-brand-text">
              {SITE_GOOGLE_REVIEW_COUNT} avis clients Google
            </span>
          </p>
          <p className="mt-3">
            <a
              href={SITE_GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-brand-green underline-offset-2 transition-colors hover:text-brand-green-dark hover:underline"
            >
              Voir la fiche Google de Core Environnement
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
