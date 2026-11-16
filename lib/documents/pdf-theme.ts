import { jsPDF, type jsPDF as JsPDFDoc } from "jspdf"

import { LEGAL_COMPANY } from "@/lib/legal"
import { cgvSections, legalParagraphText, type LegalSection } from "@/lib/legal"

/** Palette alignée vitrine CORE (devis pro / particulier). */
export const PDF_COLORS = {
  green: { r: 53, g: 162, b: 56 },
  greenDark: { r: 25, g: 117, b: 43 },
  navy: { r: 23, g: 32, b: 51 },
  muted: { r: 91, g: 100, b: 117 },
  border: { r: 228, g: 231, b: 236 },
  panel: { r: 247, g: 249, b: 244 },
  white: { r: 255, g: 255, b: 255 },
} as const

export const PDF_LAYOUT = {
  marginX: 14,
  pageW: 210,
  contentW: 182,
  headerH: 22,
} as const

function rgb(doc: JsPDFDoc, c: (typeof PDF_COLORS)[keyof typeof PDF_COLORS]) {
  doc.setTextColor(c.r, c.g, c.b)
}

function fillRgb(doc: JsPDFDoc, c: (typeof PDF_COLORS)[keyof typeof PDF_COLORS]) {
  doc.setFillColor(c.r, c.g, c.b)
}

/** Bandeau titre document (vert, texte blanc). */
export function drawDocumentTitleBar(
  doc: JsPDFDoc,
  title: string,
  subtitle?: string
): number {
  const { marginX, pageW, headerH } = PDF_LAYOUT
  fillRgb(doc, PDF_COLORS.green)
  doc.rect(0, 0, pageW, headerH, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(15)
  doc.setTextColor(255, 255, 255)
  doc.text(title, marginX, 11)
  if (subtitle) {
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9)
    doc.text(subtitle, marginX, 17)
  }
  return headerH + 6
}

export function drawMetaChips(
  doc: JsPDFDoc,
  y: number,
  chips: { label: string; value: string }[]
): number {
  doc.setFont("helvetica", "normal")
  doc.setFontSize(9)
  let x = PDF_LAYOUT.marginX
  const lineH = 5
  for (const chip of chips) {
    doc.setFont("helvetica", "bold")
    rgb(doc, PDF_COLORS.navy)
    const label = `${chip.label} : `
    doc.text(label, x, y)
    const w = doc.getTextWidth(label)
    doc.setFont("helvetica", "normal")
    rgb(doc, PDF_COLORS.muted)
    doc.text(chip.value, x + w, y)
    x += w + doc.getTextWidth(chip.value) + 10
    if (x > PDF_LAYOUT.marginX + PDF_LAYOUT.contentW - 40) {
      x = PDF_LAYOUT.marginX
      y += lineH
    }
  }
  return y + lineH + 3
}

export function drawSectionHeading(doc: JsPDFDoc, y: number, title: string): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  rgb(doc, PDF_COLORS.greenDark)
  doc.text(title.toUpperCase(), PDF_LAYOUT.marginX, y)
  fillRgb(doc, PDF_COLORS.green)
  doc.rect(PDF_LAYOUT.marginX, y + 1.5, 28, 0.6, "F")
  return y + 7
}

export function drawTwoColumnBlocks(
  doc: JsPDFDoc,
  y: number,
  leftTitle: string,
  leftLines: string[],
  rightTitle: string,
  rightLines: string[]
): number {
  const colW = PDF_LAYOUT.contentW / 2 - 4
  const xL = PDF_LAYOUT.marginX
  const xR = PDF_LAYOUT.marginX + PDF_LAYOUT.contentW / 2 + 2

  const panelH = Math.max(leftLines.length, rightLines.length) * 4.2 + 14
  fillRgb(doc, PDF_COLORS.panel)
  doc.rect(PDF_LAYOUT.marginX, y - 4, PDF_LAYOUT.contentW, panelH, "F")

  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  rgb(doc, PDF_COLORS.navy)
  doc.text(leftTitle, xL + 3, y + 1)
  doc.text(rightTitle, xR + 3, y + 1)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8.5)
  rgb(doc, PDF_COLORS.muted)
  let yL = y + 6
  for (const line of leftLines) {
    const wrapped = doc.splitTextToSize(line, colW - 4)
    doc.text(wrapped, xL + 3, yL)
    yL += wrapped.length * 3.6 + 1
  }
  let yR = y + 6
  for (const line of rightLines) {
    const wrapped = doc.splitTextToSize(line, colW - 4)
    doc.text(wrapped, xR + 3, yR)
    yR += wrapped.length * 3.6 + 1
  }

  return Math.max(yL, yR) + 5
}

