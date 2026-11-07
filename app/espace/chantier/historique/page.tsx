import { notFound } from "next/navigation"

import { ChantierSubscriptionGate } from "@/components/espace/chantier-subscription-gate"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { HistoriqueExportButtons } from "@/components/dashboard/historique-export-buttons"
import {
  DashboardSubNav,
  InterventionHistoryTable,
} from "@/components/dashboard/intervention-history"
import { evaluateDashboardAccess } from "@/lib/auth/client-nav-context"
import {
  getUserChantiers,
  loadChantierInterventions,
  userHasChantierAccess,
} from "@/lib/dashboard/chantier-data"
import { STATUTS_INTERVENTION, TYPES_DOCUMENTS } from "@/lib/cdc/referentiels"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Historique · Mon espace",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ chantier?: string }>
}

export default async function EspaceChantierHistoriquePage({ searchParams }: PageProps) {
  const { chantier: chantierParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const chantiers = await getUserChantiers(supabase, user.id)
  const gate = chantiers.length > 0 ? await evaluateDashboardAccess(supabase, user.id) : { ok: true as const }

  const selectedId =
    chantierParam && chantiers.some((c) => c.id === chantierParam)
      ? chantierParam
      : chantiers.length === 1
        ? chantiers[0].id
        : undefined

  const statutLabels = Object.fromEntries(
    STATUTS_INTERVENTION.map((s) => [s.code, s.label])
  )
  const documentLabels = Object.fromEntries(
    TYPES_DOCUMENTS.map((d) => [d.code, d.label])
  )

  let rows = null
  let chantierNom: string | null = null

  if (selectedId && gate.ok) {
    const allowed = await userHasChantierAccess(supabase, user.id, selectedId)
    if (!allowed) notFound()

    const chantier = chantiers.find((c) => c.id === selectedId)
    chantierNom = chantier?.nom ?? null

    rows = await loadChantierInterventions(
      supabase,
      selectedId,
      statutLabels,
      documentLabels
    )
  }

  return (
    <DashboardShell chantiers={chantiers} selectedChantierId={selectedId}>
      {!gate.ok ? (
        <ChantierSubscriptionGate />
      ) : !selectedId ? (
        <div className="rounded-xl border border-dashed border-[#35A238]/25 bg-white px-6 py-8 text-center text-sm">
          <p className="font-medium">Sélectionnez un chantier</p>
        </div>
      ) : (
        <div className="space-y-6">
          <DashboardSubNav chantierId={selectedId} active="historique" />
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-brand-navy">Historique</h2>
              {chantierNom ? (
                <p className="mt-1 text-sm text-muted-foreground">{chantierNom}</p>
              ) : null}
            </div>
            <HistoriqueExportButtons
              chantierId={selectedId}
              disabled={!rows?.length}
            />
          </div>
          <InterventionHistoryTable rows={rows ?? []} />
        </div>
      )}
    </DashboardShell>
  )
}
