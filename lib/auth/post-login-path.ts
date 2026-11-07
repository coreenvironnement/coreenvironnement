import type { SupabaseClient } from "@supabase/supabase-js"

import { evaluateDashboardAccess } from "@/lib/auth/client-nav-context"

/** Paramètre `next` ou défaut : chemin relatif sûr ou null. */
export function safeNextPath(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return null
  return raw
}

/**
 * Cible après authentification (mot de passe ou session OAuth).
 * Aligné avec le garde-fou serveur `assertProDashboardAccess`.
 */
export async function getPostLoginRedirectPath(
  supabase: SupabaseClient,
  userId: string,
  nextRaw: string | null
): Promise<string> {
  const next = safeNextPath(nextRaw)
  if (next) {
    if (next.startsWith("/dashboard") || next.startsWith("/espace/chantier")) {
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
    return "/espace/commandes"
  }

  const gate = await evaluateDashboardAccess(supabase, userId)
  return gate.ok ? "/espace/chantier" : gate.redirectTo
}
