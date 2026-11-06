import type { SupabaseClient } from "@supabase/supabase-js"
import { redirect } from "next/navigation"

export type CompteProDashboardGate = {
  /** L’utilisateur a une ligne comptes_pro liée à son profil. */
  hasComptePro: boolean
}

const REASON_PARAM = "reason" as const

/**
 * Si l’utilisateur est rattaché à un chantier, l’accès à l’espace client pro exige
 * un compte pro approuvé et un abonnement actif. Sinon redirection vers /pro.
 */
export async function assertProDashboardAccess(
  supabase: SupabaseClient,
  userId: string,
  hasChantierMembership: boolean
): Promise<CompteProDashboardGate> {
  if (!hasChantierMembership) {
    return { hasComptePro: false }
  }

  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("id, status, subscription_active")
    .eq("profile_id", userId)
    .maybeSingle()

  if (!compte) {
    return { hasComptePro: false }
  }

  if (compte.status !== "approved" || !compte.subscription_active) {
    redirect(`/pro?${REASON_PARAM}=dashboard_subscription`)
  }

  return { hasComptePro: true }
}
