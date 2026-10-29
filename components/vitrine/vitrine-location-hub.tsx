import Link from "next/link"

import { SEO_CONTENT_REVISION_LABEL } from "@/lib/seo/content-revision"
import { getHubDepartementSections } from "@/lib/seo/local-pages"

export function VitrineLocationHub() {
  const sections = getHubDepartementSections()

  return (
    <>
      <section
        className="border-t border-brand-border bg-brand-bg-alt py-10 sm:py-12"
        aria-labelledby="hub-intro-title"
      >
        <div className="container-x max-w-3xl">
          <h2
            id="hub-intro-title"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy sm:text-2xl"
          >
            Où commander une benne en Île-de-France ?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-brand-muted">
            Cette page recense les départements et les communes principales desservies par CORE
            ENVIRONNEMENT. Chaque lien mène à une page locale avec le même tunnel de commande
            qu&apos;à l&apos;accueil : tarif selon adresse et déchet, validation en ligne, livraison
            possible sous 24 h selon disponibilité.
          </p>
          <p className="mt-3 text-sm text-brand-muted">
            <Link
              href="/location-benne/volume"
              className="font-semibold text-brand-navy underline-offset-2 hover:text-brand-green hover:underline"
            >
              Guide des volumes de benne (m³, gravats, débarras)
            </Link>
          </p>
          <p className="mt-6 text-xs text-brand-muted">
            Index mis à jour en {SEO_CONTENT_REVISION_LABEL}.
          </p>
        </div>
      </section>

      <section
        className="border-t border-brand-border bg-brand-bg py-12 sm:py-14"
        aria-labelledby="hub-depts-title"
      >
        <div className="container-x">
          <h2
            id="hub-depts-title"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy sm:text-2xl"
          >
            Départements desservis
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
            Ouvrez votre département pour la liste complète des communes, ou accédez directement
            aux villes les plus demandées ci-dessous.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {sections.map(({ departement }) => (
              <li key={departement.slug}>
                <Link
                  href={`/location-benne/${departement.slug}`}
                  className="block rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt p-4 transition-colors hover:border-brand-green/35 hover:bg-brand-warm-field/50"
                >
                  <span className="font-semibold text-brand-navy">{departement.departementNom}</span>
                  <span className="mt-1 block text-sm text-brand-muted">
                    {departement.departementCode} · toutes les communes
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        className="border-t border-brand-border/80 bg-brand-warm-field/30 py-12 sm:py-14"
        aria-labelledby="hub-cities-title"
      >
        <div className="container-x">
          <h2
            id="hub-cities-title"
            className="font-[family-name:var(--font-display)] text-xl font-semibold text-brand-navy sm:text-2xl"
          >
            Villes principales par département
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-base">
            Raccourcis vers les communes les plus consultées. Le service couvre aussi les
            communes voisines listées sur chaque page département.
          </p>
          <div className="mt-10 space-y-10">
            {sections.map(({ departement, featuredCities }) => (
              <div key={departement.slug}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.1em] text-brand-sky">
                  <Link
                    href={`/location-benne/${departement.slug}`}
                    className="hover:text-brand-green"
                  >
                    {departement.departementNom} ({departement.departementCode})
                  </Link>
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {featuredCities.map((city) => (
                    <li key={city.slug}>
                      <Link
                        href={`/location-benne/${city.slug}`}
                        className="inline-flex rounded-full border border-brand-border bg-white px-3 py-1.5 text-sm font-medium text-brand-navy transition-colors hover:border-brand-green/40 hover:text-brand-green"
                      >
                        {city.nom}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
