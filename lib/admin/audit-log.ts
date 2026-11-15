import type { SupabaseClient } from "@supabase/supabase-js"

export async function writeAuditLog(
  supabase: SupabaseClient,
  input: {
    entityType: string
    entityId: string
    action: string
    detail?: Record<string, unknown>
    actorId?: string | null
  }
) {
  const { error } = await supabase.from("audit_log").insert({
    entity_type: input.entityType,
    entity_id: input.entityId,
    action: input.action,
    detail: input.detail ?? null,
    actor_id: input.actorId ?? null,
  })
  if (error && !error.message.includes("does not exist")) {
    console.error("[audit_log]", error.message)
  }
}

export async function loadAuditLog(
  supabase: SupabaseClient,
  entityType: string,
  entityId: string,
  limit = 30
) {
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, action, detail, created_at, profiles ( full_name, email )")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) return []
  return data ?? []
}