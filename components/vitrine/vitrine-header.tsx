"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowUpRight01Icon,
  Cancel01Icon,
  Menu01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

import { BenneIcon } from "./benne-icon"
import { VITRINE_ICON_STROKE } from "./icons"
import { VitrineLogo } from "./logo"
import { useVitrineOrder } from "./order-context"

const NAV_LINKS = [
  { label: "Accueil", href: "#accueil" },
  { label: "Services", href: "#services" },
  { label: "Engagements", href: "#engagements" },
  { label: "Fonctionnement", href: "#fonctionnement" },
  { label: "FAQ", href: "#faq" },
] as const

export function VitrineHeader() {
  const { openOrder } = useVitrineOrder()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
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

  const handleOrder = () => {
    setMenuOpen(false)
    openOrder()
  }

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ease-out",
          scrolled
            ? "border-b border-brand-border bg-brand-bg/90 shadow-[var(--shadow-vitrine-soft)] backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="container-x flex h-[72px] items-center justify-between gap-5 lg:h-[84px]">
          <Link href="/#accueil" aria-label="CORE ENVIRONNEMENT — Accueil" className="shrink-0">
            <VitrineLogo priority variant="header" transparent={!scrolled} />
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-7 xl:gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "group relative text-[15px] font-medium transition-colors duration-300 font-[family-name:var(--font-body)]",
                  scrolled
                    ? "text-brand-muted hover:text-brand-navy"
                    : "text-white/90 hover:text-white"
                )}
              >
                {link.label}
                <span
                  className={cn(
                    "absolute -bottom-[7px] left-0 h-px w-full origin-left scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100",
                    scrolled ? "bg-brand-navy" : "bg-white"
                  )}
                />
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/dashboard"
              className={cn(
                "btn btn-sm",
                scrolled ? "btn-ghost-sky" : "btn-ghost-light"
              )}
            >
              <HugeiconsIcon icon={UserIcon} size={16} strokeWidth={VITRINE_ICON_STROKE} />
              Espace client
            </Link>
            <button
              type="button"
              onClick={openOrder}
              className="btn btn-sm btn-accent group"
            >
              Commander une benne
              <BenneIcon className="h-4 w-4 shrink-0" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={handleOrder}
              className="btn btn-sm btn-accent group"
              aria-label="Commander une benne"
            >
              <BenneIcon className="h-[18px] w-[18px] shrink-0 text-white" />
              <span className="hidden min-[430px]:inline">Commander</span>
            </button>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-[10px] border transition-colors duration-500",
                scrolled
                  ? "border-brand-border bg-brand-bg text-brand-navy hover:bg-brand-bg-alt"
                  : "border-white/20 bg-white/[0.06] text-white backdrop-blur-md hover:bg-white/[0.12]"
              )}
            >
              <HugeiconsIcon icon={Menu01Icon} size={20} strokeWidth={VITRINE_ICON_STROKE} />
            </button>
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
            {[...NAV_LINKS, { label: "Espace client", href: "/dashboard" }].map((link) => (
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
          <div className="container-x space-y-2.5 pb-10 pt-6">
            <button type="button" onClick={handleOrder} className="btn btn-accent w-full">
              Commander une benne
            </button>
            <Link href="/pro" className="btn btn-ghost-light w-full">
              Compte professionnel
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
