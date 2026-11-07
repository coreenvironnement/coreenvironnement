import type { SupabaseClient } from "@supabase/supabase-js"

import { getStripe, isStripeConfigured } from "@/lib/stripe/server"

export type CompteProSeatRow = {
  id: string
  compte_pro_id: string
  profile_id: string | null
  invited_email: string
  status: string
  created_at: string
}

/** Quantité Stripe : titulaire (1) + sièges actifs. */
export async function countActiveSeats(
  supabase: SupabaseClient,
  compteProId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("compte_pro_seats")
    .select("id", { count: "exact", head: true })
    .eq("compte_pro_id", compteProId)
    .eq("status", "active")

  if (error) return 0
  return count ?? 0
}

export async function subscriptionQuantityForCompte(
  supabase: SupabaseClient,
  compteProId: string
): Promise<number> {
  const active = await countActiveSeats(supabase, compteProId)
  return 1 + active
}

export async function syncSubscriptionSeatsQuantity(
  supabase: SupabaseClient,
  compteProId: string
): Promise<{ error?: string }> {
  if (!isStripeConfigured()) return {}

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("stripe_subscription_id, subscription_active")
    .eq("id", compteProId)
    .maybeSingle()

  if (!compte?.subscription_active || !compte.stripe_subscription_id) {
    return {}
  }

  const quantity = await subscriptionQuantityForCompte(supabase, compteProId)

  try {
    const stripe = getStripe()
    const sub = await stripe.subscriptions.retrieve(compte.stripe_subscription_id)
    const item = sub.items.data[0]
    if (!item?.id) {
      return { error: "Abonnement Stripe sans ligne tarifaire." }
    }
    await stripe.subscriptions.update(compte.stripe_subscription_id, {
      items: [{ id: item.id, quantity }],
      proration_behavior: "create_prorations",
    })
  } catch {
    return { error: "Échec de mise à jour de la quantité d'abonnement." }
  }

  return {}
}
