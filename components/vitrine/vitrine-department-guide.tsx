"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons"

import { getDepartmentGuideCopy } from "@/lib/seo/department-guides"
import type { LocalPage } from "@/lib/seo/local-copy"
import { getCityPagesForDepartement } from "@/lib/seo/local-pages"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"

export function VitrineDepartmentGuide({ page }: { page: LocalPage }) {
  const { openOrder } = useVitrineOrder()
  const copy = getDepartmentGuideCopy(page)
  if (!copy) return null

  const featuredNames = page.villesPrincipales ?? []
  const cityPages = getCityPagesForDepartement(page.slug)
  const featured = featuredNames
    .map((name) => cityPages.find((city) => city.nom === name))
    .filter((city): city is NonNullable<typeof city> => Boolean(city))
  const extra = cityPages
    .filter((city) => !featuredNames.includes(city.nom))
    .slice(0, Math.max(0, 8 - featured.length))
  const cities = [...featured, ...extra].slice(0, 8)

  return (
    <section
      className="vitrine-section-warm border-t border-brand-border py-14 sm:py-18 lg:py-20"
      aria-labelledby="department-guide-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-5xl">
          <p className="section-eyebrow">Commander dans le {page.departementCode}</p>
          <h2
            id="department-guide-title"
            className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl"
          >
            Location de benne en {page.departementNom} ({page.departementCode})
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-muted">
            {copy.lead}
          </p>

          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Tarif", body: copy.tarif },
              { title: "Particuliers", body: copy.particuliers },
              { title: "Préparer la pose", body: copy.pose },
            ].map((card) => (
              <li
                key={card.title}
                className="rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt p-5 sm:p-6"
              >
                <h3 className="text-lg font-semibold text-brand-navy">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-muted">{card.body}</p>
              </li>
            ))}
          </ul>

          {cities.length > 0 ? (
            <div className="mt-8">
              <p className="text-sm font-semibold text-brand-navy">
                Villes déjà desservies dans le {page.departementCode}
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cities.map((city) => (
                  <li key={city.slug}>
                    <Link
                      href={`/location-benne/${city.slug}`}
                      className="inline-flex rounded-full border border-brand-border bg-brand-bg-alt px-3 py-1.5 text-sm text-brand-navy underline-offset-2 hover:border-brand-green/40 hover:text-brand-green hover:underline"
                    >
                      {city.nom}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" onClick={() => openOrder()} className="btn btn-accent">
              Commander une benne
            </button>
            <a href={SITE_PHONE_HREF} className="btn btn-ghost-dark">
              Une question ? {SITE_PHONE_DISPLAY}
            </a>
          </div>

          <p className="mt-6 flex gap-2 text-xs leading-relaxed text-brand-muted sm:text-sm">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              size={18}
              strokeWidth={VITRINE_ICON_STROKE}
              className="mt-0.5 shrink-0 text-brand-green"
              aria-hidden
            />
            Même catalogue, même délai minimum de 24 h et mêmes volumes que sur le reste du site.
            Aucune règle municipale n’est affirmée ici.
          </p>
        </div>
      </div>
    </section>
  )
}
