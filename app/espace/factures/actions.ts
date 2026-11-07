"use server"

import { createClient } from "@/lib/supabase/server"
import { getStripe, isStripeConfigured } from "@/lib/stripe/server"

export async function getCommandeReceiptUrl(
  commandeId: string
): Promise<{ url: string } | { error: string }> {
  if (!isStripeConfigured()) {
    return { error: "Reçu en ligne indisponible pour le moment." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Connexion requise." }
  }

  const { data: commande } = await supabase
    .from("commandes")
    .select("id, client_id, payment_status, stripe_payment_intent_id")
    .eq("id", commandeId)
    .maybeSingle()

  if (!commande || commande.client_id !== user.id) {
    return { error: "Commande introuvable." }
  }

  if (commande.payment_status !== "paid") {
    return { error: "Aucun reçu pour cette commande." }
  }

  const piId = commande.stripe_payment_intent_id
  if (!piId) {
    return { error: "Reçu Stripe non disponible pour cette commande." }
  }

  try {
    const stripe = getStripe()
    const pi = await stripe.paymentIntents.retrieve(piId, {
      expand: ["latest_charge"],
    })
    const charge = pi.latest_charge
    if (typeof charge === "object" && charge?.receipt_url) {
      return { url: charge.receipt_url }
    }
    return { error: "Reçu Stripe introuvable." }
  } catch {
    return { error: "Impossible de récupérer le reçu." }
  }
}
