import { Suspense } from "react"

import { ClientAppLayout } from "@/components/client/client-app-layout"
import { EspaceShellLoadingSkeleton } from "@/components/espace/espace-loading-skeleton"

export default function EspaceRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense fallback={<EspaceShellLoadingSkeleton />}>
      <ClientAppLayout loginNext="/espace">{children}</ClientAppLayout>
    </Suspense>
  )
}
