"use client"

import type { ReactNode } from "react"
import Image from "next/image"

import { hero } from "@/lib/cdc/contenu-vitrine"

import { VitrineOrderProvider } from "./order-context"
import { VitrineOrderModal } from "./order-modal"
import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"

export function VitrinePublicShell({
  heroContent,
  children,
}: {
  heroContent: ReactNode
  children: ReactNode
}) {
  return (
    <VitrineOrderProvider>
      <div className="vitrine-root min-h-screen">
        <VitrineHeader />

        <section className="relative isolate overflow-hidden bg-brand-navy">
          <div className="absolute inset-0 overflow-hidden md:hidden">
            <div className="hero-bg-frame hero-bg-frame--mobile relative">
              <Image
                src="/images/hero-paris-truck-mobile.png"
                alt={hero.imageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="absolute inset-0 hidden overflow-hidden md:block">
            <div className="hero-bg-frame hero-bg-frame--desktop relative">
              <Image
                src="/images/hero-paris-truck-desktop.png"
                alt={hero.imageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-[55%_center]"
              />
            </div>
          </div>
          <div aria-hidden className="hero-overlay hero-overlay--mobile md:hidden" />
          <div aria-hidden className="hero-overlay hero-overlay--desktop hidden md:block" />

          <div className="container-x relative z-10 pb-12 pt-28 sm:pb-16 sm:pt-32 lg:pb-20 lg:pt-36">
            <div className="relative max-w-[640px]">
              <div
                aria-hidden
                className="hero-readability-glow pointer-events-none absolute -inset-x-3 -inset-y-5 rounded-[1.25rem] md:-inset-x-8 md:-inset-y-8 md:rounded-[2rem]"
              />
              {heroContent}
            </div>
          </div>
        </section>

        <main id="contenu">{children}</main>
        <VitrineFooter />
        <VitrineOrderModal />
      </div>
    </VitrineOrderProvider>
  )
}
