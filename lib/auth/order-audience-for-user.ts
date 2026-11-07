import type { SupabaseClient } from "@supabase/supabase-js"

import type { OrderAudience } from "@/components/order/order-audience-toggle"

export type ResolvedOrderAudience = {
  /** Audience imposée si locked; null = l’utilisateur choisit (toggle). */
  audience: OrderAudience | null
  locked: boolean
}

export async function resolveOrderAudienceForUser(
  supabase: SupabaseClient,
  userId: string | null | undefined
): Promise<ResolvedOrderAudience> {
  if (!userId) {
    return { audience: null, locked: false }
  }

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("status")
    .eq("profile_id", userId)
    .maybeSingle()

  if (compte?.status === "approved") {
    return { audience: "professionnel", locked: true }
  }

  /** Connecté sans pro validé : défaut UI = particulier, choix explicite au checkout. */
  return { audience: null, locked: false }
}
