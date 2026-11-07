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
import { VitrineVolumeEstimator } from "./vitrine-volume-estimator"

const CARD_ICONS: Record<string, typeof PackageDimensions01Icon> = {
  volume: PackageDimensions01Icon,
  emplacement: Location01Icon,
  "voie-publique": Location01Icon,
  dechets: Recycle03Icon,
  tri: Recycle03Icon,
}

export function VitrineParticulierConseils() {
  const { conseils } = particulierAccueil

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
            const carteId = carte.id as string
            const extras = carte as Record<string, unknown>
            const guideHref =
              typeof extras.guideHref === "string" ? extras.guideHref : null
            const guideLabel =
              typeof extras.guideLabel === "string" ? extras.guideLabel : null
            const linkHref =
              typeof extras.linkHref === "string" ? extras.linkHref : null
            const linkLabel =
              typeof extras.linkLabel === "string" ? extras.linkLabel : null
            const contactLabel =
              typeof extras.contactLabel === "string"
                ? extras.contactLabel
                : null

            const Icon = CARD_ICONS[carte.id] ?? PackageDimensions01Icon
            return (
              <article
                key={carte.id}
                className={
                  carte.id === "volume"
                    ? "flex h-full flex-col rounded-2xl border border-brand-green/14 bg-white p-5 shadow-[var(--shadow-vitrine-soft)] max-md:items-center max-md:text-center sm:p-6 md:col-span-3 md:items-start md:text-left"
                    : "flex h-full flex-col rounded-2xl border border-brand-green/14 bg-white p-5 shadow-[var(--shadow-vitrine-soft)] max-md:items-center max-md:text-center sm:p-6 md:items-start md:text-left"
                }
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
                  <div className="mt-5 space-y-3 md:col-span-1">
                    <VitrineVolumeEstimator />
                    {"ctaHint" in carte && carte.ctaHint ? (
                      <p className="text-[12px] leading-snug text-brand-muted">
                        {carte.ctaHint}
                      </p>
                    ) : null}
                    {guideLabel && guideHref ? (
                      <Link
                        href={guideHref}
                        className="block text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                      >
                        {guideLabel}
                      </Link>
                    ) : null}
                  </div>
                ) : null}

                {(carteId === "emplacement" || carteId === "voie-publique") &&
                linkLabel &&
                linkHref ? (
                  <p className="mt-5">
                    <a
                      href={linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                    >
                      {linkLabel}
                    </a>
                  </p>
                ) : null}

                {carteId === "dechets" && guideLabel && guideHref ? (
                  <p className="mt-5">
                    <Link
                      href={guideHref}
                      className="text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                    >
                      {guideLabel}
                    </Link>
                  </p>
                ) : null}

                {carteId === "tri" && !contactLabel ? (
                  <p className="mt-5">
                    <a
                      href={SITE_PHONE_HREF}
                      className="text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                    >
                      Nous appeler en cas de doute
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
