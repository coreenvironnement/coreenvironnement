import Image from "next/image"
import Link from "next/link"

import {
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_ALT,
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT,
  PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH,
  SITE_IMAGES,
  VITRINE_GUIDE_ARTICLE_IMAGE_SIZES,
} from "@/lib/media/site-images"
import {
  PRIX_LOCATION_BENNE_ARTICLE_EYEBROW,
  PRIX_LOCATION_BENNE_ARTICLE_H1,
  PRIX_LOCATION_BENNE_ESTIMATEUR_HREF,
  PRIX_LOCATION_BENNE_PARCOURS_HREF,
} from "@/lib/seo/prix-location-benne-article-content"

import { VitrineFooter } from "./vitrine-footer"
import { VITRINE_HEADER_CONTENT_OFFSET_CLASS, VITRINE_SCROLL_MARGIN_CLASS } from "./header-layout"
import { VitrineHeader } from "./vitrine-header"
import { VitrineMobileActionBar } from "./vitrine-mobile-action-bar"
import { VitrineOrderModal } from "./order-modal"
import { VitrineOrderProvider } from "./order-context"

const BREADCRUMBS = [
  { href: "/", label: "Accueil" },
  { href: "/blog/prix-location-benne", label: "Prix d’une location de benne" },
] as const

const BODY_CLASS = "mt-3 text-base leading-relaxed text-brand-muted"
const H2_CLASS = "vitrine-h2 text-balance"
const SECONDARY_LINK_CLASS =
  "font-semibold text-brand-navy underline-offset-2 hover:text-brand-green hover:underline"

const OFFER_TABLE_ROWS = [
  {
    information: "Prix TTC",
    detail:
      "Le montant proposé dans le parcours particulier pour votre adresse.",
  },
  {
    information: "Déchets acceptés",
    detail: "La famille de déchets et les indications propres au forfait.",
  },
  {
    information: "Volume en m³",
    detail: "La capacité de la benne pour accueillir vos déchets.",
  },
  {
    information: "Poids inclus",
    detail: "Le tonnage couvert par le tarif affiché.",
  },
  {
    information: "Supplément par tonne",
    detail: "Le montant indiqué en cas de dépassement du poids inclus.",
  },
] as const

function GuideParagraph({ children }: { children: string }) {
  return <p className={BODY_CLASS}>{children}</p>
}

const GUIDE_ARTICLE_FIGURE_CLASS =
  "overflow-hidden rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt"

const ILLUSTRATION_CAPTION_CLASS =
  "border-t border-brand-border/80 px-4 py-2 text-[12px] text-brand-muted"

function GuideArticleCoverImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className={`mt-8 ${GUIDE_ARTICLE_FIGURE_CLASS}`}>
      <Image
        src={src}
        alt={alt}
        width={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH}
        height={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT}
        sizes={VITRINE_GUIDE_ARTICLE_IMAGE_SIZES}
        priority
        className="h-auto w-full"
      />
      <figcaption className={ILLUSTRATION_CAPTION_CLASS}>Visuels d&apos;illustration</figcaption>
    </figure>
  )
}

function GuideArticleInlineImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className={`mt-6 ${GUIDE_ARTICLE_FIGURE_CLASS}`}>
      <Image
        src={src}
        alt={alt}
        width={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_WIDTH}
        height={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_HEIGHT}
        sizes={VITRINE_GUIDE_ARTICLE_IMAGE_SIZES}
        loading="lazy"
        className="h-auto w-full"
      />
      <figcaption className={ILLUSTRATION_CAPTION_CLASS}>Visuels d&apos;illustration</figcaption>
    </figure>
  )
}

