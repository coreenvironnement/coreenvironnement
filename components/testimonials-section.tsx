import Image from "next/image"
import { Star } from "lucide-react"

import { ParticulierTestimonialIcon } from "@/components/vitrine/particulier-testimonial-icon"
import {
  testimonialsEntreprisesAvecLogo,
  testimonialsParticuliers,
} from "@/lib/testimonials"
import type { ClientSegment, Testimonial } from "@/lib/testimonials"
import { cn } from "@/lib/utils"

function SegmentBadge({
  segment,
  vitrine,
}: {
  segment: ClientSegment
  vitrine?: boolean
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide",
        vitrine && "font-[family-name:var(--font-body)]",
        segment === "pro"
          ? "bg-brand-navy/10 text-brand-navy"
          : vitrine
            ? "bg-brand-green/12 text-brand-green-dark"
            : "bg-primary/12 text-brand-green-dark"
      )}
    >
      {segment === "pro" ? "Pro" : "Particulier"}
    </span>
  )
}

function StarRating() {
  return (
    <div
      className="mb-3 flex items-center gap-0.5"
      role="img"
      aria-label="5 sur 5 étoiles"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="size-4 shrink-0 fill-amber-400 text-amber-400"
          aria-hidden
        />
      ))}
    </div>
  )
}

function cardArticleClass(vitrine?: boolean, extra?: string) {
  return cn(
    "flex flex-col rounded-2xl p-4 sm:p-5",
    vitrine
      ? "w-[calc(100vw-2rem)] shrink-0 snap-center border border-brand-border bg-brand-bg shadow-[var(--shadow-vitrine-soft)] sm:w-full sm:min-w-0"
      : "w-[min(100vw-3rem,380px)] shrink-0 snap-center sm:w-[calc(50%-0.75rem)] sm:max-w-none lg:w-[calc(33.333%-0.75rem)] border border-white/40 bg-card/90 shadow-[0_14px_50px_-28px_rgba(27,65,143,0.35)] backdrop-blur-sm",
    extra
  )
}

function TestimonialCard({
  t,
  i,
  withLogo,
  vitrine,
}: {
  t: Testimonial
  i: number
  withLogo: boolean
  vitrine?: boolean
}) {
  const logoAlt = t.logoSrc
    ? t.role.replace(/^.*?, /, "").trim() || "Entreprise"
    : ""

  return (
    <article
      className={cardArticleClass(vitrine)}
      style={{ animationDelay: `${i * 40}ms` }}
    >
      {withLogo && t.logoSrc ? (
        <div
          className={cn(
            "mb-4 flex min-h-[3rem] items-center justify-between gap-3 border-b pb-3",
            vitrine ? "border-brand-border" : "border-border/40"
          )}
        >
          <div className="relative h-11 w-[min(152px,45%)] shrink-0">
            <Image
              src={t.logoSrc}
              alt={logoAlt}
              fill
              className="object-contain object-left"
              sizes="152px"
            />
          </div>
          <SegmentBadge segment={t.segment} vitrine={vitrine} />
        </div>
      ) : (
        <div
          className={cn(
            "mb-4 flex min-h-[3rem] items-center justify-between gap-3 border-b pb-3",
            vitrine ? "border-brand-border" : "border-border/40"
          )}
        >
          <ParticulierTestimonialIcon
            className={vitrine ? "text-brand-navy/70" : "text-primary/85"}
          />
          <SegmentBadge segment={t.segment} vitrine={vitrine} />
        </div>
      )}
      <StarRating />
      <blockquote
        className={cn(
          "flex-1 text-sm leading-relaxed sm:text-[0.95rem]",
          vitrine ? "text-brand-text" : "text-foreground"
        )}
      >
        «&nbsp;{t.quote}&nbsp;»
      </blockquote>
      <footer
        className={cn(
          "mt-4 border-t pt-3",
          vitrine ? "border-brand-border" : "border-border/50"
        )}
      >
        <p className={cn("font-semibold text-brand-navy", vitrine && "font-[family-name:var(--font-display)]")}>
          {t.author}
        </p>
        <p
          className={cn(
            "mt-1 text-xs sm:text-sm",
            vitrine ? "text-brand-muted" : "text-muted-foreground"
          )}
        >
          {t.role}
        </p>
      </footer>
    </article>
  )
}

const vitrineTestimonials: Testimonial[] = [
  ...(testimonialsEntreprisesAvecLogo[0] ? [testimonialsEntreprisesAvecLogo[0]] : []),
  ...(testimonialsParticuliers[0] ? [testimonialsParticuliers[0]] : []),
  ...testimonialsEntreprisesAvecLogo.slice(1),
]

export function TestimonialsSection({ vitrine = false }: { vitrine?: boolean }) {
  return (
    <section
      id="temoignages"
      className={cn(
        "py-14 sm:py-20",
        vitrine
          ? "border-t border-brand-border bg-brand-bg"
          : "border-t border-border/40 bg-[color-mix(in_srgb,var(--secondary)_42%,transparent)]"
      )}
    >
      <div className={cn("mx-auto max-w-6xl px-4 sm:px-6 lg:px-8", vitrine && "container-x max-w-7xl")}>
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className={cn(vitrine ? "section-eyebrow" : "text-xs font-semibold uppercase tracking-[0.22em] text-primary")}>
            Témoignages
          </p>
          <h2 className={cn("mt-2 text-balance sm:text-3xl", vitrine ? "section-title mt-3" : "text-2xl font-bold tracking-tight text-brand-navy")}>
            Ils nous font confiance sur le terrain
          </h2>
          <p className={cn("mt-3 text-sm sm:text-base", vitrine ? "text-brand-muted" : "text-muted-foreground")}>
            Retours de chefs de chantier, artisans et particuliers : ponctualité,
            sérieux et suivi au quotidien.
          </p>
        </div>

        {vitrine ? (
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-4 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-4 sm:overflow-visible sm:pb-0 sm:pl-0 sm:pr-0 lg:grid-cols-3">
            {vitrineTestimonials.map((t, i) => (
              <TestimonialCard
                key={t.id}
                t={t}
                i={i}
                withLogo={Boolean(t.logoSrc)}
                vitrine
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-11">
              <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-6 sm:-mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 sm:pl-0 sm:pr-0">
                {testimonialsEntreprisesAvecLogo.map((t, i) => (
                  <TestimonialCard key={t.id} t={t} i={i} withLogo vitrine={vitrine} />
                ))}
              </div>
            </div>

            {testimonialsParticuliers.length > 0 && (
              <div>
                <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-6 sm:-mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 sm:pl-0 sm:pr-0">
                  {testimonialsParticuliers.map((t, i) => (
                    <TestimonialCard key={t.id} t={t} i={i} withLogo={false} vitrine={vitrine} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
