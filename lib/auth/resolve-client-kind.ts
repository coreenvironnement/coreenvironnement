import type { SupabaseClient } from "@supabase/supabase-js"

export type ClientKind = "particulier" | "professionnel"

export type ResolvedClientKind =
  | { kind: ClientKind; proStatus: null }
  | { kind: "professionnel"; proStatus: "pending" | "approved" | "rejected" }

export async function resolveClientKind(
  supabase: SupabaseClient,
  userId: string
): Promise<ResolvedClientKind> {
  const { data: compte } = await supabase
    .from("comptes_pro")
    .select("status")
    .eq("profile_id", userId)
    .maybeSingle()

  if (compte?.status === "approved") {
    return { kind: "professionnel", proStatus: "approved" }
  }
  if (compte) {
    const status = compte.status
    if (status === "pending" || status === "rejected") {
      return { kind: "professionnel", proStatus: status }
    }
    return { kind: "professionnel", proStatus: "pending" }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("client_kind")
    .eq("id", userId)
    .maybeSingle()

  if (profile?.client_kind === "professionnel") {
    return { kind: "professionnel", proStatus: null }
  }

  return { kind: "particulier", proStatus: null }
}
