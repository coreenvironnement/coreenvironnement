import { notFound, redirect } from "next/navigation"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { DashboardSubNav } from "@/components/dashboard/intervention-history"
import { WasteCharts } from "@/components/dashboard/waste-charts"
import {
  getUserChantiers,
  loadChantierDashboard,
  userHasChantierAccess,
} from "@/lib/dashboard/chantier-data"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Dashboard · Espace client",
}

type PageProps = {
  searchParams: Promise<{ chantier?: string }>
}

export default async function DashboardPage({ searchParams }: PageProps) {
  const { chantier: chantierParam } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, role")
    .eq("id", user.id)
    .single()

  const chantiers = await getUserChantiers(supabase, user.id)
  const selectedId =
    chantierParam && chantiers.some((c) => c.id === chantierParam)
      ? chantierParam
      : chantiers.length === 1
        ? chantiers[0].id
        : undefined

  let dashboardData = null
  if (selectedId) {
    const allowed = await userHasChantierAccess(supabase, user.id, selectedId)
    if (!allowed) notFound()
    dashboardData = await loadChantierDashboard(supabase, selectedId)
    if (!dashboardData) notFound()
  }

  const profileLabel = profile?.full_name ?? profile?.email ?? user.email ?? "Compte client"

  return (
    <DashboardShell
      profileLabel={profileLabel}
      isAdmin={profile?.role === "admin"}
      chantiers={chantiers}
      selectedChantierId={selectedId}
    >
      {!selectedId ? (
        <div className="rounded-2xl border border-dashed border-brand-navy/20 bg-muted/20 p-10 text-center">
          <p className="text-lg font-medium text-brand-navy">Choisissez un chantier</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Utilisez le sélecteur ci-dessus pour afficher les graphiques de tonnages et de
            valorisation.
          </p>
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
