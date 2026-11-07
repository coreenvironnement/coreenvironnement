"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import {
  Building2,
  FolderOpen,
  LineChart,
  Menu,
  Package,
  Plus,
  Receipt,
  User,
  X,
  type LucideIcon,
} from "lucide-react"

import { LogoutButton } from "@/components/auth/logout-button"
import { Button } from "@/components/ui/button"
import { resolveEspaceNavId } from "@/lib/client/espace-active"
import {
  ESPACE_WARM_BG,
  type ClientNavId,
  type ClientNavItem,
} from "@/lib/client/nav-items"
import { cn } from "@/lib/utils"

const NAV_ICONS: Record<ClientNavId, LucideIcon> = {
  commandes: Package,
  chantier: LineChart,
  documents: FolderOpen,
  factures: Receipt,
  compte: Building2,
  profil: User,
}

type Props = {
  children: React.ReactNode
  navItems: ClientNavItem[]
  userLabel: string
}

function NavItemLink({
  item,
  isActive,
  onNavigate,
  className,
}: {
  item: ClientNavItem
  isActive: boolean
  onNavigate?: () => void
  className?: string
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
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon
        className={cn("size-[18px] shrink-0", isActive ? "text-[#35A238]" : "text-[#35A238]/80")}
        strokeWidth={2}
        aria-hidden
      />
      {item.label}
    </Link>
  )
}

function ShellSessionFooter({ userLabel }: { userLabel: string }) {
  return (
    <div className="shrink-0 border-t border-[#35A238]/15 bg-white/80 p-3">
      <p className="truncate px-1 text-xs text-muted-foreground" title={userLabel}>
        {userLabel}
      </p>
      <LogoutButton className="mt-2 w-full justify-start px-3" />
    </div>
  )
}

export function ClientAppShell({ children, navItems, userLabel }: Props) {
  const pathname = usePathname()
  const active = resolveEspaceNavId(pathname)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const mobileTabItems = navItems.filter((item) => item.id !== "profil")

  return (
    <div className="min-h-screen text-brand-navy" style={{ backgroundColor: ESPACE_WARM_BG }}>
      <div className="mx-auto flex min-h-screen max-w-[1520px]">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 flex-col border-r border-[#35A238]/20 bg-white/90 backdrop-blur-sm md:flex">
          <div className="flex h-[3.75rem] items-center border-b border-[#35A238]/15 px-4">
            <Link href="/espace" className="relative h-8 w-[140px]">
              <Image
                src="/images/stickyheaderlogo.png"
                alt="CORE Environnement"
                fill
                sizes="140px"
                className="object-contain object-left"
              />
            </Link>
          </div>
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3" aria-label="Espace client">
            {navItems.map((item) => (
              <NavItemLink
                key={item.id}
                item={item}
                isActive={item.id === active}
              />
            ))}
            <div className="mt-3 border-t border-[#35A238]/15 pt-3">
              <Link
                href="/"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy/70 hover:bg-[#ECF4E9]"
              >
                <Plus className="size-[18px] text-[#35A238]" aria-hidden />
                Commander
              </Link>
            </div>
          </nav>
          <ShellSessionFooter userLabel={userLabel} />
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-[3.75rem] items-center justify-between gap-3 border-b border-[#35A238]/15 bg-[#ECF4E9]/95 px-4 backdrop-blur-md md:px-6">
            <div className="flex items-center gap-2 md:hidden">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[#35A238]/25 bg-white"
                aria-label="Ouvrir le menu"
              >
                <Menu className="size-5 text-[#35A238]" />
              </button>
              <span className="text-sm font-semibold">
                {navItems.find((n) => n.id === active)?.label ?? "Mon espace"}
              </span>
            </div>
            <div className="hidden text-sm font-medium text-brand-navy/80 md:block">
              Mon espace
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/espace/profil"
                className="inline-flex size-10 items-center justify-center rounded-xl border border-[#35A238]/25 bg-white"
                aria-label="Mon compte"
              >
                <User className="size-5 text-[#35A238]" aria-hidden />
              </Link>
              <Link href="/" className="hidden sm:inline-flex">
                <Button
                  size="sm"
                  className="border-0 bg-[#35A238] text-white hover:bg-[#2d8a30]"
                >
                  Commander
                </Button>
              </Link>
            </div>
          </header>

          <main
            key={pathname ?? "espace"}
            className="flex-1 p-4 transition-opacity duration-150 md:p-6"
          >
            {children}
          </main>
        </div>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-[#35A238]/20 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(25,55,35,0.08)] md:hidden"
        aria-label="Navigation rapide"
      >
        {mobileTabItems.slice(0, 5).map((item) => {
          const isActive = item.id === active
          const Icon = NAV_ICONS[item.id]
          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch
              scroll={false}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium",
                isActive ? "text-[#35A238]" : "text-brand-navy/55"
              )}
            >
              <Icon className="size-5" strokeWidth={2} aria-hidden />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="h-[4.25rem] md:hidden" aria-hidden />

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-navy/35"
            aria-label="Fermer le menu"
            onClick={() => setMobileNavOpen(false)}
          />
          <div
            className="absolute inset-y-0 left-0 flex w-[min(88vw,300px)] flex-col bg-white shadow-xl"
            style={{ backgroundColor: ESPACE_WARM_BG }}
          >
            <div className="flex h-[3.75rem] items-center justify-between border-b border-[#35A238]/15 bg-white px-4">
              <span className="font-semibold">Menu</span>
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
              <div className="mt-3 border-t border-[#35A238]/15 pt-3">
                <Link
                  href="/"
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-brand-navy/70 hover:bg-[#ECF4E9]"
                >
                  <Plus className="size-[18px] text-[#35A238]" aria-hidden />
                  Commander
                </Link>
              </div>
            </nav>
            <ShellSessionFooter userLabel={userLabel} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
