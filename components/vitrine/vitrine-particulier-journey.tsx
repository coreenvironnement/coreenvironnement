"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  ContainerIcon,
  CreditCardValidationIcon,
  DeliveryTruck01Icon,
  Recycle03Icon,
} from "@hugeicons/core-free-icons"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"

import { VITRINE_ICON_STROKE } from "./icons"

const STEP_ICONS = [
  CreditCardValidationIcon,
  DeliveryTruck01Icon,
  ContainerIcon,
  Recycle03Icon,
] as const

export function VitrineParticulierJourney() {
  const { parcours } = particulierAccueil

  return (
    <section
      id="parcours"
      className="border-t border-brand-border/80 bg-brand-bg py-12 sm:py-16"
      aria-labelledby="parcours-title"
    >
      <div className="container-x max-w-3xl">
        <p className="section-eyebrow">{parcours.eyebrow}</p>
        <h2
          id="parcours-title"
          className="section-title mt-3 text-balance text-brand-navy"
        >
          {parcours.titre}
        </h2>
        <p className="mt-4 text-[16px] leading-relaxed text-brand-muted sm:text-[17px]">
          {parcours.intro}
        </p>

        <ol className="mt-10 space-y-0">
          {parcours.etapes.map((step, index) => {
            const Icon = STEP_ICONS[index] ?? Recycle03Icon
            const isLast = index === parcours.etapes.length - 1
            return (
              <li key={step.num} className="relative flex gap-4 pb-10 sm:gap-5">
                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute left-[1.35rem] top-12 bottom-0 w-px bg-brand-green/25 sm:left-[1.45rem]"
                  />
                ) : null}
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/12 text-brand-green">
                  <HugeiconsIcon
                    icon={Icon}
                    size={22}
                    strokeWidth={VITRINE_ICON_STROKE}
                    aria-hidden
                  />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-brand-green">
                    {step.num}
                  </p>
                  <h3 className="mt-1 text-[17px] font-semibold leading-snug text-brand-navy sm:text-lg">
                    {step.titre}
                  </h3>
                  <p className="mt-2 text-[14px] leading-relaxed text-brand-muted sm:text-[15px]">
                    {step.texte}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
