"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"
import { PARCOURS_LOTTIE_BY_NUM } from "@/lib/vitrine/parcours-lottie-steps"

import { ParcoursLottieStepCard } from "./parcours-lottie-step-card"
import { useVitrineOrder } from "./order-context"

const STEP_LINK_CLASS =
  "inline-block font-[family-name:var(--font-body)] text-[15px] font-medium text-brand-navy underline underline-offset-2 transition-colors hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"

export function VitrineParticulierJourney() {
  const { parcours } = particulierAccueil
  const { openOrder } = useVitrineOrder()

  const step01 = parcours.etapes[0]
  const lien =
    step01 && "lien" in step01 && step01.lien
      ? (step01.lien as { label: string; href: string })
      : null

  return (
    <section
      id="parcours"
      className="border-t border-brand-border/80 bg-brand-bg py-12 sm:py-16"
      aria-labelledby="parcours-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow mx-auto w-fit justify-center">
            {parcours.eyebrow}
          </p>
          <h2
            id="parcours-title"
            className="section-title mt-3 text-balance text-brand-navy"
          >
            {parcours.titre}
          </h2>
          <p className="mt-4 font-[family-name:var(--font-body)] text-[16px] leading-relaxed text-brand-muted sm:text-[17px]">
            {parcours.intro}
          </p>
        </div>

        <ol className="parcours-lottie-grid mx-auto mt-10 grid max-w-4xl list-none grid-cols-1 gap-4 p-0 sm:gap-5 md:mt-12 md:grid-cols-2 md:gap-5 lg:gap-6">
          {parcours.etapes.map((step) => {
            const src = PARCOURS_LOTTIE_BY_NUM[step.num]
            if (!src) return null
            return (
              <ParcoursLottieStepCard
                key={step.num}
                num={step.num}
                titre={step.titre}
                animationSrc={src}
              />
            )
          })}
        </ol>

        {lien ? (
          <p className="parcours-volume-link mt-6 text-center md:mt-8">
            <Link href={lien.href} className={STEP_LINK_CLASS}>
              {lien.label}
            </Link>
          </p>
        ) : null}

        <div className="parcours-cta mt-8 md:mt-10">
          <button
            type="button"
            onClick={() => openOrder({ intentStart: "waste" })}
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#35A238] px-4 py-3 font-[family-name:var(--font-body)] text-[15px] font-semibold leading-snug text-white shadow-[0_8px_24px_-8px_rgb(14_32_16/0.45)] transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-base md:mx-auto md:max-w-sm lg:max-w-md"
          >
            <span className="min-w-0 flex-1 text-center">{parcours.cta}</span>
            <ChevronRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>
  )
}
