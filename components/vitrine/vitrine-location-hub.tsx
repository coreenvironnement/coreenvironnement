import Link from "next/link"

import { getDepartementPages } from "@/lib/seo/local-pages"

export function VitrineLocationHub() {
  const departements = getDepartementPages()

  return (
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
          Choisissez votre département, puis votre commune. Même tunnel de commande sur
          tout le site.
        </p>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {departements.map((dept) => (
            <li key={dept.slug}>
              <Link
                href={`/location-benne/${dept.slug}`}
                className="block rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt p-4 transition-colors hover:border-brand-green/35 hover:bg-brand-warm-field/50"
              >
                <span className="font-semibold text-brand-navy">{dept.departementNom}</span>
                <span className="mt-1 block text-sm text-brand-muted">
                  {dept.departementCode} · villes et communes
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
