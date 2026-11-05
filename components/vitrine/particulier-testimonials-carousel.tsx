"use client"

import { useCallback, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

import type { Testimonial } from "@/lib/testimonials"
import { cn } from "@/lib/utils"

export function particulierTestimonialSource(t: Testimonial): string {
  return t.id === "google-habib-s" ? "Avis Google" : t.role
}

function StarRatingParticulier() {
  return (
    <div
      className="mb-2.5 flex items-center justify-start gap-0.5"
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

export function TestimonialCardParticulierVitrine({
  t,
  i,
  mobileCarousel,
}: {
  t: Testimonial
  i: number
  mobileCarousel?: boolean
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-2xl border border-brand-green/14 bg-brand-warm-field p-4 text-left shadow-[var(--shadow-vitrine-soft)] sm:p-5",
        mobileCarousel ? "w-full" : "w-full sm:min-w-0"
      )}
      style={{ animationDelay: `${i * 40}ms` }}
    >
      <StarRatingParticulier />
      <blockquote className="flex-1 text-left text-sm leading-relaxed text-brand-text sm:text-[0.95rem]">
        «&nbsp;{t.quote}&nbsp;»
      </blockquote>
      <footer className="mt-5 border-t border-brand-border pt-4 text-left">
        <p className="font-semibold text-brand-navy font-[family-name:var(--font-display)]">
          {t.author}
        </p>
        <p className="mt-1 text-xs font-medium text-brand-muted sm:text-sm">
          {particulierTestimonialSource(t)}
        </p>
      </footer>
    </article>
  )
}

type Props = {
  items: Testimonial[]
}

export function ParticulierTestimonialsCarousel({ items }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const scrollToIndex = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const viewport = viewportRef.current
      if (!viewport || items.length === 0) return

      const normalized =
        ((index % items.length) + items.length) % items.length
      setActiveIndex(normalized)

      const slideWidth = viewport.clientWidth
      viewport.scrollTo({
        left: normalized * slideWidth,
        behavior,
      })
    },
    [items.length]
  )

  const goPrev = useCallback(() => {
    scrollToIndex(activeIndex - 1)
  }, [activeIndex, scrollToIndex])

  const goNext = useCallback(() => {
    scrollToIndex(activeIndex + 1)
  }, [activeIndex, scrollToIndex])

  const onScroll = useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport || items.length === 0) return

    const slideWidth = viewport.clientWidth
    if (slideWidth <= 0) return

    const index = Math.round(viewport.scrollLeft / slideWidth)
    const clamped = Math.min(Math.max(index, 0), items.length - 1)
    setActiveIndex((prev) => (prev === clamped ? prev : clamped))
  }, [items.length])

  return (
    <>
      <div className="relative sm:hidden">
        <div
          ref={viewportRef}
          onScroll={onScroll}
          aria-roledescription="carousel"
          aria-label="Avis clients"
          className="particulier-testimonials-carousel flex snap-x snap-mandatory gap-0 overflow-x-auto overflow-y-hidden overscroll-x-contain"
        >
          {items.map((t, i) => (
            <div
              key={t.id}
              data-testimonial-slide
              className="min-w-0 shrink-0 grow-0 basis-full snap-start snap-always"
              aria-hidden={i !== activeIndex}
            >
              <TestimonialCardParticulierVitrine t={t} i={i} mobileCarousel />
            </div>
          ))}
        </div>

        {items.length > 1 ? (
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border border-brand-green/20 bg-brand-bg-alt text-brand-navy shadow-[var(--shadow-vitrine-soft)] transition-colors",
                "hover:border-brand-green/35 hover:bg-brand-warm-field",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              )}
              aria-label="Avis précédent"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={goNext}
              className={cn(
                "inline-flex size-10 items-center justify-center rounded-full border border-brand-green/20 bg-brand-bg-alt text-brand-navy shadow-[var(--shadow-vitrine-soft)] transition-colors",
                "hover:border-brand-green/35 hover:bg-brand-warm-field",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green"
              )}
              aria-label="Avis suivant"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      <div className="hidden gap-4 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <TestimonialCardParticulierVitrine key={t.id} t={t} i={i} />
        ))}
      </div>
    </>
  )
}
