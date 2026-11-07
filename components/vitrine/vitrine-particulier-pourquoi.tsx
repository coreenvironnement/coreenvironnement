"use client"

import Image from "next/image"
import { ChevronRight } from "lucide-react"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"

import { useVitrineOrder } from "./order-context"
import { VitrineSectionHeader } from "./vitrine-section-header"

export function VitrineParticulierPourquoi() {
  const { pourquoi } = particulierAccueil
  const { openOrder } = useVitrineOrder()

  return (
    <section
      id="pourquoi-core"
      className="pourquoi-core border-t border-brand-border/80 bg-brand-bg py-12 sm:py-16"
      aria-labelledby="pourquoi-core-title"
    >
      <div className="container-x">
        <VitrineSectionHeader
          className="pourquoi-core__header mx-auto max-w-3xl"
          eyebrow={pourquoi.eyebrow}
          title={pourquoi.titre}
          titleId="pourquoi-core-title"
        />

        <ul className="pourquoi-core__grid mx-auto mt-10 list-none space-y-4 p-0 sm:mt-12 lg:mt-14 lg:grid lg:max-w-5xl lg:grid-cols-3 lg:gap-5 lg:space-y-0 xl:gap-6">
          {pourquoi.cartes.map((carte) => (
            <li key={carte.id} className="h-full">
              <article className="pourquoi-core-card card-vitrine h-full">
                <div className="pourquoi-core-card__icon-wrap">
                  <Image
                    src={carte.image}
                    alt=""
                    width={176}
                    height={176}
                    className="pourquoi-core-card__icon"
                    sizes="(max-width: 1023px) 62px, 88px"
                  />
                </div>
                <div className="pourquoi-core-card__body">
                  <h3 className="pourquoi-core-card__title text-brand-navy">
                    {carte.titre}
                  </h3>
                  <p className="pourquoi-core-card__text text-brand-muted">
                    {carte.texte}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>

        <div className="pourquoi-core__cta mt-8 md:mt-10">
          <button
            type="button"
            onClick={() => openOrder({ intentStart: "waste" })}
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#35A238] px-4 py-3 font-[family-name:var(--font-body)] text-[15px] font-semibold leading-snug text-white shadow-[0_8px_24px_-8px_rgb(14_32_16/0.45)] transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-base md:mx-auto md:max-w-sm lg:max-w-md"
          >
            <span className="min-w-0 flex-1 text-center">{pourquoi.cta}</span>
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
