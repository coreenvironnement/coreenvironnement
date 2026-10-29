"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Alert02Icon,
  PackageDimensions01Icon,
  Recycle03Icon,
} from "@hugeicons/core-free-icons"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"

import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"

const CARD_ICONS = {
  volume: PackageDimensions01Icon,
  "voie-publique": Alert02Icon,
  tri: Recycle03Icon,
} as const

export function VitrineParticulierConseils() {
  const { conseils } = particulierAccueil
  const { openOrder } = useVitrineOrder()

  return (
    <section
      id="conseils"
      className="vitrine-section-warm border-t border-brand-border py-12 sm:py-16"
      aria-labelledby="conseils-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">{conseils.eyebrow}</p>
          <h2 id="conseils-title" className="section-title mt-3 text-brand-navy">
            {conseils.titre}
          </h2>
        </div>

        <ul className="mx-auto mt-10 grid max-w-4xl gap-4 sm:gap-5">
          {conseils.cartes.map((carte) => {
            const Icon =
              CARD_ICONS[carte.id as keyof typeof CARD_ICONS] ??
              PackageDimensions01Icon
            return (
              <li
                key={carte.id}
                className="rounded-2xl border border-brand-green/14 bg-white p-5 shadow-[var(--shadow-vitrine-soft)] sm:p-6"
              >
                <div className="flex gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-navy/8 text-brand-navy">
                    <HugeiconsIcon
                      icon={Icon}
                      size={22}
                      strokeWidth={VITRINE_ICON_STROKE}
                      aria-hidden
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[16px] font-semibold text-brand-navy sm:text-[17px]">
                      {carte.titre}
                    </h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-brand-muted">
                      {carte.texte}
                    </p>
                    {"cta" in carte && carte.cta ? (
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={() => {
                            openOrder({ intentStart: "location" })
                          }}
                          className="text-left text-[14px] font-semibold text-brand-green hover:text-[#19752B]"
                        >
                          {carte.cta} →
                        </button>
                        {"ctaHint" in carte && carte.ctaHint ? (
                          <p className="mt-1.5 text-[12px] leading-snug text-brand-muted">
                            {carte.ctaHint}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
