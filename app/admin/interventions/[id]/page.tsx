import { notFound } from "next/navigation"

import { AdminInterventionChantierFiche } from "@/components/admin/admin-intervention-chantier-fiche"
import { requireAdmin } from "@/lib/auth/require-admin"

type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<Record<string, string | undefined>>
}

export default async function AdminInterventionDetailPage(props: PageProps) {
  const { id } = await props.params
  const { supabase } = await requireAdmin()

  const { data: commande } = await supabase.from("commandes").select("id").eq("id", id).maybeSingle()
  if (commande) {
    const CommandePage = (await import("@/app/admin/commandes/[id]/page")).default
    return <CommandePage params={props.params} searchParams={props.searchParams} />
  }

  const { data: intervention } = await supabase
    .from("interventions")
    .select("id, chantier_id")
    .eq("id", id)
    .maybeSingle()

  if (!intervention) notFound()

  const searchParams = await props.searchParams
  return (
    <AdminInterventionChantierFiche
      interventionId={id}
      chantierId={intervention.chantier_id}
      error={searchParams.error}
      ok={searchParams.ok}
    />
  )
}