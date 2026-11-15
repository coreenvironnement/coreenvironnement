import type { SupabaseClient } from "@supabase/supabase-js"

export type AdminNavBadges = {
  clientsNew: number
  chantiersNew: number
  interventionsNew: number
  prestatairesDocs: number
  comptesProPending: number
}

const NEW_SINCE_DAYS = 14

export async function loadAdminNavBadges(
  supabase: SupabaseClient
): Promise<AdminNavBadges> {
  const since = new Date()
  since.setDate(since.getDate() - NEW_SINCE_DAYS)
  const sinceIso = since.toISOString()

  const soon = new Date()
  soon.setDate(soon.getDate() + 30)
  const soonIso = soon.toISOString().slice(0, 10)

  const [
    { count: clientsNew },
    { count: chantiersNew },
    { count: interventionsNew },
    { count: commandesATraiter },
    { count: comptesProPending },
    prestatairesDocsRes,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sinceIso),
    supabase
      .from("chantiers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sinceIso),
    supabase
      .from("interventions")
      .select("*", { count: "exact", head: true })
      .eq("statut", "en_cours_programmation"),
    supabase
      .from("commandes")
      .select("*", { count: "exact", head: true })
      .eq("statut", "confirmee")
      .eq("payment_status", "paid"),
    supabase
      .from("comptes_pro")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("prestataire_documents")
      .select("*", { count: "exact", head: true })
      .lte("expires_at", soonIso)
      .gte("expires_at", new Date().toISOString().slice(0, 10)),
  ])

  const interventionsNewTotal =
    (interventionsNew ?? 0) + (commandesATraiter ?? 0)

  const prestatairesDocs =
    prestatairesDocsRes.error != null ? 0 : (prestatairesDocsRes.count ?? 0)

  return {
    clientsNew: clientsNew ?? 0,
    chantiersNew: chantiersNew ?? 0,
    interventionsNew: interventionsNewTotal,
    prestatairesDocs,
    comptesProPending: comptesProPending ?? 0,
  }
}