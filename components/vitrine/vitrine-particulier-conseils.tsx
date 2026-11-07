"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronRight, LampFloor } from "lucide-react"

import { CoreAccesCamionLottie } from "@/components/order/core-acces-camion-lottie"
import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"
import { HOME_VOLUME_ESTIMATOR_HASH } from "@/lib/seo/early-local-links"
import { SITE_WHATSAPP_HREF } from "@/lib/site"

import { useVitrineOrder } from "./order-context"
import { VitrineVolumeEstimator } from "./vitrine-volume-estimator"

function vitrineImageSrc(file: string): string {
  return `/images/${encodeURIComponent(file)}`
}

const CARD_SHELL =
  "flex h-full flex-col rounded-2xl border border-brand-green/14 bg-white p-5 shadow-[var(--shadow-vitrine-soft)] sm:p-6"

const CARD_LABEL =
  "font-[family-name:var(--font-body)] text-[11px] font-bold uppercase tracking-[0.12em] text-brand-green sm:text-xs"

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

export function VitrineParticulierConseils() {
  const { conseils } = particulierAccueil
  const { openVolumeEstimator, volumeEstimatorRequestId } = useVitrineOrder()
  const [volumeExpanded, setVolumeExpanded] = useState(false)
  const [accessPlayToken] = useState(1)

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
          <p className="mt-3 font-[family-name:var(--font-body)] text-[15px] leading-relaxed text-brand-muted sm:text-[16px]">
            {conseils.intro}
          </p>
        </div>

        <div className="conseils-grid mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-5 lg:grid-cols-3 lg:gap-5 xl:gap-6">
          {volumeCarte ? (
            <article className={CARD_SHELL}>
              <p className={CARD_LABEL}>
                {volumeCarte.num} · {volumeCarte.label}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-body)] text-[17px] font-semibold leading-snug text-brand-navy sm:text-lg">
                {volumeCarte.titre}
              </h3>
              <p className="mt-2 flex-1 font-[family-name:var(--font-body)] text-[14px] leading-relaxed text-brand-muted">
                {volumeCarte.texte}
              </p>
              <div className="relative mx-auto mt-4 aspect-[4/3] w-full max-w-[220px] sm:max-w-none lg:max-w-[200px]">
                <Image
                  src={vitrineImageSrc(volumeCarte.imageFile)}
                  alt=""
                  fill
                  className="object-contain object-center"
                  sizes="(max-width: 1024px) 220px, 200px"
                />
              </div>
              {"note" in volumeCarte && volumeCarte.note ? (
                <p className="mt-3 hidden text-center font-[family-name:var(--font-body)] text-[13px] italic text-brand-muted lg:block">
                  {volumeCarte.note}
                </p>
              ) : null}
              <div className="mt-4 lg:mt-3">
                <button
                  type="button"
                  onClick={() => openVolumeEstimator()}
                  className="btn btn-accent group flex min-h-12 w-full items-center justify-center gap-1.5 font-[family-name:var(--font-body)] text-[15px] font-semibold"
                >
                  {volumeCarte.cta}
                  <ChevronRight
                    className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </button>
              </div>
              {"note" in volumeCarte && volumeCarte.note ? (
                <p className="mt-2 text-center font-[family-name:var(--font-body)] text-[13px] italic text-brand-muted lg:hidden">
                  {volumeCarte.note}
                </p>
              ) : null}
            </article>
          ) : null}

          {accesCarte ? (
            <article className={CARD_SHELL}>
              <p className={CARD_LABEL}>
                {accesCarte.num} · {accesCarte.label}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-body)] text-[17px] font-semibold leading-snug text-brand-navy sm:text-lg">
                {accesCarte.titre}
              </h3>
              <div className="truck-access-help--vitrine mt-3 w-full">
                <CoreAccesCamionLottie playToken={accessPlayToken} />
              </div>
              {"specs" in accesCarte ? (
                <div className="mt-2 border-y border-brand-border/80 py-3">
                  <p className="text-center font-[family-name:var(--font-body)] text-[12px] font-semibold uppercase tracking-[0.08em] text-brand-muted">
                    {accesCarte.specsTitre}
                  </p>
                  <ul className="mt-2 grid list-none grid-cols-3 gap-1 p-0">
                    {accesCarte.specs.map((spec) => (
                      <li
                        key={spec.detail}
                        className="border-r border-brand-border/70 px-1 text-center last:border-r-0"
                      >
                        <p className="font-[family-name:var(--font-body)] text-[15px] font-bold text-brand-navy sm:text-base">
                          {spec.value}
                        </p>
                        <p className="mt-0.5 font-[family-name:var(--font-body)] text-[11px] leading-tight text-brand-muted sm:text-xs">
                          {spec.detail}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-4 flex gap-3 rounded-xl bg-[#F3EBE0] p-3.5 sm:p-4">
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/70 text-brand-navy"
                  aria-hidden
                >
                  <LampFloor className="size-5" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-[family-name:var(--font-body)] text-[13px] leading-snug text-brand-navy sm:text-[14px]">
                    {"rueTexte" in accesCarte ? accesCarte.rueTexte : null}
                  </p>
                  {"linkHref" in accesCarte && accesCarte.linkLabel ? (
                    <a
                      href={accesCarte.linkHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1 font-[family-name:var(--font-body)] text-[13px] font-medium text-brand-green underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
                    >
                      {accesCarte.linkLabel}
                      <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
                    </a>
                  ) : null}
                </div>
              </div>
            </article>
          ) : null}

          {dechetsCarte ? (
            <article className={CARD_SHELL}>
              <p className={CARD_LABEL}>
                {dechetsCarte.num} · {dechetsCarte.label}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-body)] text-[17px] font-semibold leading-snug text-brand-navy sm:text-lg">
                {dechetsCarte.titre}
              </h3>
              <p className="mt-2 flex-1 font-[family-name:var(--font-body)] text-[14px] leading-relaxed text-brand-muted">
                {dechetsCarte.texte}
              </p>
              {"wasteImageFiles" in dechetsCarte ? (
                <ul className="mt-4 grid list-none grid-cols-3 gap-2 p-0">
                  {dechetsCarte.wasteImageFiles.map((file) => (
                    <li key={file} className="overflow-hidden rounded-lg">
                      <div className="relative aspect-[4/3] w-full">
                        <Image
                          src={vitrineImageSrc(file)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-4">
                <Link
                  href={
                    "guideHref" in dechetsCarte ? dechetsCarte.guideHref : "#"
                  }
                  className="btn btn-ghost-dark group flex min-h-12 w-full items-center justify-center gap-1.5 border-brand-green/35 font-[family-name:var(--font-body)] text-[15px] font-semibold text-brand-green hover:border-brand-green/50 hover:bg-brand-green/5"
                >
                  {dechetsCarte.cta}
                  <ChevronRight
                    className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </Link>
              </div>
            </article>
          ) : null}
        </div>

        {volumeExpanded ? (
          <div
            id={HOME_VOLUME_ESTIMATOR_HASH}
            className="mx-auto mt-8 max-w-5xl scroll-mt-28 rounded-2xl border border-brand-green/14 bg-white p-5 shadow-[var(--shadow-vitrine-soft)] sm:p-6"
          >
            <VitrineVolumeEstimator
              compactTop
              launchId={volumeEstimatorRequestId}
            />
          </div>
        ) : (
          <div id={HOME_VOLUME_ESTIMATOR_HASH} className="scroll-mt-28" />
        )}

        <aside className="conseils-advisor mx-auto mt-8 flex max-w-5xl flex-col gap-4 rounded-2xl border border-brand-green/12 bg-white p-4 shadow-[var(--shadow-vitrine-soft)] sm:flex-row sm:items-center sm:gap-5 sm:p-5 lg:mt-10">
          <div className="flex items-center gap-3 sm:shrink-0">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand-green text-white shadow-[0_4px_14px_-4px_rgb(53_162_56/0.55)]">
              <WhatsAppIcon className="size-6" />
            </span>
            <span
              className="hidden h-10 w-px bg-brand-border sm:block"
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="font-[family-name:var(--font-body)] text-[15px] font-semibold leading-snug text-brand-navy sm:text-base">
              {conseils.conseiller.titre}
            </p>
            <p className="mt-1 font-[family-name:var(--font-body)] text-[14px] text-brand-muted">
              {conseils.conseiller.texte}
            </p>
          </div>
          <a
            href={SITE_WHATSAPP_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-1.5 rounded-xl font-[family-name:var(--font-body)] text-[15px] font-semibold text-brand-green underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 sm:w-auto"
          >
            {conseils.conseiller.cta}
            <ChevronRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden
            />
          </a>
        </aside>
      </div>
    </section>
  )
}
