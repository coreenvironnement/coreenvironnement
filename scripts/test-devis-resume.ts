/**
 * Vérifie parse snapshot, mint URL (si DEVIS_RESUME_SECRET défini) et round-trip jeton.
 * Usage : npx tsx scripts/test-devis-resume.ts
 */
import {
  buildParticulierTunnelResume,
  parseParticulierTunnelResume,
} from "../lib/order/particulier-tunnel-resume"
import {
  mintDevisResumeHrefFromResume,
} from "../lib/order/mint-devis-resume-href"
import { parseDevisResumeToken } from "../lib/order/devis-resume-token"

const sample = buildParticulierTunnelResume({
  prestationId: "benne-8-gravats",
  address: "48 Rue des Prés 95130 Franconville",
  selectedAddress: {
    label: "48 Rue des Prés 95130 Franconville",
    lat: 48.98,
    lng: 2.23,
    postcode: "95130",
    city: "Franconville",
    departementCode: "95",
    score: 0.9,
  },
  deliveryDate: "2026-11-18",
  contactFirstName: "Jean",
  contactLastName: "Dupont",
  contactPhone: "+33612345678",
  contactEmail: "jean.dupont@example.com",
  particulierWasteId: null,
})

if (!sample) {
  console.error("FAIL: build sample resume")
  process.exit(1)
}

const parsed = parseParticulierTunnelResume(sample)
if (!parsed || parsed.prestationId !== sample.prestationId) {
  console.error("FAIL: parseParticulierTunnelResume")
  process.exit(1)
}

const href = mintDevisResumeHrefFromResume(sample)
if (!href) {
  console.warn(
    "SKIP mint: DEVIS_RESUME_SECRET ou CRON_SECRET manquant (< 16 car.) — définir en local pour test complet."
  )
  console.log("OK: parse snapshot")
  process.exit(0)
}

const token = new URL(href).searchParams.get("reprise")
if (!token) {
  console.error("FAIL: href sans reprise")
  process.exit(1)
}

const roundTrip = parseDevisResumeToken(token)
if (!roundTrip || roundTrip.contactEmail !== sample.contactEmail) {
  console.error("FAIL: jeton round-trip")
  process.exit(1)
}

console.log("OK: snapshot + mint + parse jeton")