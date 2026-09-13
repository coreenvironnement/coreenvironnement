"use client"

import { forwardRef, useCallback, useEffect, useId, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ContainerIcon, RotateBottomLeftIcon, Tick02Icon } from "@hugeicons/core-free-icons"

import type { services } from "@/lib/cdc/contenu-vitrine"

import { CustomOperationsIcon } from "./custom-operations-icon"
import { HazardousWasteIcon } from "./hazardous-waste-icon"
import { VITRINE_ICON_STROKE } from "./icons"
import { RecyclingCenterIcon } from "./recycling-center-icon"

type Service = (typeof services)[number]
type ServiceIcon = typeof ContainerIcon

function ServiceCardIcon({ index }: { index: number }) {
  const iconClass = "h-5 w-5 shrink-0 text-current"

  if (index === 1) {
    return <RecyclingCenterIcon className={iconClass} />
  }

  if (index === 2) {
    return <HazardousWasteIcon className={iconClass} />
  }

  if (index === 3) {
    return <CustomOperationsIcon className={iconClass} />
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

const FlipActionButton = forwardRef<
  HTMLButtonElement,
  {
    label: string
    icon: typeof RotateBottomLeftIcon
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

export function ServiceFlipCard({
  service,
  index,
  featured = false,
}: {
  service: Service
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

  return (
    <article
      className={`service-flip-card group ${flipped ? "is-flipped" : ""} ${featured ? "service-flip-card--featured" : ""} ${reduced ? "service-flip-card--reduced" : ""}`}
    >
      <div className="service-flip-inner">
        <div
          className="service-flip-face service-flip-front card-vitrine"
          aria-hidden={flipped}
          {...(flipped ? { inert: true } : {})}
        >
          <span className="vitrine-label shrink-0 text-brand-green" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="service-flip-icon-wrap mt-3.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-brand-bg-alt text-brand-navy transition-[color,transform] duration-300 sm:mt-4 sm:bg-[#F2F8F2]"
            aria-hidden
          >
            <ServiceCardIcon index={index} />
          </span>
          <h3 className="mt-3.5 shrink-0 text-base leading-snug text-brand-navy sm:mt-4 sm:text-[17px]">
            {service.titre}
          </h3>
          <p className="mt-3 shrink-0 text-sm leading-relaxed text-brand-muted">
            {service.accroche}
          </p>
          <div
            className="min-h-6 flex-1 sm:min-h-0 sm:flex-[0_0_0.5rem]"
            aria-hidden
          />
          <div className="service-flip-front-footer mt-auto flex shrink-0 justify-center">
            <FlipActionButton
              ref={learnMoreRef}
              label="En savoir plus"
              icon={RotateBottomLeftIcon}
              onClick={showDetails}
              ariaExpanded={flipped}
              ariaControls={detailsId}
              className="service-flip-action--mobile-emphasis"
            />
          </div>
        </div>

        <div
          id={detailsId}
          className="service-flip-face service-flip-back card-vitrine border-brand-navy/10 bg-brand-bg-alt"
          aria-hidden={!flipped}
          {...(!flipped ? { inert: true } : {})}
        >
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <p className="vitrine-label text-brand-sky">Détail du service</p>
              <h3 className="mt-2 text-base leading-snug text-brand-navy">{service.titre}</h3>
              <ul className="mt-4 flex flex-col gap-2.5">
                {service.points.map((point) => (
                  <CheckItem key={point}>{point}</CheckItem>
                ))}
              </ul>
            </div>
            <div className="service-flip-front-footer mt-auto flex shrink-0 justify-center">
              <FlipActionButton
                ref={backRef}
                label="Retour"
                icon={RotateBottomLeftIcon}
                iconClassName="rotate-180"
                onClick={hideDetails}
                className="service-flip-action--mobile-emphasis"
              />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
