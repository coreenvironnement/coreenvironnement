"use client"

import { ChevronRight } from "lucide-react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  FileValidationIcon,
  Timer02Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons"

import { professionnelsEngagementsSection } from "@/lib/cdc/contenu-vitrine"
import { ENGAGEMENTS_LOTTIE_BY_ICON } from "@/lib/vitrine/engagements-lottie-by-icon"

import { EngagementsCardLottie } from "./engagements-card-lottie"
import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"
import { VitrineSectionHeader } from "./vitrine-section-header"

const J1_NOTE_ID = "engagements-j1-note"

const CARTE_ICONS = {
  reactivite: Timer02Icon,
  organisation: TruckIcon,
  justificatifs: FileValidationIcon,
} as const

export function VitrineEngagements() {
  const { openOrder } = useVitrineOrder()
  const content = professionnelsEngagementsSection

  return (
    <section
      id="engagements"
      className="vitrine-section-warm border-t border-brand-border/60 py-12 sm:py-16 lg:py-20"
      aria-labelledby="engagements-title"
    >
      <div className="container-x">
        <VitrineSectionHeader
          className="pro-engagements__header mx-auto max-w-3xl"
          eyebrow={content.eyebrow}
          title={content.titre}
          titleId="engagements-title"
          intro={content.intro}
        />

        <ul
          className="pro-engagements__grid mx-auto mt-8 list-none space-y-3.5 p-0 sm:mt-10 sm:space-y-4 lg:mt-12"
          role="list"
        >
          {content.cartes.map((carte) => {
            const iconKey = carte.icon as keyof typeof CARTE_ICONS
            const icon = CARTE_ICONS[iconKey]
            const lottieAsset = ENGAGEMENTS_LOTTIE_BY_ICON[carte.icon]
            return (
              <li key={carte.id} className="h-full">
                <article className="pro-engagements-card card-vitrine grid h-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3.5 gap-y-1 border-[#dce5df] bg-white p-4 text-left sm:gap-x-4 sm:p-5 lg:gap-x-5 lg:p-6">
                  {lottieAsset ? (
                    <EngagementsCardLottie
                      src={lottieAsset.json}
                      staticSrc={lottieAsset.static}
                    />
                  ) : (
                    <span
                      className="pro-engagements-card__icon-wrap row-span-3 inline-flex size-16 shrink-0 items-center justify-center rounded-xl border border-brand-green/18 bg-brand-green/[0.06] text-brand-green sm:size-[4.25rem] lg:size-[4.5rem] lg:rounded-2xl"
                      aria-hidden
                    >
                      <HugeiconsIcon
                        icon={icon}
                        size={23}
                        strokeWidth={VITRINE_ICON_STROKE}
                      />
                    </span>
                  )}
                  <p className="pro-engagements-card__label m-0 font-[family-name:var(--font-display)] text-[10px] font-bold uppercase tracking-[0.12em] text-brand-green sm:text-[11px]">
                    {carte.label}
                  </p>
                  <h3 className="pro-engagements-card__title m-0 font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-[-0.02em] text-brand-navy sm:text-base lg:text-[17px]">
                    {carte.titre}
                  </h3>
                  <p className="pro-engagements-card__text m-0 font-[family-name:var(--font-body)] text-[13.5px] leading-relaxed text-brand-muted sm:text-sm sm:leading-[1.65]">
                    {carte.texte}
                    {"texteAsterisque" in carte && carte.texteAsterisque ? (
                      <sup className="ml-0.5 align-super text-[0.65em] font-semibold">
                        <a
                          href={`#${J1_NOTE_ID}`}
                          className="text-brand-green underline decoration-brand-green/40 underline-offset-2 hover:text-brand-green-dark focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
                          aria-describedby={J1_NOTE_ID}
                        >
                          <span className="sr-only">
                            , voir la note sur l&apos;intervention J+1
                          </span>
                          *
                        </a>
                      </sup>
                    ) : null}
                  </p>
                </article>
              </li>
            )
          })}
        </ul>

        <p
          id={J1_NOTE_ID}
          className="pro-engagements__note mx-auto mt-5 max-w-2xl text-center text-xs leading-relaxed text-brand-muted sm:mt-6 sm:text-[13px]"
        >
          * {content.noteJ1}
        </p>

        <div className="pro-engagements__cta mt-7 sm:mt-8 md:mt-10">
          <button
            type="button"
            onClick={() => openOrder()}
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#35A238] px-4 py-3 font-[family-name:var(--font-body)] text-[15px] font-semibold leading-snug text-white shadow-[0_8px_24px_-8px_rgb(14_32_16/0.45)] transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-base md:mx-auto md:max-w-sm lg:max-w-md"
          >
            <span className="min-w-0 flex-1 text-center">{content.cta}</span>
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