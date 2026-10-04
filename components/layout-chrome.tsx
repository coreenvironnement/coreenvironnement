"use client"

import { usePathname } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { VitrineHeader } from "@/components/vitrine/vitrine-header"
import { VitrineOrderProvider } from "@/components/vitrine/order-context"
import { VitrineOrderModal } from "@/components/vitrine/order-modal"
import { cn } from "@/lib/utils"

export function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isDashboard = pathname.startsWith("/dashboard")
  const isStandalone =
    pathname === "/" ||
    pathname === "/login" ||
    pathname === "/pro" ||
    pathname === "/maintenance" ||
    pathname.startsWith("/location-benne")

  if (isStandalone) {
    return <>{children}</>
  }

  if (isDashboard) {
    return (
      <VitrineOrderProvider>
        <div className="vitrine-root min-h-screen bg-brand-bg-alt">
          <VitrineHeader forceSolid />
          <main className="pt-[72px] lg:pt-[84px]">{children}</main>
          <VitrineOrderModal />
        </div>
      </VitrineOrderProvider>
    )
  }

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background: `
              radial-gradient(ellipse 110% 90% at 50% -30%, color-mix(in srgb, #38a234 16%, transparent), transparent 58%),
              radial-gradient(ellipse 55% 45% at 100% 0%, color-mix(in srgb, #1b418f 10%, transparent), transparent 50%),
              var(--background)
            `,
        }}
      />
      <SiteHeader />
      <main className={cn("relative z-0 pt-28 sm:pt-32")}>{children}</main>
    </>
  )
}
