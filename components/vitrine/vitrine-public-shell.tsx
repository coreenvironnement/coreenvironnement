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
        <main id="contenu" className="pt-[7.25rem] lg:pt-[8.25rem]">
          {children}
        </main>
        <VitrineFooter />
        <VitrineOrderModal />
      </div>
    </VitrineOrderProvider>
  )
}
