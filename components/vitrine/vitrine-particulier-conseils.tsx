"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PackageDimensions01Icon,
  Location01Icon,
  Recycle03Icon,
} from "@hugeicons/core-free-icons"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"

const CARD_ICONS = {
  volume: PackageDimensions01Icon,
  emplacement: Location01Icon,
  dechets: Recycle03Icon,
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
          <p className="section-eyebrow max-md:w-full max-md:justify-center">
            {conseils.eyebrow}
          </p>
          <h2 id="conseils-title" className="section-title mt-3 text-brand-navy">
            {conseils.titre}
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {conseils.cartes.map((carte) => {
            const Icon =
              CARD_ICONS[carte.id as keyof typeof CARD_ICONS] ??
              PackageDimensions01Icon
            return (
              <article
                key={carte.id}
                className="flex h-full flex-col rounded-2xl border border-brand-green/14 bg-white p-5 shadow-[var(--shadow-vitrine-soft)] max-md:items-center max-md:text-center sm:p-6 md:items-start md:text-left"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/8 text-brand-navy max-md:mx-auto md:mx-0">
                  <HugeiconsIcon
                    icon={Icon}
                    size={22}
                    strokeWidth={VITRINE_ICON_STROKE}
                    aria-hidden
                  />
                </span>
                <h3 className="mt-4 text-[16px] font-semibold text-brand-navy sm:text-[17px]">
                  {carte.titre}
                </h3>
                <p className="mt-2 flex-1 text-[14px] leading-relaxed text-brand-muted">
                  {carte.texte}
                </p>

                {carte.id === "volume" && "cta" in carte ? (
                  <div className="mt-5 space-y-3">
                    <button
                      type="button"
                      onClick={() => openOrder({ intentStart: "waste" })}
                      className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-brand-green px-4 py-2.5 text-center text-[14px] font-semibold text-white transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
                    >
                      {carte.cta}
                    </button>
                    {"ctaHint" in carte && carte.ctaHint ? (
                      <p className="text-[12px] leading-snug text-brand-muted">
                        {carte.ctaHint}
                      </p>
                    ) : null}
                    {"guideLabel" in carte && carte.guideLabel ? (
                      <Link
                        href={carte.guideHref}
                        className="block text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                      >
                        {carte.guideLabel}
                      </Link>
                    ) : null}
                  </div>
                ) : null}

                {carte.id === "emplacement" &&
                "linkLabel" in carte &&
                carte.linkLabel ? (
                  <p className="mt-5">
                    <a
                      href={carte.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                    >
                      {carte.linkLabel}
                    </a>
                  </p>
                ) : null}

                {carte.id === "dechets" && "contactLabel" in carte ? (
                  <p className="mt-5">
                    <a
                      href={SITE_PHONE_HREF}
                      className="text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                    >
                      {carte.contactLabel}
                    </a>
                    <span className="sr-only"> — {SITE_PHONE_DISPLAY}</span>
                  </p>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
