"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"
import {
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT,
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH,
  SITE_IMAGES,
} from "@/lib/media/site-images"
import { HOME_VOLUME_ESTIMATOR_HASH } from "@/lib/seo/early-local-links"
import { SITE_PHONE_HREF } from "@/lib/site"

import { VITRINE_SCROLL_MARGIN_CLASS } from "./header-layout"
import { CpAccesEncartLottie } from "./cp-acces-encart-lottie"
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

function AdvisorChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  const dechetsCarte = conseils.cartes.find((c) => c.id === "dechets")
  const prixCarte = conseils.cartes.find((c) => c.id === "prix")
  const { accesEncart } = conseils

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
              <button
                type="button"
                className="cp-button"
                onClick={() => openVolumeEstimator()}
              >
                {volumeCarte.cta}
                <ChevronIcon />
              </button>
              {"guideHref" in volumeCarte && volumeCarte.guideLabel ? (
                <Link className="cp-link-secondary" href={volumeCarte.guideHref}>
                  {volumeCarte.guideLabel}
                </Link>
              ) : null}
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

          {prixCarte ? (
            <article className="cp-card cp-price">
              <p className="cp-category">
                {prixCarte.num} · {prixCarte.label}
              </p>
              <h3>{prixCarte.titre}</h3>
              <p className="cp-copy">{prixCarte.texte}</p>
              <figure className="cp-art cp-art--cover" aria-hidden>
                <Image
                  src={SITE_IMAGES.prixLocationBenneArticle.cover}
                  alt=""
                  width={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH}
                  height={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT}
                  sizes="(min-width: 1024px) 33vw, 620px"
                  className="cp-poster"
                  loading="lazy"
                />
              </figure>
              <Link
                className="cp-button cp-button--outline"
                href={
                  "guideHref" in prixCarte ? prixCarte.guideHref : "#"
                }
              >
                {prixCarte.cta}
                <ChevronIcon />
              </Link>
            </article>
          ) : null}
        </div>

        <aside className="cp-acces-encart" aria-labelledby="cp-acces-encart-title">
          <h3 id="cp-acces-encart-title">{accesEncart.titre}</h3>
          <div className="cp-acces-encart__main">
            <CpAccesEncartLottie />
            <div className="cp-acces-encart__details">
              <p className="cp-space">{accesEncart.specsTitre}</p>
              <dl className="cp-dimensions">
                {accesEncart.specs.map((spec) => (
                  <div key={spec.detail}>
                    <dt>{spec.value}</dt>
                    <dd>{spec.detail}</dd>
                  </div>
                ))}
              </dl>
              <div className="cp-street">
                <StreetLampIcon />
                <div>
                  <p>{accesEncart.rueTexte}</p>
                  <a
                    className="cp-link"
                    href={accesEncart.linkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {accesEncart.linkLabel}
                    <ExternalLinkIcon />
                    <span className="cp-sr-only"> (nouvel onglet)</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="cp-acces-encart__help">
            <p>{conseils.conseiller.titre}</p>
            <a
              href={SITE_PHONE_HREF}
              className="cp-acces-encart__advisor"
              aria-label={`${conseils.conseiller.cta} - ${conseils.conseiller.texte}`}
            >
              <AdvisorChatIcon className="size-5 shrink-0 text-brand-green" />
              {conseils.conseiller.cta}
            </a>
          </div>
        </aside>

        <p className="cp-hub-cta">
          <Link className="cp-hub-cta__link" href={conseils.hub.href}>
            {conseils.hub.label}
            <ChevronIcon />
          </Link>
        </p>

        <div
          id={HOME_VOLUME_ESTIMATOR_HASH}
          className={`cp-estimator-anchor ${VITRINE_SCROLL_MARGIN_CLASS}`}
        >
          {volumeExpanded ? (
            <div className="cp-estimator">
              <VitrineVolumeEstimator
                compactTop
                launchId={volumeEstimatorRequestId}
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}