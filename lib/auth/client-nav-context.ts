import type { SupabaseClient } from "@supabase/supabase-js"

export type ClientNavContext =
  | { isLoggedIn: false }
  | {
      isLoggedIn: true
      hasComptePro: boolean
      hasChantier: boolean
      canAccessDashboard: boolean
      canViewDocuments: boolean
      subscriptionActive: boolean
      compteApproved: boolean
    }

export async function evaluateDashboardAccess(
  supabase: SupabaseClient,
  userId: string
): Promise<{ ok: true } | { ok: false; redirectTo: string }> {
  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("status, subscription_active")
    .eq("profile_id", userId)
    .maybeSingle()

  if (!compte) {
    return { ok: true }
  }
  if (compte.status !== "approved" || !compte.subscription_active) {
    return { ok: false, redirectTo: "/espace/compte?reason=dashboard_subscription" }
  }
  return { ok: true }
}

export async function getClientNavContext(
  supabase: SupabaseClient,
  userId: string
): Promise<ClientNavContext> {
  const [{ data: chantierLinks }, { data: compte }] = await Promise.all([
    supabase
      .from("chantier_membres")
      .select("id")
      .eq("profile_id", userId)
      .limit(1),
    supabase
      .from("comptes_pro")
      .select("id, status, subscription_active")
      .eq("profile_id", userId)
      .maybeSingle(),
  ])

  const hasChantier = (chantierLinks?.length ?? 0) > 0
  const gate = await evaluateDashboardAccess(supabase, userId)
  const subscriptionActive = Boolean(compte?.subscription_active)
  const compteApproved = compte?.status === "approved"

  const canViewDocuments =
    hasChantier &&
    (!compte || (compteApproved && subscriptionActive))

  return {
    isLoggedIn: true,
    hasComptePro: Boolean(compte),
    hasChantier,
    canAccessDashboard: hasChantier && gate.ok,
    canViewDocuments,
    subscriptionActive,
    compteApproved,
  }
}
