"use client"

import { useCallback, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MapPinIcon,
  Timer01Icon,
  TwentyFourHoursClockIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"

const REASSURANCE = [
  {
    icon: TwentyFourHoursClockIcon,
    label: "Intervention 24h",
    description: "Une réponse rapide sur vos chantiers",
  },
  {
    icon: Timer01Icon,
    label: "Commande en 3 min",
    description: "Simple, rapide, 100 % en ligne",
  },
  {
    icon: MapPinIcon,
    label: "Toute l'Île-de-France",
    description: "À vos côtés partout dans la région",
  },
] as const

const AUTO_PLAY_MS = 4800
const RESUME_AFTER_MS = 4000

type VitrineHeroReassuranceProps = {
  className?: string
}

export function VitrineHeroReassurance({ className }: VitrineHeroReassuranceProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const pauseUntilRef = useRef(0)
  const slideIndexRef = useRef(0)
  const isAutoScrollingRef = useRef(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const pauseAutoPlay = useCallback((durationMs = RESUME_AFTER_MS) => {
    pauseUntilRef.current = Date.now() + durationMs
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => {
      pauseUntilRef.current = 0
    }, durationMs)
  }, [])

  const scrollToSlide = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const viewport = viewportRef.current
    if (!viewport) return

    const slideCount = REASSURANCE.length
    const normalizedIndex = ((index % slideCount) + slideCount) % slideCount
    slideIndexRef.current = normalizedIndex

    isAutoScrollingRef.current = true
    viewport.scrollTo({
      left: normalizedIndex * viewport.clientWidth,
      behavior,
    })

    window.setTimeout(() => {
      isAutoScrollingRef.current = false
    }, behavior === "smooth" ? 600 : 50)
  }, [])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (mediaQuery.matches) return

    const tick = () => {
      if (Date.now() < pauseUntilRef.current) return
      scrollToSlide(slideIndexRef.current + 1)
    }

    const intervalId = window.setInterval(tick, AUTO_PLAY_MS)

    const onUserIntent = () => pauseAutoPlay()

    const onScroll = () => {
      if (isAutoScrollingRef.current) return

      const width = viewport.clientWidth
      if (width <= 0) return

      slideIndexRef.current = Math.min(
        Math.round(viewport.scrollLeft / width),
        REASSURANCE.length - 1
      )
      pauseAutoPlay()
    }

    const onResize = () => scrollToSlide(slideIndexRef.current, "auto")

    viewport.addEventListener("touchstart", onUserIntent, { passive: true })
    viewport.addEventListener("pointerdown", onUserIntent)
    viewport.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize)

    return () => {
      window.clearInterval(intervalId)
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
      viewport.removeEventListener("touchstart", onUserIntent)
      viewport.removeEventListener("pointerdown", onUserIntent)
      viewport.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
    }
  }, [pauseAutoPlay, scrollToSlide])

  return (
    <aside
      aria-label="Nos engagements"
      className={cn("animate-fade-up relative isolate w-full", className)}
      style={{ animationDelay: "380ms" }}
    >
      {/* Mobile — bandeau navy premium, carrousel horizontal */}
      <div
        ref={viewportRef}
        role="list"
        aria-roledescription="carousel"
        className="hero-reassurance-carousel relative flex bg-[linear-gradient(180deg,#132a59_0%,#0e1e42_48%,#0b1732_100%)] md:hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-b from-transparent to-[#F3F7F5]/[0.06]"
        />

        {REASSURANCE.map((item) => (
          <div
            key={item.label}
            role="listitem"
            className="hero-reassurance-carousel__slide flex shrink-0 items-center justify-center gap-3 px-5 py-3.5"
          >
            <span className="relative flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px]">
              <span
                aria-hidden
                className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full border-2 border-[#0b1732] bg-brand-green"
              />
              <HugeiconsIcon
                icon={item.icon}
                size={20}
                strokeWidth={VITRINE_ICON_STROKE}
                className="text-white"
                aria-hidden
              />
            </span>

            <div className="min-w-0 text-left">
              <p className="text-[14px] font-semibold leading-snug tracking-[-0.01em] text-white">
                {item.label}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-[#94A3B8]">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop — extension premium intégrée au hero */}
      <div
        role="list"
        className="relative hidden bg-[linear-gradient(180deg,#132a59_0%,#0e1e42_48%,#0b1732_100%)] md:block"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#F3F7F5]/[0.06]"
        />

        <div className="container-x relative grid grid-cols-3 py-7 lg:py-8">
          {REASSURANCE.map((item, index) => (
            <div
              key={item.label}
              role="listitem"
              className={cn(
                "flex items-start gap-4 px-6 lg:gap-5 lg:px-8 xl:px-10",
                index > 0 && "border-l border-white/[0.06]"
              )}
            >
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px] lg:size-[3.75rem] lg:rounded-[0.875rem]">
                <span
                  aria-hidden
                  className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-[#0b1732] bg-brand-green"
                />
                <HugeiconsIcon
                  icon={item.icon}
                  size={24}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="text-white"
                  aria-hidden
                />
              </span>

              <div className="min-w-0 pt-0.5">
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white lg:text-base">
                  {item.label}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#94A3B8] lg:mt-1.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
