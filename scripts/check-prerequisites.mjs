/**
 * Vérification prérequis Mois 1
 * Usage : node scripts/check-prerequisites.mjs
 */
import { config } from "dotenv"
import { createClient } from "@supabase/supabase-js"

config({ path: ".env.local" })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

function ok(label, pass, detail = "") {
  console.log(`${pass ? "✅" : "❌"} ${label}${detail ? " — " + detail : ""}`)
  return pass
}

if (!url || !anon || !service) {
  console.log("\n❌ .env.local incomplet (URL, ANON, SERVICE_ROLE requis)\n")
  process.exit(1)
}

ok(".env.local", true, "3 variables présentes")

const sb = createClient(url, service)

const { error: e4 } = await sb.from("chantier_membres").select("contact_prenom").limit(1)
ok("Migration 004 (contact_prenom)", !e4, e4?.message)

const { data: prestataires, error: e5 } = await sb.from("prestataires").select("id, nom").limit(5)
ok("Migration 005 (prestataires)", !e5, e5?.message ?? `${prestataires?.length ?? 0} prestataire(s)`)

const { error: e5b } = await sb.from("chantiers").select("prestataire_id").limit(1)
ok("Migration 005 (chantiers.prestataire_id)", !e5b, e5b?.message)

const { data: buckets } = await sb.storage.listBuckets()
const bucket = buckets?.find((b) => b.name === "intervention-documents")
ok(
  "Bucket intervention-documents",
  Boolean(bucket),
  bucket ? (bucket.public ? "public (devrait être privé)" : "privé") : "créer dans Storage"
)

const { count: nChantiers } = await sb.from("chantiers").select("*", { count: "exact", head: true })
const { count: nInterventions } = await sb.from("interventions").select("*", { count: "exact", head: true })
const { count: nMembres } = await sb.from("chantier_membres").select("*", { count: "exact", head: true })
const { count: nStats } = await sb.from("chantier_stats_dechets").select("*", { count: "exact", head: true })
const { count: nDocs } = await sb.from("intervention_documents").select("*", { count: "exact", head: true })

console.log("\n--- Données démo ---")
ok("≥ 1 chantier", (nChantiers ?? 0) >= 1, `actuel : ${nChantiers ?? 0}`)
ok("≥ 1 membre (accès client)", (nMembres ?? 0) >= 1, `actuel : ${nMembres ?? 0}`)
ok("≥ 1 intervention", (nInterventions ?? 0) >= 1, `actuel : ${nInterventions ?? 0}`)
ok("≥ 1 stat tonnage", (nStats ?? 0) >= 1, `actuel : ${nStats ?? 0}`)
ok("≥ 1 document PDF", (nDocs ?? 0) >= 1, `actuel : ${nDocs ?? 0}`)

const { data: admins } = await sb.from("profiles").select("email, role").eq("role", "admin")
console.log("\n--- Comptes ---")
ok("≥ 1 admin", (admins?.length ?? 0) >= 1, admins?.map((a) => a.email).join(", ") || "aucun")

console.log("\nProchaine étape : corriger les ❌ puis relancer ce script.\n")
