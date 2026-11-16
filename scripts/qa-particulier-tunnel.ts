import {
  getOrderTunnelSteps,
  type OrderTunnelStepId,
} from "../lib/order/tunnel-steps"
import { isValidDeliveryDate, minDeliveryDateISO } from "../lib/order/delivery-dates"
import { PRESTATIONS, prestationById } from "../lib/prestations"
import { isInvoiceAvailable } from "../lib/invoice/commande-invoice"
import { buildDevisPdfBytes } from "../lib/documents/devis-pdf"

const steps = getOrderTunnelSteps("particulier")
const ids = steps.map((s) => s.id)
const expected: readonly OrderTunnelStepId[] = [
  "intent",
  "forfait",
  "infos-dates",
  "infos-contact",
  "recap",
  "payment",
]

let ok = true
for (const id of expected) {
  if (!ids.includes(id)) {
    console.error("Missing step:", id)
    ok = false
  }
}

const minDate = minDeliveryDateISO()
if (!isValidDeliveryDate(minDate)) {
  console.error("minDeliveryDateISO invalid")
  ok = false
}

if (!PRESTATIONS.length || !prestationById(PRESTATIONS[0]!.id)) {
  console.error("prestations missing")
  ok = false
}

const livreeAt = new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
if (!isInvoiceAvailable(livreeAt)) {
  console.error("invoice 4h rule failed (should be available)")
  ok = false
}

const recent = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
if (isInvoiceAvailable(recent)) {
  console.error("invoice 4h rule failed (should be pending)")
  ok = false
}

const samplePrestation = PRESTATIONS[0]!
const pdf = buildDevisPdfBytes({
  reference: "DEV-TEST",
  contactName: "Test",
  contactEmail: "test@example.com",
  contactPhone: "0600000000",
  prestationLabel: samplePrestation.label,
  address: "1 rue Test, 75001 Paris",
  deliveryDate: minDate,
  priceHt: samplePrestation.priceHt,
  acceptedSummary: samplePrestation.acceptedSummary,
  excludedSummary: samplePrestation.excludedSummary,
  tonnageMax: samplePrestation.tonnageMax,
})
if (pdf.byteLength < 500) {
  console.error("devis pdf too small")
  ok = false
}

if (ok) {
  console.log("OK qa-particulier-tunnel", steps.length, "steps")
  process.exit(0)
}
process.exit(1)