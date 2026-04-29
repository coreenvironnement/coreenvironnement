"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

const nav = [
  { href: "/", label: "Accueil" },
  { href: "/#commande", label: "Commander" },
  { href: "/#temoignages", label: "Avis clients" },
] as const

function NavLinks({
  className,
  onItemClick,
}: {
  className?: string
  onItemClick?: () => void
}) {
  return (
    <nav
      className={cn(
        "flex flex-col gap-0.5 md:flex-row md:items-center md:gap-0.5",
        className
      )}
    >
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onItemClick}
          className="rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy transition hover:bg-primary/10 hover:text-primary md:py-2"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:px-6 lg:top-6">
      <div
        className="pointer-events-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border border-brand-navy/[0.14] bg-[color-mix(in_srgb,var(--background)_88%,transparent)] px-3 shadow-[0_6px_28px_-10px_color-mix(in_srgb,var(--brand-navy)_45%,transparent)] backdrop-blur-md backdrop-saturate-100 supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--muted)_92%,transparent)] sm:h-16 sm:px-5"
        role="banner"
      >
        <Link
          href="/"
          className="relative flex h-9 max-w-[min(52vw,200px)] shrink-0 items-center sm:h-10 sm:max-w-[220px]"
        >
          <Image
            src="/logocoreenvironnement.png"
            alt="Core Environnement"
            width={260}
            height={72}
            sizes="220px"
            className="h-full w-full object-contain object-left"
            priority
          />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-center md:flex">
          <NavLinks className="flex-wrap justify-center" />
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <a
            href={SITE_PHONE_HREF}
            className="hidden items-center gap-2 rounded-full border border-transparent bg-[#38a234] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-[#2d8a2a] md:inline-flex"
          >
            <Phone className="size-4 shrink-0" aria-hidden />
            {SITE_PHONE_DISPLAY}
          </a>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 rounded-xl border border-brand-navy/20 bg-[color-mix(in_srgb,var(--muted)_85%,transparent)] text-brand-navy shadow-sm md:hidden"
                  aria-label="Ouvrir le menu"
                />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(100%,380px)] gap-0 border-l border-brand-navy/15 bg-background/95"
            >
              <SheetHeader className="border-b border-border/50 text-left">
                <SheetTitle className="text-brand-navy">Menu</SheetTitle>
                <SheetDescription className="sr-only">
                  Navigation principale du site
                </SheetDescription>
              </SheetHeader>
              <div className="flex flex-col gap-4 p-4">
                <NavLinks onItemClick={() => setMobileOpen(false)} />
                <a
                  href={SITE_PHONE_HREF}
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#38a234] py-3 text-sm font-semibold text-white shadow-md"
                >
                  <Phone className="size-4 shrink-0" aria-hidden />
                  {SITE_PHONE_DISPLAY}
                </a>
                <Link
                  href="/pro"
                  onClick={() => setMobileOpen(false)}
                  className="text-center text-sm font-medium text-brand-navy/80 underline-offset-4 hover:underline"
                >
                  Espace Pro
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
