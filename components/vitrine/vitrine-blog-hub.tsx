import Link from "next/link"

import {
  BLOG_HUB_H1,
  BLOG_HUB_INTRO,
} from "@/lib/seo/blog-hub-content"
import { DECHETS_ACCEPTES_GUIDE_DESCRIPTION } from "@/lib/seo/dechets-acceptes-guide-content"
import {
  PRIX_LOCATION_BENNE_ARTICLE_DESCRIPTION,
  PRIX_LOCATION_BENNE_ARTICLE_H1,
} from "@/lib/seo/prix-location-benne-article-content"
import { VOLUME_GUIDE_DESCRIPTION } from "@/lib/seo/volume-guide-content"

import { VitrineFooter } from "./vitrine-footer"
import { VITRINE_HEADER_CONTENT_OFFSET_CLASS } from "./header-layout"
import { VitrineHeader } from "./vitrine-header"
import { VitrineMobileActionBar } from "./vitrine-mobile-action-bar"
import { VitrineOrderModal } from "./order-modal"
import { VitrineOrderProvider } from "./order-context"

const BREADCRUMBS = [
  { href: "/", label: "Accueil" },
  { href: "/blog", label: "Guides et conseils" },
] as const

const GUIDE_LINKS = [
  {
    href: "/location-benne/volume",
    title: "Quel volume de benne choisir ?",
    description: VOLUME_GUIDE_DESCRIPTION,
    eyebrow: "Guide volumes",
  },
  {
    href: "/location-benne/dechets-acceptes",
    title: "Quels déchets peut-on mettre dans une benne ?",
    description: DECHETS_ACCEPTES_GUIDE_DESCRIPTION,
    eyebrow: "Déchets acceptés",
  },
  {
    href: "/blog/prix-location-benne",
    title: PRIX_LOCATION_BENNE_ARTICLE_H1,
    description: PRIX_LOCATION_BENNE_ARTICLE_DESCRIPTION,
    eyebrow: "Tarifs",
  },
] as const

export function VitrineBlogHub() {
  return (
    <VitrineOrderProvider>
      <div className="vitrine-root vitrine--with-action-bar min-h-screen">
        <VitrineHeader />
        <main id="contenu" className={VITRINE_HEADER_CONTENT_OFFSET_CLASS}>
          <nav aria-label="Fil d'Ariane" className="container-x pb-2">
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-brand-muted sm:text-[13px]">
              {BREADCRUMBS.map((item, index) => {
                const last = index === BREADCRUMBS.length - 1
                return (
                  <li key={item.href} className="inline-flex items-center gap-1.5">
                    {index > 0 ? (
                      <span className="text-brand-border" aria-hidden>
                        /
                      </span>
                    ) : null}
                    {last ? (
                      <span className="font-medium text-brand-navy" aria-current="page">
                        {item.label}
                      </span>
                    ) : (
                      <Link
                        href={item.href}
                        className="underline-offset-2 hover:text-brand-green hover:underline"
                      >
                        {item.label}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>

          <section className="border-b border-brand-border bg-brand-bg py-12 sm:py-16">
            <div className="container-x mx-auto max-w-3xl">
              <p className="section-eyebrow">Ressources</p>
              <h1 className="vitrine-h1 text-balance">{BLOG_HUB_H1}</h1>
              <p className="vitrine-section-intro">{BLOG_HUB_INTRO}</p>

              <ul className="mt-10 space-y-4">
                {GUIDE_LINKS.map((item) => (
                  <li key={item.href}>
                    <article className="rounded-[var(--radius-card)] border border-brand-border bg-white p-5 shadow-[var(--shadow-vitrine-soft)] sm:p-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-brand-navy/75">
                        {item.eyebrow}
                      </p>
                      <h2 className="vitrine-h3 mt-2 text-balance">
                        <Link
                          href={item.href}
                          className="text-brand-navy underline-offset-2 hover:text-brand-green hover:underline"
                        >
                          {item.title}
                        </Link>
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                        {item.description}
                      </p>
                      <Link
                        href={item.href}
                        className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-brand-green underline-offset-2 hover:underline"
                      >
                        Lire le guide
                      </Link>
                    </article>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
        <VitrineFooter />
        <VitrineMobileActionBar />
        <VitrineOrderModal />
      </div>
    </VitrineOrderProvider>
  )
}