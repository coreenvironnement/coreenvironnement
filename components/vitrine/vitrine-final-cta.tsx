"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Recycle03Icon,
  Tick02Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons"

import { finalCta } from "@/lib/cdc/contenu-vitrine"
import { cn } from "@/lib/utils"

import { BenneIcon } from "./benne-icon"
import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"

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

function useReveal<T extends HTMLElement>(reduced: boolean) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduced) {
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
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  return { ref, shown }
}

export function VitrineFinalCta() {
  const { openOrder } = useVitrineOrder()
  const reduced = usePrefersReducedMotion()
  const { ref, shown } = useReveal<HTMLDivElement>(reduced)
  const content = finalCta

  return (
    <section
      id="commander"
      aria-labelledby="final-cta-title"
      className="relative scroll-mt-[72px] overflow-hidden bg-[#183574] pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-[4.75rem] lg:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55] [background-image:repeating-linear-gradient(180deg,rgba(255,255,255,0.045)_0px,rgba(255,255,255,0.045)_1px,transparent_1px,transparent_72px)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_50%_0%,rgba(255,255,255,0.055)_0%,transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.16),transparent)]"
      />

      <HugeiconsIcon
        icon={TruckIcon}
        size={400}
        strokeWidth={0.65}
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-[-3.5rem] text-white opacity-[0.07] sm:-right-14 sm:bottom-[-4rem] lg:-right-10 lg:bottom-[-4.5rem] lg:opacity-[0.075]"
      />

      <div className="container-x relative">
        <div
          ref={ref}
          className="mx-auto flex max-w-[46rem] flex-col items-center text-center"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(18px)",
            transition: reduced
              ? "none"
              : "opacity 750ms cubic-bezier(0.22,1,0.36,1), transform 750ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <p className="section-eyebrow section-eyebrow--inverse">{content.eyebrow}</p>

          <h2
            id="final-cta-title"
            className="mt-5 text-[clamp(1.95rem,4.2vw,3rem)] font-bold leading-[1.11] tracking-[-0.034em] text-white"
          >
            {content.titre}
            <span className="block">{content.titreSuite}</span>
          </h2>

          <p className="mt-5 max-w-[33rem] text-[15.5px] leading-[1.7] text-white/68 sm:mt-6 sm:text-[16.5px]">
            {content.description}
          </p>

          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={openOrder}
              className="btn btn-accent group w-full px-7 sm:w-auto"
            >
              {content.ctaPrimary}
              <BenneIcon className="h-[18px] w-[18px] shrink-0" />
            </button>
            <a href="#contact" className="btn btn-ghost-light w-full sm:w-auto">
              {content.ctaSecondary}
            </a>
          </div>

          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
            {content.reassurance.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={14}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="shrink-0 text-brand-green"
                />
                <span className="font-[family-name:var(--font-body)] text-[13px] font-medium text-white/75">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 font-[family-name:var(--font-body)] text-[11.5px] text-white/55">
            {content.footnote}
          </p>

          <div
            aria-hidden
            className="mt-10 w-full max-w-[34rem] border-t border-white/10 pt-8"
          >
            <ol className="flex items-center justify-between">
              {content.journey.map((step, i) => (
                <li
                  key={step}
                  className="relative flex flex-1 flex-col items-center"
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: shown ? "translateY(0)" : "translateY(6px)",
                    transition: reduced
                      ? "none"
                      : `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
                  }}
                >
                  {i > 0 && (
                    <span
                      className={cn(
                        "absolute right-1/2 top-[7px] hidden h-px w-full sm:block",
                        i === content.journey.length - 1
                          ? "bg-gradient-to-r from-brand-green/50 to-brand-green/90"
                          : "bg-white/16"
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 h-3.5 w-3.5 rounded-full border-[1.5px]",
                      i === content.journey.length - 1
                        ? "border-brand-green bg-brand-green"
                        : "border-white/28 bg-brand-navy"
                    )}
                  />
                  <span className="mt-2.5 font-[family-name:var(--font-display)] text-[11.5px] font-medium tracking-[0.02em] text-white/60 sm:text-[12.5px]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-center justify-center gap-1.5 font-[family-name:var(--font-body)] text-[11px] text-white/50">
              <HugeiconsIcon
                icon={Recycle03Icon}
                size={13}
                strokeWidth={VITRINE_ICON_STROKE}
                className="text-white/40"
              />
              {content.journeyTagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
