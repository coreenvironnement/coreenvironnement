import { NextResponse } from "next/server"
import type Stripe from "stripe"

import { createServiceClient } from "@/lib/supabase/service"
import { syncCommandeFromCheckoutSession } from "@/lib/stripe/sync-commande"
import { syncCompteProFromCheckoutSession, syncCompteProFromSubscription } from "@/lib/stripe/sync-compte-pro"
import { getStripe } from "@/lib/stripe/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 500 })
  }

  const stripe = getStripe()
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Signature manquante." }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 })
  }

  const supabase = createServiceClient()

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        if (session.mode === "subscription") {
          await syncCompteProFromCheckoutSession(supabase, session, stripe)
        } else if (session.mode === "payment" && session.metadata?.commande_id) {
          await syncCommandeFromCheckoutSession(supabase, session)
        }
        break
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription
        await syncCompteProFromSubscription(supabase, subscription)
        break
      }
      default:
        break
    }
  } catch (error) {
    console.error("Stripe webhook error:", error)
    return NextResponse.json({ error: "Traitement webhook échoué." }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
