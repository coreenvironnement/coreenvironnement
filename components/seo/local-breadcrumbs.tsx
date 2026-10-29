import Link from "next/link"

import { buildLocalBreadcrumbs } from "@/lib/seo/breadcrumbs"
import type { LocalPage } from "@/lib/seo/local-copy"

export function LocalBreadcrumbs({ page }: { page: LocalPage }) {
  const items = buildLocalBreadcrumbs(page)
  if (items.length < 2) return null

  return (
    <nav aria-label="Fil d'Ariane" className="container-x relative z-20 pb-2">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-white/85 sm:text-[13px]">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={item.href} className="inline-flex items-center gap-1.5">
              {index > 0 ? (
                <span className="text-white/45" aria-hidden>
                  /
                </span>
              ) : null}
              {last ? (
                <span className="font-medium text-white" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="underline-offset-2 hover:text-white hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
