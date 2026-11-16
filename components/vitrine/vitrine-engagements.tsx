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
import { TrackdechetsLogoMark } from "./trackdechets-official-badge"

const STEP_META = [
  { verb: "INTERVENIR", icon: AlarmClockCheckIcon },
  { verb: "SUIVRE", icon: DashboardSpeed01Icon },
  { verb: "TRACER", icon: SecurityCheckIcon },
  { verb: "VALORISER", icon: Recycle03Icon },
] as const

const EMPHASIS_PHRASES = [
  "intervention rapide sur vos chantiers en Île-de-France",
  "e-mail de confirmation",
  "vous rappelle pour caler la pose",
  "documents de traçabilité",
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
  scrollFocus,
  showTrackdechetsOnTracerStep,
}: {
  item: (typeof engagements)[number]
  index: number
  isLast: boolean
  isActive: boolean
  isEntering: boolean
  reduced: boolean
  mobileReveal: boolean
  scrollFocus: boolean
  showTrackdechetsOnTracerStep?: boolean
}) {
  const step = STEP_META[index]
  const isDigital = item.titre.toLowerCase().includes("suivi de la commande")
  const { ref, shown } = useStepReveal(reduced, mobileReveal)
  const focusReady = scrollFocus && (!mobileReveal || shown || reduced)

  return (
    <li
      ref={ref}
      data-step={index}
      className={cn(
        "engagements-step relative",
        isDigital && "engagements-step--digital",
        focusReady &&
          (isActive ? "engagements-step--active" : "engagements-step--inactive"),
        mobileReveal && !shown && !reduced && "engagements-step--awaiting-reveal",
        mobileReveal && shown && !reduced && "engagements-step--revealed"
      )}
    >
      <article
        className={cn(
          "engagements-step__card grid grid-cols-1 gap-y-3 sm:grid-cols-[minmax(3.25rem,auto)_minmax(0,1fr)] sm:gap-x-5 sm:gap-y-0"
        )}
      >
        <div className="engagements-step__marker flex flex-col items-center gap-2 sm:items-start">
          <span className="engagements-step__icon">
            <HugeiconsIcon
              icon={step.icon}
              size={20}
              strokeWidth={VITRINE_ICON_STROKE}
              aria-hidden
            />
          </span>
          <p
            className="engagements-step__kicker"
            aria-label={`Étape ${index + 1} : ${step.verb.charAt(0) + step.verb.slice(1).toLowerCase()}`}
          >
            <span className="engagements-step__kicker-num">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="engagements-step__kicker-rule" aria-hidden />
            <span className="engagements-step__kicker-verb">{step.verb}</span>
          </p>
        </div>

        <div
          className={cn(
            "engagements-step__body min-w-0",
            isLast ? "pb-0" : "pb-10 sm:pb-12 lg:pb-14",
            "transition-colors duration-300 ease-out"
          )}
          style={
            isEntering && !reduced
              ? { animation: "engagement-step-enter 300ms ease-out both" }
              : undefined
          }
        >
          <h3
            className={cn(
              "vitrine-h3 transition-colors duration-300",
              isActive ? "text-[#152a3b]" : "text-[#152a3b]/72"
            )}
          >
            {item.titre}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted sm:text-[15px] sm:leading-[1.72]">
            <EngagementText text={item.texte} />
          </p>
          {showTrackdechetsOnTracerStep && index === 2 ? (
            <div
              className={cn(
                "mt-5 flex max-w-[28rem] flex-col gap-3 rounded-2xl border border-brand-green/12 bg-white/65 px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:px-5",
                !isActive && "lg:opacity-90"
              )}
            >
              <TrackdechetsLogoMark size="md" className="mx-auto sm:mx-0" />
              <p className="text-center text-[12px] leading-relaxed text-brand-muted sm:text-left sm:text-[13px]">
                Édition des{" "}
                <strong className="font-medium text-brand-text">
                  Bordereaux de Suivi de Déchets (BSD)
                </strong>{" "}
                via la plateforme officielle Trackdéchets.
              </p>
            </div>
          ) : null}
        </div>
      </article>
    </li>
  )
}

