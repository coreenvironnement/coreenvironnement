"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUpRight01Icon,
  Cancel01Icon,
  Menu01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"
import { VitrineLogo } from "./logo"

/** Hauteur approximative bandeau + barre (pour scroll-margin / hero padding). */
export const VITRINE_HEADER_TOTAL_OFFSET_CLASS = "pt-[7.25rem] sm:pt-[7.75rem] lg:pt-[8.25rem]"

const SCROLL_SOLID_THRESHOLD = 16

function readScrollSolid(): boolean {
  if (typeof window === "undefined") return false
  const y = window.scrollY || document.documentElement.scrollTop || 0
  return y > SCROLL_SOLID_THRESHOLD
}

const PARTICULIER_NAV = [
  { label: "Comment ça marche", href: "/#parcours" },
  { label: "Conseils", href: "/#conseils" },
  { label: "Avis", href: "/#temoignages" },
  { label: "FAQ", href: "/#faq" },
] as const

const PRO_NAV = [
  { label: "Comment ça marche", href: "/professionnels#fonctionnement" },
  { label: "Engagements", href: "/professionnels#engagements" },
  { label: "Avis", href: "/professionnels#temoignages" },
  { label: "FAQ", href: "/professionnels#faq" },
] as const

function AudienceBandeau({ isProPage }: { isProPage: boolean }) {
  return (
    <div
      className={cn(
        "border-b text-center text-[12px] leading-snug sm:text-[13px]",
        isProPage
          ? "border-white/10 bg-[#0f2552] text-white/90"
          : "border-brand-green/20 bg-[#0f2552]/95 text-white/90 backdrop-blur-sm"
      )}
    >
      <p className="container-x py-2 sm:py-2.5">
        {isProPage ? (
          <>
            Vous êtes un particulier ?{" "}
            <Link
              href="/"
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
            >
              Accéder à la page particulier
            </Link>
          </>
        ) : (
          <>
            Vous êtes un professionnel ?{" "}
            <Link
              href="/professionnels"
              className="font-semibold text-brand-green underline-offset-2 hover:underline"
            >
              Accéder à la page pro
            </Link>
          </>
        )}
      </p>
    </div>
  )
}

export function VitrineHeader({ forceSolid = false }: { forceSolid?: boolean }) {
  const pathname = usePathname()
  const isProPage = pathname?.startsWith("/professionnels") ?? false
  const navLinks = isProPage ? PRO_NAV : PARTICULIER_NAV
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const solid = forceSolid || scrolled

  useLayoutEffect(() => {
    setScrolled(readScrollSolid())
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(readScrollSolid())
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [menuOpen])

  const logoHref = isProPage ? "/professionnels" : "/#accueil"

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <AudienceBandeau isProPage={isProPage} />

        <div
          className={cn(
            "transition-[background-color,box-shadow,border-color] duration-500 ease-out",
            solid
              ? "border-b border-brand-border bg-brand-bg/90 shadow-[var(--shadow-vitrine-soft)] backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          )}
        >
        <div className="container-x flex h-[72px] items-center justify-between gap-4 lg:h-[84px]">
          <Link href={logoHref} aria-label="CORE ENVIRONNEMENT — Accueil" className="shrink-0">
            <VitrineLogo priority variant="header" transparent={!solid} />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-6 xl:gap-7 lg:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-[15px] font-medium transition-colors duration-300 font-[family-name:var(--font-body)]",
                  solid
                    ? "text-brand-muted hover:text-brand-navy"
                    : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-[7px] left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                    solid ? "bg-brand-navy" : "bg-white"
                  )}
                />
              </a>
            ))}
            {!isProPage ? (
              <Link
                href="/professionnels"
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[14px] font-semibold transition-colors",
                  solid
                    ? "bg-brand-navy text-white hover:bg-[#152d66]"
                    : "border border-white/35 bg-white/10 text-white hover:bg-white/15"
                )}
              >
                Professionnels
              </Link>
            ) : (
              <Link
                href="/"
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-[14px] font-semibold transition-colors",
                  solid
                    ? "border border-brand-border bg-white text-brand-navy hover:border-brand-green/40"
                    : "border border-white/35 bg-white/10 text-white hover:bg-white/15"
                )}
              >
                Particulier
              </Link>
            )}
          </nav>

          <div className="hidden lg:flex">
            <Link
              href="/dashboard"
              className={cn(
                "btn btn-sm",
                solid ? "btn-ghost-sky" : "btn-ghost-light"
              )}
            >
              <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={VITRINE_ICON_STROKE} />
              Espace client
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors duration-500",
                solid
                  ? "border-brand-border bg-brand-bg text-brand-navy hover:bg-brand-bg-alt"
                  : "border-white/20 bg-white/[0.06] text-white backdrop-blur-md hover:bg-white/[0.12]"
              )}
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={VITRINE_ICON_STROKE} />
            </button>
          </div>
        </div>
        </div>
      </header>

      <div
        className={cn("fixed inset-0 z-[60] lg:hidden", menuOpen ? "" : "pointer-events-none")}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={cn(
            "absolute inset-0 bg-brand-navy/70 backdrop-blur-sm transition-opacity duration-400",
            menuOpen ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className={cn(
            "absolute inset-x-0 top-0 flex h-[100svh] flex-col bg-brand-navy text-white transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(38,157,210,0.18),transparent_60%)]",
            menuOpen ? "translate-y-0 opacity-100" : "-translate-y-6 opacity-0"
          )}
        >
          <div className="container-x flex h-[72px] items-center justify-between">
            <VitrineLogo variant="header" transparent />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fermer le menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-white/15 bg-white/[0.05] text-white"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={20} strokeWidth={VITRINE_ICON_STROKE} />
            </button>
          </div>
          <nav aria-label="Navigation mobile" className="container-x flex flex-1 flex-col justify-center">
            {[
              ...navLinks,
              isProPage
                ? { label: "Particulier", href: "/" }
                : { label: "Professionnels", href: "/professionnels" },
              { label: "Espace client", href: "/dashboard" },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="group flex items-center justify-between border-b border-white/10 py-[15px] text-[21px] text-white/90 hover:text-white"
              >
                {link.label}
                <HugeiconsIcon
                  icon={ArrowUpRight01Icon}
                  size={18}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="opacity-50"
                />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
