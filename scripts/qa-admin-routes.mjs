/**
 * Smoke test routes admin (sans auth → redirection login attendue).
 * Usage : BASE_URL=http://localhost:3020 node scripts/qa-admin-routes.mjs
 */
import { config } from "dotenv"

config({ path: ".env.local" })

const base = (process.env.BASE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3020").replace(
  /\/$/,
  ""
)

const paths = [
  "/admin",
  "/admin/interventions",
  "/admin/commandes",
  "/admin/clients",
  "/admin/prestataires",
  "/admin/chantiers",
  "/api/admin/export/interventions",
  "/api/admin/export/clients",
]

let ok = 0
for (const path of paths) {
  try {
    const res = await fetch(`${base}${path}`, { redirect: "manual" })
    const pass = res.status === 307 || res.status === 302 || res.status === 200
    console.log(`${pass ? "✅" : "❌"} ${path} → ${res.status}`)
    if (pass) ok++
  } catch (e) {
    console.log(`❌ ${path} — ${e.message}`)
  }
}

console.log(`\n${ok}/${paths.length} routes joignables`)

if (ok < paths.length) {
  console.log(`\nLancer le serveur : npm run dev -- -p 3020`)
  process.exit(1)
}