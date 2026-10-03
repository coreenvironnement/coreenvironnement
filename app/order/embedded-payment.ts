"use server"

import type Stripe from "stripe"

import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import { prepareParticulierOrder } from "@/lib/order/prepare-particulier-order"
import { getStripe, isStripePaymentConfigured } from "@/lib/stripe/server"
import { createServiceClient } from "@/lib/supabase/service"

export type EmbeddedPaymentInput = OrderCheckoutInput & {
  existingCommandeId?: string
}

export type EmbeddedPaymentResult =
  | { error: string }
  | {
      clientSecret: string
      commandeId: string
      amountTtcCents: number
      alreadyPaid?: boolean
    }

const REUSABLE_PI_STATUSES = new Set<Stripe.PaymentIntent.Status>([
  "requires_payment_method",
  "requires_confirmation",
  "requires_action",
])

export async function initOrderEmbeddedPayment(
  input: EmbeddedPaymentInput
): Promise<EmbeddedPaymentResult> {
  if (!isStripePaymentConfigured()) {
    return { error: "Paiement en ligne temporairement indisponible. Contactez-nous par téléphone." }
  }

  const prepared = await prepareParticulierOrder(input)
  if ("error" in prepared) {
    return prepared
  }

  if (prepared.alreadyPaid) {
    return {
      clientSecret: "",
      commandeId: prepared.commandeId,
      amountTtcCents: prepared.amountTtcCents,
      alreadyPaid: true,
    }
  }

  let stripe
  try {
    stripe = getStripe()
  } catch (error) {
    console.error("Stripe client:", error)
    return { error: "Paiement en ligne temporairement indisponible. Contactez-nous par téléphone." }
  }

  const metadata = {
    commande_id: prepared.commandeId,
    order_type: "benne_particulier",
  }

  let intent: Stripe.PaymentIntent | null = null

  if (prepared.stripePaymentIntentId) {
    try {
      const existing = await stripe.paymentIntents.retrieve(prepared.stripePaymentIntentId)
      if (existing.status === "succeeded") {
        return {
          clientSecret: "",
          commandeId: prepared.commandeId,
          amountTtcCents: prepared.amountTtcCents,
          alreadyPaid: true,
        }
      }
      const cardOnly =
        existing.payment_method_types.length === 1 &&
        existing.payment_method_types[0] === "card" &&
        !existing.automatic_payment_methods?.enabled
      if (
        cardOnly &&
        REUSABLE_PI_STATUSES.has(existing.status) &&
        existing.amount === prepared.amountTtcCents
      ) {
        intent = existing
      }
    } catch (error) {
      console.error("Retrieve PaymentIntent:", error)
    }
  }

  if (!intent) {
    try {
      intent = await stripe.paymentIntents.create({
        amount: prepared.amountTtcCents,
        currency: "eur",
        receipt_email: prepared.email,
        payment_method_types: ["card"],
        metadata,
        description: prepared.prestation.label,
      })
    } catch (error) {
      console.error("Create PaymentIntent:", error)
      return { error: "Impossible d'initialiser le paiement. Réessayez." }
    }
  }

  if (!intent.client_secret) {
    return { error: "Impossible d'initialiser le paiement. Réessayez." }
  }

  const supabase = createServiceClient()
  const { error: updateError } = await supabase
    .from("commandes")
    .update({
      stripe_payment_intent_id: intent.id,
    })
    .eq("id", prepared.commandeId)

  if (updateError) {
    console.error("Update commande payment intent:", updateError)
  }

  return {
    clientSecret: intent.client_secret,
    commandeId: prepared.commandeId,
    amountTtcCents: prepared.amountTtcCents,
  }
}
