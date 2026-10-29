import Link from "next/link"

import { SEO_CONTENT_REVISION_LABEL } from "@/lib/seo/content-revision"
import { PRICING_DISCLAIMER } from "@/lib/seo/pricing-snapshot"
import {
  getVolumeGuidePricingRows,
  getVolumeGuideWasteRows,
  VOLUME_GUIDE_SECTIONS,
} from "@/lib/seo/volume-guide-content"

import { VitrineFinalCta } from "./vitrine-final-cta"
import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"
import { VitrineOrderModal } from "./order-modal"
import { VitrineOrderProvider } from "./order-context"

const VOLUME_BREADCRUMBS = [
  { href: "/", label: "Accueil" },
  { href: "/location-benne", label: "Location benne" },
  { href: "/location-benne/volume", label: "Guide volumes" },
] as const

export function VitrineVolumeGuide() {
  const pricingRows = getVolumeGuidePricingRows()
  const wasteRows = getVolumeGuideWasteRows()

  return (
    <VitrineOrderProvider>
      <div className="vitrine-root min-h-screen">
        <VitrineHeader />
        <main id="contenu" className="pt-[7.25rem] sm:pt-[7.75rem]">
          <nav aria-label="Fil d'Ariane" className="container-x pb-2">
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-brand-muted sm:text-[13px]">
              {VOLUME_BREADCRUMBS.map((item, index) => {
                const last = index === VOLUME_BREADCRUMBS.length - 1
                return (
                  <li key={item.href} className="inline-flex items-center gap-1.5">
                    {index > 0 ? (
                      <span className="text-brand-border" aria-hidden>
                        /
                      </span>
                    ) : null}
                    {last ? (
                      <span className="font-medium text-brand-navy" aria-current="page">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="underline-offset-2 hover:text-brand-green hover:underline"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>

          <article className="border-b border-brand-border bg-brand-bg py-12 sm:py-16">
            <div className="container-x mx-auto max-w-3xl">
              <p className="section-eyebrow">Guide pratique</p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold text-brand-navy sm:text-4xl">
                Quel volume de benne choisir ?
              </h1>
              <p className="mt-4 text-base leading-relaxed text-brand-muted sm:text-lg">
                Estimation en m³, choix selon le déchet, exemples de forfaits CORE ENVIRONNEMENT
                en Île-de-France. Contenu revu en {SEO_CONTENT_REVISION_LABEL}.
              </p>

              {VOLUME_GUIDE_SECTIONS.map((section) => (
                <section key={section.id} id={section.id} className="mt-10 scroll-mt-28">
                  <h2 className="text-xl font-semibold text-brand-navy">{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph.slice(0, 40)} className="mt-3 text-base leading-relaxed text-brand-muted">
                      {paragraph}
                    </p>
                  ))}

                  {section.id === "catalogue" ? (
                    <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt">
                      <table className="w-full min-w-[280px] text-left text-sm">
                        <caption className="sr-only">
                          Exemples de forfaits par volume
                        </caption>
                        <thead>
                          <tr className="border-b border-brand-border bg-brand-warm-field/80">
                            <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                              Forfait
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                              HT
                            </th>
                            <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                              TTC particulier
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {pricingRows.map((row) => (
                            <tr
                              key={row.label}
                              className="border-b border-brand-border/80 last:border-0"
                            >
                              <td className="px-4 py-3 text-brand-muted">{row.label}</td>
                              <td className="px-4 py-3 font-medium text-brand-navy">
                                {row.priceHt} €
                              </td>
                              <td className="px-4 py-3 font-medium text-brand-navy">
                                {row.priceTtc} €
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}

                  {section.id === "dechet" ? (
                    <ul className="mt-4 space-y-3">
                      {wasteRows.map((row) => (
                        <li
                          key={row.dechet}
                          className="rounded-xl border border-brand-green/12 bg-brand-bg-alt px-4 py-3 text-sm leading-relaxed text-brand-muted"
                        >
                          <span className="font-semibold text-brand-navy">{row.dechet}</span>
                          <span className="text-brand-navy"> · Volume conseillé : {row.volume}. </span>
                          {row.note}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {section.id === "commande" ? (
                    <p className="mt-4 text-sm text-brand-muted">
                      <Link
                        href="/location-benne"
                        className="font-semibold text-brand-navy underline-offset-2 hover:text-brand-green hover:underline"
                      >
                        Voir toutes les communes desservies
                      </Link>
                      {" · "}
                      <Link
                        href="/#parcours"
                        className="font-semibold text-brand-navy underline-offset-2 hover:text-brand-green hover:underline"
                      >
                        Reprendre la commande depuis l&apos;accueil
                      </Link>
                    </p>
                  ) : null}
                </section>
              ))}

              <p className="mt-10 text-xs leading-relaxed text-brand-muted">{PRICING_DISCLAIMER}</p>
            </div>
          </article>

          <VitrineFinalCta />
        </main>
        <VitrineFooter />
        <VitrineOrderModal />
      </div>
    </VitrineOrderProvider>
  )
}
