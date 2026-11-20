import type { SupabaseClient } from "@supabase/supabase-js"

export type ParticulierClientRow = {
  key: string
  profileId: string | null
  email: string
  nom: string | null
  phone: string | null
  commandeCount: number
  lastCommandeAt: string
}

export async function loadParticulierClients(
  supabase: SupabaseClient
): Promise<ParticulierClientRow[]> {
  const { data: commandes } = await supabase
    .from("commandes")
    .select(
      "id, client_id, contact_email, contact_nom, contact_telephone, date_creation, audience, statut"
    )
    .eq("audience", "particulier")
    .order("date_creation", { ascending: false })

  const map = new Map<string, ParticulierClientRow>()

  for (const c of commandes ?? []) {
    const email = (c.contact_email ?? "").trim().toLowerCase()
    const key = c.client_id ?? (email || `anon-${c.id}`)
    const existing = map.get(key)
    const created = c.date_creation ?? ""
    const isBrouillon = c.statut === "brouillon"
    if (!existing) {
      map.set(key, {
        key,
        profileId: c.client_id,
        email: email || "-",
        nom: c.contact_nom,
        phone: c.contact_telephone?.trim() || null,
        commandeCount: isBrouillon ? 0 : 1,
        lastCommandeAt: isBrouillon ? "" : created,
      })
    } else {
      if (!isBrouillon) {
        existing.commandeCount += 1
        if (created > existing.lastCommandeAt) {
          existing.lastCommandeAt = created
          if (c.contact_nom) existing.nom = c.contact_nom
          if (c.contact_telephone?.trim()) {
            existing.phone = c.contact_telephone.trim()
          }
        }
      }
    }
  }

  const profileIds = [...map.values()]
    .map((r) => r.profileId)
    .filter(Boolean) as string[]

  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone")
      .in("id", profileIds)

    for (const p of profiles ?? []) {
      for (const row of map.values()) {
        if (row.profileId === p.id) {
          row.email = p.email
          if (p.full_name) row.nom = p.full_name
          if (p.phone?.trim()) row.phone = p.phone.trim()
        }
      }
    }
  }

  return [...map.values()]
    .filter((r) => r.commandeCount > 0 || r.lastCommandeAt.length > 0)
    .sort((a, b) => b.lastCommandeAt.localeCompare(a.lastCommandeAt))
}
