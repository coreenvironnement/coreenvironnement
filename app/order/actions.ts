"use server"

import { headers } from "next/headers"

import {
  dechetCodeForFamily,
  priceTtcFromHt,
} from "@/lib/order/prestation-mapping"
import {
  departementLabel,
  extractDepartementFromAddress,
  isAddressInIdf,
  isDepartementInIdf,
  isPostcodeInIdf,
} from "@/lib/geo/idf"
import { prestationById } from "@/lib/prestations"
import {
  getRequestOrigin,
  getStripe,
  isStripePaymentConfigured,
  stripeCheckoutPaymentOptions,
} from "@/lib/stripe/server"
import { createServiceClient } from "@/lib/supabase/service"

export type OrderCheckoutInput = {
  audience: "particulier" | "professionnel"
  address: string
  lat: number
  lng: number
  addressLabel: string
  postcode?: string
  departementCode?: string
  prestationId: string
  deliveryDate: string
  pickupDate?: string
  contactEmail: string
  contactName?: string
}

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

export async function startOrderCheckout(
  input: OrderCheckoutInput
): Promise<OrderCheckoutResult> {
  if (input.audience === "professionnel") {
    return {
      error:
        "Les professionnels validés commandent sur facture depuis leur espace client. Créez votre compte pro sur /pro.",
    }
  }

  if (!isStripePaymentConfigured()) {
    return { error: "Paiement en ligne temporairement indisponible. Contactez-nous par téléphone." }
  }

  const address = input.address.trim()
  if (!address.length) {
    return { error: "Indiquez l'adresse de livraison." }
  }

  const postcode = input.postcode?.trim() ?? ""
  const departementFromInput = input.departementCode?.trim() ?? ""

  const idfFromPostcode = postcode.length > 0 && isPostcodeInIdf(postcode)
  const idfFromDept =
    departementFromInput.length > 0 && isDepartementInIdf(departementFromInput)
  const idfFromAddress = isAddressInIdf(address)

  if (!idfFromPostcode && !idfFromDept && !idfFromAddress) {
    return {
      error:
        "Adresse hors Île-de-France. Nous intervenons sur les 8 départements IDF (75, 77, 78, 91, 92, 93, 94, 95).",
    }
  }

  const prestation = prestationById(input.prestationId)
  if (!prestation) {
    return { error: "Forfait sélectionné introuvable." }
  }

  if (!input.deliveryDate.length) {
    return { error: "Indiquez une date de livraison souhaitée." }
  }

  const email = input.contactEmail.trim()
  if (!email.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Indiquez une adresse e-mail valide pour la confirmation." }
  }

  const deptCode =
    (idfFromDept ? departementFromInput : null) ??
    (idfFromPostcode ? postcode.slice(0, 2) : null) ??
    extractDepartementFromAddress(address)
  if (!deptCode || !isDepartementInIdf(deptCode)) {
    return { error: "Code postal IDF introuvable dans l'adresse." }
  }

  let supabase
  try {
    supabase = createServiceClient()
  } catch (error) {
    console.error("Supabase service client:", error)
    return { error: "Service temporairement indisponible. Réessayez plus tard." }
  }

  const dechetCode = dechetCodeForFamily(prestation.family)
  const { data: dechetType, error: dechetError } = await supabase
    .from("dechets_types")
    .select("id")
    .eq("code", dechetCode)
    .maybeSingle()

  if (dechetError || !dechetType) {
    return { error: "Type de déchet indisponible. Réessayez plus tard." }
  }

  const { data: commande, error: insertError } = await supabase
    .from("commandes")
    .insert({
      adresse_complete: address,
      type_dechet_id: dechetType.id,
      statut: "brouillon",
      payment_status: "pending",
      audience: input.audience,
      prestation_id: prestation.id,
      prestation_label: prestation.label,
      volume_m3: prestation.volumeM3,
      price_ht: prestation.priceHt,
      date_livraison: input.deliveryDate,
      date_enlevement: input.pickupDate?.length ? input.pickupDate : null,
      departement_code: deptCode,
      contact_email: email,
      contact_nom: input.contactName?.trim() || null,
    })
    .select("id")
    .single()

  if (insertError || !commande) {
    console.error("Insert commande:", insertError)
    return { error: "Impossible d'enregistrer la commande. Réessayez." }
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
  const amountTtc = priceTtcFromHt(prestation.priceHt)
  const deptLabel = departementLabel(deptCode)

  let session
  try {
    session = await stripe.checkout.sessions.create({
      mode: "payment",
      ...stripeCheckoutPaymentOptions(),
      customer_email: email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "eur",
            unit_amount: amountTtc,
            product_data: {
              name: prestation.label,
              description: `Livraison ${input.deliveryDate} · ${deptLabel ?? deptCode} · ${input.addressLabel}`.slice(
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
        commande_id: commande.id,
        order_type: "benne_particulier",
      },
    })
  } catch (error) {
    console.error("Stripe checkout session:", error)
    return { error: stripeCheckoutErrorMessage(error) }
  }

  const { error: updateError } = await supabase
    .from("commandes")
    .update({
      stripe_checkout_session_id: session.id,
    })
    .eq("id", commande.id)

  if (updateError) {
    console.error("Update commande stripe session:", updateError)
  }

  if (!session.url) {
    return { error: "Impossible d'ouvrir la page de paiement Stripe." }
  }

  return { checkoutUrl: session.url }
}
