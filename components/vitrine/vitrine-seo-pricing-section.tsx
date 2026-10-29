import Link from "next/link"

import {
  getCatalogPricingRows,
  getEntryPriceHt,
  getEntryPriceTtcParticulier,
  PRICING_DISCLAIMER,
} from "@/lib/seo/pricing-snapshot"
import { WASTE_VOLUME_ROWS } from "@/lib/seo/waste-volume-guide"

type VitrineSeoPricingSectionProps = {
  /** Afficher le lien vers le hub local (home). */
  showHubLink?: boolean
}

export function VitrineSeoPricingSection({
  showHubLink = true,
}: VitrineSeoPricingSectionProps) {
  const rows = getCatalogPricingRows()
  const entryHt = getEntryPriceHt()
  const entryTtc = getEntryPriceTtcParticulier()

  return (
    <section
      className="vitrine-section-warm border-t border-brand-border py-14 sm:py-16"
      aria-labelledby="seo-pricing-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-5xl">
          <p className="section-eyebrow">Tarifs indicatifs</p>
          <h2
            id="seo-pricing-title"
            className="mt-3 font-[family-name:var(--font-display)] text-2xl font-semibold text-brand-navy sm:text-3xl"
          >
            Location de benne en Île-de-France : à partir de {entryHt} € HT
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-muted">
            Le point d’entrée du catalogue est la benne 8 m³ gravats propres :{" "}
            {entryHt} € HT, soit {entryTtc} € TTC pour un particulier.{" "}
            {PRICING_DISCLAIMER}
          </p>

          <div className="mt-8 overflow-x-auto rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt">
            <table className="w-full min-w-[280px] text-left text-sm">
              <caption className="sr-only">
                Exemples de forfaits location benne CORE ENVIRONNEMENT
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
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-brand-border/80 last:border-0">
                    <td className="px-4 py-3 text-brand-muted">{row.label}</td>
                    <td className="px-4 py-3 font-medium text-brand-navy">{row.priceHt} €</td>
                    <td className="px-4 py-3 font-medium text-brand-navy">{row.priceTtc} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 text-lg font-semibold text-brand-navy">
            Quelle benne pour quel déchet ?
          </h3>
          <ul className="mt-4 space-y-3">
            {WASTE_VOLUME_ROWS.map((row) => (
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

          {showHubLink ? (
            <p className="mt-8 text-sm text-brand-muted">
              <Link
                href="/location-benne"
                className="font-semibold text-brand-navy underline-offset-2 hover:text-brand-green hover:underline"
              >
                Voir toutes les communes desservies en Île-de-France
              </Link>
            </p>
          ) : null}

          <p className="mt-4 text-xs leading-relaxed text-brand-muted">
            Contenu revu en octobre 2026. Pas besoin d’appeler pour obtenir un premier tarif : utilisez
            le formulaire en haut de page.
          </p>
        </div>
      </div>
    </section>
  )
}
