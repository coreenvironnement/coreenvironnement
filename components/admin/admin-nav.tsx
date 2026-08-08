"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HardHat, LayoutDashboard, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/admin", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/admin/chantiers", label: "Chantiers", icon: HardHat },
] as const

export function AdminNav() {
  const currentPath = usePathname()

  return (
    <aside className="w-full shrink-0 lg:w-56">
      <div className="rounded-2xl border border-brand-navy/12 bg-background p-4 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Administration
        </p>
        <nav className="mt-3 flex flex-col gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              href === "/admin"
                ? currentPath === "/admin"
                : currentPath.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-brand-navy hover:bg-muted"
                )}
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="mt-4 space-y-2 border-t border-border/60 pt-4">
          <Link
            href="/dashboard"
            className="block text-sm text-muted-foreground hover:text-primary"
          >
            ← Espace client
          </Link>
          <form action="/auth/logout" method="post">
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start px-3">
              <LogOut className="size-4" aria-hidden />
              Déconnexion
            </Button>
          </form>
        </div>
      </div>
    </aside>
  )
}
