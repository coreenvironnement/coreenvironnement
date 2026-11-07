import type { ReactNode } from "react"

import Link from "next/link"

import {
  DECHETS_ACCEPTES_ADEME_AMIANTE_HREF,
  DECHETS_ACCEPTES_ADEME_COLLECTE_HREF,
  DECHETS_ACCEPTES_GUIDE_CALLOUT,
  DECHETS_ACCEPTES_CHARGEMENT_STEPS,
  DECHETS_ACCEPTES_COLLECTE_LIST,
  DECHETS_ACCEPTES_GUIDE_INTRO,
  DECHETS_ACCEPTES_GUIDE_TABLE_ROWS,
  DECHETS_ACCEPTES_GUIDE_TOC,
  DECHETS_ACCEPTES_ORDER_CTA_HREF,
  DECHETS_ACCEPTES_PHONE_DISPLAY,
  DECHETS_ACCEPTES_PHONE_HREF,
  DECHETS_ACCEPTES_VOLUME_GUIDE_HREF,
} from "@/lib/seo/dechets-acceptes-guide-content"

import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"
import { VitrineOrderModal } from "./order-modal"
import { VitrineOrderProvider } from "./order-context"

const BREADCRUMBS = [
  { href: "/", label: "Accueil" },
  { href: "/location-benne", label: "Location benne" },
  { href: "/location-benne/dechets-acceptes", label: "Déchets acceptés" },
] as const

const BODY_CLASS = "mt-3 text-base leading-relaxed text-brand-muted"
const H3_CLASS = "vitrine-h3 mt-8"
const H2_CLASS = "vitrine-h2 text-balance"
const CALLOUT_CLASS =
  "mt-4 rounded-xl border border-brand-green/12 bg-brand-warm px-4 py-3 text-sm leading-relaxed text-brand-muted"
const SECONDARY_LINK_CLASS =
  "font-semibold text-brand-navy underline-offset-2 hover:text-brand-green hover:underline"

function GuideParagraph({ children }: { children: string }) {
  return <p className={BODY_CLASS}>{children}</p>
}

function GuideCallout({ children }: { children: ReactNode }) {
  return <div className={CALLOUT_CLASS}>{children}</div>
}

