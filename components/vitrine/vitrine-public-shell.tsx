"use client"

import type { ReactNode } from "react"

import { VitrineOrderProvider } from "./order-context"
import { VitrineOrderModal } from "./order-modal"
import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"

export function VitrinePublicShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <VitrineOrderProvider>
      <div className="vitrine-root min-h-screen">
        <VitrineHeader forceSolid />
        <main id="contenu" className="pt-[72px] lg:pt-[84px]">
          {children}
        </main>
        <VitrineFooter />
        <VitrineOrderModal />
      </div>
    </VitrineOrderProvider>
  )
}
