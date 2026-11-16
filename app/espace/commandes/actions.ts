"use server"

import { isResumableParticulierBrouillon } from "@/lib/espace/particulier-brouillon-shared"
import { mintDevisResumeHrefFromCommande } from "@/lib/order/mint-devis-resume-href"
import { createClient } from "@/lib/supabase/server"

export type CommandeSnapshotRow = {
  id: string
  statut: string
  payment_status: string | null
  prestation_label: string | null
  prestation_id: string | null
  volume_m3: number | null
  date_livraison: string | null
  livraison_planifiee_at: string | null
  date_creation: string
  adresse_complete: string | null
  audience: string | null
  devis_sent_at: string | null
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
      "id, statut, payment_status, prestation_label, prestation_id, volume_m3, date_livraison, livraison_planifiee_at, date_creation, adresse_complete, audience, devis_sent_at"
    )
    .eq("client_id", user.id)
    .order("date_creation", { ascending: false })

  return (data ?? []) as CommandeSnapshotRow[]
}

/** Lien vitrine `/?reprise=…` pour un brouillon particulier du client connecté. */
export async function getCommandeDevisResumeHref(
  commandeId: string
): Promise<string | null> {
  const id = commandeId.trim()
  if (!id) return null

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const [{ data: row }, { data: profile }] = await Promise.all([
    supabase
      .from("commandes")
      .select(
        "id, audience, statut, payment_status, prestation_id, date_livraison, date_enlevement, adresse_complete, departement_code, contact_email, contact_nom, contact_telephone, tunnel_resume_snapshot"
      )
      .eq("id", id)
      .eq("client_id", user.id)
      .maybeSingle(),
    supabase
      .from("profiles")
      .select("full_name, phone, email")
      .eq("id", user.id)
      .maybeSingle(),
  ])

  if (!row || !isResumableParticulierBrouillon(row)) return null

  return mintDevisResumeHrefFromCommande(
    {
      adresse_complete: row.adresse_complete,
      prestation_id: row.prestation_id,
      date_livraison: row.date_livraison,
      date_enlevement: row.date_enlevement,
      contact_nom: row.contact_nom,
      contact_telephone: row.contact_telephone,
      contact_email: row.contact_email,
      departement_code: row.departement_code,
      tunnel_resume_snapshot: row.tunnel_resume_snapshot,
    },
    {
      fallbackEmail: user.email ?? profile?.email,
      fallbackContactName: profile?.full_name,
      fallbackPhone: profile?.phone,
    }
  )
}
