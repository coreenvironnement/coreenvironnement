"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  Briefcase,
  HardHat,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { resolveAdminNavId } from "@/lib/admin/admin-active"
import { ADMIN_WARM_BG, type AdminNavId, type AdminNavItem } from "@/lib/admin/nav-items"
import { cn } from "@/lib/utils"

const NAV_ICONS: Record<AdminNavId, LucideIcon> = {
  overview: LayoutDashboard,
  commandesB2C: Package,
  commandesB2B: Package,
  clientsB2C: Users,
  comptesPro: Briefcase,
  chantiers: HardHat,
}

type Props = {
  children: React.ReactNode
  navItems: AdminNavItem[]
  userLabel: string
}

function NavItemLink({
  item,
  isActive,
  onNavigate,
  compact,
}: {
  item: AdminNavItem
  isActive: boolean
  onNavigate?: () => void
  compact?: boolean
}) {
  const Icon = NAV_ICONS[item.id]
  return (
    <Link
      href={item.href}
      prefetch
      scroll={false}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#35A238]/15 text-brand-navy shadow-[inset_0_0_0_1px_rgba(53,162,56,0.35)]"
          : "text-brand-navy/70 hover:bg-[#ECF4E9] hover:text-brand-navy",
        compact && "text-[10px] py-2 px-2 gap-1"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn("shrink-0 text-[#35A238]", compact ? "size-4" : "size-[18px]")}
        strokeWidth={2}
        aria-hidden
      />
      <span className="min-w-0 flex-1 leading-tight">{item.label}</span>
      {item.badge ? (
        <span className="rounded-full bg-[#35A238] px-1.5 py-0.5 text-[10px] font-semibold text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  )
}

export function AdminAppShell({ children, navItems, userLabel }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const query = searchParams?.toString() ?? ""
  const active = resolveAdminNavId(pathname, query)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen text-brand-navy" style={{ backgroundColor: ADMIN_WARM_BG }}>
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-[#35A238]/20 bg-white/90 backdrop-blur-sm lg:flex">
          <div className="flex h-[3.75rem] items-center border-b border-[#35A238]/15 px-4">
            <Link href="/admin" className="relative h-8 w-[140px]">
              <Image
                src="/images/stickyheaderlogo.png"
                alt="CORE Environnement"
                fill
                sizes="140px"
                className="object-contain object-left"
              />
            </Link>
          </div>
          <p className="px-4 pt-3 text-[11px] font-semibold uppercase tracking-wider text-[#35A238]">
            Administration
          </p>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Administration">
            {navItems.map((item) => (
              <NavItemLink key={item.id} item={item} isActive={item.id === active} />
            ))}
            <div className="mt-3 border-t border-[#35A238]/15 pt-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy/70 hover:bg-[#ECF4E9]"
              >
                Site vitrine
              </Link>
            </div>
          </nav>
          <div className="border-t border-[#35A238]/15 p-3">
            <p className="truncate px-1 text-xs text-muted-foreground" title={userLabel}>
              {userLabel}
            </p>
            <form action="/auth/logout" method="post" className="mt-2">
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-brand-navy/80"
              >
                <LogOut className="size-4 text-[#35A238]" aria-hidden />
                Déconnexion
              </Button>
            </form>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-[3.75rem] items-center justify-between gap-3 border-b border-[#35A238]/15 bg-[#ECF4E9]/95 px-4 backdrop-blur-md">
            <div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[#35A238]/25 bg-white"
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-5 text-[#35A238]" />
              </button>
              <span className="text-sm font-semibold">Admin</span>
            </div>
            <div className="hidden text-sm font-medium text-brand-navy/80 lg:block">
              Back-office CORE
            </div>
            <p className="hidden max-w-[12rem] truncate text-xs text-muted-foreground sm:block">
              {userLabel}
            </p>
          </header>

          <main key={`${pathname}?${query}`} className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[#35A238]/20 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(25,55,35,0.08)] lg:hidden"
        aria-label="Navigation admin"
      >
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.id}
            href={item.href}
            prefetch
            scroll={false}
            className={cn(
              "relative flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5 text-[9px] font-medium",
              item.id === active ? "text-[#35A238]" : "text-brand-navy/55"
            )}
          >
            {(() => {
              const Icon = NAV_ICONS[item.id]
              return <Icon className="size-5" strokeWidth={2} aria-hidden />
            })()}
            <span className="max-w-[4.2rem] truncate text-center leading-tight">{item.label}</span>
            {item.badge ? (
              <span className="absolute right-2 top-1 size-2 rounded-full bg-[#35A238]" aria-hidden />
            ) : null}
          </Link>
        ))}
      </nav>

      <div className="h-[4.25rem] lg:hidden" aria-hidden />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-navy/35"
            aria-label="Fermer"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[min(88vw,300px)] flex-col bg-white shadow-xl"
            style={{ backgroundColor: ADMIN_WARM_BG }}
          >
            <div className="flex h-[3.75rem] items-center justify-between border-b bg-white px-4">
              <span className="font-semibold">Menu admin</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex size-10 items-center justify-center rounded-xl border bg-white"
                aria-label="Fermer"
              >
                <X className="size-5" />
              </button>
            </div>
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
              {navItems.map((item) => (
                <NavItemLink
                  key={item.id}
                  item={item}
                  isActive={item.id === active}
                  onNavigate={() => setMobileNavOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  )
}
