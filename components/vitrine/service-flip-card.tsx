"use client"

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  BalanceScaleIcon,
  CircleArrowLeft02Icon,
  ClipboardCheckIcon,
  ComputerIcon,
  ConstructionIcon,
  ContainerIcon,
  CustomerService01Icon,
  FileClockIcon,
  CircleArrowReload02Icon,
  Leaf01Icon,
  Location01Icon,
  Recycle03Icon,
  SecurityCheckIcon,
  SmartPhone02Icon,
  Tick02Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons"

import type {
  pourquoiNousChoisir,
  VersoDocumentsIconId,
  VersoGrilleIconId,
  VersoLignesIconId,
} from "@/lib/cdc/contenu-vitrine"

import { CustomOperationsIcon } from "./custom-operations-icon"
import { VITRINE_ICON_STROKE } from "./icons"
import { OrderTunnelStepIconBenne } from "./order-tunnel-step-icons"
import { ContactChantierIllustration } from "./contact-chantier-illustration"
import { ServiceFlipDemoRotation } from "./service-flip-demo-rotation"
import { SolutionsChantierIllustration } from "./solutions-chantier-illustration"
type PourquoiCarte = (typeof pourquoiNousChoisir)[number]

function ServiceCardIcon({ index }: { index: number }) {
  const iconClass = "h-5 w-5 shrink-0 text-current"

  if (index === 0) {
    return <CustomOperationsIcon className={iconClass} />
  }

  if (index === 1) {
    return (
      <HugeiconsIcon
        icon={CustomerService01Icon}
        size={20}
        strokeWidth={VITRINE_ICON_STROKE}
        className={iconClass}
      />
    )
  }

  if (index === 2) {
    return (
      <HugeiconsIcon
        icon={CircleArrowReload02Icon}
        size={20}
        strokeWidth={VITRINE_ICON_STROKE}
        className={iconClass}
      />
    )
  }

  return (
    <HugeiconsIcon
      icon={ContainerIcon}
      size={20}
      strokeWidth={VITRINE_ICON_STROKE}
      className={iconClass}
    />
  )
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return reduced
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-brand-text">
      <HugeiconsIcon
        icon={Tick02Icon}
        size={15}
        strokeWidth={VITRINE_ICON_STROKE}
        className="mt-0.5 shrink-0 text-brand-green"
        aria-hidden
      />
      <span>{children}</span>
    </li>
  )
}

function FrontPointMarker({ variant }: { variant: "dot" | "benne" }) {
  if (variant === "benne") {
    return (
      <OrderTunnelStepIconBenne className="service-flip-front-point-icon" aria-hidden />
    )
  }

  return (
    <span
      className="mt-[0.45rem] h-1 w-1 shrink-0 rounded-full bg-brand-green/55"
      aria-hidden
    />
  )
}

function FrontPointItem({
  children,
  marker = "dot",
}: {
  children: React.ReactNode
  marker?: "dot" | "benne"
}) {
  return (
    <li className="service-flip-front-point flex gap-2.5 text-brand-muted">
      <FrontPointMarker variant={marker} />
      <span className="service-flip-front-point-label">{children}</span>
    </li>
  )
}

const FlipActionButton = forwardRef<
  HTMLButtonElement,
  {
    label: string
    icon: typeof ArrowRight01Icon
    onClick: () => void
    ariaExpanded?: boolean
    ariaControls?: string
    iconClassName?: string
    className?: string
  }
>(function FlipActionButton(
  { label, icon, onClick, ariaExpanded, ariaControls, iconClassName, className },
  ref
) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={ariaExpanded}
      aria-controls={ariaControls}
      className={`service-flip-action ${className ?? ""}`}
    >
      {label}
      <HugeiconsIcon
        icon={icon}
        size={15}
        strokeWidth={VITRINE_ICON_STROKE}
        className={`service-flip-action-icon shrink-0 ${iconClassName ?? ""}`}
        aria-hidden
      />
    </button>
  )
})

function hasAccroche(
  carte: PourquoiCarte,
): carte is PourquoiCarte & { accroche: string } {
  return "accroche" in carte && typeof carte.accroche === "string"
}

