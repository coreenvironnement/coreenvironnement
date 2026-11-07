"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PackageDimensions01Icon,
  Location01Icon,
  Recycle03Icon,
} from "@hugeicons/core-free-icons"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

import { HOME_VOLUME_ESTIMATOR_HASH } from "@/lib/seo/early-local-links"

import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"
import { VitrineVolumeEstimator } from "./vitrine-volume-estimator"

const CARD_ICONS: Record<string, typeof PackageDimensions01Icon> = {
  volume: PackageDimensions01Icon,
  emplacement: Location01Icon,
  "voie-publique": Location01Icon,
  dechets: Recycle03Icon,
  tri: Recycle03Icon,
}

const cardShellClass =
  "flex h-full flex-col rounded-2xl border border-brand-green/14 bg-white p-5 text-left shadow-[var(--shadow-vitrine-soft)] sm:p-6"

const cardLinkClass =
  "text-[14px] font-medium text-brand-navy underline-offset-2 hover:text-brand-green hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"

function ConseilCardHeader({
  icon: Icon,
  titre,
}: {
  icon: typeof PackageDimensions01Icon
  titre: string
}) {
  return (
    <>
      <div className="flex items-start gap-3 md:hidden">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/8 text-brand-navy">
          <HugeiconsIcon
            icon={Icon}
            size={22}
            strokeWidth={VITRINE_ICON_STROKE}
            aria-hidden
          />
        </span>
        <h3 className="min-w-0 flex-1 pt-2 text-[16px] font-semibold text-brand-navy">
          {titre}
        </h3>
      </div>
      <span className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-brand-green/8 text-brand-navy md:flex">
        <HugeiconsIcon
          icon={Icon}
          size={22}
          strokeWidth={VITRINE_ICON_STROKE}
          aria-hidden
        />
      </span>
      <h3 className="mt-4 hidden text-[16px] font-semibold text-brand-navy sm:text-[17px] md:block">
        {titre}
      </h3>
    </>
  )
}

function VolumeConseilActions({
  cta,
  expanded,
  onExpand,
  volumeEstimatorRequestId,
}: {
  cta: string
  expanded: boolean
  onExpand: () => void
  volumeEstimatorRequestId: number
}) {
  if (!expanded) {
    return (
      <div className="mt-5 w-full">
        <button
          type="button"
          onClick={() => onExpand()}
          className="btn btn-accent flex min-h-12 w-full items-center justify-center font-bold"
        >
          {cta}
        </button>
      </div>
    )
  }

  return (
    <div className={expanded ? "w-full" : "mt-5 w-full"}>
      <VitrineVolumeEstimator compactTop launchId={volumeEstimatorRequestId} />
    </div>
  )
}

export function VitrineParticulierConseils() {
  const { conseils } = particulierAccueil
  const { volumeEstimatorRequestId } = useVitrineOrder()
  const [volumeExpanded, setVolumeExpanded] = useState(false)

  useEffect(() => {
    if (volumeEstimatorRequestId > 0) setVolumeExpanded(true)
  }, [volumeEstimatorRequestId])

  useEffect(() => {
    const syncFromHash = () => {
      if (window.location.hash === `#${HOME_VOLUME_ESTIMATOR_HASH}`) {
        setVolumeExpanded(true)
      }
    }
    syncFromHash()
    window.addEventListener("hashchange", syncFromHash)
    return () => window.removeEventListener("hashchange", syncFromHash)
  }, [])

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

        <div className="mx-auto mt-10 flex max-w-5xl flex-col gap-6 md:grid md:grid-cols-3 md:gap-5 lg:gap-6">
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
            const cta = typeof extras.cta === "string" ? extras.cta : null

            const Icon = CARD_ICONS[carte.id] ?? PackageDimensions01Icon
            const isVolume = carte.id === "volume"
            const showVolumeShell = isVolume && !volumeExpanded

            return (
              <article
                key={carte.id}
                id={isVolume ? HOME_VOLUME_ESTIMATOR_HASH : undefined}
                className={
                  isVolume
                    ? `${cardShellClass} scroll-mt-28 md:col-span-3`
                    : cardShellClass
                }
              >
                {showVolumeShell ? (
                  <>
                    <ConseilCardHeader icon={Icon} titre={carte.titre} />
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-brand-muted">
                      {carte.texte}
                    </p>
                  </>
                ) : isVolume ? null : (
                  <>
                    <ConseilCardHeader icon={Icon} titre={carte.titre} />
                    <p className="mt-2 flex-1 text-[14px] leading-relaxed text-brand-muted">
                      {carte.texte}
                    </p>
                  </>
                )}

                {isVolume && cta ? (
                  <VolumeConseilActions
                    cta={cta}
                    expanded={volumeExpanded}
                    onExpand={() => setVolumeExpanded(true)}
                    volumeEstimatorRequestId={volumeEstimatorRequestId}
                  />
                ) : null}

                {(carteId === "emplacement" || carteId === "voie-publique") &&
                linkLabel &&
                linkHref ? (
                  <p className="mt-5">
                    <a
                      href={linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cardLinkClass}
                    >
                      {linkLabel}
                    </a>
                  </p>
                ) : null}

                {carteId === "dechets" && guideLabel && guideHref ? (
                  <p className="mt-5">
                    <Link href={guideHref} className={cardLinkClass}>
                      {guideLabel}
                    </Link>
                  </p>
                ) : null}

                {carteId === "tri" && !contactLabel ? (
                  <p className="mt-5">
                    <a href={SITE_PHONE_HREF} className={cardLinkClass}>
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
