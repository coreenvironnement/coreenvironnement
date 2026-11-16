"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import { HOME_VOLUME_ESTIMATOR_HASH } from "@/lib/seo/early-local-links"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

import {
  MobileBarAccountIcon,
  MobileBarCommanderIcon,
  MobileBarEstimateIcon,
  MobileBarPhoneIcon,
} from "./mobile-action-bar-icons"
import { useVitrineOrder } from "./order-context"

/**
 * 4 zones tactiles : cellules un peu plus hautes (min ≈ 52 px ; barre ≈ 65 px réservée) sur ≥ 25 % de la largeur,
 * icônes ~21 px + libellé 13 px, arrondi `--radius-btn` et vert de marque
 * alignés sur `.btn` (états hover / active / focus-visible).
 */
const ITEM_MOTION =
  "touch-manipulation transition-[transform,background-color,box-shadow] duration-150 ease-out motion-safe:active:scale-[0.97] motion-reduce:active:scale-100"

const ITEM_CLASS = cn(
  ITEM_MOTION,
  "flex min-h-[3.25rem] select-none flex-col items-center justify-center gap-1 rounded-[var(--radius-btn)] px-1.5 py-2 font-[family-name:var(--font-display)] text-[13px] font-semibold leading-none tracking-[-0.01em] text-brand-navy hover:bg-brand-green/[0.06] active:bg-brand-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green"
)

/** Commander = action principale : même vert que `.btn-primary` / `.btn-accent`. */
const ITEM_PRIMARY_CLASS = cn(
  "bg-brand-green text-white shadow-[0_6px_18px_-6px_rgba(53,162,56,0.55)]",
  "hover:bg-brand-green-dark active:bg-brand-green-dark",
  "motion-safe:active:scale-[0.94] motion-safe:active:shadow-[inset_0_2px_10px_rgba(14,32,16,0.28)]",
  "focus-visible:ring-white"
)

function isFormField(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  return el.matches("input, textarea, select, [contenteditable='true']")
}

function ActionLabel({
  icon,
  label,
  iconSlotClassName = "h-[1.3125rem]",
}: {
  icon: ReactNode
  label: string
  iconSlotClassName?: string
}) {
  return (
    <>
      <span
        aria-hidden
        className={cn("flex items-center justify-center", iconSlotClassName)}
      >
        {icon}
      </span>
      <span>{label}</span>
    </>
  )
}

/**
 * Barre d’actions basse (< lg) : Estimer · Commander · Appeler · Mon compte.
 * À monter dans un shell vitrine déjà sous `VitrineOrderProvider` ; la classe
 * `vitrine--with-action-bar` sur `.vitrine-root` réserve l’espace en bas de page.
 * Masquée quand le menu du header ou la modale de commande est ouvert(e),
 * ou pendant la saisie dans un champ (clavier mobile).
 */
export function VitrineMobileActionBar() {
  const pathname = usePathname()
  const { open: orderOpen, headerMenuOpen, openOrder, openVolumeEstimator } = useVitrineOrder()
  const [hasEstimator, setHasEstimator] = useState(false)
  const [fieldFocused, setFieldFocused] = useState(false)

  // Estimateur / ancre présent sur la page → scroll local ; sinon lien vers l’accueil.
  useEffect(() => {
    setHasEstimator(document.getElementById(HOME_VOLUME_ESTIMATOR_HASH) !== null)
  }, [pathname])

  useEffect(() => {
    const onFocusIn = (e: FocusEvent) => setFieldFocused(isFormField(e.target))
    const onFocusOut = () => setFieldFocused(false)
    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("focusout", onFocusOut)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("focusout", onFocusOut)
    }
  }, [])

  if (headerMenuOpen || orderOpen || fieldFocused) return null

  const iconClass = "h-[1.3125rem] w-[1.3125rem]"

  return (
    <nav
      aria-label="Actions rapides"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[55] lg:hidden",
        "border-t border-[#35A238]/12 bg-[#ECF4E9]/96 shadow-[0_-6px_20px_-14px_rgb(14_32_16/0.12)] backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom,0px)]"
      )}
    >
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1.5 px-2 py-1.5">
        {hasEstimator ? (
          <button type="button" onClick={() => openVolumeEstimator()} className={ITEM_CLASS}>
            <ActionLabel icon={<MobileBarEstimateIcon className={iconClass} />} label="Estimer" />
          </button>
        ) : (
          <Link href={`/#${HOME_VOLUME_ESTIMATOR_HASH}`} className={ITEM_CLASS}>
            <ActionLabel icon={<MobileBarEstimateIcon className={iconClass} />} label="Estimer" />
          </Link>
        )}

        <button
          type="button"
          onClick={() => openOrder()}
          className={cn(ITEM_CLASS, ITEM_PRIMARY_CLASS)}
        >
          <ActionLabel
            icon={<MobileBarCommanderIcon className="h-7 w-7" />}
            iconSlotClassName="h-7"
            label="Commander"
          />
        </button>

        <a
          href={SITE_PHONE_HREF}
          aria-label={`Appeler le ${SITE_PHONE_DISPLAY}`}
          className={ITEM_CLASS}
        >
          <ActionLabel icon={<MobileBarPhoneIcon className={iconClass} />} label="Appeler" />
        </a>

        <Link href="/espace/commandes" className={ITEM_CLASS}>
          <ActionLabel icon={<MobileBarAccountIcon className={iconClass} />} label="Mon compte" />
        </Link>
      </div>
    </nav>
  )
}