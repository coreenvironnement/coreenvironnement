/**
 * Applique 019 + 020 sur le projet Supabase de .env.local via Supabase CLI (compte connecté).
 * Prérequis : npx supabase login + droits sur le projet (ref dans NEXT_PUBLIC_SUPABASE_URL).
 *
 * Usage : node scripts/apply-migration-019-remote.mjs
 */
import { config } from "dotenv"
import { execSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { join, dirname } from "node:path"
import { fileURLToPath } from "node:url"

config({ path: ".env.local" })

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
if (!url) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL manquant")
  process.exit(1)
}

const ref = new URL(url).hostname.split(".")[0]
const root = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(root, "..")
const files = ["019_admin_v2.sql", "020_admin_v2_missing_columns.sql"]

process.env.SUPABASE_YES = "1"

for (const file of files) {
  const path = join(projectRoot, "supabase", "migrations", file)
  const sql = readFileSync(path, "utf8")
  console.log(`\n→ ${file} sur projet ${ref} …`)
  try {
    execSync(
      `npx supabase db query --remote=${ref} --yes`,
      {
        input: sql,
        stdio: ["pipe", "inherit", "inherit"],
        cwd: projectRoot,
        env: process.env,
      }
    )
    console.log(`✅ ${file}`)
  } catch (e) {
    console.error(`❌ ${file} — ${e.message}`)
    console.error(
      "\nAlternative : coller le SQL dans Supabase Dashboard → SQL Editor pour le projet",
      ref
    )
    process.exit(1)
  }
}

console.log("\nVérification…")
execSync("node scripts/verify-migration-019.mjs", { stdio: "inherit", cwd: projectRoot })