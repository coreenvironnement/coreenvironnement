"use client"

import { useCallback, useEffect, useRef } from "react"
import {
  ClipboardText,
  MapPin,
  Truck,
  type Icon as PhosphorIcon,
} from "@phosphor-icons/react"

import type { OrderAudience } from "@/components/order/order-audience-toggle"
import { cn } from "@/lib/utils"

type ReassuranceItem = {
  Icon: PhosphorIcon
  label: string
  description: string
}

const REASSURANCE_PARTICULIER: ReassuranceItem[] = [
  {
    Icon: Truck,
    label: "Livraison possible sous 24 h",
    description: "Selon votre adresse de livraison et les disponibilités.",
  },
  {
    Icon: ClipboardText,
    label: "Suivi de commande en ligne",
    description:
      "Consultez l’avancement de votre commande depuis votre espace client.",
  },
  {
    Icon: MapPin,
    label: "Livraison en Île-de-France",
    description:
      "Livraison et enlèvement à l’adresse de vos travaux ou de votre débarras.",
  },
]

const REASSURANCE_PROFESSIONNEL: ReassuranceItem[] = [
  {
    Icon: Truck,
    label: "Livraison possible sous 24 h",
    description:
      "Selon vos adresses de livraison et les disponibilités sur vos chantiers.",
  },
  {
    Icon: ClipboardText,
    label: "Suivi de commande en ligne",
    description:
      "Consultez l’avancement de vos demandes depuis votre espace client.",
  },
  {
    Icon: MapPin,
    label: "Livraison en Île-de-France",
    description: "Un interlocuteur unique pour l’ensemble de vos sites.",
  },
]

const AUTO_PLAY_MS = 4800
const RESUME_AFTER_MS = 4000

type VitrineHeroReassuranceProps = {
  className?: string
  audience?: OrderAudience
}

export function VitrineHeroReassurance({
  className,
  audience = "particulier",
}: VitrineHeroReassuranceProps) {
  const reassurance =
    audience === "professionnel"
      ? REASSURANCE_PROFESSIONNEL
      : REASSURANCE_PARTICULIER

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

  const scrollToSlide = useCallback(
    (index: number, behavior: ScrollBehavior = "smooth") => {
      const viewport = viewportRef.current
      if (!viewport) return

      const slideCount = reassurance.length
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
    },
    [reassurance.length]
  )

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
        reassurance.length - 1
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
  }, [pauseAutoPlay, reassurance.length, scrollToSlide])

  const renderIcon = (Icon: PhosphorIcon, size: 20 | 24) => (
    <Icon size={size} weight="regular" className="text-white" aria-hidden />
  )

  return (
    <aside
      aria-label="Nos engagements"
      className={cn("animate-fade-up relative isolate w-full", className)}
      style={{ animationDelay: "380ms" }}
    >
      <div
        ref={viewportRef}
        role="list"
        aria-roledescription="carousel"
        className="hero-reassurance-carousel relative flex bg-[linear-gradient(180deg,#1a3d1c_0%,#122a14_48%,#0c1810_100%)] md:hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        {reassurance.map((item, index) => (
          <div
            key={item.label}
            role="listitem"
            className={cn(
              "hero-reassurance-carousel__slide flex shrink-0 items-center justify-center gap-3 px-5 py-4",
              index > 0 && "border-t border-white/[0.06]"
            )}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px]">
              {renderIcon(item.Icon, 20)}
            </span>
            <div className="min-w-0 text-center">
              <p className="text-[14px] font-semibold leading-snug tracking-[-0.01em] text-white">
                {item.label}
              </p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-slate-300">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div
        role="list"
        className="relative hidden bg-[linear-gradient(180deg,#1a3d1c_0%,#122a14_48%,#0c1810_100%)] md:block"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div className="container-x relative grid grid-cols-3 py-7 lg:py-8">
          {reassurance.map((item, index) => (
            <div
              key={item.label}
              role="listitem"
              className={cn(
                "flex items-start gap-4 px-6 lg:gap-5 lg:px-8 xl:px-10",
                index > 0 && "border-l border-white/[0.06]"
              )}
            >
              <span className="flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px] lg:size-[3.75rem] lg:rounded-[0.875rem]">
                {renderIcon(item.Icon, 24)}
              </span>
              <div className="min-w-0 pt-0.5">
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white lg:text-base">
                  {item.label}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-slate-300 lg:mt-1.5">
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
