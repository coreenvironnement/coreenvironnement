import { notFound, redirect } from "next/navigation"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import {
  DashboardSubNav,
  InterventionHistoryTable,
} from "@/components/dashboard/intervention-history"
import {
  getUserChantiers,
  loadChantierInterventions,
  userHasChantierAccess,
} from "@/lib/dashboard/chantier-data"
import { STATUTS_INTERVENTION, TYPES_DOCUMENTS } from "@/lib/cdc/referentiels"
import { createClient } from "@/lib/supabase/server"

export const metadata = {
  title: "Historique · Espace client",
}

type PageProps = {
  searchParams: Promise<{ chantier?: string }>
}

export default async function DashboardHistoriquePage({ searchParams }: PageProps) {
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

  const statutLabels = Object.fromEntries(
    STATUTS_INTERVENTION.map((s) => [s.code, s.label])
  )
  const documentLabels = Object.fromEntries(
    TYPES_DOCUMENTS.map((d) => [d.code, d.label])
  )

  let rows = null
  let chantierNom: string | null = null

  if (selectedId) {
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
            Sélectionnez un chantier pour consulter l&apos;historique des prestations et
            télécharger les documents (BI, pesée, BSD).
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <DashboardSubNav chantierId={selectedId} active="historique" />
          <div>
            <h2 className="text-xl font-semibold text-brand-navy">
              Historique des prestations
            </h2>
            {chantierNom ? (
              <p className="mt-1 text-sm text-muted-foreground">{chantierNom}</p>
            ) : null}
          </div>
          <InterventionHistoryTable rows={rows ?? []} />
        </div>
      )}
    </DashboardShell>
  )
}
