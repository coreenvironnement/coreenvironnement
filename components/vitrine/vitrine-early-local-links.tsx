import Link from "next/link"

import {
  getEarlyLocalLinksForPage,
  HOME_EARLY_LOCAL_LINKS,
} from "@/lib/seo/early-local-links"
import type { LocalPage } from "@/lib/seo/local-copy"

type VitrineEarlyLocalLinksProps =
  | { mode: "home" | "hub" }
  | { mode: "local"; page: LocalPage }

export function VitrineEarlyLocalLinks(props: VitrineEarlyLocalLinksProps) {
  const links =
    props.mode === "local"
      ? getEarlyLocalLinksForPage(props.page)
      : props.mode === "hub"
        ? HOME_EARLY_LOCAL_LINKS.filter((l) => l.href !== "/location-benne")
        : HOME_EARLY_LOCAL_LINKS

  const title =
    props.mode === "local"
      ? "Communes proches et ressources"
      : "Location benne près de chez vous"

  return (
    <nav
      className="relative z-20 border-b border-brand-border/70 bg-brand-bg-alt/95 py-4 backdrop-blur-sm"
      aria-label="Liens locaux CORE ENVIRONNEMENT"
    >
      <div className="container-x">
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-sky">
          {title}
        </p>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {links.map(({ href, label }) => (
            <li key={href}>
              <Link
                href={href}
                className="inline-flex rounded-full border border-brand-border bg-white px-3 py-1.5 text-xs font-medium text-brand-navy transition-colors hover:border-brand-green/40 hover:text-brand-green sm:text-sm"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
