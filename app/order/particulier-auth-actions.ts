"use server"

import {
  ensureParticulierClientForCommande,
  sendParticulierConfirmationForEmail,
} from "@/lib/auth/particulier-client"
import { createServiceClient, getSupabaseServiceConfigError } from "@/lib/supabase/service"

export async function resendParticulierEmailConfirmation(
  commandeId: string
): Promise<{ sent: boolean; error?: string }> {
  const id = commandeId.trim()
  if (!id) {
    return { sent: false, error: "Commande introuvable." }
  }

  if (getSupabaseServiceConfigError()) {
    return { sent: false, error: "Service indisponible." }
  }

  const supabase = createServiceClient()
  const { data: commande } = await supabase
    .from("commandes")
    .select("id, contact_email, payment_status, audience")
    .eq("id", id)
    .maybeSingle()

  if (!commande) {
    return { sent: false, error: "Commande introuvable." }
  }

  if (commande.audience && commande.audience !== "particulier") {
    return { sent: false, error: "Action non disponible pour cette commande." }
  }

  const paid =
    commande.payment_status === "paid" || commande.payment_status === "waived"
  if (!paid) {
    return { sent: false, error: "La commande n’est pas encore confirmée." }
  }

  const email =
    typeof commande.contact_email === "string" ? commande.contact_email.trim() : ""
  if (!email) {
    return { sent: false, error: "E-mail de contact manquant." }
  }

  await ensureParticulierClientForCommande(supabase, id, {
    sendConfirmationEmail: false,
  })

  return sendParticulierConfirmationForEmail(supabase, email)
}
