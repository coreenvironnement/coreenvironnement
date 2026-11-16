"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUpRight01Icon,
  Cancel01Icon,
  Menu01Icon,
} from "@hugeicons/core-free-icons"

import { VitrineAccountLinks } from "@/components/client-account-links"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"
import { VitrineLogo } from "./logo"
import { useVitrineOrder } from "./order-context"

export const VITRINE_SCROLL_SOLID_THRESHOLD = 16

export function readVitrineScrollSolid(): boolean {
  if (typeof window === "undefined") return false
  const y = window.scrollY || document.documentElement.scrollTop || 0
  return y > VITRINE_SCROLL_SOLID_THRESHOLD
}

function syncHeaderScrollSolid(setScrolled: (v: boolean) => void) {
  setScrolled(readVitrineScrollSolid())
}

/** Pages avec hero plein écran sous le header fixe (barre transparente au scroll 0). */
function isHeroUnderHeaderRoute(pathname: string | null): boolean {
  if (!pathname) return false
  if (pathname === "/location-benne/volume") return false
  if (pathname === "/location-benne/dechets-acceptes") return false
  return (
    pathname === "/" ||
    pathname.startsWith("/location-benne") ||
    pathname.startsWith("/professionnels")
  )
}

type NavItem = { label: string; id: string }

const PARTICULIER_BASE = "/"
const PRO_BASE = "/professionnels"

const PARTICULIER_NAV: readonly NavItem[] = [
  { label: "Comment ça marche", id: "parcours" },
  { label: "Conseils", id: "conseils" },
  { label: "Avis", id: "temoignages" },
  { label: "FAQ", id: "faq" },
]

const PRO_NAV: readonly NavItem[] = [
  { label: "Comment ça marche", id: "fonctionnement" },
  { label: "Engagements", id: "engagements" },
  { label: "Avis", id: "temoignages" },
  { label: "FAQ", id: "faq" },
]

const MOBILE_LINK_CLASS =
  "group flex min-h-11 items-center justify-between border-b border-white/10 py-3 text-[19px] text-white/90 hover:text-white"

/**
 * Contrôles header < lg : cible tactile 44×44 px minimum (h-11 / w-11 = 2.75rem),
 * arrondi = token `--radius-btn` (aligné sur `.btn`), focus clavier visible.
 */
const MOBILE_HEADER_TOUCH_CLASS =
  "inline-flex h-11 min-h-11 items-center justify-center rounded-[var(--radius-btn)] border transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"

/** Voile sombre prolongé sous la barre pour éviter une couture nette sur le hero. */
const HEADER_HERO_FADE_CLASS =
  "pointer-events-none absolute inset-x-0 top-0 z-0 h-[calc(var(--vitrine-header-height)+2.75rem)] border-0 bg-gradient-to-b from-brand-forest/40 via-brand-forest/14 to-transparent"

