import { jsPDF } from "jspdf"

import { LEGAL_COMPANY } from "@/lib/legal"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import { formatOrderReference } from "@/lib/commande/reference"
import {
  PDF_LAYOUT,
  drawDocumentTitleBar,
  drawLegalFooter,
  drawMetaChips,
  drawSectionHeading,
  drawTotalsBlock,
  drawTwoColumnBlocks,
} from "@/lib/documents/pdf-theme"

export type FactureCommandePdfInput = {
  commandeId: string
  invoiceNumber: string
  contactName: string | null
  contactEmail: string | null
  prestationLabel: string | null
  address: string | null
  deliveryDate: string | null
  priceHt: number | null
  paidAt?: string | null
}

export function buildFactureCommandePdfBytes(input: FactureCommandePdfInput): Uint8Array {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const breakdown =
    input.priceHt != null ? priceBreakdownFromHt(input.priceHt) : null
  const ref = formatOrderReference(input.commandeId)
  const issued = formatDateFr(new Date().toISOString().slice(0, 10))

  let y = drawDocumentTitleBar(doc, "Facture", LEGAL_COMPANY.name)

  const chips = [
    { label: "N°", value: input.invoiceNumber },
    { label: "Commande", value: ref },
    { label: "Date", value: issued },
  ]
  if (input.paidAt) {
    chips.push({
      label: "Paiement",
      value: formatDateFr(input.paidAt.slice(0, 10)),
    })
  }
  y = drawMetaChips(doc, y, chips)

  const client = input.contactName?.trim() || "Client"
  y = drawSectionHeading(doc, y, "Informations")
  y = drawTwoColumnBlocks(
    doc,
    y,
    "Émetteur",
    [
      LEGAL_COMPANY.name,
      LEGAL_COMPANY.address,
      `SIRET : ${LEGAL_COMPANY.siret}`,
      `TVA : ${LEGAL_COMPANY.tva}`,
    ],
    "Client",
    [client, input.contactEmail ?? ""].filter(Boolean)
  )

  y = drawSectionHeading(doc, y, "Détail")
  const detail: string[] = []
  if (input.prestationLabel) detail.push(`Prestation : ${input.prestationLabel}`)
  if (input.address) detail.push(`Lieu : ${input.address}`)
  if (input.deliveryDate) {
    detail.push(`Livraison : ${formatDateFr(input.deliveryDate)}`)
  }
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  doc.setTextColor(23, 32, 51)
  for (const line of detail) {
    const wrapped = doc.splitTextToSize(line, PDF_LAYOUT.contentW)
    doc.text(wrapped, PDF_LAYOUT.marginX, y)
    y += wrapped.length * 4.2 + 1
  }

  if (breakdown) {
    y += 2
    y = drawTotalsBlock(doc, y, [
      { label: "Montant HT", value: formatEuro(breakdown.ht) },
      { label: "TVA (20 %)", value: formatEuro(breakdown.tva) },
      { label: "Total TTC", value: formatEuro(breakdown.ttc), bold: true },
    ])
  }

  y += 4
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  doc.setTextColor(91, 100, 117)
  doc.text(
    doc.splitTextToSize(
      "Document généré automatiquement. TVA acquittée sur les encaissements.",
      PDF_LAYOUT.contentW
    ),
    PDF_LAYOUT.marginX,
    y
  )

  drawLegalFooter(doc)

  const raw = doc.output("arraybuffer") as ArrayBuffer
  return new Uint8Array(raw)
}