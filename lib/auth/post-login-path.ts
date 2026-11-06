import type { SupabaseClient } from "@supabase/supabase-js"

/** Paramètre `next` ou défaut : chemin relatif sûr ou null. */
export function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null
  return raw
}

/**
 * Cible après authentification (mot de passe ou session OAuth/magic link).
 * Aligné avec le garde-fou serveur `assertProDashboardAccess`.
 */
export async function getPostLoginRedirectPath(
  supabase: SupabaseClient,
  userId: string,
  nextRaw: string | null
): Promise<string> {
  const next = safeNextPath(nextRaw)
  if (next) {
    if (next.startsWith("/dashboard")) {
      const gate = await evaluateDashboardAccess(supabase, userId)
      if (!gate.ok) return gate.redirectTo
    }
    return next
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  if (profile?.role === "admin") {
    return "/admin/commandes"
  }

  const { data: chantierLinks } = await supabase
    .from("chantier_membres")
    .select("id")
    .eq("profile_id", userId)
    .limit(1)

  if (!chantierLinks?.length) {
    return "/mes-commandes"
  }

  const gate = await evaluateDashboardAccess(supabase, userId)
  return gate.ok ? "/dashboard" : gate.redirectTo
}

async function evaluateDashboardAccess(
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
    return { ok: false, redirectTo: "/pro?reason=dashboard_subscription" }
  }
  return { ok: true }
}
