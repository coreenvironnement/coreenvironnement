import type { SupabaseClient } from "@supabase/supabase-js"

import type { ClientKind } from "@/lib/auth/resolve-client-kind"

export async function syncProfileClientKind(
  supabase: SupabaseClient,
  userId: string,
  kind: ClientKind
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ client_kind: kind })
    .eq("id", userId)

  if (error) {
    console.error("[sync-profile-client-kind]", error.message)
  }
}
