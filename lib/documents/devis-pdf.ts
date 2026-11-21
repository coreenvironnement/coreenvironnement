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
  surchargePerTonHt?: number
  /** Validité affichée (particulier : 7 jours par défaut). */
  validityDays?: number
}

const TABLE_COLS = [
  { key: "desc", title: "Description", width: 72 },
  { key: "unit", title: "Unité", width: 18 },
  { key: "price", title: "Prix € HT", width: 24 },
  { key: "note", title: "Commentaire", width: 68 },
] as const

const INFORMATIONS_COMPLEMENTAIRES = [
  "Les déchets dangereux sont strictement interdits dans les bennes. En cas de constat de déchets dangereux, un supplément de 200,00 € HT par benne sera facturé au client, ainsi qu’un coût de 2,00 € HT par kilo pour le traitement des déchets concernés.",
  "Les fonds de toupie à béton sont également interdits. En cas de présence de béton frais dans la benne, un forfait de 1 500,00 € HT par benne sera facturé au client.",
  "Temps d’attente du chauffeur : le chauffeur ne peut dépasser 20 minutes sur place. En cas de dépassement, un supplément de 30,00 € HT par tranche de 15 minutes sera facturé.",
  "TGAP (Taxe Générale sur les Activités Polluantes) : toute hausse de la TGAP sera intégralement et automatiquement répercutée au client. L’édition du Bordereau de Suivi des Déchets (BSD) pour les déchets non dangereux ou dangereux est facturée 15,00 € HT par BSD.",
] as const

const OBJET_PRESTATION =
  "Mise à disposition de contenant, collecte et traitement des déchets"

function buildForfaitDescription(input: DevisPdfInput): string {
  const parts = [`Forfait – ${input.prestationLabel}`]
  if (input.tonnageMax != null && input.tonnageMax > 0) {
    const tonnage = String(input.tonnageMax).replace(".", ",")
    parts.push(`Comprend un tonnage maximal de ${tonnage} tonnes`)
    if (input.surchargePerTonHt != null && input.surchargePerTonHt > 0) {
      parts.push(
        `Tout dépassement fera l’objet d’une facturation complémentaire de ${formatEuro(input.surchargePerTonHt)} HT par tonne supplémentaire`
      )
    }
  }
  return parts.join(" – ")
}

function buildCommentCell(input: DevisPdfInput): string {
  return [
    `Déchets acceptés : ${input.acceptedSummary}`,
    `Sont strictement exclus : ${input.excludedSummary}`,
  ].join("\n")
}

function ensurePageRoom(doc: jsPDF, y: number, neededMm: number): number {
  const pageH = doc.internal.pageSize.getHeight()
  if (y + neededMm <= pageH - 16) return y
  drawLegalFooter(doc)
  doc.addPage()
  return PDF_LAYOUT.marginX + 10
}

export function buildDevisPdfBytes(input: DevisPdfInput): Uint8Array {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const breakdown = priceBreakdownFromHt(input.priceHt)
  const issued = formatDateFr(new Date().toISOString().slice(0, 10))
  const validityDays = input.validityDays ?? 7

  let y = drawDocumentTitleBar(doc, "Offre commerciale 2026", LEGAL_COMPANY.name)

  y = drawMetaChips(doc, y, [
    { label: "N°", value: input.reference },
    { label: "Date", value: issued },
    { label: "Validité", value: `${validityDays} jours` },
  ])

  y = drawSectionHeading(doc, y, "Informations fournisseur / client")
  y = drawTwoColumnBlocks(
    doc,
    y,
    "Informations fournisseur",
    [
      `Raison sociale : ${LEGAL_COMPANY.name}`,
      `Adresse : ${LEGAL_COMPANY.address}`,
      `Téléphone : ${LEGAL_COMPANY.phone}`,
      `E-mail : ${LEGAL_COMPANY.email}`,
      `SIRET : ${LEGAL_COMPANY.siret}`,
    ],
    "Informations client",
    [
      `Nom : ${input.contactName}`,
      `Téléphone : ${input.contactPhone}`,
      `E-mail : ${input.contactEmail}`,
    ]
  )

  y = drawLabeledParagraph(doc, y, "Objet", OBJET_PRESTATION)

  y = drawSectionHeading(doc, y, "Intervention")
  y = drawLabeledParagraph(doc, y, "Adresse d’intervention", input.address)
  y = drawLabeledParagraph(
    doc,
    y,
    "Livraison souhaitée",
    formatDateFr(input.deliveryDate)
  )
  if (input.pickupDate?.trim()) {
    y = drawLabeledParagraph(
      doc,
      y,
      "Enlèvement souhaité",
      formatDateFr(input.pickupDate)
    )
  }
  y = drawLabeledParagraph(doc, y, "Nom contact sur place", input.contactName)
  y = drawLabeledParagraph(
    doc,
    y,
    "Téléphone contact sur place",
    input.contactPhone
  )

  y = ensurePageRoom(doc, y, 50)
  y = drawSectionHeading(doc, y, "Prestation")
  y = drawQuoteTableHeader(doc, y, [...TABLE_COLS])
  y = drawQuoteTableRow(
    doc,
    y,
    [...TABLE_COLS],
    {
      desc: buildForfaitDescription(input),
      unit: "Forfait",
      price: formatEuro(breakdown.ht),
      note: buildCommentCell(input),
    },
    true
  )

  y = drawTotalsBlock(doc, y + 4, [
    { label: "Montant HT", value: formatEuro(breakdown.ht) },
    { label: "TVA (20 %)", value: formatEuro(breakdown.tva) },
    { label: "Total TTC", value: formatEuro(breakdown.ttc), bold: true },
  ])

  y = ensurePageRoom(doc, y, 55)
  y = drawNoteBox(doc, y + 2, "Informations complémentaires", [
    ...INFORMATIONS_COMPLEMENTAIRES,
  ])

  y = ensurePageRoom(doc, y, 40)
  y = drawNoteBox(doc, y, "Modalités de paiement", [
    "Conditions de règlement : à la commande.",
    "Moyen de paiement : lien de paiement sécurisé (carte bancaire en ligne).",
    `Cette offre est valable ${validityDays} jours à compter de sa date d’émission.`,
    "Pour confirmer, finalisez votre commande sur la plateforme et réglez en ligne. Un conseiller CORE vous contacte pour valider le créneau de livraison.",
    "En validant votre commande et le paiement, vous acceptez nos conditions générales de vente (document joint).",
  ])

  y = ensurePageRoom(doc, y, 12)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7.5)
  const latePay = doc.splitTextToSize(
    "Conformément à l’article L. 441-6, une indemnité de 40 € est due en cas de retard de paiement ou de non-paiement total d’une facture à la date de paiement définie dans le document.",
    PDF_LAYOUT.contentW
  )
  doc.text(latePay, PDF_LAYOUT.marginX, y)
  y += latePay.length * 3.5 + 4

  drawLegalFooter(doc)

  const raw = doc.output("arraybuffer") as ArrayBuffer
  return new Uint8Array(raw)
}