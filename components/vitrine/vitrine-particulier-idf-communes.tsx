import Link from "next/link"

import {
  HOME_EARLY_ALL_COMMUNES_LINK,
  HOME_EARLY_LOCAL_SECTOR_LINKS,
} from "@/lib/seo/early-local-links"

import { localLinkPillClass } from "./vitrine-early-local-links"

export function VitrineParticulierIdfCommunes() {
  return (
    <section
      className="vitrine-particulier-idf-communes border-t border-brand-border/60 bg-brand-bg-alt py-10 sm:py-12"
      aria-labelledby="particulier-idf-communes-title"
    >
      <nav
        className="container-x text-center"
        aria-label="Communes desservies en Île-de-France"
      >
        <h2
          id="particulier-idf-communes-title"
          className="section-title text-balance text-brand-navy"
        >
          Votre benne en Île-de-France
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-brand-muted sm:text-[15px]">
          Retrouvez les informations utiles pour louer une benne dans votre
          commune.
        </p>
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {HOME_EARLY_LOCAL_SECTOR_LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={localLinkPillClass}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-5">
          <Link
            href={HOME_EARLY_ALL_COMMUNES_LINK.href}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-green underline-offset-4 transition-colors hover:text-brand-navy hover:underline"
          >
            {HOME_EARLY_ALL_COMMUNES_LINK.label}
          </Link>
        </p>
      </nav>
    </section>
  )
}
