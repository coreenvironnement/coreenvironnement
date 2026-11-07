"use client"

import Link from "next/link"

import {
  getEarlyLocalLinksForPage,
  HOME_EARLY_LOCAL_LINKS,
  HOME_VOLUME_ESTIMATOR_HASH,
} from "@/lib/seo/early-local-links"
import type { LocalPage } from "@/lib/seo/local-copy"

import { useVitrineOrder } from "./order-context"

type VitrineEarlyLocalLinksProps =
  | { mode: "hub" }
  | { mode: "local"; page: LocalPage }

export const localLinkPillClass =
  "inline-flex min-h-11 items-center rounded-full border border-brand-border bg-white px-3.5 py-2 text-xs font-medium text-brand-navy transition-colors hover:border-brand-green/40 hover:text-brand-green sm:text-sm"

const pillLinkClass = localLinkPillClass

function isVolumeEstimatorHref(href: string): boolean {
  return (
    href === `/#${HOME_VOLUME_ESTIMATOR_HASH}` ||
    href === `#${HOME_VOLUME_ESTIMATOR_HASH}`
  )
}

export function VitrineEarlyLocalLinks(props: VitrineEarlyLocalLinksProps) {
  const { openVolumeEstimator } = useVitrineOrder()

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
            <li key={`${href}-${label}`}>
              {isVolumeEstimatorHref(href) ? (
                <button
                  type="button"
                  onClick={() => openVolumeEstimator()}
                  className={pillLinkClass}
                >
                  {label}
                </button>
              ) : (
                <Link href={href} className={pillLinkClass}>
                  {label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