export function VitrinePrixLocationBenneArticle() {
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

          <article className="border-b border-brand-border bg-brand-bg py-12 sm:py-16">
            <div className="container-x mx-auto max-w-3xl">
              <p className="section-eyebrow">{PRIX_LOCATION_BENNE_ARTICLE_EYEBROW}</p>
              <h1 className="vitrine-h1 text-balance">{PRIX_LOCATION_BENNE_ARTICLE_H1}</h1>

              <GuideArticleCoverImage
                src={SITE_IMAGES.prixLocationBenneArticle.cover}
                alt={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_ALT.cover}
              />

              <GuideParagraph>
                Vous avez des déchets à évacuer et vous souhaitez comparer les offres ? Le prix affiché
                est un premier repère. Pour savoir ce qui correspond à votre projet, regardez aussi les
                déchets acceptés, le volume de la benne et le poids compris dans le tarif.
              </GuideParagraph>
              <GuideParagraph>
                Chez CORE ENVIRONNEMENT, le parcours de réservation pour les particuliers présente les
                prix TTC. Le montant proposé dépend notamment de votre adresse en Île-de-France, des
                déchets à évacuer et de l’offre choisie. Voici comment lire ces informations avant de
                réserver.
              </GuideParagraph>

              <section className={`mt-10 ${VITRINE_SCROLL_MARGIN_CLASS}`}>
                <h2 className={H2_CLASS}>
                  Pourquoi deux bennes de même volume peuvent-elles avoir des prix différents ?
                </h2>
                <GuideParagraph>
                  Une benne de 8 m³ indique une capacité, pas une prestation identique dans toutes les
                  situations. Une offre pour des gravats propres et une offre pour des déchets mélangés ne
                  correspondent pas au même contenu.
                </GuideParagraph>
                <GuideParagraph>
                  Le guide des volumes présente par exemple une benne de 8 m³ pour gravats propres à 396 €
                  TTC et une benne de 8 m³ pour mélange DND à 528 € TTC. Ces exemples montrent pourquoi il
                  faut comparer le type de déchets autant que la taille du contenant. Le tarif à retenir
                  pour votre projet reste celui affiché pour votre adresse et l’offre sélectionnée.
                </GuideParagraph>
                <GuideParagraph>
                  Votre commune intervient également dans le calcul du prix proposé. Nous desservons toute
                  l’Île-de-France : renseigner l’adresse de livraison permet de consulter les offres
                  correspondant à votre projet.
                </GuideParagraph>
              </section>

              <section className={`mt-10 ${VITRINE_SCROLL_MARGIN_CLASS}`}>
                <h2 className={H2_CLASS}>Les cinq informations à lire sur une offre</h2>
                <GuideParagraph>
                  Avant de comparer deux montants, vérifiez qu’ils correspondent au même besoin.
                </GuideParagraph>

                <div className="mt-6 overflow-x-auto rounded-[var(--radius-card)] border border-brand-border bg-brand-bg-alt">
                  <table className="w-full min-w-[280px] text-left text-sm">
                    <caption className="sr-only">
                      Informations à vérifier sur une offre de location de benne
                    </caption>
                    <thead>
                      <tr className="border-b border-brand-border bg-brand-warm-field/80">
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Information
                        </th>
                        <th scope="col" className="px-4 py-3 font-semibold text-brand-navy">
                          Ce qu’il faut regarder
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {OFFER_TABLE_ROWS.map((row) => (
                        <tr
                          key={row.information}
                          className="border-b border-brand-border/80 last:border-0"
                        >
                          <td className="px-4 py-3 font-medium text-brand-navy">{row.information}</td>
                          <td className="px-4 py-3 text-brand-muted">{row.detail}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <GuideParagraph>
                  Le montant le plus bas n’est donc pas le seul critère de choix. Une offre doit d’abord
                  correspondre aux matériaux que vous allez réellement déposer. Si vous comparez plusieurs
                  forfaits, gardez ces cinq informations ensemble plutôt que de relever uniquement le prix
                  et le volume.
                </GuideParagraph>
              </section>

              <section className={`mt-10 ${VITRINE_SCROLL_MARGIN_CLASS}`}>
                <h2 className={H2_CLASS}>
                  Le poids inclus ne correspond pas à une benne remplie jusqu’au bord
                </h2>
                <GuideParagraph>
                  Une offre peut indiquer « Jusqu’à … tonnes au tarif affiché ». Ce chiffre désigne le
                  poids compris dans le forfait. Il ne signifie pas que tous les chargements occupant le
                  volume de la benne auront ce poids.
                </GuideParagraph>
                <GuideParagraph>
                  Les matériaux lourds peuvent atteindre la limite de poids avant que le contenant soit
                  plein. Le chargement doit donc respecter à la fois le haut des parois et la limite
                  indiquée dans l’offre.
                </GuideParagraph>
                <GuideArticleInlineImage
                  src={SITE_IMAGES.prixLocationBenneArticle.volumePoids}
                  alt={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_ALT.volumePoids}
                />
                <GuideParagraph>
                  Vous hésitez sur la benne à choisir ? L’estimateur CORE vous guide à partir du type de
                  déchets, de la forme du chargement et de dimensions ou d’un nombre de sacs. Il affiche un
                  volume estimé en m³ et une benne recommandée.
                </GuideParagraph>
                <div className="mt-4">
                  <a
                    href={PRIX_LOCATION_BENNE_ESTIMATEUR_HREF}
                    className="btn btn-accent inline-flex"
                  >
                    Estimer mon volume de déchets
                  </a>
                </div>
                <GuideParagraph>
                  Vous pouvez l’utiliser sans compte ni adresse. Votre choix de benne est repris si vous
                  poursuivez la réservation. L’outil estime le volume : le poids inclus et le tarif restent
                  à vérifier dans l’offre, après saisie de l’adresse.
                </GuideParagraph>
                <p className={BODY_CLASS}>
                  Pour comprendre les repères de calcul et la différence entre mètres cubes et tonnes,
                  consultez notre{" "}
                  <Link href="/location-benne/volume" className={SECONDARY_LINK_CLASS}>
                    guide pour choisir le volume de votre benne
                  </Link>
                  .
                </p>
              </section>

              <section className={`mt-10 ${VITRINE_SCROLL_MARGIN_CLASS}`}>
                <h2 className={H2_CLASS}>Comment comprendre le supplément par tonne ?</h2>
                <GuideParagraph>
                  L’offre indique le poids inclus et le montant prévu par tonne supplémentaire. Ce
                  supplément correspond à un éventuel dépassement : ce n’est pas une somme à ajouter
                  systématiquement au prix initial.
                </GuideParagraph>
                <GuideParagraph>
                  Dans le parcours particulier, les montants du supplément sont calculés en TTC. Gardez
                  cette même base de comparaison : un prix HT destiné aux professionnels et un prix TTC
                  ne se comparent pas directement.
                </GuideParagraph>
                <GuideParagraph>
                  Avant de réserver, prenez connaissance des conditions de dépassement indiquées dans
                  l’offre. Si vous hésitez sur le poids de vos déchets, décrivez les matériaux à notre
                  équipe. Il est plus utile de préciser leur nature et la quantité estimée que de se fier
                  uniquement à la taille du tas.
                </GuideParagraph>
              </section>

              <section className={`mt-10 ${VITRINE_SCROLL_MARGIN_CLASS}`}>
                <h2 className={H2_CLASS}>Choisir la bonne famille de déchets</h2>
                <GuideParagraph>
                  Le formulaire de réservation distingue notamment « Gravats propres », « Gravats
                  mélangés » et « Mélange déchets non dangereux ». Ces libellés ne sont pas
                  interchangeables. Consultez la description de l’offre pour vérifier qu’elle correspond
                  à ce que vous souhaitez évacuer.
                </GuideParagraph>
                <GuideParagraph>
                  Un chantier peut produire plusieurs matériaux. Identifiez-les avant de choisir votre
                  forfait et ne supposez pas qu’une offre pour déchets mélangés accepte tous les déchets
                  sans distinction.
                </GuideParagraph>
                <GuideArticleInlineImage
                  src={SITE_IMAGES.prixLocationBenneArticle.famillesDechets}
                  alt={PRIX_LOCATION_BENNE_ARTICLE_IMAGE_ALT.famillesDechets}
                />
                <p className={BODY_CLASS}>
                  Notre{" "}
                  <Link href="/location-benne/dechets-acceptes" className={SECONDARY_LINK_CLASS}>
                    guide des déchets acceptés dans une benne
                  </Link>{" "}
                  vous aide à préparer cette vérification. Il présente les principales familles de déchets
                  et les cas qui nécessitent une collecte spécifique.
                </p>
              </section>

              <section className={`mt-10 ${VITRINE_SCROLL_MARGIN_CLASS}`}>
                <h2 className={H2_CLASS}>Comment obtenir le tarif adapté à votre projet ?</h2>
                <GuideParagraph>
                  Dans la commande en ligne, renseignez l’adresse de livraison, sélectionnez vos déchets et
                  comparez les volumes proposés. Vous pourrez consulter le prix TTC, le poids inclus et le
                  supplément éventuel de chaque offre.
                </GuideParagraph>
                <GuideParagraph>
                  Vérifiez ensuite les dates disponibles et les conditions de mise à disposition avant de
                  payer. Si un point reste incertain, demandez conseil : choisir une offre adaptée dès le
                  départ permet de préparer la livraison et le chargement avec des informations claires.
                </GuideParagraph>
                <div className="mt-6">
                  <a href={PRIX_LOCATION_BENNE_PARCOURS_HREF} className="btn btn-accent inline-flex">
                    Voir les bennes et les tarifs
                  </a>
                </div>
              </section>
            </div>
          </article>
        </main>
        <VitrineFooter />
        <VitrineOrderModal />
        <VitrineMobileActionBar />
      </div>
    </VitrineOrderProvider>
  )
}