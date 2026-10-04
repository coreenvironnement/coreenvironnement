"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon, CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons"

import type { LocalPage } from "@/lib/seo/local-copy"
import { getCityOfficialInfo } from "@/lib/seo/city-official-info"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"

import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"

type GuideVariant = {
  intro: string
  planning: string
  access: string
}

const GUIDE_VARIANTS: readonly GuideVariant[] = [
  {
    intro:
      "Pour des travaux, une rénovation ou un débarras, commencez par identifier précisément ce qui doit être évacué. Cette étape aide à choisir une benne adaptée sans mélanger des flux incompatibles.",
    planning:
      "Préparez le type de déchets et le volume estimé, puis renseignez l’adresse et la date souhaitée dans le tunnel de commande.",
    access:
      "Décrivez l’emplacement prévu et les conditions d’accès : largeur disponible, portail, stationnement et contraintes utiles à la dépose.",
  },
  {
    intro:
      "Un projet de rénovation, de travaux ou de débarras se prépare d’abord par un inventaire des déchets à évacuer. Le tunnel CORE vous guide ensuite vers les catégories proposées.",
    planning:
      "Regroupez les informations essentielles : nature des déchets, volume envisagé, adresse du chantier et date souhaitée.",
    access:
      "Vérifiez où la benne peut être déposée et signalez les particularités d’accès afin que CORE puisse examiner votre demande.",
  },
  {
    intro:
      "Avant l’évacuation, séparez les déchets selon les catégories disponibles dans le catalogue CORE. Vous pourrez ainsi décrire clairement votre besoin pour vos travaux ou votre débarras.",
    planning:
      "Estimez le volume, choisissez le flux correspondant, puis indiquez l’adresse du projet et la date souhaitée lors de la commande.",
    access:
      "Précisez l’emplacement de pose envisagé et tout élément d’accès utile, notamment un portail, une rue étroite ou une zone de stationnement.",
  },
]

function stableVariantIndex(slug: string): number {
  let hash = 0
  for (const character of slug) hash = (hash * 31 + character.charCodeAt(0)) >>> 0
  return hash % GUIDE_VARIANTS.length
}

export function VitrineCityGuide({ page }: { page: LocalPage }) {
  const { openOrder } = useVitrineOrder()
  const officialInfo = getCityOfficialInfo(page.slug)
  const variant = GUIDE_VARIANTS[stableVariantIndex(page.slug)]
  const city = page.city ?? page.nom

  return (
    <section
      className="border-t border-brand-border bg-white py-14 sm:py-18 lg:py-20"
      aria-labelledby="city-guide-title"
    >
      <div className="container-x">
        <div className="mx-auto max-w-5xl">
          <p className="section-eyebrow">Bien préparer votre location</p>
          <h2
            id="city-guide-title"
            className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-2xl font-semibold leading-tight text-brand-navy sm:text-3xl"
          >
            Location de benne à {city} : préparer votre projet
          </h2>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
            <article className="rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-brand-navy sm:text-2xl">
                Location de benne pour particuliers à {city}
              </h3>
              <p className="mt-4 leading-relaxed text-brand-muted">{variant.intro}</p>

              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {[variant.planning, variant.access].map((item) => (
                  <li key={item} className="flex gap-3 rounded-xl bg-white p-4 text-sm leading-relaxed text-brand-muted">
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      size={20}
                      strokeWidth={VITRINE_ICON_STROKE}
                      className="mt-0.5 shrink-0 text-brand-green"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm leading-relaxed text-brand-muted">
                Le catalogue propose notamment les gravats propres, les déchets non dangereux en
                mélange, le bois, les végétaux et le plâtre. En cas de doute sur un déchet ou sur
                l’accès, contactez CORE avant de valider.
              </p>
            </article>

            <aside className="rounded-[var(--radius-card)] bg-brand-navy p-6 text-white sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/70">
                Les informations à préparer
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/85">
                <li>Type et volume des déchets</li>
                <li>Adresse et emplacement envisagé</li>
                <li>Conditions d’accès au chantier</li>
                <li>Date souhaitée et coordonnées de contact</li>
              </ul>
              <div className="mt-7 flex flex-col gap-3">
                <button type="button" onClick={openOrder} className="btn btn-accent w-full">
                  Commander une benne
                </button>
                <a href={SITE_PHONE_HREF} className="btn btn-ghost-light w-full">
                  Une question ? {SITE_PHONE_DISPLAY}
                </a>
              </div>
            </aside>
          </div>

          {officialInfo ? (
            <div className="mt-5 rounded-[var(--radius-card)] border border-brand-green/25 bg-brand-green-soft p-6 sm:p-8">
              <div className="flex gap-4">
                <HugeiconsIcon
                  icon={InformationCircleIcon}
                  size={24}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="mt-0.5 shrink-0 text-brand-green-dark"
                  aria-hidden
                />
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy">
                    À savoir avant l’installation d’une benne à {city}
                  </h3>
                  <p className="mt-3 text-sm font-medium leading-relaxed text-brand-navy">
                    {officialInfo.summary}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                    {officialInfo.content}
                  </p>
                  <a
                    href={officialInfo.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-navy underline-offset-4 hover:underline"
                  >
                    Source officielle : {officialInfo.sourceTitle}
                    <HugeiconsIcon icon={ArrowUpRight01Icon} size={14} aria-hidden />
                  </a>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-5 rounded-xl border border-brand-border bg-brand-bg-alt px-5 py-4 text-xs leading-relaxed text-brand-muted sm:text-sm">
            <p className="font-semibold text-brand-navy">Informations locales</p>
            <p className="mt-1">
              Les informations locales et administratives présentées sont fournies à titre
              indicatif et sont susceptibles d’évoluer. Les règles peuvent varier selon
              l’emplacement et la situation. Pour confirmer les modalités applicables à votre
              projet, contactez CORE Environnement au {SITE_PHONE_DISPLAY} ou le service public
              compétent.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
