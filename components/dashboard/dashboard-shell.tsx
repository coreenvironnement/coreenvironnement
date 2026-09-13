import Link from "next/link"
import { Suspense } from "react"

import { ChantierSelector } from "@/components/dashboard/chantier-selector"
import { Button } from "@/components/ui/button"
import type { ChantierSummary } from "@/lib/dashboard/chantier-data"

type Props = {
  profileLabel: string
  isAdmin: boolean
  chantiers: ChantierSummary[]
  selectedChantierId?: string
  children: React.ReactNode
}

export function DashboardShell({
  profileLabel,
  isAdmin,
  chantiers,
  selectedChantierId,
  children,
}: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">Espace client</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {profileLabel}
            {isAdmin ? " · Administrateur" : null}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/pro">
            <Button variant="secondary">Compte pro</Button>
          </Link>
          {isAdmin ? (
            <Link href="/admin">
              <Button variant="secondary">Administration</Button>
            </Link>
          ) : null}
          <form action="/auth/logout" method="post">
            <Button type="submit" variant="outline">
              Se déconnecter
            </Button>
          </form>
        </div>
      </div>

      {chantiers.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-brand-navy/20 bg-muted/30 p-10 text-center">
          <p className="text-lg font-medium text-brand-navy">
            Aucun chantier associé à votre compte
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Sélectionnez un chantier pour afficher vos statistiques de déchets et
            l&apos;historique des interventions. Votre administrateur CORE ENVIRONNEMENT doit
            d&apos;abord lier votre e-mail à un chantier.
          </p>
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <Suspense fallback={<div className="h-10 max-w-md animate-pulse rounded-lg bg-muted/50" />}>
            <ChantierSelector chantiers={chantiers} selectedId={selectedChantierId} />
          </Suspense>
          {children}
        </div>
      )}
    </div>
  )
}
