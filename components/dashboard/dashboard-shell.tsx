import { Suspense } from "react"

import { ChantierSelector } from "@/components/dashboard/chantier-selector"
import type { ChantierSummary } from "@/lib/dashboard/chantier-data"

type Props = {
  chantiers: ChantierSummary[]
  selectedChantierId?: string
  children: React.ReactNode
}

export function DashboardShell({
  chantiers,
  selectedChantierId,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Suivi chantier</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Tonnages, valorisation et historique
        </p>
      </div>

      {chantiers.length === 0 ? (
        <div className="rounded-xl border border-dashed border-brand-navy/15 bg-white px-6 py-10 text-center text-sm">
          <p className="font-medium">Aucun chantier lié à ce compte</p>
          <p className="mt-2 text-muted-foreground">
            Contactez votre interlocuteur CORE pour être rattaché à un chantier.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <Suspense
            fallback={<div className="h-10 max-w-md animate-pulse rounded-lg bg-muted/50" />}
          >
            <ChantierSelector chantiers={chantiers} selectedId={selectedChantierId} />
          </Suspense>
          {children}
        </div>
      )}
    </div>
  )
}
