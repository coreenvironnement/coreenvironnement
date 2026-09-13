import type { SupabaseClient } from "@supabase/supabase-js"
import type Stripe from "stripe"

function subscriptionPeriodEndIso(subscription: Stripe.Subscription): string | null {
  const subscriptionWithPeriod = subscription as Stripe.Subscription & {
    current_period_end?: number
  }

  if (typeof subscriptionWithPeriod.current_period_end === "number") {
    return new Date(subscriptionWithPeriod.current_period_end * 1000).toISOString()
  }

  const firstItem = subscription.items.data[0] as { current_period_end?: number } | undefined
  if (typeof firstItem?.current_period_end === "number") {
    return new Date(firstItem.current_period_end * 1000).toISOString()
  }

  return null
}

export async function syncCompteProFromSubscription(
  supabase: SupabaseClient,
  subscription: Stripe.Subscription
) {
  const compteProId = subscription.metadata.compte_pro_id
  const customerId =
    typeof subscription.customer === "string"
      ? subscription.customer
      : subscription.customer.id

  const active = subscription.status === "active" || subscription.status === "trialing"

  const payload = {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    subscription_status: subscription.status,
    subscription_active: active,
    subscription_current_period_end: subscriptionPeriodEndIso(subscription),
    updated_at: new Date().toISOString(),
  }

  if (compteProId) {
    await supabase.from("comptes_pro").update(payload).eq("id", compteProId)
    return
  }

  await supabase.from("comptes_pro").update(payload).eq("stripe_customer_id", customerId)
}

export async function syncCompteProFromCheckoutSession(
  supabase: SupabaseClient,
  session: Stripe.Checkout.Session,
  stripe: Stripe
) {
  const compteProId = session.metadata?.compte_pro_id
  const customerId =
    typeof session.customer === "string" ? session.customer : session.customer?.id

  if (!customerId) return

  const baseUpdate = {
    stripe_customer_id: customerId,
    updated_at: new Date().toISOString(),
  }

  if (compteProId) {
    await supabase.from("comptes_pro").update(baseUpdate).eq("id", compteProId)
  } else {
    await supabase.from("comptes_pro").update(baseUpdate).eq("stripe_customer_id", customerId)
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id

  if (!subscriptionId) return

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)
  await syncCompteProFromSubscription(supabase, subscription)
}
