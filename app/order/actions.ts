"use server"

import { headers } from "next/headers"

import { priceTtcFromHt } from "@/lib/order/prestation-mapping"
import { prepareParticulierOrder } from "@/lib/order/prepare-particulier-order"
import { departementLabel } from "@/lib/geo/idf"
import {
  getRequestOrigin,
  getStripe,
  isStripePaymentConfigured,
  stripeCheckoutPaymentOptions,
} from "@/lib/stripe/server"
import {
  authUserIdForProContactEmail,
  ensureProClientForCommande,
} from "@/lib/auth/pro-client"
import { createProCommandeFromRequest } from "@/lib/order/create-pro-commande"
import { createServiceClient } from "@/lib/supabase/service"
import { createClient } from "@/lib/supabase/server"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import {
  notifyDemandeProAdmin,
  notifyDemandeProClient,
} from "@/lib/email/notifications"
import {
  prepareProfessionalBenneRequest,
  type ProfessionalBenneRequestInput,
} from "@/lib/order/pro-request"

export type OrderCheckoutResult =
  | { error: string }
  | { checkoutUrl: string }

function stripeCheckoutErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    const message = String((error as { message: unknown }).message)
    if (message.includes("Invalid URL")) {
      return "Configuration du paiement incorrecte. Contactez-nous par téléphone."
    }
  }

  return "Impossible d'initialiser le paiement Stripe. Réessayez ou contactez-nous."
}

/** Fallback Checkout particulier — conservé, non exposé dans l’UI étape 5. */
export async function startOrderCheckout(
  input: OrderCheckoutInput
): Promise<OrderCheckoutResult> {
  if (!isStripePaymentConfigured()) {
    return { error: "Paiement en ligne temporairement indisponible. Contactez-nous par téléphone." }
  }

  const prepared = await prepareParticulierOrder(input)
  if ("error" in prepared) {
    return prepared
  }

  if (prepared.alreadyPaid) {
    return { error: "Cette commande est déjà payée." }
  }

  let stripe
  try {
    stripe = getStripe()
  } catch (error) {
    console.error("Stripe client:", error)
    return { error: "Paiement en ligne temporairement indisponible. Contactez-nous par téléphone." }
  }

  const headersList = await headers()
  const origin = getRequestOrigin(headersList)
  const amountTtc = priceTtcFromHt(prepared.prestation.priceHt)
  const deptLabel = departementLabel(prepared.deptCode)

  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...stripeCheckoutPaymentOptions(),
      customer_email: prepared.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountTtc,
            product_data: {
              name: prepared.prestation.label,
              description: `Livraison ${input.deliveryDate}, ${deptLabel ?? prepared.deptCode}, ${input.addressLabel}`.slice(
                0,
                500
              ),
            },
          },
        },
      ],
      success_url: `${origin}/?order=success`,
      cancel_url: `${origin}/?order=cancelled`,
      metadata: {
        commande_id: prepared.commandeId,
        order_type: "benne_particulier",
      },
    })
  } catch (error) {
    console.error("Stripe checkout session:", error)
    return { error: stripeCheckoutErrorMessage(error) }
  }

  const supabase = createServiceClient()
  const { error: updateError } = await supabase
    .from("commandes")
    .update({
      stripe_checkout_session_id: session.id,
    })
    .eq("id", prepared.commandeId)

  if (updateError) {
    console.error("Update commande stripe session:", updateError)
  }

  if (!session.url) {
    return { error: "Impossible d'ouvrir la page de paiement Stripe." }
  }

  return { checkoutUrl: session.url }
}

export async function submitProfessionalBenneRequest(
  input: ProfessionalBenneRequestInput
): Promise<
  | { error: string }
  | { success: true; reference: string; clientEmailSent: boolean }
> {
  const prepared = await prepareProfessionalBenneRequest(input)
  if ("error" in prepared) {
    return prepared
  }

  const authSupabase = await createClient()
  const {
    data: { user: authUser },
  } = await authSupabase.auth.getUser()
  const linkedClientId = authUserIdForProContactEmail(authUser, prepared.contactEmail)

  if (authUser) {
    const { data: compte } = await authSupabase
      .from("comptes_pro")
      .select("status, payment_mode")
      .eq("profile_id", authUser.id)
      .maybeSingle()

    if (compte) {
      if (compte.status !== "approved") {
        return {
          error:
            "Votre compte professionnel n’est pas encore validé. Vous recevrez un accès complet après validation.",
        }
      }
      if (compte.payment_mode === "cb_required") {
        return {
          error:
            "Votre entreprise est en paiement par carte : utilisez l’étape paiement du tunnel (connecté) pour finaliser la commande.",
        }
      }
      if (compte.payment_mode !== "invoice") {
        return {
          error:
            "Mode de paiement non défini pour votre compte. Contactez CORE Environnement ou complétez votre dossier sur /pro.",
        }
      }
    }
  }

  const created = await createProCommandeFromRequest(input, prepared, {
    clientId: linkedClientId,
  })
  if ("error" in created) {
    return created
  }

  const serviceSupabase = createServiceClient()
  await ensureProClientForCommande(serviceSupabase, created.commandeId, {
    sendConfirmationEmail: "initial",
  })

  const preparedWithCommande = {
    ...prepared,
    commandeId: created.commandeId,
  }

  const admin = await notifyDemandeProAdmin(preparedWithCommande)
  if (!admin.sent) {
    return {
      error:
        admin.error === "Email non configuré."
          ? "L'envoi d'e-mail n'est pas configuré sur cet environnement."
          : "Impossible d'envoyer la demande pour le moment. Réessayez ou appelez-nous.",
    }
  }

  const client = await notifyDemandeProClient(preparedWithCommande)
  return {
    success: true,
    reference: prepared.reference,
    clientEmailSent: client.sent,
  }
}
