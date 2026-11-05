import Link from "next/link"

import { particulierAccueil } from "@/lib/cdc/contenu-vitrine"

const STEP_LINK_CLASS =
  "mt-3 inline-block text-[15px] font-medium text-brand-navy underline underline-offset-2 transition-colors hover:text-brand-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2 max-md:mx-auto max-md:block max-md:w-fit"

export function VitrineParticulierJourney() {
  const { parcours } = particulierAccueil

  return (
    <section
      id="parcours"
      className="border-t border-brand-border/80 bg-brand-bg py-12 sm:py-16"
      aria-labelledby="parcours-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-3xl max-md:text-center md:mx-0 md:text-left">
          <p className="section-eyebrow max-md:w-full max-md:justify-center">{parcours.eyebrow}</p>
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
            return (
              <li key={step.num} className="min-w-0 max-md:text-center">
                <p
                  className="text-[13px] font-bold tabular-nums tracking-wide text-brand-green"
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
