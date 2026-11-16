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
 * 4 zones tactiles : chaque cellule fait ≥ 44 px de haut (min-h-12 = 48 px ; barre ≈ 57 px < 3.75rem réservés) sur ≥ 25 % de la largeur,
 * icône 20 px + libellé 12 px (lisible), arrondi `--radius-btn` et vert de marque
 * alignés sur `.btn` (états hover / active / focus-visible).
 */
const ITEM_CLASS =
  "flex min-h-12 select-none flex-col items-center justify-center gap-1 rounded-[var(--radius-btn)] px-1 py-1.5 font-[family-name:var(--font-display)] text-[12px] font-semibold leading-none tracking-[-0.01em] text-brand-navy transition-colors duration-200 hover:bg-brand-green/[0.06] active:bg-brand-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-green"

/** Commander = action principale : même vert que `.btn-primary` / `.btn-accent`. */
const ITEM_PRIMARY_CLASS =
  "bg-brand-green text-white shadow-[var(--shadow-vitrine-soft)] hover:bg-brand-green-dark active:bg-brand-green-dark focus-visible:ring-white"

function isFormField(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false
  return el.matches("input, textarea, select, [contenteditable='true']")
}

function ActionLabel({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <>
      <span aria-hidden className="flex h-5 items-center justify-center">
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

  const iconClass = "h-5 w-5"

  return (
    <nav
      aria-label="Actions rapides"
      className={cn(
        "fixed inset-x-0 bottom-0 z-[55] lg:hidden",
        "border-t border-brand-border bg-white/95 shadow-[0_-6px_20px_-12px_rgba(23,32,51,0.25)] backdrop-blur-md",
        "pb-[env(safe-area-inset-bottom,0px)]"
      )}
    >
      <div className="mx-auto grid max-w-xl grid-cols-4 gap-1 px-1.5 py-1">
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
          <ActionLabel icon={<MobileBarCommanderIcon className={iconClass} />} label="Commander" />
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