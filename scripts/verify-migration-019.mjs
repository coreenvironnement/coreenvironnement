/**
 * Vérifie que la migration 019 Admin V2 est appliquée sur le projet .env.local
 * Usage : node scripts/verify-migration-019.mjs
 */
import { config } from "dotenv"
import { createClient } from "@supabase/supabase-js"

config({ path: ".env.local" })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !service) {
  console.error("❌ .env.local : URL ou SERVICE_ROLE manquant")
  process.exit(1)
}

const sb = createClient(url, service)

const checks = []

async function tableOk(name) {
  const { error } = await sb.from(name).select("*", { count: "exact", head: true })
  checks.push({ name: `table ${name}`, ok: !error, detail: error?.message })
}

async function columnOk(table, column) {
  const { error } = await sb.from(table).select(column).limit(1)
  checks.push({
    name: `${table}.${column}`,
    ok: !error,
    detail: error?.message,
  })
}

await tableOk("chantier_lignes_tarifaires")
await tableOk("audit_log")
await tableOk("prestataire_documents")
await columnOk("interventions", "poids_reel_kg")
await columnOk("interventions", "prestataire_id")
await columnOk("prestataires", "raison_sociale")

let pass = 0
for (const c of checks) {
  const mark = c.ok ? "✅" : "❌"
  if (c.ok) pass++
  console.log(`${mark} ${c.name}${c.ok ? "" : " — " + c.detail}`)
}

console.log(`\n${pass}/${checks.length} OK`)

if (pass < checks.length) {
  console.log(
    "\nAppliquer supabase/migrations/019_admin_v2.sql dans Supabase → SQL Editor (projet lié à .env.local)."
  )
  process.exit(1)
}

console.log("Migration 019 détectée.\n")
process.exit(0)