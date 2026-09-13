"use client"

import { useEffect, useRef, useState } from "react"

import { finalCta } from "@/lib/cdc/contenu-vitrine"

import { BenneIcon } from "./benne-icon"
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
        </div>
      </div>
    </section>
  )
}
