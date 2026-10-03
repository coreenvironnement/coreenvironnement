import type { SupabaseClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

import { claimCommandeEmail } from "@/lib/commande/email-claims"
import { formatOrderReference } from "@/lib/commande/reference"
import {
  notifyCommandeAdminNewOrder,
  notifyCommandeConfirmed,
  notifyCommandeRefunded,
} from "@/lib/email/notifications"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"

function numberOrNull(value: unknown): number | null {
  if (value == null) return null
  const n = Number(value)
  return Number.isFinite(n) ? n : null
}

async function sendConfirmationEmailsIfClaimed(
  supabase: SupabaseClient,
  commandeId: string
) {
  const claimedConfirm = await claimCommandeEmail(
    supabase,
    commandeId,
    "confirmation_email_sent_at"
  )
  if (claimedConfirm?.contact_email) {
    const priceHt = numberOrNull(claimedConfirm.price_ht)
    await notifyCommandeConfirmed({
      contactEmail: claimedConfirm.contact_email,
      contactNom: claimedConfirm.contact_nom,
      prestationLabel: claimedConfirm.prestation_label,
      adresseComplete: claimedConfirm.adresse_complete,
      departementCode:
        typeof claimedConfirm.departement_code === "string"
          ? claimedConfirm.departement_code
          : null,
      dateLivraison: claimedConfirm.date_livraison,
      dateEnlevement: claimedConfirm.date_enlevement,
      priceHt,
      reference: formatOrderReference(claimedConfirm.id),
    })
  }

  const claimedAdmin = await claimCommandeEmail(
    supabase,
    commandeId,
    "admin_notify_sent_at"
  )
  if (claimedAdmin) {
    await notifyCommandeAdminNewOrder({
      commandeId: claimedAdmin.id,
      reference: formatOrderReference(claimedAdmin.id),
      contactNom: claimedAdmin.contact_nom,
      contactEmail: claimedAdmin.contact_email,
      contactTelephone:
        typeof claimedAdmin.contact_telephone === "string"
          ? claimedAdmin.contact_telephone
          : null,
      prestationLabel: claimedAdmin.prestation_label,
      adresseComplete: claimedAdmin.adresse_complete,
      dateLivraison: claimedAdmin.date_livraison,
      dateEnlevement: claimedAdmin.date_enlevement,
      priceHt: numberOrNull(claimedAdmin.price_ht),
    })
  }
}

async function confirmCommandeIfNeeded(
  supabase: SupabaseClient,
  commandeId: string,
  extraUpdate: Record<string, string>
) {
  const { error } = await supabase
    .from("commandes")
    .update({
      ...extraUpdate,
      payment_status: "paid",
      statut: "confirmee",
    })
    .eq("id", commandeId)

  if (error) {
    console.error("confirmCommandeIfNeeded update:", error)
    return
  }

  await sendConfirmationEmailsIfClaimed(supabase, commandeId)
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

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id

  await confirmCommandeIfNeeded(supabase, commandeId, {
    stripe_checkout_session_id: session.id,
    ...(paymentIntentId ? { stripe_payment_intent_id: paymentIntentId } : {}),
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

export type CommandeRefundSyncInput = {
  paymentIntentId: string | null
  refundId?: string | null
  outcome: "succeeded" | "pending" | "failed"
  isFullRefund?: boolean
}

export async function syncCommandeFromRefund(
  supabase: SupabaseClient,
  input: CommandeRefundSyncInput
) {
  if (!input.paymentIntentId) return

  const { data: commande } = await supabase
    .from("commandes")
    .select(
      "id, contact_email, contact_nom, prestation_label, adresse_complete, date_livraison, price_ht, payment_status, stripe_refund_id"
    )
    .eq("stripe_payment_intent_id", input.paymentIntentId)
    .maybeSingle()

  if (!commande) return
  if (commande.payment_status === "refunded") return

  if (input.outcome === "failed") {
    await supabase
      .from("commandes")
      .update({ payment_status: "refund_failed" })
      .eq("id", commande.id)
    return
  }

  const treatAsFullSuccess = input.outcome === "succeeded" && input.isFullRefund !== false

  if (!treatAsFullSuccess) {
    await supabase
      .from("commandes")
      .update({
        payment_status: "refund_pending",
        statut: "annulee",
        ...(input.refundId ? { stripe_refund_id: input.refundId } : {}),
      })
      .eq("id", commande.id)
    return
  }

  await supabase
    .from("commandes")
    .update({
      payment_status: "refunded",
      statut: "annulee",
      stripe_refund_id: input.refundId ?? commande.stripe_refund_id,
      refunded_at: new Date().toISOString(),
    })
    .eq("id", commande.id)

  const claimed = await claimCommandeEmail(supabase, commande.id, "refund_email_sent_at")
  if (!claimed?.contact_email) return

  const priceHt = numberOrNull(claimed.price_ht)
  const montantTtc = priceHt != null ? priceBreakdownFromHt(priceHt).ttc : 0

  await notifyCommandeRefunded({
    contactEmail: claimed.contact_email,
    contactNom: claimed.contact_nom,
    reference: formatOrderReference(claimed.id),
    montantTtc,
  })
}
