"use client"

import { ChevronRight } from "lucide-react"

import { professionnelsEngagementsSection } from "@/lib/cdc/contenu-vitrine"

import { useVitrineOrder } from "./order-context"

const J1_NOTE_ID = "engagements-j1-note"

export function VitrineEngagements() {
  const { openOrder } = useVitrineOrder()
  const content = professionnelsEngagementsSection

  return (
    <section
      id="engagements"
      className="vitrine-section-warm border-t border-brand-border/60 py-12 sm:py-16 lg:py-20"
      aria-labelledby="engagements-title"
    >
      <div className="container-x">
        <header className="pro-engagements__header mx-auto max-w-3xl text-center">
          <p className="vitrine-label text-brand-green">{content.eyebrow}</p>
          <h2 id="engagements-title" className="vitrine-h2 mt-3 text-balance">
            {content.titre}
          </h2>
        </header>

        <ul
          className="pro-engagements__grid mx-auto mt-10 list-none space-y-4 p-0 sm:mt-12 lg:mt-14 lg:grid lg:grid-cols-3 lg:gap-5 lg:space-y-0 xl:gap-6"
          role="list"
        >
          {content.cartes.map((carte) => (
            <li key={carte.id} className="h-full">
              <article className="pro-engagements-card card-vitrine flex h-full flex-col gap-2 border-[#dce5df] bg-white p-5 text-center sm:gap-2.5 sm:p-6 lg:p-7">
                <h3 className="vitrine-h3 vitrine-h3--card text-brand-navy">
                  {"titreAsterisque" in carte && carte.titreAsterisque ? (
                    <>
                      {carte.titre}
                      <sup className="ml-0.5 align-super text-[0.65em] font-semibold">
                        <a
                          href={`#${J1_NOTE_ID}`}
                          className="text-brand-green underline decoration-brand-green/40 underline-offset-2 hover:text-brand-green-dark focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2"
                          aria-describedby={J1_NOTE_ID}
                        >
                          <span className="sr-only">, voir la note sur l&apos;intervention J+1</span>*
                        </a>
                      </sup>
                    </>
                  ) : (
                    carte.titre
                  )}
                </h3>
                <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-brand-muted sm:text-[15px]">
                  {carte.texte}
                </p>
              </article>
            </li>
          ))}
        </ul>

        <p
          id={J1_NOTE_ID}
          className="pro-engagements__note mx-auto mt-6 max-w-2xl text-center text-xs leading-relaxed text-brand-muted sm:text-[13px]"
        >
          * {content.noteJ1}
        </p>

        <div className="pro-engagements__cta mt-8 md:mt-10">
          <button
            type="button"
            onClick={() => openOrder()}
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#35A238] px-4 py-3 font-[family-name:var(--font-body)] text-[15px] font-semibold leading-snug text-white shadow-[0_8px_24px_-8px_rgb(14_32_16/0.45)] transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-base md:mx-auto md:max-w-sm lg:max-w-md"
          >
            <span className="min-w-0 flex-1 text-center">{content.cta}</span>
            <ChevronRight
              className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden
            />
          </button>
        </div>
      </div>
    </section>
  )
}