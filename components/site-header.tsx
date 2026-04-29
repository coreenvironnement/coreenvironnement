"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
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
        className="pointer-events-auto flex h-14 w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border border-white/50 bg-background/70 px-3 shadow-[0_8px_32px_-8px_color-mix(in_srgb,var(--brand-navy)_35%,transparent)] backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-background/55 sm:h-16 sm:px-5"
        role="banner"
      >
        <Link
          href="/"
          className="relative flex h-9 max-w-[min(52vw,200px)] shrink-0 items-center sm:h-10 sm:max-w-[220px]"
        >
          <Image
            src="/logo-core-environnement.png"
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
          <Link
            href="/pro"
            className="hidden rounded-full border border-brand-navy/25 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-navy/50 hover:bg-brand-navy hover:text-white md:inline-flex"
          >
            Espace Pro
          </Link>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 rounded-xl border-brand-navy/25 bg-white/80 text-brand-navy shadow-sm md:hidden"
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
                <Link
                  href="/pro"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-md"
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
