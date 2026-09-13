import Link from "next/link"

import type { SeoVariant } from "@/lib/seo/landing-variants"
import { getDepartementPages } from "@/lib/seo/local-pages"

type VitrineLocalSeoProps = {
  seoVariant: SeoVariant
}

export function VitrineLocalSeo({ seoVariant }: VitrineLocalSeoProps) {
  const departements = getDepartementPages()
  const showCityGrid =
    seoVariant.relatedCityLinks && seoVariant.relatedCityLinks.length > 0

  return (
    <section
      className="border-t border-brand-border/80 bg-brand-bg-alt py-12 sm:py-14"
      aria-labelledby="zones-intervention-title"
    >
      <div className="container-x">
        {seoVariant.departementLink ? (
          <p className="mb-6 text-sm text-brand-muted">
            <Link
              href={seoVariant.departementLink.href}
              className="font-medium text-brand-navy underline-offset-2 hover:underline"
            >
              ← Location benne {seoVariant.departementLink.label}
            </Link>
          </p>
        ) : null}

        {showCityGrid ? (
          <div className="mb-10">
            <h2
              id="zones-intervention-title"
              className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy sm:text-2xl"
            >
              Villes desservies
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
              CORE ENVIRONNEMENT livre des bennes dans les communes ci-dessous et
              leurs environs. Même service : commande en ligne, intervention sous 24 h
              et suivi digital.
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {seoVariant.relatedCityLinks!.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-brand-navy/90 underline-offset-2 hover:text-brand-green hover:underline"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div>
          <h2
            className={
              showCityGrid
                ? "text-sm font-semibold uppercase tracking-[0.14em] text-brand-sky"
                : "font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy sm:text-2xl"
            }
            id={showCityGrid ? undefined : "zones-intervention-title"}
          >
            {showCityGrid ? "Tous les départements IDF" : "Zones d'intervention en Île-de-France"}
          </h2>
          {!showCityGrid ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
              Location de benne dans les 8 départements d&apos;Île-de-France.
            </p>
          ) : null}
          <ul className="mt-4 flex flex-wrap gap-2">
            {departements.map((dept) => (
              <li key={dept.slug}>
                <Link
                  href={`/location-benne/${dept.slug}`}
                  className="inline-flex rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition-colors hover:border-brand-green/40 hover:text-brand-green sm:text-sm"
                >
                  {dept.nom} ({dept.departementCode})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
