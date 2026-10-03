import type { SupabaseClient } from "@supabase/supabase-js"

import { claimCommandeEmail } from "@/lib/commande/email-claims"
import { formatOrderReference } from "@/lib/commande/reference"
import { notifyCommandeCancelled } from "@/lib/email/notifications"

export async function sendCommandeCancellationIfClaimed(
  supabase: SupabaseClient,
  commandeId: string,
  paymentStatusBefore: string
) {
  const claimed = await claimCommandeEmail(
    supabase,
    commandeId,
    "cancellation_email_sent_at"
  )
  if (!claimed?.contact_email) return

  await notifyCommandeCancelled({
    contactEmail: claimed.contact_email,
    contactNom: claimed.contact_nom,
    reference: formatOrderReference(claimed.id),
    prestationLabel: claimed.prestation_label,
    adresseComplete: claimed.adresse_complete,
    dateLivraison: claimed.date_livraison,
    mentionRemboursementPossible: paymentStatusBefore === "paid",
  })
}
