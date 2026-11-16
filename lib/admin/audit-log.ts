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

export type AuditLogEntry = {
  id: string
  action: string
  detail: Record<string, unknown> | null
  created_at: string
  profiles: { full_name: string | null; email: string | null } | null
}

function normalizeAuditProfile(
  raw: unknown
): { full_name: string | null; email: string | null } | null {
  if (!raw) return null
  if (Array.isArray(raw)) return (raw[0] as { full_name: string | null; email: string | null }) ?? null
  return raw as { full_name: string | null; email: string | null }
}

export async function loadAuditLog(
  supabase: SupabaseClient,
  entityType: string,
  entityId: string,
  limit = 30
): Promise<AuditLogEntry[]> {
  const { data, error } = await supabase
    .from("audit_log")
    .select("id, action, detail, created_at, profiles ( full_name, email )")
    .eq("entity_type", entityType)
    .eq("entity_id", entityId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) return []
  return (data ?? []).map((row) => ({
    id: row.id as string,
    action: row.action as string,
    detail: (row.detail as Record<string, unknown> | null) ?? null,
    created_at: row.created_at as string,
    profiles: normalizeAuditProfile(row.profiles),
  }))
}