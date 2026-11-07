"use client"

import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"

import { useVitrineOrder } from "./order-context"

const STEP_LINK_CLASS =
  "mt-3 inline-block text-left text-[15px] font-medium text-brand-navy underline underline-offset-2 transition-colors hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"

const STEP_VISUALS: Record<
  string,
  { src: string; alt: string; imageClass?: string }
> = {
  "01": {
    src: "/vitrine-scroll/benne-vide.png",
    alt: "Benne vide — choix du volume et du type de déchets en ligne",
  },
  "02": {
    src: "/images/parcours-etape-2.png",
    alt: "Camion déposant une benne vide sur votre adresse",
    imageClass: "object-contain object-center px-1.5 py-2.5 sm:px-2 sm:py-3",
  },
  "03": {
    src: "/images/parcours-etape-3.png",
    alt: "Benne verte remplie de gravats sur place",
    imageClass: "object-contain object-center px-2 py-1 sm:px-2.5 sm:py-1.5",
  },
  "04": {
    src: "/images/parcours-etape-4.png",
    alt: "Camion porte-benne chargé de gravats — enlèvement",
    imageClass: "object-contain object-center px-1.5 py-2.5 sm:px-2 sm:py-3",
  },
}

export function VitrineParticulierJourney() {
  const { parcours } = particulierAccueil
  const { openOrder } = useVitrineOrder()

  return (
    <section
      id="parcours"
      className="border-t border-brand-border/80 bg-brand-bg py-12 sm:py-16"
      aria-labelledby="parcours-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow mx-auto w-fit justify-center">
            {parcours.eyebrow}
          </p>
          <h2
            id="parcours-title"
            className="section-title mt-3 text-balance text-brand-navy"
          >
            {parcours.titre}
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-brand-muted sm:text-[17px]">
            {parcours.intro}
          </p>
        </div>

        <ol className="parcours-steps mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {parcours.etapes.map((step) => {
            const lien =
              "lien" in step && step.lien
                ? (step.lien as { label: string; href: string })
                : null
            const visual = STEP_VISUALS[step.num]
            return (
              <li
                key={step.num}
                className="parcours-step min-w-0 max-md:flex max-md:items-start max-md:gap-3.5"
              >
                {visual ? (
                  <div className="parcours-step-visual relative shrink-0 overflow-hidden rounded-xl border border-brand-green/12 bg-gradient-to-b from-[#eef5eb] to-brand-bg max-md:aspect-square max-md:h-[4.75rem] max-md:w-[5.5rem] md:mx-0 md:aspect-[4/3] md:w-full md:max-w-[15rem] lg:mx-0">
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      fill
                      className={
                        visual.imageClass ??
                        "object-contain object-center p-3 max-md:p-1.5"
                      }
                      sizes="(max-width: 768px) 88px, (max-width: 1024px) 50vw, 240px"
                    />
                  </div>
                ) : null}
                <div className="parcours-step-body min-w-0 flex-1 md:mt-0">
                  <h3 className="mt-0 text-[17px] font-semibold leading-snug text-brand-navy max-md:text-left md:mt-4 sm:text-lg">
                    <span className="text-brand-green tabular-nums">
                      {step.num}
                    </span>
                    <span className="text-brand-green" aria-hidden>
                      {" "}
                      ·{" "}
                    </span>
                    {step.titre}
                  </h3>
                  <p className="mt-2 text-[16px] leading-relaxed text-brand-muted max-md:text-left">
                    {step.texte}
                  </p>
                  {lien ? (
                    <Link href={lien.href} className={STEP_LINK_CLASS}>
                      {lien.label}
                    </Link>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ol>

        <div className="parcours-cta mt-10 lg:mt-12">
          <button
            type="button"
            onClick={() => openOrder({ intentStart: "waste" })}
            className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#35A238] px-4 py-3 font-[family-name:var(--font-body)] text-[15px] font-semibold leading-snug text-white shadow-[0_8px_24px_-8px_rgb(14_32_16/0.45)] transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-base md:mx-auto md:max-w-sm lg:max-w-md"
          >
            <span className="min-w-0 flex-1 text-center">{parcours.cta}</span>
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
