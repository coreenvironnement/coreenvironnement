import type { ReactNode } from "react"

import { AuthPageHeader } from "@/components/auth/auth-page-header"

type AuthPageShellProps = {
  desktopTitle: ReactNode
  desktopIntro: ReactNode
  eyebrow?: string
  children: ReactNode
}

export function AuthPageShell({
  desktopTitle,
  desktopIntro,
  eyebrow = "Espace client",
  children,
}: AuthPageShellProps) {
  return (
    <section className="flex min-h-0 flex-col bg-[#ECF4E9] pb-2 pt-1 sm:flex-1 sm:pb-4 sm:pt-2 lg:py-16">
      <div className="container-x flex min-h-0 flex-1 flex-col">
        <AuthPageHeader />
        <div className="mx-auto grid w-full max-w-5xl flex-1 items-start gap-4 lg:grid-cols-[1fr_1fr] lg:gap-14 lg:pt-2">
          <div className="hidden pt-2 lg:block lg:pt-6">
            <p className="section-eyebrow">{eyebrow}</p>
            <h1 className="mt-4 max-w-xl text-[clamp(1.85rem,3.2vw,2.75rem)] font-semibold leading-[1.12] text-brand-navy">
              {desktopTitle}
            </h1>
            <p className="mt-4 max-w-md text-[16px] leading-relaxed text-brand-muted">{desktopIntro}</p>
          </div>

          <div className="flex w-full min-h-0 flex-col justify-start max-lg:mx-auto max-lg:max-w-md lg:pt-2">
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}