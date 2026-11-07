import { notFound } from "next/navigation"

import { ChantierSubscriptionGate } from "@/components/espace/chantier-subscription-gate"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSubNav } from "@/components/dashboard/intervention-history"
import { PrestataireAlert } from "@/components/dashboard/prestataire-alert"
import { WasteCharts } from "@/components/dashboard/waste-charts"
import { evaluateDashboardAccess } from "@/lib/auth/client-nav-context"
import {
  getUserChantiers,
  loadChantierDashboard,
  userHasChantierAccess,
} from "@/lib/dashboard/chantier-data"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Suivi chantier · Mon espace",
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<{ chantier?: string }>
}

export default async function EspaceChantierPage({ searchParams }: PageProps) {
  const { chantier: chantierParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  const chantiers = await getUserChantiers(supabase, user.id)
  const gate = chantiers.length > 0 ? await evaluateDashboardAccess(supabase, user.id) : { ok: true as const }

  const selectedId =
    chantierParam && chantiers.some((c) => c.id === chantierParam)
      ? chantierParam
      : chantiers.length === 1
        ? chantiers[0].id
        : undefined

  let dashboardData = null
  if (selectedId && gate.ok) {
    const allowed = await userHasChantierAccess(supabase, user.id, selectedId)
    if (!allowed) notFound()
    dashboardData = await loadChantierDashboard(supabase, selectedId)
    if (!dashboardData) notFound()
  }

  return (
    <DashboardShell chantiers={chantiers} selectedChantierId={selectedId}>
      {!gate.ok ? (
        <ChantierSubscriptionGate />
      ) : !selectedId ? (
        <div className="rounded-xl border border-dashed border-[#35A238]/25 bg-white px-6 py-8 text-center text-sm">
          <p className="font-medium">Sélectionnez un chantier</p>
        </div>
      ) : dashboardData ? (
        <div className="space-y-6">
          <DashboardSubNav chantierId={selectedId} active="overview" />
          <div>
            <h2 className="text-xl font-semibold text-brand-navy">{dashboardData.chantier.nom}</h2>
            {dashboardData.chantier.adresse ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {dashboardData.chantier.adresse}
              </p>
            ) : null}
          </div>
          <PrestataireAlert
            chantierId={selectedId}
            prestataireNom={dashboardData.chantier.prestataireNom}
            isAdmin={profile?.role === "admin"}
          />
          <WasteCharts
            tonnages={dashboardData.tonnages}
            valorisation={dashboardData.valorisation}
            prestataireNom={dashboardData.chantier.prestataireNom}
            anneeTaux={dashboardData.anneeTaux}
          />
        </div>
      ) : null}
    </DashboardShell>
  )
}
