import type { SupabaseClient } from "@supabase/supabase-js"

export const COMMANDE_EMAIL_CLAIM_COLUMNS = [
  "confirmation_email_sent_at",
  "admin_notify_sent_at",
  "cancellation_email_sent_at",
  "refund_email_sent_at",
] as const

export type CommandeEmailClaimColumn = (typeof COMMANDE_EMAIL_CLAIM_COLUMNS)[number]

export type ClaimedCommande = Record<string, unknown> & {
  id: string
  contact_email: string | null
  contact_nom: string | null
  contact_telephone?: string | null
  prestation_label: string | null
  adresse_complete: string
  departement_code?: string | null
  date_livraison: string | null
  date_enlevement: string | null
  price_ht: number | string | null
  payment_status: string
  statut: string
}

/**
 * UPDATE ... SET col = now() WHERE id = $1 AND col IS NULL RETURNING *
 * 0 ligne → ne pas envoyer l'e-mail.
 */
export async function claimCommandeEmail(
  supabase: SupabaseClient,
  commandeId: string,
  column: CommandeEmailClaimColumn
): Promise<ClaimedCommande | null> {
  const { data, error } = await supabase
    .from("commandes")
    .update({ [column]: new Date().toISOString() })
    .eq("id", commandeId)
    .is(column, null)
    .select("*")
    .maybeSingle()

  if (error || !data) return null
  return data as ClaimedCommande
}
