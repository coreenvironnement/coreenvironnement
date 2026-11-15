import type { SupabaseClient } from "@supabase/supabase-js"

import { loadParticulierClients } from "@/lib/admin/particulier-clients"

export type UnifiedClientRow = {
  id: string
  kind: "particulier" | "professionnel"
  label: string
  email: string
  siret: string | null
  chantiersCount: number
  interventionsHint: number
  lastActivity: string | null
}

export async function loadUnifiedClients(
  supabase: SupabaseClient
): Promise<UnifiedClientRow[]> {
  const particuliers = await loadParticulierClients(supabase)

  const { data: comptes } = await supabase
    .from("comptes_pro")
    .select("id, raison_sociale, status, created_at, siret, contact_email")
    .order("created_at", { ascending: false })

  const rows: UnifiedClientRow[] = particuliers.map((p) => ({
    id: p.profileId ?? p.key,
    kind: "particulier",
    label: p.nom ?? p.email,
    email: p.email,
    siret: null,
    chantiersCount: 0,
    interventionsHint: p.commandeCount,
    lastActivity: p.lastCommandeAt,
  }))

  for (const c of comptes ?? []) {
    rows.push({
      id: c.id,
      kind: "professionnel",
      label: c.raison_sociale ?? "Compte pro",
      email: c.contact_email ?? "—",
      siret: c.siret ?? null,
      chantiersCount: 0,
      interventionsHint: 0,
      lastActivity: c.created_at,
    })
  }

  rows.sort((a, b) => (b.lastActivity ?? "").localeCompare(a.lastActivity ?? ""))

  return rows
}

export async function findDuplicateClients(
  supabase: SupabaseClient,
  siret: string | null,
  nom: string,
  adresse: string
): Promise<string[]> {
  const warnings: string[] = []
  const s = siret?.replace(/\s/g, "") ?? ""
  if (s.length >= 9) {
    const { data } = await supabase.from("comptes_pro").select("id, raison_sociale").eq("siret", s)
    if (data?.length) {
      warnings.push(`SIRET déjà utilisé (${data[0].raison_sociale ?? "compte pro"})`)
    }
  }
  const needle = nom.trim().toLowerCase()
  const addr = adresse.trim().toLowerCase()
  if (needle && addr) {
    const { data: chantiers } = await supabase
      .from("chantiers")
      .select("id, nom, adresse")
      .ilike("nom", `%${needle.slice(0, 20)}%`)
    for (const ch of chantiers ?? []) {
      if ((ch.adresse ?? "").toLowerCase().includes(addr.slice(0, 12))) {
        warnings.push(`Chantier similaire : ${ch.nom}`)
        break
      }
    }
  }
  return warnings
}