export function drawLabeledParagraph(
  doc: JsPDFDoc,
  y: number,
  label: string,
  value: string
): number {
  doc.setFont("helvetica", "bold")
  doc.setFontSize(9)
  rgb(doc, PDF_COLORS.navy)
  doc.text(`${label} :`, PDF_LAYOUT.marginX, y)
  doc.setFont("helvetica", "normal")
  rgb(doc, PDF_COLORS.muted)
  const wrapped = doc.splitTextToSize(value, PDF_LAYOUT.contentW - 28)
  doc.text(wrapped, PDF_LAYOUT.marginX + 26, y)
  return y + Math.max(5, wrapped.length * 4.2) + 1
}

export type QuoteTableColumn = { key: string; title: string; width: number }

export function drawQuoteTableHeader(
  doc: JsPDFDoc,
  y: number,
  columns: QuoteTableColumn[]
): number {
  const x0 = PDF_LAYOUT.marginX
  const rowH = 7
  fillRgb(doc, PDF_COLORS.green)
  doc.rect(x0, y - 4.5, PDF_LAYOUT.contentW, rowH, "F")
  doc.setFont("helvetica", "bold")
  doc.setFontSize(8)
  doc.setTextColor(255, 255, 255)
  let x = x0 + 2
  for (const col of columns) {
    doc.text(col.title, x, y)
    x += col.width
  }
  return y + rowH - 2
}

export function drawQuoteTableRow(
  doc: JsPDFDoc,
  y: number,
  columns: QuoteTableColumn[],
  cells: Record<string, string>,
  stripe?: boolean
): number {
  const x0 = PDF_LAYOUT.marginX
  if (stripe) {
    fillRgb(doc, PDF_COLORS.panel)
    doc.rect(x0, y - 3.5, PDF_LAYOUT.contentW, 14, "F")
  }
  doc.setDrawColor(PDF_COLORS.border.r, PDF_COLORS.border.g, PDF_COLORS.border.b)
  doc.setLineWidth(0.1)
  doc.rect(x0, y - 3.5, PDF_LAYOUT.contentW, 14)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  rgb(doc, PDF_COLORS.navy)

  let x = x0 + 2
  let maxLines = 1
  for (const col of columns) {
    const raw = cells[col.key] ?? ""
    const wrapped = doc.splitTextToSize(raw, col.width - 3)
    doc.text(wrapped, x, y)
    maxLines = Math.max(maxLines, wrapped.length)
    x += col.width
  }
  return y + Math.max(14, maxLines * 3.5 + 4)
}

export function drawTotalsBlock(
  doc: JsPDFDoc,
  y: number,
  lines: { label: string; value: string; bold?: boolean }[]
): number {
  const xLabel = PDF_LAYOUT.marginX + PDF_LAYOUT.contentW - 68
  const xVal = PDF_LAYOUT.marginX + PDF_LAYOUT.contentW - 2
  for (const line of lines) {
    doc.setFont("helvetica", line.bold ? "bold" : "normal")
    doc.setFontSize(line.bold ? 10 : 9)
    rgb(doc, line.bold ? PDF_COLORS.navy : PDF_COLORS.muted)
    doc.text(line.label, xLabel, y, { align: "right" })
    doc.text(line.value, xVal, y, { align: "right" })
    y += line.bold ? 7 : 5.5
  }
  return y + 2
}