type VitrineEngagementsProps = {
  /** Bloc 03 TRACER : logo officiel (page professionnels). */
  showTrackdechetsOnTracerStep?: boolean
}

export function VitrineEngagements({
  showTrackdechetsOnTracerStep = false,
}: VitrineEngagementsProps) {
  const reduced = usePrefersReducedMotion()
  const isDesktop = useDesktopEngagements()
  const listRef = useRef<HTMLOListElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [stepFocusEngaged, setStepFocusEngaged] = useState(false)
  const [enterIndex, setEnterIndex] = useState<number | null>(null)
  const hasMountedRef = useRef(false)

  const scrollFocus = !reduced
  const headerInactive = scrollFocus && stepFocusEngaged

  useEffect(() => {
    if (!scrollFocus) return

    const nodes = listRef.current?.querySelectorAll<HTMLElement>("[data-step]")
    if (!nodes?.length) return

    const inFocusBand = new Map<number, DOMRectReadOnly>()

    const syncActiveFromBand = () => {
      if (inFocusBand.size === 0) {
        setStepFocusEngaged(false)
        return
      }

      setStepFocusEngaged(true)

      const viewportCenter = window.innerHeight * 0.5
      let bestIndex = 0
      let bestDistance = Number.POSITIVE_INFINITY

      inFocusBand.forEach((rect, idx) => {
        const stepCenter = rect.top + rect.height * 0.5
        const distance = Math.abs(stepCenter - viewportCenter)
        if (distance < bestDistance) {
          bestDistance = distance
          bestIndex = idx
        }
      })

      setActiveIndex(bestIndex)
    }

    const rootMargin = isDesktop ? "-42% 0px -42% 0px" : "-36% 0px -36% 0px"

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number(entry.target.getAttribute("data-step"))
          if (Number.isNaN(idx)) return
          if (entry.isIntersecting) {
            inFocusBand.set(idx, entry.boundingClientRect)
          } else {
            inFocusBand.delete(idx)
          }
        })
        syncActiveFromBand()
      },
      { rootMargin, threshold: [0, 0.12, 0.35, 0.6, 1] }
    )

    nodes.forEach((node) => io.observe(node))
    return () => io.disconnect()
  }, [isDesktop, scrollFocus])

  useEffect(() => {
    if (!scrollFocus) return
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    setEnterIndex(activeIndex)
    const timer = window.setTimeout(() => setEnterIndex(null), 320)
    return () => window.clearTimeout(timer)
  }, [activeIndex, scrollFocus])

  return (
    <section id="engagements" className="vitrine-section-warm py-16 sm:py-20 lg:py-[5.5rem]">
      <div className="container-x">
        <div className="lg:grid lg:grid-cols-[minmax(0,2.5fr)_minmax(0,4fr)] lg:items-start lg:gap-12 xl:gap-16">
          <header className="flex flex-col items-center text-center lg:sticky lg:top-28 lg:self-start lg:items-start lg:text-left">
            <div
              className={cn(
                "engagements-section-header__panel flex w-full flex-col items-center lg:items-start",
                headerInactive && "engagements-section-header__panel--inactive"
              )}
            >
              <p className="section-eyebrow">Nos engagements</p>
              <h2 className="section-title max-w-[18rem]">
                Réactivité, transparence et conformité
              </h2>
              <p className="vitrine-section-intro max-w-[30rem] sm:mt-5">
                De la première dépose jusqu&apos;au recyclage final, CORE ENVIRONNEMENT coordonne
                chaque étape pour une gestion des déchets simple, transparente et conforme.
              </p>
              <p className="mt-5 text-[13px] font-medium tracking-[0.02em] text-brand-navy/55 sm:mt-6">
                Un seul interlocuteur. Un suivi complet.
              </p>
            </div>
          </header>

          <ol ref={listRef} className="engagements-steps mt-12 lg:mt-0">
            {engagements.map((item, index) => {
              const isLast = index === engagements.length - 1
              const isActive = scrollFocus ? activeIndex === index : true

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
                  scrollFocus={scrollFocus}
                  showTrackdechetsOnTracerStep={showTrackdechetsOnTracerStep}
                />
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
