import { jsPDF } from "jspdf"

import { LEGAL_COMPANY } from "@/lib/legal"
import { formatDateFr } from "@/lib/format/date"
import { formatEuro } from "@/lib/format/currency"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import {
  PDF_LAYOUT,
  drawDocumentTitleBar,
  drawLegalFooter,
  drawLabeledParagraph,
  drawMetaChips,
  drawNoteBox,
  drawQuoteTableHeader,
  drawQuoteTableRow,
  drawSectionHeading,
  drawTotalsBlock,
  drawTwoColumnBlocks,
} from "@/lib/documents/pdf-theme"

export type DevisPdfInput = {
  reference: string
  contactName: string
  contactEmail: string
  contactPhone: string
  prestationLabel: string
  address: string
  deliveryDate: string
  pickupDate?: string | null
  priceHt: number
  acceptedSummary: string
  excludedSummary: string
  tonnageMax?: number
}

const TABLE_COLS = [
  { key: "desc", title: "Description", width: 78 },
  { key: "unit", title: "Unité", width: 22 },
  { key: "price", title: "Prix € HT", width: 28 },
  { key: "note", title: "Détails", width: 54 },
] as const

function buildDescriptionLines(input: DevisPdfInput): string {
  const parts = [
    input.prestationLabel,
    `Livraison souhaitée : ${formatDateFr(input.deliveryDate)}`,
  ]
  if (input.pickupDate?.trim()) {
    parts.push(`Enlèvement souhaité : ${formatDateFr(input.pickupDate)}`)
  }
  parts.push(`Adresse : ${input.address}`)
  return parts.join("\n")
}

function buildNoteCell(input: DevisPdfInput): string {
  const parts = [
    `Déchets acceptés : ${input.acceptedSummary}`,
    `À exclure : ${input.excludedSummary}`,
  ]
  if (input.tonnageMax != null && input.tonnageMax > 0) {
    parts.push(
      `Le forfait inclut un tonnage maximal de ${String(input.tonnageMax).replace(".", ",")} tonnes. Au-delà, une facturation complémentaire peut s’appliquer selon nos conditions.`
    )
  }
  return parts.join("\n")
}

export function buildDevisPdfBytes(input: DevisPdfInput): Uint8Array {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const breakdown = priceBreakdownFromHt(input.priceHt)
  const issued = formatDateFr(new Date().toISOString().slice(0, 10))

  let y = drawDocumentTitleBar(doc, "Devis", "Location de benne — particulier")

  y = drawMetaChips(doc, y, [
    { label: "N°", value: input.reference },
    { label: "Date", value: issued },
    { label: "Validité", value: "7 jours" },
  ])

  y = drawSectionHeading(doc, y, "Informations")
  y = drawTwoColumnBlocks(
    doc,
    y,
    "Fournisseur",
    [
      LEGAL_COMPANY.name,
      LEGAL_COMPANY.address,
      `Téléphone : ${LEGAL_COMPANY.phone}`,
      `E-mail : ${LEGAL_COMPANY.email}`,
      `SIRET : ${LEGAL_COMPANY.siret}`,
    ],
    "Client",
    [
      input.contactName,
      `Téléphone : ${input.contactPhone}`,
      `E-mail : ${input.contactEmail}`,
    ]
  )

  y = drawLabeledParagraph(
    doc,
    y,
    "Objet",
    "Mise à disposition d’une benne, livraison sur votre adresse et enlèvement une fois remplie."
  )

  y = drawSectionHeading(doc, y, "Prestation")
  y = drawQuoteTableHeader(doc, y, [...TABLE_COLS])
  y = drawQuoteTableRow(
    doc,
    y,
    [...TABLE_COLS],
    {
      desc: buildDescriptionLines(input),
      unit: "Forfait",
      price: formatEuro(breakdown.ht),
      note: buildNoteCell(input),
    },
    true
  )

  y = drawTotalsBlock(doc, y + 4, [
    { label: "Montant HT", value: formatEuro(breakdown.ht) },
    { label: "TVA (20 %)", value: formatEuro(breakdown.tva) },
    { label: "Total TTC", value: formatEuro(breakdown.ttc), bold: true },
  ])

  y = drawNoteBox(doc, y + 2, "Modalités", [
    "Ce devis est valable 7 jours à compter de sa date d’émission.",
    "Pour confirmer, finalisez votre commande et le paiement sécurisé en ligne. Un conseiller CORE vous appelle pour fixer le créneau de livraison.",
    "Les conditions générales de vente (document joint) s’appliquent à votre commande.",
  ])

  if (y > PDF_LAYOUT.marginX + 240) {
    drawLegalFooter(doc)
    doc.addPage()
    y = PDF_LAYOUT.marginX + 10
  }

  drawLegalFooter(doc)

  const raw = doc.output("arraybuffer") as ArrayBuffer
  return new Uint8Array(raw)
}