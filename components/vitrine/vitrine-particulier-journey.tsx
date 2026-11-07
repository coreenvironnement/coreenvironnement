import Image from "next/image"
import Link from "next/link"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"

const STEP_LINK_CLASS =
  "mt-3 inline-block text-[15px] font-medium text-brand-navy underline underline-offset-2 transition-colors hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2 max-md:mx-auto max-md:block max-md:w-fit"

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

  return (
    <section
      id="parcours"
      className="border-t border-brand-border/80 bg-brand-bg py-12 sm:py-16"
      aria-labelledby="parcours-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="section-eyebrow mx-auto w-fit justify-center">{parcours.eyebrow}</p>
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

        <ol className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-8 md:gap-y-10 lg:mt-12 lg:grid-cols-4 lg:gap-6">
          {parcours.etapes.map((step) => {
            const lien =
              "lien" in step && step.lien
                ? (step.lien as { label: string; href: string })
                : null
            const visual = STEP_VISUALS[step.num]
            return (
              <li key={step.num} className="min-w-0 max-md:text-center">
                {visual ? (
                  <div className="parcours-step-visual relative mx-auto aspect-[4/3] w-full max-w-[15rem] overflow-hidden rounded-xl border border-brand-green/12 bg-gradient-to-b from-[#eef5eb] to-brand-bg md:mx-0 max-md:max-w-[13.5rem]">
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      fill
                      className={
                        visual.imageClass ??
                        "object-contain object-center p-3"
                      }
                      sizes="(max-width: 768px) 216px, (max-width: 1024px) 50vw, 240px"
                    />
                  </div>
                ) : null}
                <p
                  className={`text-[13px] font-bold tabular-nums tracking-wide text-brand-green ${visual ? "mt-4" : ""}`}
                  aria-hidden
                >
                  {step.num}
                </p>
                <h3 className="mt-2 text-[17px] font-semibold leading-snug text-brand-navy sm:text-lg">
                  {step.titre}
                </h3>
                <p className="mt-3 text-[16px] leading-relaxed text-brand-muted">
                  {step.texte}
                </p>
                {lien ? (
                  <Link href={lien.href} className={STEP_LINK_CLASS}>
                    {lien.label}
                  </Link>
                ) : null}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