export function VitrineHeader({ forceSolid = false }: { forceSolid?: boolean }) {
  const pathname = usePathname()
  const isProPage = pathname?.startsWith("/professionnels") ?? false
  const navItems = isProPage ? PRO_NAV : PARTICULIER_NAV
  const baseHref = isProPage ? PRO_BASE : PARTICULIER_BASE
  const [scrolled, setScrolled] = useState(false)
  const [localIds, setLocalIds] = useState<ReadonlySet<string>>(() => new Set())
  const { openOrder, headerMenuOpen: menuOpen, setHeaderMenuOpen: setMenuOpen } = useVitrineOrder()
  /** Transparent seulement sur hero sombre, en haut de page, menu fermé (sinon fond clair = texte lisible). */
  const transparent = !forceSolid && isHeroUnderHeaderRoute(pathname) && !scrolled && !menuOpen
  const solid = !transparent

  const closeMenu = useCallback(() => setMenuOpen(false), [setMenuOpen])

  useLayoutEffect(() => {
    syncHeaderScrollSolid(setScrolled)
    const raf = requestAnimationFrame(() => syncHeaderScrollSolid(setScrolled))
    const t = window.setTimeout(() => syncHeaderScrollSolid(setScrolled), 0)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
    }
  }, [pathname])

  useEffect(() => {
    const onScroll = () => syncHeaderScrollSolid(setScrolled)
    const onPageShow = () => syncHeaderScrollSolid(setScrolled)

    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pageshow", onPageShow)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pageshow", onPageShow)
    }
  }, [pathname])

  /** Ancres intelligentes : lien local (#id) si la section existe sur la page courante. */
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const found = new Set<string>()
      for (const item of navItems) {
        if (document.getElementById(item.id)) found.add(item.id)
      }
      setLocalIds(found)
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname, navItems])

  useEffect(() => {
    if (!menuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    const onResize = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    window.addEventListener("resize", onResize)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("resize", onResize)
    }
  }, [menuOpen, setMenuOpen])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname, setMenuOpen])

  const logoHref = isProPage ? "/professionnels" : "/#accueil"

  const hrefFor = (item: NavItem) =>
    localIds.has(item.id) ? `#${item.id}` : `${baseHref}#${item.id}`

  const onAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, item: NavItem) => {
    const target = localIds.has(item.id) ? document.getElementById(item.id) : null
    if (!target) {
      closeMenu()
      return
    }
    event.preventDefault()
    closeMenu()
    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      window.history.replaceState(null, "", `#${item.id}`)
    })
  }

  const handleOrder = () => {
    closeMenu()
    openOrder()
  }

  const audienceLink = isProPage
    ? { label: "Page particulier", href: "/" }
    : { label: "Page pro", href: "/professionnels" }

  const audienceAriaLabel = isProPage
    ? "Aller à la page particulier"
    : "Aller à la page pro"

  const audienceUnderLogoClass = cn(
    "min-w-[148px] w-max max-w-[11.5rem] whitespace-nowrap rounded-full px-2.5 py-0.5 text-center text-[11px] font-semibold leading-tight transition-colors",
    isProPage
      ? solid
        ? "border border-brand-border bg-white text-brand-navy hover:border-brand-green/40"
        : "border border-white/35 bg-white/10 text-white hover:bg-white/15"
      : solid
        ? "bg-brand-green text-white hover:bg-brand-green-dark"
        : "border border-white/35 bg-white/10 text-white hover:bg-white/15"
  )

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-0">
        <div
          className={cn(
            "relative border-0 transition-[background-color,box-shadow] duration-300 ease-out",
            solid
              ? "bg-brand-warm shadow-[var(--shadow-vitrine-soft)]"
              : "bg-transparent shadow-none"
          )}
        >
          {!solid ? <div aria-hidden className={HEADER_HERO_FADE_CLASS} /> : null}
          <div className="container-x relative z-[1] grid h-[var(--vitrine-header-height)] grid-cols-3 items-center gap-3 lg:flex lg:justify-between lg:gap-4">
            <div className="flex min-w-0 items-center justify-start gap-2">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={menuOpen}
                aria-controls="vitrine-mobile-menu"
                className={cn(
                  MOBILE_HEADER_TOUCH_CLASS,
                  "w-11 shrink-0 lg:hidden",
                  solid
                    ? "border-brand-border bg-white text-brand-navy hover:bg-brand-warm-field"
                    : "border-white/20 bg-white/[0.06] text-white backdrop-blur-md hover:bg-white/[0.12]"
                )}
              >
                <HugeiconsIcon
                  icon={menuOpen ? Cancel01Icon : Menu01Icon}
                  size={20}
                  strokeWidth={VITRINE_ICON_STROKE}
                />
              </button>
              <div className="hidden min-w-0 flex-col items-start gap-0.5 lg:flex">
                <Link
                  href={logoHref}
                  aria-label="CORE ENVIRONNEMENT — Accueil"
                  className="inline-flex shrink-0"
                  onClick={closeMenu}
                >
                  <VitrineLogo priority variant="header" transparent={!solid} />
                </Link>
                <Link
                  href={audienceLink.href}
                  onClick={closeMenu}
                  aria-label={audienceAriaLabel}
                  className={audienceUnderLogoClass}
                >
                  {audienceLink.label}
                </Link>
              </div>
            </div>

            <div className="flex min-w-0 justify-center lg:hidden">
              <Link
                href={logoHref}
                aria-label="CORE ENVIRONNEMENT — Accueil"
                className="shrink-0"
                onClick={closeMenu}
              >
                <VitrineLogo priority variant="header" transparent={!solid} />
              </Link>
            </div>

            <nav
              aria-label="Navigation principale"
              className="hidden items-center gap-4 lg:flex xl:gap-6"
            >
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={hrefFor(item)}
                  onClick={(event) => onAnchorClick(event, item)}
                  className={cn(
                    "group relative whitespace-nowrap text-[14px] font-medium transition-colors duration-300 font-[family-name:var(--font-body)] xl:text-[15px]",
                    solid
                      ? "text-brand-navy hover:text-brand-navy/85"
                      : "text-white/90 hover:text-white"
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute -bottom-[7px] left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                      solid ? "bg-brand-green" : "bg-white"
                    )}
                  />
                </a>
              ))}
            </nav>

            <div className="hidden items-center gap-2 lg:flex">
              <VitrineAccountLinks solid={solid} variant="desktop" />
            </div>

            <div className="flex items-center justify-end gap-2 lg:hidden">
              <Link
                href={audienceLink.href}
                onClick={closeMenu}
                aria-label={audienceAriaLabel}
                className={cn(
                  MOBILE_HEADER_TOUCH_CLASS,
                  "min-w-fit max-w-[9.25rem] shrink px-3 text-[12px] font-semibold leading-tight sm:text-[13px]",
                  solid
                    ? "border-brand-green/30 bg-white text-brand-green-dark hover:border-brand-green"
                    : "border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/15"
                )}
              >
                {audienceLink.label}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Panneau menu mobile : sous le header, hauteur au contenu (pas plein écran). */}
      <div
        className={cn("fixed inset-0 z-[45] lg:hidden", menuOpen ? "" : "pointer-events-none")}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={closeMenu}
          className={cn(
            "absolute inset-x-0 bottom-0 top-[var(--vitrine-header-height)] bg-brand-forest/55 backdrop-blur-[2px] transition-opacity duration-300",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          id="vitrine-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className={cn(
            "absolute inset-x-0 top-[var(--vitrine-header-height)] max-h-[calc(100dvh-var(--vitrine-header-height))] overflow-y-auto overscroll-contain rounded-b-2xl bg-brand-forest pb-[max(1.25rem,env(safe-area-inset-bottom))] text-white shadow-[var(--shadow-vitrine-pop)] transition-[opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          )}
        >
          <nav aria-label="Navigation mobile" className="container-x flex flex-col pt-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={hrefFor(item)}
                onClick={(event) => onAnchorClick(event, item)}
                tabIndex={menuOpen ? 0 : -1}
                className={MOBILE_LINK_CLASS}
              >
                {item.label}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={18}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="opacity-50"
                />
              </a>
            ))}
            <Link
              href={audienceLink.href}
              onClick={closeMenu}
              tabIndex={menuOpen ? 0 : -1}
              className={MOBILE_LINK_CLASS}
            >
              {audienceLink.label}
              <HugeiconsIcon
                icon={ArrowUpRight01Icon}
                size={18}
                strokeWidth={VITRINE_ICON_STROKE}
                className="opacity-50"
              />
            </Link>
            <VitrineAccountLinks solid={solid} variant="mobile" onLinkClick={closeMenu} />
            <button
              type="button"
              onClick={handleOrder}
              tabIndex={menuOpen ? 0 : -1}
              className="btn btn-primary mt-4 w-full"
            >
              Commander une benne
            </button>
          </nav>
        </div>
      </div>
    </>
  )
}
