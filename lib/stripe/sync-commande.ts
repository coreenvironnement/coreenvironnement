import type { SupabaseClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

import { notifyCommandeConfirmed } from "@/lib/email/notifications"

export async function syncCommandeFromCheckoutSession(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
) {
  const commandeId = session.metadata?.commande_id
  if (!commandeId) return

  const paid = session.payment_status === "paid"

  const { data: before } = await supabase
    .from("commandes")
    .select(
      "payment_status, contact_email, contact_nom, prestation_label, adresse_complete, departement_code, date_livraison, date_enlevement, price_ht"
    )
    .eq("id", commandeId)
    .single()

  await supabase
    .from("commandes")
    .update({
      stripe_checkout_session_id: session.id,
      payment_status: paid ? "paid" : "pending",
      statut: paid ? "confirmee" : "brouillon",
    })
    .eq("id", commandeId)

  if (paid && before?.payment_status !== "paid" && before?.contact_email) {
    await notifyCommandeConfirmed({
      contactEmail: before.contact_email,
      contactNom: before.contact_nom,
      prestationLabel: before.prestation_label,
      adresseComplete: before.adresse_complete,
      departementCode: before.departement_code,
      dateLivraison: before.date_livraison,
      dateEnlevement: before.date_enlevement,
      priceHt: before.price_ht != null ? Number(before.price_ht) : null,
    })
  }
}
