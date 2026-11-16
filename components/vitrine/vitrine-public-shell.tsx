"use client"

import type { ReactNode } from "react"

import { VitrineOrderProvider } from "./order-context"
import { VitrineOrderModal } from "./order-modal"
import { VitrineFooter } from "./vitrine-footer"
import { VITRINE_HEADER_AUTH_OFFSET_CLASS } from "./header-layout"
import { VitrineHeader } from "./vitrine-header"
import { VitrineMobileActionBar } from "./vitrine-mobile-action-bar"
import { cn } from "@/lib/utils"

export function VitrinePublicShell({
  children,
  hideChrome = false,
  withMobileActionBar = false,
}: {
  children: ReactNode
  /** Page auth autonome : pas de header vitrine ni footer marketing */
  hideChrome?: boolean
  /** Barre sticky bas (Estimer · Commander · …) réservée < lg */
  withMobileActionBar?: boolean
}) {
  return (
    <VitrineOrderProvider>
      <div
        className={cn(
          "vitrine-root",
          hideChrome
            ? "flex min-h-dvh flex-col bg-brand-warm"
            : "min-h-screen",
          withMobileActionBar && "vitrine--with-action-bar"
        )}
      >
        {hideChrome ? (
          <main id="contenu" className="flex min-h-0 flex-1 flex-col">
            {children}
          </main>
        ) : (
          <>
            <VitrineHeader forceSolid />
            <main id="contenu" className={VITRINE_HEADER_AUTH_OFFSET_CLASS}>
              {children}
            </main>
            <VitrineFooter />
          </>
        )}
        <VitrineOrderModal />
        {withMobileActionBar ? <VitrineMobileActionBar /> : null}
      </div>
    </VitrineOrderProvider>
  )
}
