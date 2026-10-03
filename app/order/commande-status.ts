"use server"

import { createServiceClient, getSupabaseServiceConfigError } from "@/lib/supabase/service"

export type CommandePaymentStatus = {
  paid: boolean
  paymentStatus: string | null
  statut: string | null
  numero: string | null
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
      .select("id, payment_status, statut")
      .eq("id", id)
      .maybeSingle()

    if (error || !data) {
      return { error: "Statut indisponible." }
    }

    const paymentStatus = typeof data.payment_status === "string" ? data.payment_status : null
    const statut = typeof data.statut === "string" ? data.statut : null

    return {
      paid: paymentStatus === "paid" || paymentStatus === "waived",
      paymentStatus,
      statut,
      numero: null,
    }
  } catch {
    return { error: "Statut indisponible." }
  }
}
