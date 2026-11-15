/**
 * Vérifie Resend pour e-mails intervention planifiée.
 */
import { config } from "dotenv"

config({ path: ".env.local" })

const key = process.env.RESEND_API_KEY?.trim()
const from = process.env.EMAIL_FROM?.trim()

let ok = true
if (key) {
  console.log("✅ RESEND_API_KEY présente")
} else {
  console.log("❌ RESEND_API_KEY absente — e-mails planification non envoyés")
  ok = false
}

if (from) {
  console.log(`✅ EMAIL_FROM : ${from}`)
} else {
  console.log("⚠️ EMAIL_FROM absente — repli onboarding@resend.dev en dev")
}

process.exit(ok ? 0 : 1)