function hasPointsFront(
  carte: PourquoiCarte,
): carte is PourquoiCarte & { pointsFront: readonly string[] } {
  return (
    "pointsFront" in carte &&
    Array.isArray(carte.pointsFront) &&
    carte.pointsFront.length > 0
  )
}

function hasSousTitreFront(
  carte: PourquoiCarte,
): carte is PourquoiCarte & { sousTitreFront: string } {
  return "sousTitreFront" in carte && typeof carte.sousTitreFront === "string"
}

function hasSousTitreVerso(
  carte: PourquoiCarte,
): carte is PourquoiCarte & { sousTitreVerso: string } {
  return "sousTitreVerso" in carte && typeof carte.sousTitreVerso === "string"
}

function hasEyebrowVerso(
  carte: PourquoiCarte,
): carte is PourquoiCarte & { eyebrowVerso: string } {
  return "eyebrowVerso" in carte && typeof carte.eyebrowVerso === "string"
}

function hasVersoGrille(
  carte: PourquoiCarte,
): carte is PourquoiCarte & {
  versoGrille: ReadonlyArray<{
    icon: VersoGrilleIconId
    titre: string
    sousTitre: string
  }>
} {
  return (
    "versoGrille" in carte &&
    Array.isArray(carte.versoGrille) &&
    carte.versoGrille.length > 0
  )
}

function hasVersoLignes(
  carte: PourquoiCarte,
): carte is PourquoiCarte & {
  versoLignes: ReadonlyArray<{
    icon: VersoLignesIconId
    titre: string
    description: string
  }>
} {
  return (
    "versoLignes" in carte &&
    Array.isArray(carte.versoLignes) &&
    carte.versoLignes.length > 0
  )
}

function hasVersoDocuments(
  carte: PourquoiCarte,
): carte is PourquoiCarte & {
  versoDocuments: ReadonlyArray<{
    icon: VersoDocumentsIconId
    titre: string
  }>
} {
  return (
    "versoDocuments" in carte &&
    Array.isArray(carte.versoDocuments) &&
    carte.versoDocuments.length > 0
  )
}

function hasPhraseVerso(
  carte: PourquoiCarte,
): carte is PourquoiCarte & { phraseVerso: string } {
  return "phraseVerso" in carte && typeof carte.phraseVerso === "string"
}

const VERSO_GRILLE_ICONS = {
  benne: ContainerIcon,
  recycle: Recycle03Icon,
  shield: SecurityCheckIcon,
  construction: ConstructionIcon,
} as const satisfies Record<VersoGrilleIconId, typeof ContainerIcon>

function VersoGrilleIcon({ icon }: { icon: VersoGrilleIconId }) {
  return (
    <HugeiconsIcon
      icon={VERSO_GRILLE_ICONS[icon]}
      size={20}
      strokeWidth={VITRINE_ICON_STROKE}
      className="service-flip-verso-tile-icon shrink-0 text-brand-green"
      aria-hidden
    />
  )
}

const VERSO_LIGNES_ICONS = {
  contact: CustomerService01Icon,
  terrain: Location01Icon,
  logistique: TruckIcon,
} as const satisfies Record<VersoLignesIconId, typeof CustomerService01Icon>

function VersoLigneIcon({ icon }: { icon: VersoLignesIconId }) {
  return (
    <span
      className="service-flip-verso-ligne__icon-wrap"
      aria-hidden
    >
      <HugeiconsIcon
        icon={VERSO_LIGNES_ICONS[icon]}
        size={20}
        strokeWidth={VITRINE_ICON_STROKE}
        className="service-flip-verso-ligne__icon shrink-0 text-brand-green"
      />
    </span>
  )
}

const VERSO_DOCUMENTS_ICONS = {
  cerfa: FileClockIcon,
  pesee: BalanceScaleIcon,
  intervention: ClipboardCheckIcon,
  valorisation: Leaf01Icon,
} as const satisfies Record<VersoDocumentsIconId, typeof FileClockIcon>

function VersoDocumentIcon({ icon }: { icon: VersoDocumentsIconId }) {
  return (
    <HugeiconsIcon
      icon={VERSO_DOCUMENTS_ICONS[icon]}
      size={20}
      strokeWidth={VITRINE_ICON_STROKE}
      className="service-flip-verso-document__icon shrink-0 text-brand-green"
      aria-hidden
    />
  )
}

