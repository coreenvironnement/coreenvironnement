"use server"

import { createClient } from "@/lib/supabase/server"

export type CommandeSnapshotRow = {
  id: string
  statut: string
  payment_status: string | null
  prestation_label: string | null
  prestation_id: string | null
  volume_m3: number | null
  date_livraison: string | null
  date_creation: string
  adresse_complete: string | null
  audience: string | null
}

export async function getMyCommandesSnapshot(): Promise<CommandeSnapshotRow[]> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return []

  const { data } = await supabase
    .from("commandes")
    .select(
      "id, statut, payment_status, prestation_label, prestation_id, volume_m3, date_livraison, date_creation, adresse_complete, audience"
    )
    .eq("client_id", user.id)
    .order("date_creation", { ascending: false })

  return (data ?? []) as CommandeSnapshotRow[]
}
