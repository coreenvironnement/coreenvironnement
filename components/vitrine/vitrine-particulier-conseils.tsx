"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"
import { HOME_VOLUME_ESTIMATOR_HASH } from "@/lib/seo/early-local-links"
import { SITE_PHONE_HREF } from "@/lib/site"

import { PreparationLottieArt } from "./preparation-lottie-art"
import { useVitrineOrder } from "./order-context"
import { VitrineVolumeEstimator } from "./vitrine-volume-estimator"

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path d="M4 12h16m-6-6 6 6-6 6" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path d="M14 4h6v6m0-6L10 14M9 5H5v14h14v-4" />
    </svg>
  )
}

function StreetLampIcon() {
  return (
    <svg
      viewBox="0 0 28 38"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden
    >
      <path d="M9 35h11M14 35V12q0-7 6-7M17 12h10l-2-5h-6Z" />
      <path d="M20 12v3h5v-3" fill="#E5BD55" stroke="none" />
    </svg>
  )
}

function AdvisorChatIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      aria-hidden
    >
      <path d="M9 34 5 43l12-4a19 19 0 1 0-8-5Z" />
      <path
        d="m18 14-4 3c1 8 8 14 15 15l3-5-5-3-3 3c-3-1-6-4-7-7l3-2Z"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function VitrineParticulierConseils() {
  const { conseils } = particulierAccueil
  const { openVolumeEstimator, volumeEstimatorRequestId } = useVitrineOrder()
  const [volumeExpanded, setVolumeExpanded] = useState(false)

  const volumeCarte = conseils.cartes.find((c) => c.id === "volume")
  const accesCarte = conseils.cartes.find((c) => c.id === "acces")
  const dechetsCarte = conseils.cartes.find((c) => c.id === "dechets")

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
      className="cp-section"
      id="conseils"
      aria-labelledby="conseils-title"
    >
      <div className="cp-wrap">
        <header className="cp-header">
          <p className="cp-eyebrow">{conseils.eyebrow}</p>
          <h2 id="conseils-title">{conseils.titre}</h2>
          <p className="cp-intro">{conseils.intro}</p>
        </header>

        <div className="cp-grid">
          {volumeCarte ? (
            <article className="cp-card cp-volume">
              <p className="cp-category">
                {volumeCarte.num} · {volumeCarte.label}
              </p>
              <h3>{volumeCarte.titre}</h3>
              <p className="cp-copy">{volumeCarte.texte}</p>
              <PreparationLottieArt animation="01-volume" />
              {"note" in volumeCarte && volumeCarte.note ? (
                <p className="cp-note">{volumeCarte.note}</p>
              ) : null}
              <button
                type="button"
                className="cp-button"
                onClick={() => openVolumeEstimator()}
              >
                {volumeCarte.cta}
                <ChevronIcon />
              </button>
            </article>
          ) : null}

          {accesCarte ? (
            <article className="cp-card cp-access">
              <p className="cp-category">
                {accesCarte.num} · {accesCarte.label}
              </p>
              <h3>{accesCarte.titre}</h3>
              <PreparationLottieArt animation="02-acces" />
              {"specsTitre" in accesCarte ? (
                <>
                  <p className="cp-space">{accesCarte.specsTitre}</p>
                  <dl className="cp-dimensions">
                    {accesCarte.specs.map((spec) => (
                      <div key={spec.detail}>
                        <dt>{spec.value}</dt>
                        <dd>{spec.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              ) : null}
              <div className="cp-street">
                <StreetLampIcon />
                <div>
                  <p>
                    {"rueTexte" in accesCarte ? accesCarte.rueTexte : null}
                  </p>
                  {"linkHref" in accesCarte && accesCarte.linkLabel ? (
                    <a
                      className="cp-link"
                      href={accesCarte.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {accesCarte.linkLabel}
                      <ExternalLinkIcon />
                      <span className="cp-sr-only"> (nouvel onglet)</span>
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}

          {dechetsCarte ? (
            <article className="cp-card cp-waste">
              <p className="cp-category">
                {dechetsCarte.num} · {dechetsCarte.label}
              </p>
              <h3>{dechetsCarte.titre}</h3>
              <p className="cp-copy">{dechetsCarte.texte}</p>
              <PreparationLottieArt animation="03-dechets" variant="waste" />
              <Link
                className="cp-button cp-button--outline"
                href={
                  "guideHref" in dechetsCarte ? dechetsCarte.guideHref : "#"
                }
              >
                {dechetsCarte.cta}
                <ChevronIcon />
              </Link>
            </article>
          ) : null}
        </div>

        {volumeExpanded ? (
          <div
            id={HOME_VOLUME_ESTIMATOR_HASH}
            className="cp-estimator scroll-mt-28"
          >
            <VitrineVolumeEstimator
              compactTop
              launchId={volumeEstimatorRequestId}
            />
          </div>
        ) : (
          <div id={HOME_VOLUME_ESTIMATOR_HASH} className="scroll-mt-28" />
        )}

        <aside className="cp-help" aria-label="Demander conseil">
          <AdvisorChatIcon />
          <div className="cp-help-copy">
            <strong>{conseils.conseiller.titre}</strong>
            <p>{conseils.conseiller.texte}</p>
          </div>
          <a className="cp-link" href={SITE_PHONE_HREF}>
            {conseils.conseiller.cta}
            <ChevronIcon />
          </a>
        </aside>
      </div>
    </section>
  )
}
