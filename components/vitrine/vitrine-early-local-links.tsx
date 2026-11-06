import Link from "next/link"

import {
  getEarlyLocalLinksForPage,
  HOME_EARLY_ALL_COMMUNES_LINK,
  HOME_EARLY_LOCAL_LINKS,
  HOME_EARLY_LOCAL_SECTOR_LINKS,
  HOME_EARLY_VOLUME_GUIDE_LINK,
} from "@/lib/seo/early-local-links"
import type { LocalPage } from "@/lib/seo/local-copy"

type VitrineEarlyLocalLinksProps =
  | { mode: "home" | "hub" }
  | { mode: "local"; page: LocalPage }

const pillLinkClass =
  "inline-flex min-h-11 items-center rounded-full border border-brand-border bg-white px-3.5 py-2 text-xs font-medium text-brand-navy transition-colors hover:border-brand-green/40 hover:text-brand-green sm:text-sm"

export function VitrineEarlyLocalLinks(props: VitrineEarlyLocalLinksProps) {
  if (props.mode === "home") {
    return (
      <nav
        className="vitrine-early-local-links relative z-20 border-b border-brand-border/70 bg-brand-bg-alt/95 py-4 backdrop-blur-sm"
        aria-label="Liens locaux CORE ENVIRONNEMENT"
      >
        <div className="container-x max-md:text-center">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-normal text-brand-navy sm:text-xl">
            Votre benne en Île-de-France
          </h2>
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-brand-muted max-md:mx-auto">
            Retrouvez les informations utiles pour louer une benne dans votre
            commune.
          </p>
          <ul className="mt-3 flex flex-wrap justify-center gap-2 max-md:justify-center md:max-lg:justify-start lg:justify-center">
            {HOME_EARLY_LOCAL_SECTOR_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={pillLinkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 max-md:text-center md:max-lg:text-left lg:text-center">
            <Link
              href={HOME_EARLY_ALL_COMMUNES_LINK.href}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-brand-green underline-offset-4 transition-colors hover:text-brand-navy hover:underline"
            >
              {HOME_EARLY_ALL_COMMUNES_LINK.label}
            </Link>
          </p>
          <p className="mt-4 border-t border-brand-border/60 pt-3 text-sm text-brand-muted max-md:text-center md:max-lg:text-left lg:text-center">
            Vous hésitez sur la taille de la benne ?{" "}
            <Link
              href={HOME_EARLY_VOLUME_GUIDE_LINK.href}
              className="font-medium text-brand-navy underline-offset-4 transition-colors hover:text-brand-green hover:underline"
            >
              {HOME_EARLY_VOLUME_GUIDE_LINK.label}
            </Link>
          </p>
        </div>
      </nav>
    )
  }

  const links =
    props.mode === "local"
      ? getEarlyLocalLinksForPage(props.page)
      : HOME_EARLY_LOCAL_LINKS.filter((l) => l.href !== "/location-benne")

  const title =
    props.mode === "local"
      ? "Communes proches et ressources"
      : "Location benne près de chez vous"

  return (
    <nav
      className="relative z-20 border-b border-brand-border/70 bg-brand-bg-alt/95 py-4 backdrop-blur-sm"
      aria-label="Liens locaux CORE ENVIRONNEMENT"
    >
      <div className="container-x max-md:text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-green">
          {title}
        </p>
        <ul className="mt-2.5 flex flex-wrap justify-center gap-2 max-md:justify-center md:justify-start">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} className={pillLinkClass}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
