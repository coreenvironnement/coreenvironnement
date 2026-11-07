"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type TouchEvent,
} from "react"
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
    Icon: ClipboardText,
    label: "Votre demande en ligne",
    description:
      "Renseignez l’adresse, les déchets et le volume pour préparer votre besoin.",
  },
  {
    Icon: Truck,
    label: "Suivi de commande en ligne",
    description:
      "Retrouvez l’avancement de vos commandes confirmées dans votre espace client.",
  },
  {
    Icon: MapPin,
    label: "Vos chantiers en Île-de-France",
    description: "Consultez les offres proposées à l’adresse de votre chantier.",
  },
]

const AUTO_PLAY_MS = 5000
const RESUME_AFTER_MS = 4000
const SWIPE_THRESHOLD_PX = 48

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

  const [activeIndex, setActiveIndex] = useState(0)
  const pauseUntilRef = useRef(0)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchStartXRef = useRef<number | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const reducedMotionRef = useRef(false)

  const slideCount = reassurance.length

  const pauseAutoPlay = useCallback((durationMs = RESUME_AFTER_MS) => {
    pauseUntilRef.current = Date.now() + durationMs
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current)
    }
    resumeTimeoutRef.current = setTimeout(() => {
      pauseUntilRef.current = 0
    }, durationMs)
  }, [])

  const goToSlide = useCallback(
    (index: number) => {
      const normalized =
        ((index % slideCount) + slideCount) % slideCount
      setActiveIndex(normalized)
    },
    [slideCount]
  )

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1)
  }, [activeIndex, goToSlide])

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1)
  }, [activeIndex, goToSlide])

  useEffect(() => {
    setActiveIndex(0)
  }, [audience])

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncReducedMotion = () => {
      reducedMotionRef.current = mediaQuery.matches
    }
    syncReducedMotion()
    mediaQuery.addEventListener("change", syncReducedMotion)

    if (mediaQuery.matches) return () => {
      mediaQuery.removeEventListener("change", syncReducedMotion)
    }

    const tick = () => {
      if (Date.now() < pauseUntilRef.current) return
      setActiveIndex((current) => (current + 1) % slideCount)
    }

    const intervalId = window.setInterval(tick, AUTO_PLAY_MS)

    return () => {
      window.clearInterval(intervalId)
      mediaQuery.removeEventListener("change", syncReducedMotion)
      if (resumeTimeoutRef.current) {
        clearTimeout(resumeTimeoutRef.current)
      }
    }
  }, [slideCount])

  const onCarouselKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight") {
      event.preventDefault()
      goNext()
      pauseAutoPlay()
    } else if (event.key === "ArrowLeft") {
      event.preventDefault()
      goPrev()
      pauseAutoPlay()
    } else if (event.key === "Home") {
      event.preventDefault()
      goToSlide(0)
      pauseAutoPlay()
    } else if (event.key === "End") {
      event.preventDefault()
      goToSlide(slideCount - 1)
      pauseAutoPlay()
    }
  }

  const onTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.changedTouches[0]?.clientX ?? null
    pauseAutoPlay()
  }

  const onTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartXRef.current
    touchStartXRef.current = null
    if (startX == null) return

    const endX = event.changedTouches[0]?.clientX
    if (endX == null) return

    const delta = endX - startX
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return

    if (delta < 0) {
      goNext()
    } else {
      goPrev()
    }
    pauseAutoPlay()
  }

  const renderIcon = (Icon: PhosphorIcon, size: 20 | 22 | 24) => (
    <Icon size={size} weight="regular" className="text-white" aria-hidden />
  )

  const mobileSlideId = (index: number) => `hero-reassurance-slide-${index}`

  return (
    <aside
      aria-label="Nos engagements"
      className={cn("animate-fade-up relative isolate w-full", className)}
      style={{ animationDelay: "380ms" }}
    >
      <div className="hero-reassurance-carousel-wrap relative md:hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />

        <div
          ref={carouselRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Arguments de réassurance"
          tabIndex={0}
          onKeyDown={onCarouselKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onPointerDown={() => pauseAutoPlay()}
          onFocus={() => pauseAutoPlay()}
          className="hero-reassurance-carousel relative bg-[linear-gradient(180deg,#1a3d1c_0%,#122a14_48%,#0c1810_100%)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/25"
        >
          <div className="hero-reassurance-carousel__stage grid grid-cols-1 grid-rows-1">
            {reassurance.map((item, index) => (
              <div
                key={item.label}
                id={mobileSlideId(index)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} sur ${slideCount}`}
                aria-hidden={index !== activeIndex}
                className={cn(
                  "hero-reassurance-carousel__slide col-start-1 row-start-1 flex w-full flex-col items-center justify-center gap-2 px-4 py-4 text-center sm:gap-2.5 sm:px-5",
                  index === activeIndex
                    ? "hero-reassurance-carousel__slide--active"
                    : "hero-reassurance-carousel__slide--inactive"
                )}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px]">
                  {renderIcon(item.Icon, 22)}
                </span>
                <p className="max-w-[20rem] text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white">
                  {item.label}
                </p>
                <p className="max-w-[22rem] text-[12px] leading-relaxed text-[#b5d0b8] sm:text-[13px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div
            className="hero-reassurance-carousel__indicators flex items-center justify-center gap-2.5 px-4 pb-3.5 pt-0"
            role="tablist"
            aria-label="Choisir un argument"
          >
            {reassurance.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                id={`hero-reassurance-tab-${index}`}
                aria-selected={index === activeIndex}
                aria-controls={mobileSlideId(index)}
                tabIndex={index === activeIndex ? 0 : -1}
                onClick={() => {
                  goToSlide(index)
                  pauseAutoPlay()
                }}
                onKeyDown={(event) => {
                  if (event.key === "ArrowRight") {
                    event.preventDefault()
                    goToSlide((index + 1) % slideCount)
                    pauseAutoPlay()
                  } else if (event.key === "ArrowLeft") {
                    event.preventDefault()
                    goToSlide((index - 1 + slideCount) % slideCount)
                    pauseAutoPlay()
                  }
                }}
                className="hero-reassurance-carousel__indicator flex h-6 items-center justify-center rounded-sm p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35"
              >
                <span
                  aria-hidden
                  className={cn(
                    "hero-reassurance-carousel__indicator-line block rounded-full transition-[width,opacity,background-color] duration-300 ease-out",
                    index === activeIndex
                      ? "hero-reassurance-carousel__indicator-line--active"
                      : "hero-reassurance-carousel__indicator-line--idle"
                  )}
                />
                <span className="sr-only">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
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
