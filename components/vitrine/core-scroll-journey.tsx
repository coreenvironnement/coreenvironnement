"use client"

import Link from "next/link"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"

import {
  CORE_SCROLL_STAGE_POINTS,
  CORE_SCROLL_STEPS,
  clamp,
  scrollStageIndex,
} from "@/lib/vitrine/core-scroll-pose"

import {
  CoreScrollScene,
  type CoreScrollSceneHandle,
} from "./core-scroll-scene"

const MOBILE_MAX = 760

function readHeaderHeight(): number {
  if (typeof document === "undefined") return 116
  const header = document.querySelector(".vitrine-root header")
  if (header) return header.getBoundingClientRect().height
  const root = document.querySelector(".vitrine-root")
  const css = root ? getComputedStyle(root) : getComputedStyle(document.documentElement)
  const raw = css.getPropertyValue("--vitrine-header-height").trim()
  const parsed = parseFloat(raw)
  if (Number.isFinite(parsed) && parsed > 0) {
    return raw.endsWith("rem") ? parsed * 16 : parsed
  }
  return 116
}

type CoreScrollJourneyProps = {
  volumeGuideHref: string
  volumeGuideLabel: string
}

export function CoreScrollJourney({
  volumeGuideHref,
  volumeGuideLabel,
}: CoreScrollJourneyProps) {
  const journeyRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const sceneHandleRef = useRef<CoreScrollSceneHandle>(null)
  const progressBarRef = useRef<HTMLSpanElement>(null)
  const captionRef = useRef<HTMLParagraphElement>(null)

  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  const lastStageRef = useRef(-1)
  const lastPRef = useRef(0)
  const dirtyRef = useRef(true)
  const frameRef = useRef(0)
  const disposedRef = useRef(false)

  const bounds = useCallback(() => {
    const journey = journeyRef.current
    const pinned = pinnedRef.current
    if (!journey || !pinned) return { top: 0, span: 1 }
    const h = readHeaderHeight()
    const top = journey.getBoundingClientRect().top + window.scrollY - h
    const span = Math.max(journey.offsetHeight - pinned.offsetHeight, 1)
    return { top, span }
  }, [])

  const readProgress = useCallback(() => {
    const b = bounds()
    return clamp((window.scrollY - b.top) / b.span)
  }, [bounds])

  const applyProgress = useCallback(
    (p: number) => {
      lastPRef.current = p
      setProgress(p)
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${p * 100}%`
      }

      const mobile = window.innerWidth <= MOBILE_MAX
      sceneHandleRef.current?.render(p, mobile)

      const nextStage = scrollStageIndex(p)
      if (nextStage !== lastStageRef.current) {
        lastStageRef.current = nextStage
        setStage(nextStage)
        if (captionRef.current) {
          captionRef.current.textContent = CORE_SCROLL_STEPS[nextStage]!.caption
        }
      }
    },
    []
  )

  const tick = useCallback(() => {
    frameRef.current = 0
    if (disposedRef.current || reducedMotion) return
    if (dirtyRef.current) {
      dirtyRef.current = false
      applyProgress(readProgress())
    }
  }, [applyProgress, readProgress, reducedMotion])

  const schedule = useCallback(() => {
    dirtyRef.current = true
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(tick)
    }
  }, [tick])

  const scrollToProgress = useCallback(
    (targetP: number, behavior: ScrollBehavior = "smooth") => {
      const b = bounds()
      window.scrollTo({
        top: b.top + b.span * clamp(targetP),
        behavior: reducedMotion ? "instant" : behavior,
      })
      schedule()
    },
    [bounds, reducedMotion, schedule]
  )

  useEffect(() => {
    disposedRef.current = false
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const syncMotion = () => setReducedMotion(mq.matches)
    syncMotion()
    mq.addEventListener("change", syncMotion)

    const onScroll = () => schedule()
    const onResize = () => schedule()

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onResize, { passive: true })

    applyProgress(0)
    schedule()

    return () => {
      disposedRef.current = true
      mq.removeEventListener("change", syncMotion)
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onResize)
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [applyProgress, schedule])

  useEffect(() => {
    if (reducedMotion) return
    schedule()
  }, [reducedMotion, schedule])

  const onStageClick = (index: number) => {
    scrollToProgress(CORE_SCROLL_STAGE_POINTS[index] ?? 0)
  }

  const onStageKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      onStageClick(index)
    }
  }

  const step = CORE_SCROLL_STEPS[stage]!

  return (
    <div
      ref={journeyRef}
      className={`core-scroll-journey${reducedMotion ? " core-scroll-journey--static" : ""}`}
      aria-label="Les quatre étapes de votre location"
    >
      <div ref={pinnedRef} className="core-scroll-journey__pinned">
        <div className="core-scroll-journey__chapter core-scroll-journey__animated">
          <span>Du premier clic au dernier gravat</span>
          <span>Quatre étapes. Un accompagnement.</span>
        </div>

        <div className="core-scroll-journey__layout core-scroll-journey__animated">
          <div className="core-scroll-journey__story">
            <p className="core-scroll-journey__count" aria-live="polite">
              0{stage + 1} / 04
            </p>
            <h3 className="core-scroll-journey__title">
              {step.titleLines[0]}
              <span className="block">{step.titleLines[1]}</span>
            </h3>
            <p className="core-scroll-journey__description">{step.description}</p>
            {stage === 0 ? (
              <p className="core-scroll-journey__volume-link-wrap">
                <Link href={volumeGuideHref} className="core-scroll-journey__volume-link">
                  {volumeGuideLabel}
                </Link>
              </p>
            ) : null}

            <nav className="core-scroll-journey__step-nav" aria-label="Explorer les étapes">
              {CORE_SCROLL_STEPS.map((s, i) => (
                <button
                  key={s.navLabel}
                  type="button"
                  aria-current={i === stage ? "step" : undefined}
                  onClick={() => onStageClick(i)}
                  onKeyDown={(e) => onStageKeyDown(e, i)}
                >
                  <span className="core-scroll-journey__step-num">0{i + 1}</span>
                  {s.navLabel}
                </button>
              ))}
            </nav>
          </div>

          <div className="core-scroll-journey__visual">
            <CoreScrollScene ref={sceneHandleRef} />
            <p
              ref={captionRef}
              className="core-scroll-journey__caption"
            >
              {step.caption}
            </p>
          </div>
        </div>

        <div className="core-scroll-journey__bottom core-scroll-journey__animated">
          <span className="core-scroll-journey__hint">Défilez pour suivre la suite ↓</span>
          <div className="core-scroll-journey__progress" aria-hidden="true">
            <span ref={progressBarRef} style={{ width: `${progress * 100}%` }} />
          </div>
        </div>

        <div className="core-scroll-journey__fallback" aria-label="Étapes sans animation">
          <p className="vitrine-label text-brand-green">Comment ça se passe</p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold tracking-[-0.02em] text-brand-navy sm:text-2xl">
            Une benne, quatre étapes.
          </h3>
          <ol className="core-scroll-journey__fallback-list">
            {CORE_SCROLL_STEPS.map((s, i) => (
              <li key={s.navLabel}>
                <h4 className="font-[family-name:var(--font-display)] text-base font-semibold text-brand-navy">
                  0{i + 1} — {s.navLabel}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">{s.description}</p>
                {i === 0 ? (
                  <Link href={volumeGuideHref} className="core-scroll-journey__volume-link mt-3 inline-block">
                    {volumeGuideLabel}
                  </Link>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <noscript>
        <style>{`.core-scroll-journey__pinned{display:none!important}`}</style>
        <div className="core-scroll-journey__noscript px-6 py-8 sm:px-10">
          <p className="vitrine-label text-brand-green">Comment ça se passe</p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy">
            Une benne, quatre étapes.
          </h3>
          <ol className="core-scroll-journey__fallback-list mt-6">
            {CORE_SCROLL_STEPS.map((s, i) => (
              <li key={s.navLabel} className="border-b border-brand-green/10 py-5">
                <h4 className="font-[family-name:var(--font-display)] font-semibold text-brand-navy">
                  0{i + 1} — {s.navLabel}
                </h4>
                <p className="mt-2 text-sm text-brand-muted">{s.description}</p>
              </li>
            ))}
          </ol>
          <Link href={volumeGuideHref} className="core-scroll-journey__volume-link mt-4 inline-block">
            {volumeGuideLabel}
          </Link>
        </div>
      </noscript>
    </div>
  )
}