export function drawNoteBox(doc: JsPDFDoc, y: number, title: string, paragraphs: string[]): number {
  y = drawSectionHeading(doc, y, title)
  let boxH = 8
  const wrappedBlocks: string[][] = []
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  for (const p of paragraphs) {
    const w = doc.splitTextToSize(p, PDF_LAYOUT.contentW - 8)
    wrappedBlocks.push(w)
    boxH += w.length * 3.5 + 2
  }
  fillRgb(doc, PDF_COLORS.panel)
  doc.rect(PDF_LAYOUT.marginX, y - 3, PDF_LAYOUT.contentW, boxH, "F")
  let innerY = y + 2
  rgb(doc, PDF_COLORS.muted)
  for (const w of wrappedBlocks) {
    doc.text(w, PDF_LAYOUT.marginX + 4, innerY)
    innerY += w.length * 3.5 + 2
  }
  return innerY + 4
}

export function drawLegalFooter(doc: JsPDFDoc) {
  const foot =
    `${LEGAL_COMPANY.name} — ${LEGAL_COMPANY.legalForm} au capital de ${LEGAL_COMPANY.capital} — SIRET ${LEGAL_COMPANY.siret} — ${LEGAL_COMPANY.rcs} — Code APE : 82.99Z — TVA ${LEGAL_COMPANY.tva}`
  doc.setFont("helvetica", "normal")
  doc.setFontSize(7)
  rgb(doc, PDF_COLORS.muted)
  const lines = doc.splitTextToSize(foot, PDF_LAYOUT.contentW)
  const pageH = doc.internal.pageSize.getHeight()
  doc.text(lines, PDF_LAYOUT.marginX, pageH - 8)
}

export function renderCgvIntoDoc(doc: JsPDFDoc, sections: readonly LegalSection[] = cgvSections) {
  let y = drawDocumentTitleBar(
    doc,
    "Conditions générales de vente",
    LEGAL_COMPANY.name
  )

  y += 2
  doc.setFont("helvetica", "normal")
  doc.setFontSize(8)
  rgb(doc, PDF_COLORS.muted)
  const intro = doc.splitTextToSize(
    "Les présentes conditions s'appliquent à votre commande auprès de CORE Environnement. Ce document reprend le texte officiel des CGV sans modification de fond.",
    PDF_LAYOUT.contentW
  )
  doc.text(intro, PDF_LAYOUT.marginX, y)
  y += intro.length * 3.5 + 6

  const pageH = doc.internal.pageSize.getHeight()
  const bottom = pageH - 14

  for (const section of sections) {
    if (y > bottom - 20) {
      drawLegalFooter(doc)
      doc.addPage()
      y = drawDocumentTitleBar(doc, "Conditions générales de vente (suite)")
      y += 4
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    rgb(doc, PDF_COLORS.greenDark)
    const titleLines = doc.splitTextToSize(section.title, PDF_LAYOUT.contentW)
    doc.text(titleLines, PDF_LAYOUT.marginX, y)
    y += titleLines.length * 4 + 2

    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    rgb(doc, PDF_COLORS.navy)

    for (const block of section.paragraphs) {
      const text = legalParagraphText(block)
      const wrapped = doc.splitTextToSize(text, PDF_LAYOUT.contentW)
      if (y + wrapped.length * 3.4 > bottom) {
        drawLegalFooter(doc)
        doc.addPage()
        y = drawDocumentTitleBar(doc, "Conditions générales de vente (suite)")
        y += 4
      }
      doc.text(wrapped, PDF_LAYOUT.marginX, y)
      y += wrapped.length * 3.4 + 2.5
    }
    y += 2
  }

  drawLegalFooter(doc)
}

export function buildCgvPdfBytes(): Uint8Array {
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  renderCgvIntoDoc(doc)
  return new Uint8Array(doc.output("arraybuffer") as ArrayBuffer)
}