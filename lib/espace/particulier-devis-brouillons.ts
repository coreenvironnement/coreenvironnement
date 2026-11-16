import type { SupabaseClient } from "@supabase/supabase-js"

import {
  commandeDevisPdfHref,
  isResumableParticulierBrouillon,
} from "@/lib/espace/particulier-brouillon-shared"
import { mintDevisResumeHrefFromCommande } from "@/lib/order/mint-devis-resume-href"
import type { CommandeResumeEnrich } from "@/lib/order/resume-from-commande-row"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import {
  createServiceClient,
  getSupabaseServiceConfigError,
} from "@/lib/supabase/service"

export { commandeDevisPdfHref, isResumableParticulierBrouillon }

export type ParticulierDevisBrouillonCard = {
  id: string
  prestation_label: string | null
  priceTtc: number | null
  date_livraison: string | null
  devis_sent_at: string | null
  resumeHref: string | null
  devisPdfHref: string | null
}

const BROUILLON_SELECT =
  "id, statut, payment_status, audience, prestation_id, prestation_label, price_ht, date_livraison, date_enlevement, adresse_complete, departement_code, contact_email, contact_nom, contact_telephone, devis_sent_at, tunnel_resume_snapshot"

/** Rattache les brouillons orphelins (e-mail devis avant connexion) au compte connecté. */
export async function linkOrphanParticulierBrouillons(
  userId: string,
  email: string | undefined
): Promise<void> {
  const normalized = email?.trim().toLowerCase() ?? ""
  if (!normalized || getSupabaseServiceConfigError()) return

  const service = createServiceClient()
  const { error } = await service
    .from("commandes")
    .update({ client_id: userId })
    .eq("audience", "particulier")
    .eq("statut", "brouillon")
    .eq("payment_status", "pending")
    .is("client_id", null)
    .ilike("contact_email", normalized)

  if (error) {
    console.error("[particulier-devis-brouillons] link client_id:", error.message)
  }
}

export async function loadParticulierDevisBrouillonCards(
  supabase: SupabaseClient,
  userId: string,
  enrich?: CommandeResumeEnrich
): Promise<ParticulierDevisBrouillonCard[]> {
  const { data, error } = await supabase
    .from("commandes")
    .select(BROUILLON_SELECT)
    .eq("client_id", userId)
    .eq("audience", "particulier")
    .eq("statut", "brouillon")
    .eq("payment_status", "pending")
    .order("date_creation", { ascending: false })

  if (error) {
    console.error("[particulier-devis-brouillons] select:", error.message)
    return []
  }

  const rows = data ?? []
  const cards: ParticulierDevisBrouillonCard[] = []

  for (const row of rows) {
    const priceHt =
      row.price_ht != null && !Number.isNaN(Number(row.price_ht))
        ? Number(row.price_ht)
        : null
    const resumeHref = await mintDevisResumeHrefFromCommande(
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
      enrich
    )

    cards.push({
      id: row.id,
      prestation_label: row.prestation_label,
      priceTtc: priceHt != null ? priceBreakdownFromHt(priceHt).ttc : null,
      date_livraison: row.date_livraison,
      devis_sent_at: row.devis_sent_at,
      resumeHref,
      devisPdfHref: row.devis_sent_at ? commandeDevisPdfHref(row.id) : null,
    })
  }

  return cards
}