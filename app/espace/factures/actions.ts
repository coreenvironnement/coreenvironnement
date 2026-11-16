"use server"

import {
  formatInvoiceAvailableHint,
  isInvoiceAvailable,
} from "@/lib/invoice/commande-invoice"
import { ensureCommandeInvoicePdf } from "@/lib/invoice/generate-commande-invoice"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
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

const INVOICE_BUCKET = "commande-documents"

export async function getCommandeInvoiceUrl(
  commandeId: string
): Promise<
  | { url: string }
  | { error: string }
  | { pending: true; availableAtLabel: string | null }
> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Connexion requise." }
  }

  const { data: commande } = await supabase
    .from("commandes")
    .select(
      "id, client_id, statut, livree_at, invoice_storage_path, audience, payment_status"
    )
    .eq("id", commandeId)
    .maybeSingle()

  if (!commande || commande.client_id !== user.id) {
    return { error: "Commande introuvable." }
  }

  if (commande.statut !== "livree" || !commande.livree_at) {
    return { error: "La facture sera disponible après livraison de la benne." }
  }

  if (!isInvoiceAvailable(commande.livree_at)) {
    return {
      pending: true,
      availableAtLabel: formatInvoiceAvailableHint(commande.livree_at),
    }
  }

  let path = commande.invoice_storage_path
  if (!path) {
    const service = createServiceClient()
    const ensured = await ensureCommandeInvoicePdf(service, commandeId)
    if ("error" in ensured) {
      return { error: ensured.error }
    }
    path = ensured.path
  }

  const { data: signed, error: signError } = await supabase.storage
    .from(INVOICE_BUCKET)
    .createSignedUrl(path, 120)

  if (signError || !signed?.signedUrl) {
    const service = createServiceClient()
    const { data: adminSigned, error: adminErr } = await service.storage
      .from(INVOICE_BUCKET)
      .createSignedUrl(path, 120)
    if (adminErr || !adminSigned?.signedUrl) {
      return { error: "Impossible d'ouvrir la facture." }
    }
    return { url: adminSigned.signedUrl }
  }

  return { url: signed.signedUrl }
}