export function VitrineDechetsAcceptesGuide() {
  return (
    <VitrineOrderProvider>
      <div className="vitrine-root min-h-screen">
        <VitrineHeader />
        <main id="contenu" className="pt-[7.25rem] sm:pt-[7.75rem]">
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

          <article className="border-b border-brand-border bg-brand-bg py-12 sm:py-16">
            <div className="container-x mx-auto max-w-3xl">
              <p className="section-eyebrow">Guide pratique</p>
              <h1 className="vitrine-h1 text-balance">
                Quels déchets peut-on mettre dans une benne ?
              </h1>
              <p className="vitrine-section-intro">{DECHETS_ACCEPTES_GUIDE_INTRO}</p>

              <GuideCallout>{DECHETS_ACCEPTES_GUIDE_CALLOUT}</GuideCallout>

              <nav
                aria-label="Dans ce guide"
                className="mt-8 rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt px-4 py-4 sm:px-5"
              >
                <p className="text-sm font-semibold text-brand-navy">Dans ce guide</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {DECHETS_ACCEPTES_GUIDE_TOC.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={SECONDARY_LINK_CLASS}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <section id="identifier-dechets" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Quels déchets correspondent à votre projet ?
                </h2>
                <GuideParagraph>
                  Commencez par faire la liste des matériaux que vous souhaitez évacuer. Les exemples
                  ci-dessous vous aident à les identifier : leur acceptation doit ensuite être vérifiée
                  dans le détail de l’offre choisie.
                </GuideParagraph>

                <div className="mt-6 hidden overflow-x-auto rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt md:block">
                  <table className="w-full min-w-[280px] text-left text-sm">
                    <caption className="sr-only">
                      Exemples de déchets et points à vérifier
                    </caption>
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-warm-field/80">
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Vos déchets
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Exemples
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Ce qu’il faut vérifier
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {DECHETS_ACCEPTES_GUIDE_TABLE_ROWS.map((row) => (
                        <tr
                          key={row.category}
                          className="border-b border-brand-border/80 last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-brand-navy">
                            {row.category}
                          </td>
                          <td className="px-4 py-3 text-brand-muted">{row.examples}</td>
                          <td className="px-4 py-3 text-brand-muted">{row.verify}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 space-y-4 md:hidden">
                  {DECHETS_ACCEPTES_GUIDE_TABLE_ROWS.map((row) => (
                    <article
                      key={row.category}
                      className="rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt p-4"
                    >
                      <p className="text-sm font-semibold text-brand-navy">Vos déchets</p>
                      <p className="mt-1 text-sm text-brand-muted">{row.category}</p>
                      <p className="mt-3 text-sm font-semibold text-brand-navy">Exemples</p>
                      <p className="mt-1 text-sm text-brand-muted">{row.examples}</p>
                      <p className="mt-3 text-sm font-semibold text-brand-navy">
                        Ce qu’il faut vérifier
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-brand-muted">
                        {row.verify}
                      </p>
                    </article>
                  ))}
                </div>

                <h3 className={H3_CLASS}>Que signifie « mélange DND » ?</h3>
                <GuideParagraph>
                  DND signifie « déchets non dangereux ». Une offre de mélange DND peut accepter
                  plusieurs matériaux, mais elle possède sa propre liste de déchets autorisés. Elle ne
                  signifie pas que tous les déchets peuvent être déposés ensemble.
                </GuideParagraph>
                <GuideParagraph>
                  Dans la commande, consultez les informations « Déchets acceptés et interdits » de la
                  benne envisagée. Si un matériau de votre liste n’y figure pas clairement,
                  demandez-nous conseil avant de réserver.
                </GuideParagraph>
              </section>

              <section id="collecte-specifique" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Quels déchets nécessitent une collecte spécifique ?
                </h2>
                <GuideParagraph>
                  Certains déchets doivent être gardés à part et orientés vers une collecte adaptée. Ne
                  les ajoutez pas à une benne classique de gravats ou de déchets mélangés.
                </GuideParagraph>
                <ul className={`${BODY_CLASS} list-disc space-y-2 pl-5`}>
                  {DECHETS_ACCEPTES_COLLECTE_LIST.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <GuideParagraph>
                  Pour ces déchets, renseignez-vous auprès de votre déchèterie ou d’un point de
                  collecte spécialisé avant de vous déplacer. Les déchets acceptés et les conditions de
                  dépôt varient selon les sites.
                </GuideParagraph>

                <h3 className={H3_CLASS}>
                  Vous avez un doute sur un matériau susceptible de contenir de l’amiante ?
                </h3>
                <GuideParagraph>
                  Ne le cassez pas et ne le mélangez pas aux autres déchets. Faites appel à un
                  professionnel compétent pour déterminer la marche à suivre. Une photographie ne
                  suffit pas à confirmer l’absence d’amiante.
                </GuideParagraph>
                <p className="mt-4">
                  <a
                    href={DECHETS_ACCEPTES_ADEME_AMIANTE_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SECONDARY_LINK_CLASS}
                  >
                    Consulter les conseils de l’ADEME sur l’amiante
                  </a>
                </p>

                <h3 className={H3_CLASS}>Où trouver une solution pour mes autres déchets ?</h3>
                <GuideParagraph>
                  L’outil de l’ADEME vous aide à rechercher une solution selon l’objet ou le déchet
                  dont vous souhaitez vous séparer.
                </GuideParagraph>
                <p className="mt-4">
                  <a
                    href={DECHETS_ACCEPTES_ADEME_COLLECTE_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={SECONDARY_LINK_CLASS}
                  >
                    Trouver une solution de collecte avec l’ADEME
                  </a>
                </p>
              </section>

              <section id="preparer-chargement" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Comment préparer le chargement de votre benne ?
                </h2>

                <ol className="mt-6 space-y-6">
                  {DECHETS_ACCEPTES_CHARGEMENT_STEPS.map((step, index) => (
                    <li key={step.title} className="rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt px-4 py-4 sm:px-5">
                      <p className="text-sm font-semibold text-brand-navy">
                        Étape {index + 1} — {step.title}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-brand-muted">{step.text}</p>
                    </li>
                  ))}
                </ol>

                <p className="mt-6">
                  <Link href={DECHETS_ACCEPTES_VOLUME_GUIDE_HREF} className={SECONDARY_LINK_CLASS}>
                    Consulter le guide pour choisir mon volume de benne
                  </Link>
                </p>

                <GuideCallout>
                  Vous avez plusieurs types de déchets ? Indiquez-les dès le départ. Le choix de
                  l’offre dépend des matériaux à évacuer, pas seulement du volume du tas.
                </GuideCallout>
              </section>

              <section id="conseil-dechets" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Un doute sur vos déchets ? Parlons de votre projet.
                </h2>
                <GuideParagraph>
                  Avant de réserver, préparez la liste des matériaux à évacuer, leur quantité
                  approximative et l’adresse de livraison. Ces informations nous permettent de vous
                  conseiller sur l’offre à choisir.
                </GuideParagraph>
                <div className="mt-6 flex flex-col items-start gap-2">
                  <a href={DECHETS_ACCEPTES_PHONE_HREF} className="btn btn-outline">
                    Demander conseil sur mes déchets
                  </a>
                  <p className="text-sm text-brand-muted">{DECHETS_ACCEPTES_PHONE_DISPLAY}</p>
                </div>

                <h3 className={H3_CLASS}>Vous avez identifié vos déchets ?</h3>
                <GuideParagraph>
                  Renseignez votre adresse de livraison et le type de déchets pour consulter les
                  bennes proposées dans votre secteur en Île-de-France. Vous pourrez comparer les
                  volumes et les tarifs TTC avant de commander.
                </GuideParagraph>
                <div className="mt-6">
                  <Link href={DECHETS_ACCEPTES_ORDER_CTA_HREF} className="btn btn-accent">
                    Voir les bennes et les tarifs
                  </Link>
                </div>
              </section>
            </div>
          </article>
        </main>
        <VitrineFooter />
        <VitrineOrderModal />
      </div>
    </VitrineOrderProvider>
  )
}
