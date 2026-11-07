"use server"

import { ensureParticulierClientForCommande } from "@/lib/auth/particulier-client"
import { createServiceClient, getSupabaseServiceConfigError } from "@/lib/supabase/service"

export type CommandePaymentStatus = {
  paid: boolean
  paymentStatus: string | null
  statut: string | null
  numero: string | null
  emailConfirmed: boolean
  needsPasswordSetup: boolean
  passwordSetupEmailSent: boolean
  contactEmail: string | null
}

export async function getCommandePaymentStatus(
  commandeId: string
): Promise<CommandePaymentStatus | { error: string }> {
  const id = commandeId.trim()
  if (!id) {
    return { error: "Commande introuvable." }
  }

  if (getSupabaseServiceConfigError()) {
    return { error: "Statut indisponible." }
  }

  try {
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("commandes")
      .select("id, payment_status, statut, contact_email")
      .eq("id", id)
      .maybeSingle()

    if (error || !data) {
      return { error: "Statut indisponible." }
    }

    const paymentStatus = typeof data.payment_status === "string" ? data.payment_status : null
    const statut = typeof data.statut === "string" ? data.statut : null
    const paid = paymentStatus === "paid" || paymentStatus === "waived"
    const contactEmail =
      typeof data.contact_email === "string" ? data.contact_email.trim() : null

    let emailConfirmed = false
    let needsPasswordSetup = false
    let passwordSetupEmailSent = false

    if (paid) {
      const link = await ensureParticulierClientForCommande(supabase, id)
      emailConfirmed = link?.emailConfirmed ?? false
      needsPasswordSetup = link?.needsPasswordSetup ?? false
      passwordSetupEmailSent = link?.passwordSetupEmailSent ?? false
    }

    return {
      paid,
      paymentStatus,
      statut,
      numero: null,
      emailConfirmed,
      needsPasswordSetup,
      passwordSetupEmailSent,
      contactEmail,
    }
  } catch {
    return { error: "Statut indisponible." }
  }
}