function titreVerso(carte: PourquoiCarte): string {
  const verso =
    "titreVerso" in carte && typeof carte.titreVerso === "string"
      ? carte.titreVerso
      : undefined
  return verso ?? (carte as { titre: string }).titre
}

export function ServiceFlipCard({
  service,
  index,
  featured = false,
}: {
  service: PourquoiCarte
  index: number
  featured?: boolean
}) {
  const detailsId = useId()
  const reduced = usePrefersReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const learnMoreRef = useRef<HTMLButtonElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)

  const showDetails = useCallback(() => {
    setFlipped(true)
    requestAnimationFrame(() => backRef.current?.focus())
  }, [])

  const hideDetails = useCallback(() => {
    setFlipped(false)
    requestAnimationFrame(() => learnMoreRef.current?.focus())
  }, [])

  useEffect(() => {
    if (!flipped) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") hideDetails()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [flipped, hideDetails])

  const mobileStripeClass = index % 2 === 1 ? "service-flip-face--stripe" : ""
  const versoTitre = titreVerso(service)
  const showVersoTitle =
    versoTitre !== service.titre || hasSousTitreVerso(service)
  const featuredIllustration = index === 0 || index === 1 || index === 2
  const carteDechets = featured && index === 0
  const frontCtaLabel =
    index === 1
      ? "Découvrir l'accompagnement"
      : index === 2
        ? "Découvrir le suivi"
        : "Découvrir nos solutions"
  const versoGrille = hasVersoGrille(service)
  const versoLignes = hasVersoLignes(service)
  const versoDocuments = hasVersoDocuments(service)
  const versoEyebrow = hasEyebrowVerso(service)
    ? service.eyebrowVerso
    : "En détail"

  return (
    <article
      className={`service-flip-card group ${flipped ? "is-flipped" : ""} ${featured ? "service-flip-card--featured" : ""} ${featuredIllustration ? "service-flip-card--featured-illustration" : ""} ${index === 1 ? "service-flip-card--carte-contact" : ""} ${index === 2 ? "service-flip-card--carte-digital" : ""} ${carteDechets ? "service-flip-card--carte-dechets" : ""} ${reduced ? "service-flip-card--reduced" : ""}`}
    >
      <div className="service-flip-inner">
        <div
          className={`service-flip-face service-flip-front card-vitrine ${featuredIllustration ? "service-flip-front--illustration" : ""} ${mobileStripeClass}`}
          aria-hidden={flipped}
          {...(flipped ? { inert: true } : {})}
        >
          <span className="vitrine-label shrink-0 text-brand-green" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className={`service-flip-icon-wrap inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-bg-alt text-brand-navy transition-[color,transform] duration-300 sm:bg-[#F2F8F2] ${featuredIllustration ? "" : "mt-3.5 sm:mt-4"}`}
            aria-hidden
          >
            <ServiceCardIcon index={index} />
          </span>
          <div
            className={`service-flip-front-headline min-h-0 ${featuredIllustration ? "" : "mt-3 shrink sm:mt-4 sm:shrink-0"}`}
          >
            <h3 className="vitrine-h3 service-flip-front-title">{service.titre}</h3>
            {hasSousTitreFront(service) ? (
              <p className="service-flip-front-subtitle">{service.sousTitreFront}</p>
            ) : null}
          </div>
          {index === 0 && featuredIllustration ? (
            <SolutionsChantierIllustration className="service-flip-front-illustration" />
          ) : null}
          {index === 1 && featuredIllustration ? (
            <ContactChantierIllustration className="service-flip-front-illustration" />
          ) : null}
          {index === 2 && featuredIllustration ? (
            <ServiceFlipDemoRotation className="service-flip-front-illustration" />
          ) : null}
          {hasPointsFront(service) ? (
            <ul
              className="service-flip-front-points service-flip-front-points--premium mt-3 flex min-h-0 flex-col gap-2 sm:mt-3.5 sm:gap-2.5"
              aria-label="Points clés"
            >
              {service.pointsFront.map((point) => (
                <FrontPointItem key={point}>{point}</FrontPointItem>
              ))}
            </ul>
          ) : hasAccroche(service) && index !== 2 ? (
            <p className="service-flip-front-accroche mt-2.5 min-h-0 text-sm leading-snug text-brand-muted sm:mt-3 sm:shrink-0 sm:leading-relaxed">
              {service.accroche}
            </p>
          ) : null}
          {featuredIllustration ? null : (
            <div
              className="min-h-0 flex-[0_0_0.25rem] sm:flex-[0_0_0.5rem]"
              aria-hidden
            />
          )}
          <div
            className={`service-flip-front-footer flex shrink-0 justify-center ${featuredIllustration ? "service-flip-front-footer--illustration" : "mt-auto"}`}
          >
            <FlipActionButton
              ref={learnMoreRef}
              label={frontCtaLabel}
              icon={ArrowRight01Icon}
              onClick={showDetails}
              ariaExpanded={flipped}
              ariaControls={detailsId}
              className="service-flip-action--mobile-emphasis"
            />
          </div>
        </div>

        <div
          id={detailsId}
          className={`service-flip-face service-flip-back card-vitrine border-brand-green/12 bg-brand-bg-alt ${versoGrille ? "service-flip-back--solutions" : ""} ${versoLignes ? "service-flip-back--concretement" : ""} ${versoDocuments ? "service-flip-back--digital" : ""} ${mobileStripeClass}`}
          aria-hidden={!flipped}
          {...(!flipped ? { inert: true } : {})}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            {versoLignes ? (
              <div className="service-flip-verso-concretement flex min-h-0 flex-1 flex-col">
                <div className="service-flip-verso-concretement__main min-h-0 w-full flex-1">
                  <p className="vitrine-label service-flip-verso-concretement__eyebrow text-brand-green">
                    {versoEyebrow}
                  </p>
                  {showVersoTitle ? (
                    <h3 className="vitrine-h3 service-flip-verso-concretement__title">
                      {versoTitre}
                    </h3>
                  ) : null}
                  <div
                    className="service-flip-verso-lignes"
                    role="list"
                    aria-label="Points clés"
                  >
                    {service.versoLignes.map((ligne) => (
                      <div
                        key={ligne.titre}
                        role="listitem"
                        className="service-flip-verso-ligne"
                      >
                        <VersoLigneIcon icon={ligne.icon} />
                        <div className="service-flip-verso-ligne__body min-w-0">
                          <p className="service-flip-verso-ligne__title">
                            {ligne.titre}
                          </p>
                          <p className="service-flip-verso-ligne__desc">
                            {ligne.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {hasPhraseVerso(service) ? (
                    <p className="service-flip-verso-phrase service-flip-verso-phrase--concretement">
                      {service.phraseVerso}
                    </p>
                  ) : null}
                </div>
                <div className="service-flip-front-footer service-flip-verso-concretement__footer mt-auto flex w-full shrink-0 justify-center">
                  <FlipActionButton
                    ref={backRef}
                    label="Retour"
                    icon={CircleArrowLeft02Icon}
                    onClick={hideDetails}
                    className="service-flip-action--mobile-emphasis"
                  />
                </div>
              </div>
            ) : versoDocuments ? (
              <div className="service-flip-verso-digital flex min-h-0 flex-1 flex-col">
                <div className="service-flip-verso-digital__main min-h-0 w-full flex-1">
                  <p className="vitrine-label service-flip-verso-digital__eyebrow text-brand-green">
                    {versoEyebrow}
                  </p>
                  {showVersoTitle ? (
                    <h3 className="vitrine-h3 service-flip-verso-digital__title">
                      {versoTitre}
                    </h3>
                  ) : null}
                  {hasSousTitreVerso(service) ? (
                    <p className="service-flip-verso-digital__subtitle">
                      {service.sousTitreVerso}
                    </p>
                  ) : null}
                  <div
                    className="service-flip-verso-documents"
                    role="list"
                    aria-label="Documents consultables"
                  >
                    {service.versoDocuments.map((ligne) => (
                      <div
                        key={ligne.titre}
                        role="listitem"
                        className="service-flip-verso-document"
                      >
                        <VersoDocumentIcon icon={ligne.icon} />
                        <p className="service-flip-verso-document__title">
                          {ligne.titre}
                        </p>
                      </div>
                    ))}
                  </div>
                  {hasPhraseVerso(service) ? (
                    <div className="service-flip-verso-digital__pied">
                      <HugeiconsIcon
                        icon={SmartPhone02Icon}
                        size={18}
                        strokeWidth={VITRINE_ICON_STROKE}
                        className="shrink-0 text-brand-green"
                        aria-hidden
                      />
                      <span>{service.phraseVerso}</span>
                      <HugeiconsIcon
                        icon={ComputerIcon}
                        size={18}
                        strokeWidth={VITRINE_ICON_STROKE}
                        className="shrink-0 text-brand-green"
                        aria-hidden
                      />
                    </div>
                  ) : null}
                </div>
                <div className="service-flip-front-footer service-flip-verso-digital__footer mt-auto flex w-full shrink-0 justify-center">
                  <FlipActionButton
                    ref={backRef}
                    label="Retour"
                    icon={CircleArrowLeft02Icon}
                    onClick={hideDetails}
                    className="service-flip-action--mobile-emphasis"
                  />
                </div>
              </div>
            ) : versoGrille ? (
              <div className="service-flip-verso-solutions flex min-h-0 flex-1 flex-col items-center text-center">
                <div className="service-flip-verso-solutions__main min-h-0 w-full flex-1">
                  <p className="vitrine-label text-brand-green">{versoEyebrow}</p>
                  {showVersoTitle ? (
                    <h3 className="vitrine-h3 service-flip-verso-solutions__title mt-2">
                      {versoTitre}
                    </h3>
                  ) : null}
                  {hasSousTitreVerso(service) ? (
                    <p className="service-flip-front-subtitle service-flip-verso-solutions__subtitle mt-1.5">
                      {service.sousTitreVerso}
                    </p>
                  ) : null}
                  <div
                    className="service-flip-verso-grid"
                    role="list"
                    aria-label="Nos solutions"
                  >
                    {service.versoGrille.map((tile) => (
                      <div
                        key={tile.titre}
                        role="listitem"
                        className="service-flip-verso-tile"
                      >
                        <VersoGrilleIcon icon={tile.icon} />
                        <span className="service-flip-verso-tile__title">
                          {tile.titre}
                        </span>
                        <span className="service-flip-verso-tile__desc">
                          {tile.sousTitre}
                        </span>
                      </div>
                    ))}
                  </div>
                  {hasPhraseVerso(service) ? (
                    <p className="service-flip-verso-phrase">
                      {service.phraseVerso}
                    </p>
                  ) : null}
                </div>
                <div className="service-flip-front-footer mt-auto flex w-full shrink-0 justify-center">
                  <FlipActionButton
                    ref={backRef}
                    label="Retour"
                    icon={CircleArrowLeft02Icon}
                    onClick={hideDetails}
                    className="service-flip-action--mobile-emphasis"
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  <p className="vitrine-label text-brand-green">{versoEyebrow}</p>
                  {showVersoTitle ? (
                    <h3 className="vitrine-h3 mt-2">{versoTitre}</h3>
                  ) : null}
                  {hasSousTitreVerso(service) ? (
                    <p className="service-flip-front-subtitle mt-1.5">
                      {service.sousTitreVerso}
                    </p>
                  ) : null}
                  <ul
                    className={`flex flex-col gap-2.5 ${showVersoTitle || hasSousTitreVerso(service) ? "mt-4" : "mt-3"}`}
                    {...(!showVersoTitle
                      ? { "aria-label": `Détails - ${service.titre}` }
                      : {})}
                  >
                    {"points" in service &&
                      service.points.map((point) => (
                        <CheckItem key={point}>{point}</CheckItem>
                      ))}
                  </ul>
                </div>
                <div className="service-flip-front-footer mt-auto flex shrink-0 justify-center">
                  <FlipActionButton
                    ref={backRef}
                    label="Retour"
                    icon={CircleArrowLeft02Icon}
                    onClick={hideDetails}
                    className="service-flip-action--mobile-emphasis"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
