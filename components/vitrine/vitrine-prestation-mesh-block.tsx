import Link from "next/link"

import type { SeoLink } from "@/lib/seo/landing-variants"

type VitrinePrestationMeshBlockProps = {
  links: SeoLink[]
  title: string
  intro?: string
}

const pillClass =
  "inline-flex min-h-10 items-center rounded-full border border-brand-border bg-white px-3 py-1.5 text-sm font-medium text-brand-navy transition-colors hover:border-brand-green/40 hover:text-brand-green sm:text-sm"

export function VitrinePrestationMeshBlock({
  links,
  title,
  intro,
}: VitrinePrestationMeshBlockProps) {
  if (links.length === 0) return null

  return (
    <div
      className="mt-6 rounded-xl border border-brand-border/80 bg-brand-bg px-4 py-4 sm:px-5 sm:py-5"
      aria-labelledby="prestation-mesh-title"
    >
      <p
        id="prestation-mesh-title"
        className="text-sm font-semibold text-brand-navy"
      >
        {title}
      </p>
      {intro ? (
        <p className="mt-1 text-xs leading-relaxed text-brand-muted sm:text-sm">
          {intro}
        </p>
      ) : null}
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className={pillClass}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}