"use client"

import { Fragment } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  Building02Icon,
  ContainerIcon,
  File02Icon,
  SecurityCheckIcon,
  SmartPhone02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons"

import { professionnelsCommentCaFonctionne } from "@/lib/cdc/contenu-vitrine"

import { VITRINE_ICON_STROKE } from "./icons"
import { VitrineSectionHeader } from "./vitrine-section-header"

const STEP_ICONS = {
  compte: Building02Icon,
  dossier: SecurityCheckIcon,
  commande: ContainerIcon,
} as const

export function VitrineCommentCaMarchePro() {
  const content = professionnelsCommentCaFonctionne

  return (
    <section
      id="fonctionnement"
      className="pro-comment-marche bg-[#F3F6FB] pb-16 pt-16 max-sm:pt-[5.75rem] sm:py-20 lg:py-[5.5rem]"
      aria-labelledby="fonctionnement-title"
    >
      <div className="container-x">
        <div className="pro-comment-marche__card card-vitrine mx-auto max-w-xl border-[#dce5df] bg-white p-5 shadow-[0_2px_8px_rgb(14_32_16/0.04),0_16px_40px_-12px_rgb(14_32_16/0.08)] sm:max-w-2xl sm:p-7 lg:max-w-[34rem] lg:p-8">
          <VitrineSectionHeader
            className="pro-comment-marche__header"
            eyebrow={content.eyebrow}
            title={content.titre}
            titleId="fonctionnement-title"
            intro={content.intro}
          />

          <ol
            className="pro-comment-marche__steps mt-8 list-none space-y-0 p-0 sm:mt-9"
            role="list"
          >
            {content.etapes.map((etape, index) => {
              const icon = STEP_ICONS[etape.id as keyof typeof STEP_ICONS]
              const showConnector = index < content.etapes.length - 1
              return (
                <Fragment key={etape.num}>
                  <li className="pro-comment-marche__step">
                    <article className="pro-comment-marche__step-inner grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-3 gap-y-1 sm:grid-cols-[3rem_minmax(0,1fr)] sm:gap-x-3.5">
                      <span
                        className="pro-comment-marche__step-icon row-span-2 mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-green/18 bg-brand-green/[0.06] text-brand-green sm:h-11 sm:w-11"
                        aria-hidden
                      >
                        <HugeiconsIcon
                          icon={icon}
                          size={20}
                          strokeWidth={VITRINE_ICON_STROKE}
                        />
                      </span>
                      <div className="pro-comment-marche__step-head min-w-0">
                        <p className="m-0 flex min-w-0 flex-col gap-0.5">
                          <span className="pro-comment-marche__step-num font-[family-name:var(--font-display)] text-[10px] font-bold uppercase tracking-[0.12em] text-brand-green sm:text-[11px]">
                            Étape {etape.num}
                          </span>
                          <span className="font-[family-name:var(--font-display)] text-[15px] font-semibold tracking-[-0.02em] text-brand-navy sm:text-base">
                            {etape.titre}
                          </span>
                        </p>
                      </div>
                      <div className="pro-comment-marche__step-body col-start-2 min-w-0">
                        <p className="m-0 text-[13.5px] leading-relaxed text-brand-muted sm:text-sm sm:leading-[1.65]">
                          {etape.texte}
                        </p>
                        {etape.id === "commande" ? (
                          <div className="pro-comment-marche__example mt-4 rounded-xl border border-[#dce5df] bg-[#FAFBFA] p-3.5 sm:p-4">
                            <div className="mb-3 flex items-center justify-between gap-2">
                              <p className="m-0 font-[family-name:var(--font-display)] text-[13px] font-semibold text-brand-navy sm:text-sm">
                                {content.exempleDemande.titre}
                              </p>
                              <span
                                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-brand-green/15 bg-brand-green/[0.06] text-brand-green"
                                aria-hidden
                              >
                                <HugeiconsIcon
                                  icon={File02Icon}
                                  size={16}
                                  strokeWidth={VITRINE_ICON_STROKE}
                                />
                              </span>
                            </div>
                            <dl className="pro-comment-marche__example-grid grid grid-cols-2 gap-2 sm:gap-2.5">
                              {content.exempleDemande.champs.map((champ) => (
                                <div
                                  key={champ.id}
                                  className="rounded-lg border border-[#e4ebe6] bg-white px-2.5 py-2"
                                >
                                  <dt className="text-[10px] font-medium uppercase tracking-wide text-brand-muted">
                                    {champ.label}
                                  </dt>
                                  <dd className="mt-0.5 text-[13px] font-semibold text-brand-navy">
                                    {champ.valeur}
                                  </dd>
                                </div>
                              ))}
                            </dl>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  </li>
                  {showConnector ? (
                    <li className="pro-comment-marche__connector list-none" aria-hidden>
                      <div className="flex justify-center py-1.5 sm:py-2">
                        <span className="text-lg leading-none text-brand-green/50">↓</span>
                      </div>
                    </li>
                  ) : null}
                </Fragment>
              )
            })}
          </ol>

          <aside
            className="pro-comment-marche__docs mt-6 rounded-xl border border-[#e4ebe6]/80 bg-[#F5F8F6] px-3.5 py-4 sm:mt-7 sm:px-4 sm:py-4"
            aria-labelledby="pro-comment-docs-title"
          >
            <div className="pro-comment-marche__docs-inner flex gap-3 sm:gap-3.5">
              <span
                className="pro-comment-marche__docs-icon relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-brand-green/15 bg-white text-brand-green sm:h-11 sm:w-11"
                aria-hidden
              >
                <HugeiconsIcon
                  icon={File02Icon}
                  size={19}
                  strokeWidth={VITRINE_ICON_STROKE}
                />
                <span className="absolute -bottom-0.5 -right-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full border border-white bg-brand-green/[0.12] text-brand-green">
                  <HugeiconsIcon
                    icon={SmartPhone02Icon}
                    size={11}
                    strokeWidth={VITRINE_ICON_STROKE}
                  />
                </span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3
                    id="pro-comment-docs-title"
                    className="m-0 font-[family-name:var(--font-display)] text-[14px] font-semibold tracking-[-0.02em] text-brand-navy sm:text-[15px]"
                  >
                    {content.documents.titre}
                  </h3>
                  <span className="pro-comment-marche__docs-badge shrink-0 rounded-md border border-brand-green/25 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-brand-green">
                    {content.documents.badge}
                  </span>
                </div>
                <p className="mt-1 text-[12.5px] leading-relaxed text-brand-muted sm:text-[13px]">
                  {content.documents.texte}
                </p>
                <p className="pro-comment-marche__docs-price mt-2.5 font-[family-name:var(--font-display)] leading-none">
                  <span className="text-lg font-bold tracking-[-0.02em] text-brand-navy sm:text-xl">
                    {content.documents.prixMontant}
                  </span>
                  <span className="ml-0.5 text-[12px] font-normal text-brand-muted sm:text-[13px]">
                    {content.documents.prixUnite}
                  </span>
                </p>
              </div>
            </div>
          </aside>

          <div className="pro-comment-marche__actions mt-6 sm:mt-7">
            <Link
              href={content.ctaHref}
              className="pro-comment-marche__cta group flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-5 py-3.5 font-[family-name:var(--font-body)] text-[15px] font-semibold text-white shadow-[0_8px_28px_-10px_rgb(14_32_16/0.55)] transition-colors hover:bg-[#0f1f2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-base"
            >
              <span>{content.cta}</span>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                strokeWidth={VITRINE_ICON_STROKE}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden
              />
            </Link>
            <p className="pro-comment-marche__footnote mt-4 flex items-center justify-center gap-2 text-center text-xs leading-relaxed text-brand-muted sm:text-[13px]">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={16}
                strokeWidth={VITRINE_ICON_STROKE}
                className="shrink-0 text-brand-green"
                aria-hidden
              />
              <span>{content.footnote}</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}