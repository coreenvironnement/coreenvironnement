import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

import { COLONNES_HISTORIQUE, TYPES_DOCUMENTS } from "@/lib/cdc/referentiels"
import { formatDateFr } from "@/lib/format/date"

import type { InterventionHistoryRow } from "./chantier-data"

function rowsToSheetData(rows: InterventionHistoryRow[]): string[][] {
  return rows.map((row) => {
    const docByType = Object.fromEntries(
      row.documents.map((d) => [d.documentType, d.fileName])
    )

    return [
      row.numero,
      formatDateFr(row.dateDemande),
      row.typeLabel,
      row.contenantLabel,
      row.dechetNom,
      formatDateFr(row.dateSouhaitee),
      row.statutLabel,
      formatDateFr(row.dateReelle),
      row.commentaire?.trim() || "—",
      ...TYPES_DOCUMENTS.map((t) => (docByType[t.code] ? "Disponible (PDF)" : "—")),
    ]
  })
}

export function buildHistoriqueXlsxBase64(rows: InterventionHistoryRow[]): string {
  const headers = [...COLONNES_HISTORIQUE]
  const ws = XLSX.utils.aoa_to_sheet([headers, ...rowsToSheetData(rows)])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Historique")
  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer
  return buffer.toString("base64")
}

export function buildHistoriquePdfBase64(
  rows: InterventionHistoryRow[],
  chantierNom: string
): string {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" })

  doc.setFontSize(14)
  doc.setTextColor(27, 65, 143)
  doc.text(`Historique des prestations — ${chantierNom}`, 14, 14)

  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text(`Export CORE ENVIRONNEMENT · ${formatDateFr(new Date().toISOString())}`, 14, 20)

  autoTable(doc, {
    head: [[...COLONNES_HISTORIQUE]],
    body: rowsToSheetData(rows),
    startY: 26,
    styles: { fontSize: 6.5, cellPadding: 1.2, overflow: "linebreak" },
    headStyles: { fillColor: [27, 65, 143], textColor: 255, fontSize: 6.5 },
    margin: { left: 10, right: 10 },
  })

  const arrayBuffer = doc.output("arraybuffer")
  return Buffer.from(arrayBuffer).toString("base64")
}

export function historiqueFilename(chantierNom: string, ext: "xlsx" | "pdf"): string {
  const slug =
    chantierNom
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "chantier"

  return `historique-${slug}-${new Date().toISOString().slice(0, 10)}.${ext}`
}
