"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { ABONNEMENT_PRO_HT } from "@/lib/cdc/referentiels"
import { createClient } from "@/lib/supabase/server"
import {
  getAppOrigin,
  getProMonthlyPriceId,
  getStripe,
  isStripeConfigured,
  stripeCheckoutPaymentOptions,
} from "@/lib/stripe/server"

export async function startProSubscription(): Promise<{ error: string } | never> {
  if (!isStripeConfigured()) {
    return {
      error: `Abonnement ${ABONNEMENT_PRO_HT} € HT / mois : paiement Stripe en cours de configuration.`,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Connectez-vous pour activer l'abonnement." }
  }

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("id, status, stripe_customer_id, contact_email, raison_sociale, subscription_active")
    .eq("profile_id", user.id)
    .maybeSingle()

  if (!compte || compte.status !== "approved") {
    return { error: "Votre dossier compte pro doit être validé avant l'abonnement." }
  }

  if (compte.subscription_active) {
    return { error: "Votre abonnement est déjà actif." }
  }

  const stripe = getStripe()
  const headersList = await headers()
  const origin = getAppOrigin(headersList.get("origin"))

  let customerId = compte.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: compte.contact_email,
      name: compte.raison_sociale,
      metadata: {
        compte_pro_id: compte.id,
        profile_id: user.id,
      },
    })
    customerId = customer.id

    await supabase
      .from("comptes_pro")
      .update({
        stripe_customer_id: customerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", compte.id)
  }

  const priceId = await getProMonthlyPriceId(stripe)

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    ...stripeCheckoutPaymentOptions(),
    customer: customerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${origin}/pro?subscription=success`,
    cancel_url: `${origin}/pro?subscription=cancelled`,
    metadata: {
      compte_pro_id: compte.id,
      profile_id: user.id,
    },
    subscription_data: {
      metadata: {
        compte_pro_id: compte.id,
        profile_id: user.id,
      },
    },
  })

  if (!session.url) {
    return { error: "Impossible d'ouvrir la page de paiement Stripe." }
  }

  redirect(session.url)
}

export async function openBillingPortal(): Promise<{ error: string } | never> {
  if (!isStripeConfigured()) {
    return { error: "Portail de facturation indisponible." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Connectez-vous pour gérer votre abonnement." }
  }

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("stripe_customer_id")
    .eq("profile_id", user.id)
    .maybeSingle()

  if (!compte?.stripe_customer_id) {
    return { error: "Aucun abonnement Stripe associé à votre compte." }
  }

  const stripe = getStripe()
  const headersList = await headers()
  const origin = getAppOrigin(headersList.get("origin"))

  const session = await stripe.billingPortal.sessions.create({
    customer: compte.stripe_customer_id,
    return_url: `${origin}/pro`,
  })

  redirect(session.url)
}
