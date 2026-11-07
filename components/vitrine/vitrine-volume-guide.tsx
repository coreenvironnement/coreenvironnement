import type { ReactNode } from "react"

import Link from "next/link"

import {
  VOLUME_GUIDE_COMMUNES_HREF,
  VOLUME_GUIDE_ESTIMATEUR_HREF,
  VOLUME_GUIDE_INTRO,
  VOLUME_GUIDE_ORDER_CTA_HREF,
  VOLUME_GUIDE_PHONE_DISPLAY,
  VOLUME_GUIDE_PHONE_HREF,
  VOLUME_GUIDE_PRICING_ROWS,
  VOLUME_GUIDE_TOC,
} from "@/lib/seo/volume-guide-content"

import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"
import { VitrineOrderModal } from "./order-modal"
import { VitrineOrderProvider } from "./order-context"

const VOLUME_BREADCRUMBS = [
  { href: "/", label: "Accueil" },
  { href: "/location-benne", label: "Location benne" },
  { href: "/location-benne/volume", label: "Guide volumes" },
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

export function VitrineVolumeGuide() {
  return (
    <VitrineOrderProvider>
      <div className="vitrine-root min-h-screen">
        <VitrineHeader />
        <main id="contenu" className="pt-[7.25rem] sm:pt-[7.75rem]">
          <nav aria-label="Fil d'Ariane" className="container-x pb-2">
            <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[12px] text-brand-muted sm:text-[13px]">
              {VOLUME_BREADCRUMBS.map((item, index) => {
                const last = index === VOLUME_BREADCRUMBS.length - 1
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
              <h1 className="vitrine-h1 text-balance">Quel volume de benne choisir ?</h1>
              <p className="vitrine-section-intro">
                {VOLUME_GUIDE_INTRO}
              </p>

              <nav aria-label="Dans ce guide" className="mt-8 rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt px-4 py-4 sm:px-5">
                <p className="text-sm font-semibold text-brand-navy">Dans ce guide</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {VOLUME_GUIDE_TOC.map((item) => (
                    <li key={item.href}>
                      <a href={item.href} className={SECONDARY_LINK_CLASS}>
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>

              <section id="volume-et-poids" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Volume et poids : quelle différence ?
                </h2>
                <GuideParagraph>
                  Le volume d’une benne, exprimé en mètres cubes (m³), indique l’espace disponible pour
                  accueillir vos déchets. Il ne correspond pas à un poids en tonnes.
                </GuideParagraph>
                <GuideParagraph>
                  Des gravats et des cartons peuvent occuper le même espace tout en pesant très
                  différemment. Pour les déchets lourds, comme le béton ou la terre, le poids peut
                  limiter le chargement avant que la benne soit entièrement remplie.
                </GuideParagraph>
                <GuideCallout>
                  Pour comparer les offres, regardez ensemble le volume en m³, le poids compris dans le
                  forfait et les conditions de chargement.
                </GuideCallout>
              </section>

              <section id="estimer-volume" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Comment estimer votre volume de déchets ?
                </h2>

                <h3 className={H3_CLASS}>À partir des dimensions d’un tas</h3>
                <GuideParagraph>
                  Pour un tas de forme assez régulière, multipliez sa longueur, sa largeur et sa hauteur
                  en mètres.
                </GuideParagraph>
                <GuideCallout>
                  <p className="font-semibold text-brand-navy">
                    Longueur × largeur × hauteur = volume en m³
                  </p>
                  <p className="mt-2">
                    Un tas de 4 m de long, 2 m de large et 1,2 m de haut représente environ 9,6 m³.
                  </p>
                </GuideCallout>
                <GuideParagraph>
                  Ce calcul donne un ordre de grandeur. La forme du tas et la disposition des déchets
                  influencent la précision de l’estimation.
                </GuideParagraph>

                <h3 className={H3_CLASS}>À partir du nombre de sacs</h3>
                <GuideParagraph>
                  Additionnez le volume des sacs remplis : 1 000 litres correspondent à 1 m³.
                </GuideParagraph>
                <GuideCallout>
                  40 sacs de 100 litres entièrement remplis représentent environ 4 m³.
                </GuideCallout>
                <GuideParagraph>
                  Cette méthode aide à estimer l’espace occupé. Pour des gravats, vérifiez également le
                  poids : le volume des sacs ne suffit pas à choisir la benne.
                </GuideParagraph>

                <h3 className={H3_CLASS}>Avec notre estimateur en ligne</h3>
                <GuideParagraph>
                  Vous pouvez aussi utiliser notre estimateur à partir des dimensions de votre tas ou du
                  nombre de sacs. Si vous connaissez déjà votre volume, vous pouvez le sélectionner
                  directement.
                </GuideParagraph>
                <GuideParagraph>
                  L’outil est accessible dans la commande, après avoir renseigné votre adresse et le type
                  de déchets. Il vous aide à comparer les capacités proposées pour votre demande.
                </GuideParagraph>
                <p className="mt-4">
                  <Link href={VOLUME_GUIDE_ESTIMATEUR_HREF} className={SECONDARY_LINK_CLASS}>
                    Estimer mon volume dans la commande
                  </Link>
                </p>
              </section>

              <section id="choisir-dechets" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Quelle benne choisir selon vos déchets ?
                </h2>

                <h3 className={H3_CLASS}>Pour des gravats</h3>
                <GuideParagraph>
                  Béton, briques, tuiles : vérifiez que vos matériaux figurent parmi les déchets acceptés
                  dans l’offre « gravats propres ».
                </GuideParagraph>
                <GuideParagraph>
                  Le poids compte particulièrement pour ces déchets. Comparez les volumes proposés avec
                  le poids compris dans chaque forfait.
                </GuideParagraph>

                <h3 className={H3_CLASS}>Pour de la terre</h3>
                <GuideParagraph>
                  Si vous devez évacuer de la terre, vérifiez qu’elle est acceptée dans l’offre choisie.
                  Son volume et son poids doivent être pris en compte ensemble pour préparer le
                  chargement.
                </GuideParagraph>

                <h3 className={H3_CLASS}>Pour un débarras ou des déchets mélangés</h3>
                <GuideParagraph>
                  Bois, emballages, objets encombrants : consultez la liste des déchets acceptés pour
                  trouver l’offre correspondant à votre projet.
                </GuideParagraph>
                <GuideParagraph>
                  Une offre de mélange de déchets non dangereux, parfois appelée « mélange DND », possède
                  elle aussi ses consignes de tri. Vérifiez notamment les conditions concernant le plâtre
                  et les différents matériaux présents dans votre débarras.
                </GuideParagraph>
                <GuideCallout>
                  Un doute sur un déchet ? Contactez-nous avant de réserver pour choisir une offre
                  adaptée.{" "}
                  <a href={VOLUME_GUIDE_PHONE_HREF} className={SECONDARY_LINK_CLASS}>
                    {VOLUME_GUIDE_PHONE_DISPLAY}
                  </a>
                </GuideCallout>
              </section>

              <section id="exemples-tarifs" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Exemples de volumes et de tarifs
                </h2>
                <GuideParagraph>
                  Voici quelques exemples pour comparer les offres. Les tarifs proposés pour votre
                  demande dépendent notamment de l’adresse de livraison, des déchets et du volume choisi.
                </GuideParagraph>

                <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt">
                  <table className="w-full min-w-[280px] text-left text-sm">
                    <caption className="sr-only">Exemples de forfaits par volume</caption>
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-warm-field/80">
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Offre
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Tarif TTC particulier
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Tarif HT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {VOLUME_GUIDE_PRICING_ROWS.map((row) => (
                        <tr
                          key={row.offre}
                          className="border-b border-brand-border/80 last:border-0"
                        >
                          <td className="px-4 py-3 text-brand-muted">{row.offre}</td>
                          <td className="px-4 py-3 font-medium text-brand-navy">{row.priceTtc}</td>
                          <td className="px-4 py-3 font-medium text-brand-navy">{row.priceHt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <GuideParagraph>
                  Consultez le détail de chaque offre pour connaître le poids compris dans le forfait et
                  les éventuels suppléments en cas de dépassement.
                </GuideParagraph>
              </section>

              <section id="consulter-offres" className="mt-10 scroll-mt-28">
                <h2 className={H2_CLASS}>
                  Consultez les bennes et les tarifs pour votre projet
                </h2>
                <GuideParagraph>
                  Renseignez votre adresse de livraison et les déchets à évacuer pour découvrir les
                  offres disponibles dans votre secteur. Vous pourrez comparer les capacités et consulter
                  le tarif du forfait avant de passer au paiement.
                </GuideParagraph>
                <div className="mt-6 flex flex-col items-start gap-4">
                  <Link href={VOLUME_GUIDE_ORDER_CTA_HREF} className="btn btn-accent">
                    Voir les bennes et les tarifs
                  </Link>
                  <Link href={VOLUME_GUIDE_COMMUNES_HREF} className={SECONDARY_LINK_CLASS}>
                    Consulter les communes desservies en Île-de-France
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
