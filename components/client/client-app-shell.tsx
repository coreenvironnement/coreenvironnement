"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  FolderOpen,
  LineChart,
  LogOut,
  Package,
  Plus,
  FileText,
  User,
  type LucideIcon,
} from "lucide-react"

import { LogoutButton } from "@/components/auth/logout-button"
import { FaviconIcon } from "@/components/favicon-icon"
import { resolveEspaceNavId } from "@/lib/client/espace-active"
import {
  ESPACE_WARM_BG,
  type ClientNavId,
  type ClientNavItem,
} from "@/lib/client/nav-items"
import { cn } from "@/lib/utils"

const NAV_ICONS: Record<Exclude<ClientNavId, "aide">, LucideIcon> = {
  commandes: Package,
  chantier: LineChart,
  documents: FolderOpen,
  factures: FileText,
  compte: Building2,
  profil: User,
}

function ClientNavIcon({
  id,
  isActive,
  variant,
}: {
  id: ClientNavId
  isActive: boolean
  variant: "sidebar" | "mobileTab"
}) {
  if (id === "aide") {
    const size = variant === "mobileTab" ? 22 : 18
    return (
      <FaviconIcon
        size={size}
        className={cn(
          variant === "mobileTab" ? "size-[22px]" : "size-[18px]",
          variant === "mobileTab"
            ? isActive
              ? "opacity-100"
              : "opacity-55"
            : isActive
              ? "opacity-100"
              : "opacity-80"
        )}
      />
    )
  }

  const Icon = NAV_ICONS[id]
  const sizeClass = variant === "mobileTab" ? "size-5" : "size-[18px]"
  return (
    <Icon
      className={cn(
        "shrink-0",
        sizeClass,
        variant === "mobileTab"
          ? isActive && "text-[#35A238]"
          : isActive
            ? "text-[#35A238]"
            : "text-[#35A238]/80"
      )}
      strokeWidth={2}
      aria-hidden
    />
  )
}

type Props = {
  children: React.ReactNode
  navItems: ClientNavItem[]
  userLabel: string
}

function NavItemLink({
  item,
  isActive,
  className,
}: {
  item: ClientNavItem
  isActive: boolean
  className?: string
}) {
  return (
    <Link
      href={item.href}
      prefetch
      scroll={false}
      className={cn(
        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
        isActive
          ? "bg-[#35A238]/15 text-brand-navy shadow-[inset_0_0_0_1px_rgba(53,162,56,0.35)]"
          : "text-brand-navy/70 hover:bg-[#ECF4E9] hover:text-brand-navy",
        className
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <ClientNavIcon id={item.id} isActive={isActive} variant="sidebar" />
      {item.label}
    </Link>
  )
}

function mobileWelcomeLabel(userLabel: string): string {
  const trimmed = userLabel.trim()
  if (!trimmed || trimmed === "Mon compte" || trimmed.includes("@")) {
    return "Bienvenue"
  }
  const firstName = trimmed.split(/\s+/)[0]
  return firstName ? `Bienvenue ${firstName}` : "Bienvenue"
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
  const mobileTabItems = navItems
  const mobileTabOverflow = mobileTabItems.length > 5
  const mobileWelcome = mobileWelcomeLabel(userLabel)

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
                href="/espace/commandes/nouvelle"
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
            <div className="flex min-w-0 flex-1 items-center md:flex-none">
              <p className="truncate text-sm font-medium text-brand-navy md:hidden" title={mobileWelcome}>
                {mobileWelcome}
              </p>
              <div className="hidden text-sm font-medium text-brand-navy/80 md:block">
                Mon espace
              </div>
            </div>
            <div className="flex items-center gap-2">
              <form action="/auth/logout" method="post" className="inline-flex shrink-0 sm:hidden">
                <button
                  type="submit"
                  className="inline-flex size-10 items-center justify-center rounded-xl border border-[#35A238]/25 bg-white transition-colors hover:bg-white/80"
                  aria-label="Se déconnecter"
                >
                  <LogOut className="size-5 text-[#35A238]" aria-hidden />
                </button>
              </form>
              <div className="hidden shrink-0 sm:block [&_form]:w-auto">
                <LogoutButton
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#35A238]/25 bg-white px-3"
                />
              </div>
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
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-[#35A238]/20 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_rgba(25,55,35,0.08)] md:hidden",
          mobileTabOverflow
            ? "flex overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "flex"
        )}
        aria-label="Navigation rapide"
      >
        {mobileTabItems.map((item) => {
          const isActive = item.id === active
          return (
            <Link
              key={item.id}
              href={item.href}
              prefetch
              scroll={false}
              className={cn(
                "flex min-h-[44px] flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium leading-tight",
                mobileTabOverflow
                  ? "min-w-[4.75rem] shrink-0 px-1.5"
                  : "min-w-0 flex-1",
                isActive
                  ? "text-[#35A238] font-semibold"
                  : "text-brand-navy/55"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <ClientNavIcon id={item.id} isActive={isActive} variant="mobileTab" />
              <span className="max-w-[4.5rem] truncate text-center">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="h-[4.25rem] md:hidden" aria-hidden />
    </div>
  )
}
