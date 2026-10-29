"use client"

import type { LocalPage } from "@/lib/seo/local-copy"
import { buildLongtailTitle } from "@/lib/seo/longtail-seo"
import { getEntryPriceHt, getEntryPriceTtcParticulier } from "@/lib/seo/pricing-snapshot"

import { useVitrineOrder } from "./order-context"

export function VitrineLongtailIntro({ page }: { page: LocalPage }) {
  const { openOrder } = useVitrineOrder()
  const ht = getEntryPriceHt()
  const ttc = getEntryPriceTtcParticulier()
  const geo = page.city
    ? `${page.city} (${page.departementCode})`
    : `${page.departementNom} (${page.departementCode})`

  return (
    <section
      className="vitrine-section-warm border-t border-brand-border py-12 sm:py-14"
      aria-labelledby="longtail-intro-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-3xl">
          <h2
            id="longtail-intro-title"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy sm:text-2xl"
          >
            {buildLongtailTitle(page)}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-muted">
            Service {geo}. Dès {ht} € HT ({ttc} € TTC particulier pour une benne 8 m³ gravats propres).
            Indiquez votre adresse et votre type de déchet : le montant s’affiche avant validation.
          </p>
          <button
            type="button"
            className="btn btn-accent mt-6"
            onClick={() => openOrder()}
          >
            Voir mon tarif
          </button>
        </div>
      </div>
    </section>
  )
}
