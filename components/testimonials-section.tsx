import { Quote } from "lucide-react"

import { testimonials } from "@/lib/testimonials"
import type { ClientSegment } from "@/lib/testimonials"

function SegmentBadge({ segment }: { segment: ClientSegment }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide ${
        segment === "pro"
          ? "bg-brand-navy/10 text-brand-navy"
          : "bg-primary/12 text-brand-green-dark"
      }`}
    >
      {segment === "pro" ? "Pro" : "Particulier"}
    </span>
  )
}

export function TestimonialsSection() {
  return (
    <section
      id="temoignages"
      className="border-t border-border/40 bg-muted/35 py-14 sm:py-20"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Témoignages
          </p>
          <h2 className="mt-2 text-balance text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">
            Ils nous font confiance sur le terrain
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Retours de chefs de chantier, artisans et particuliers — ponctualité,
            sérieux et suivi au quotidien.
          </p>
        </div>

        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pl-4 pr-6 sm:-mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:pb-0 sm:pl-0 sm:pr-0">
          {testimonials.map((t, i) => (
            <article
              key={t.id}
              className="flex w-[min(100vw-3rem,380px)] shrink-0 snap-center flex-col rounded-2xl border border-white/70 bg-card/95 p-5 shadow-[0_14px_50px_-28px_rgba(27,65,143,0.35)] backdrop-blur-sm sm:w-[calc(50%-0.75rem)] sm:max-w-none lg:w-[calc(33.333%-0.75rem)]"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <Quote
                  className="size-8 shrink-0 text-primary/85"
                  aria-hidden
                />
                <SegmentBadge segment={t.segment} />
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-foreground sm:text-[0.95rem]">
                «&nbsp;{t.quote}&nbsp;»
              </blockquote>
              <footer className="mt-4 border-t border-border/50 pt-3">
                <p className="font-semibold text-brand-navy">— {t.author}</p>
                <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {t.role}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
