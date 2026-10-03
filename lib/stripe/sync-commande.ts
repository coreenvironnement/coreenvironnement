import type { SupabaseClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

import { notifyCommandeConfirmed } from "@/lib/email/notifications"

async function confirmCommandeIfNeeded(
  supabase: SupabaseClient,
  commandeId: string,
  extraUpdate: Record<string, string>
) {
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
      ...extraUpdate,
      payment_status: "paid",
      statut: "confirmee",
    })
    .eq("id", commandeId)

  if (before?.payment_status !== "paid" && before?.contact_email) {
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

export async function syncCommandeFromCheckoutSession(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session
) {
  const commandeId = session.metadata?.commande_id
  if (!commandeId) return

  const paid = session.payment_status === "paid"
  if (!paid) {
    await supabase
      .from("commandes")
      .update({
        stripe_checkout_session_id: session.id,
        payment_status: "pending",
        statut: "brouillon",
      })
      .eq("id", commandeId)
    return
  }

  await confirmCommandeIfNeeded(supabase, commandeId, {
    stripe_checkout_session_id: session.id,
  })
}

export async function syncCommandeFromPaymentIntent(
  supabase: SupabaseClient,
  intent: Stripe.PaymentIntent
) {
  if (intent.metadata?.order_type !== "benne_particulier") return
  const commandeId = intent.metadata?.commande_id
  if (!commandeId) return
  if (intent.status !== "succeeded") return

  await confirmCommandeIfNeeded(supabase, commandeId, {
    stripe_payment_intent_id: intent.id,
  })
}
