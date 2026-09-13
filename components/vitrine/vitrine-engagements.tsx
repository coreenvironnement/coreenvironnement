"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  AlarmClockCheckIcon,
  DashboardSpeed01Icon,
  Recycle03Icon,
  SecurityCheckIcon,
} from "@hugeicons/core-free-icons"

import { engagements } from "@/lib/cdc/contenu-vitrine"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"

const STEP_META = [
  { verb: "INTERVENIR", icon: AlarmClockCheckIcon },
  { verb: "SUIVRE", icon: DashboardSpeed01Icon },
  { verb: "TRACER", icon: SecurityCheckIcon },
  { verb: "VALORISER", icon: Recycle03Icon },
] as const

const EMPHASIS_PHRASES = [
  "intervention rapide sur vos chantiers en Île-de-France",
  "espace client digital",
  "l'avancée de la prestation",
  "bons d'intervention",
  "bons de pesée",
  "Bordereaux de Suivi de Déchets (BSD)",
  "couvert vis-à-vis des contrôles",
  "plus de 90 % des déchets collectés",
  "filières de tri et de valorisation agréées",
  "taux de recyclage",
] as const

const emphasisPattern = new RegExp(
  `(${EMPHASIS_PHRASES.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
  "gi"
)

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return reduced
}

function useDesktopEngagements() {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)")
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return isDesktop
}

function useStepReveal(reduced: boolean, enabled: boolean) {
  const ref = useRef<HTMLLIElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!enabled || reduced) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enabled, reduced])

  return { ref, shown }
}

function EngagementText({ text }: { text: string }) {
  const parts = text.split(emphasisPattern)

  return (
    <>
      {parts.map((part, index) => {
        const emphasized = EMPHASIS_PHRASES.some(
          (phrase) => phrase.toLowerCase() === part.toLowerCase()
        )
        if (emphasized) {
          return (
            <strong key={`${part}-${index}`} className="font-medium text-brand-text">
              {part}
            </strong>
          )
        }
        return part
      })}
    </>
  )
}

function EngagementStep({
  item,
  index,
  isLast,
  isActive,
  isEntering,
  reduced,
  mobileReveal,
}: {
  item: (typeof engagements)[number]
  index: number
  isLast: boolean
  isActive: boolean
  isEntering: boolean
  reduced: boolean
  mobileReveal: boolean
}) {
  const step = STEP_META[index]
  const isDigital = item.titre.toLowerCase().includes("suivi digital")
  const { ref, shown } = useStepReveal(reduced, mobileReveal)

  return (
    <li
      ref={ref}
      data-step={index}
      className="engagements-step relative"
      style={
        mobileReveal && !shown && !reduced
          ? { opacity: 0, transform: "translateY(10px)" }
          : mobileReveal && shown && !reduced
            ? {
                opacity: 1,
                transform: "translateY(0)",
                transition: "opacity 320ms ease-out, transform 320ms ease-out",
              }
            : undefined
      }
    >
      <article className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 sm:gap-x-5">
        <div className="flex flex-col items-center">
          <span
            className={cn(
              "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-white transition-[border-color,box-shadow,color] duration-300 sm:h-[3.25rem] sm:w-[3.25rem]",
              isActive
                ? "border-[#35A238]/35 text-brand-navy shadow-[0_3px_14px_-4px_rgba(53,162,56,0.22)]"
                : "border-[#d5ddd9] text-brand-navy/75 shadow-[0_2px_10px_-4px_rgba(24,53,116,0.1)]",
              isDigital && !isActive && "border-brand-sky/25 text-brand-sky/80"
            )}
          >
            <HugeiconsIcon
              icon={step.icon}
              size={21}
              strokeWidth={VITRINE_ICON_STROKE}
              aria-hidden
            />
          </span>
          {!isLast ? (
            <span
              aria-hidden
              className="engagements-step-rail mt-3 mb-1 w-[1.5px] flex-1 min-h-[2.5rem] bg-[#cfd9d3] lg:hidden"
            />
          ) : null}
        </div>

        <div
          className={cn(
            isLast ? "pb-0" : "pb-10 sm:pb-12 lg:pb-14",
            "transition-opacity duration-300 ease-out",
            !isActive && "lg:opacity-[0.62]"
          )}
          style={
            isEntering && !reduced
              ? { animation: "engagement-step-enter 300ms ease-out both" }
              : undefined
          }
        >
          <p className="vitrine-label flex flex-wrap items-center gap-x-2 transition-colors duration-300">
            <span
              className={cn(
                isActive ? "text-[#35A238]" : "text-brand-navy/45 lg:text-brand-muted"
              )}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="text-brand-border">
              —
            </span>
            <span
              className={cn(
                "tracking-[0.16em] transition-colors duration-300",
                isActive ? "text-[#35A238]/90" : "text-brand-muted"
              )}
            >
              {step.verb}
            </span>
          </p>
          <h3
            className={cn(
              "mt-2 text-lg leading-snug transition-colors duration-300 sm:text-[1.125rem]",
              isActive ? "text-brand-navy" : "text-brand-navy/72"
            )}
          >
            {item.titre}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-[15px] sm:leading-[1.72]">
            <EngagementText text={item.texte} />
          </p>
        </div>
      </article>

      {!isLast ? (
        <div
          aria-hidden
          className="engagements-step-divider ml-[calc(3rem+1rem)] border-b border-brand-border/90 sm:ml-[calc(3.25rem+1.25rem)]"
        />
      ) : null}
    </li>
  )
}

export function VitrineEngagements() {
  const reduced = usePrefersReducedMotion()
  const isDesktop = useDesktopEngagements()
  const listRef = useRef<HTMLOListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [enterIndex, setEnterIndex] = useState<number | null>(null)
  const [railFill, setRailFill] = useState(0)
  const hasMountedRef = useRef(false)

  useEffect(() => {
    if (!isDesktop || reduced) {
      setRailFill(1)
      return
    }

    const list = listRef.current
    if (!list) return

    const updateProgress = () => {
      const rect = list.getBoundingClientRect()
      const focal = window.innerHeight * 0.42
      const traveled = focal - rect.top
      const progress = Math.min(1, Math.max(0, traveled / Math.max(rect.height, 1)))
      setRailFill(progress)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)
    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [isDesktop, reduced])

  useEffect(() => {
    if (!isDesktop || reduced) return

    const nodes = listRef.current?.querySelectorAll<HTMLElement>("[data-step]")
    if (!nodes?.length) return

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          const idx = Number(visible[0].target.getAttribute("data-step"))
          if (!Number.isNaN(idx)) {
            setActiveIndex(idx)
          }
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 }
    )

    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [isDesktop, reduced])

  useEffect(() => {
    if (!isDesktop || reduced) return
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    setEnterIndex(activeIndex)
    const timer = window.setTimeout(() => setEnterIndex(null), 320)
    return () => window.clearTimeout(timer)
  }, [activeIndex, isDesktop, reduced])

  return (
    <section id="engagements" className="bg-[#FAFBFA] py-16 sm:py-20 lg:py-[5.5rem]">
      <div className="container-x">
        <div className="lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,4fr)] lg:items-start lg:gap-12 xl:gap-16">
          <header className="lg:sticky lg:top-28 lg:self-start">
            <p className="section-eyebrow">Nos engagements</p>
            <h2 className="section-title mt-3 max-w-[18rem]">
              Réactivité, transparence et conformité
            </h2>
            <p className="mt-4 max-w-[30rem] text-sm leading-relaxed text-brand-muted sm:mt-5 sm:text-[15px] sm:leading-[1.72]">
              De la première dépose jusqu&apos;au recyclage final, CORE ENVIRONNEMENT coordonne
              chaque étape pour une gestion des déchets simple, transparente et conforme.
            </p>
            <p className="mt-5 text-[13px] font-medium tracking-[0.02em] text-brand-navy/55 sm:mt-6">
              Un seul interlocuteur. Un suivi complet.
            </p>
          </header>

          <ol ref={listRef} className="engagements-steps relative mt-12 lg:mt-0">
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-16 left-[23px] top-6 hidden w-[1.5px] overflow-hidden rounded-full bg-[#cfd9d3] lg:block sm:left-[25px]"
            >
              <div
                className="w-full bg-[#35A238] transition-[height] duration-150 ease-out"
                style={{ height: `${railFill * 100}%` }}
              />
            </div>

            {engagements.map((item, index) => {
              const isLast = index === engagements.length - 1
              const scrollEnhanced = isDesktop && !reduced
              const isActive = scrollEnhanced ? activeIndex === index : true

              return (
                <EngagementStep
                  key={item.titre}
                  item={item}
                  index={index}
                  isLast={isLast}
                  isActive={isActive}
                  isEntering={enterIndex === index}
                  reduced={reduced}
                  mobileReveal={!isDesktop}
                />
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
