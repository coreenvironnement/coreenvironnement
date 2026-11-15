import * as XLSX from "xlsx"

export type ExcelColumn<T> = {
  header: string
  value: (row: T) => string | number | null | undefined
}

export function buildExcelBuffer<T>(rows: T[], columns: ExcelColumn<T>[]): Buffer {
  const sheetData = [
    columns.map((c) => c.header),
    ...rows.map((row) => columns.map((c) => c.value(row) ?? "")),
  ]
  const ws = XLSX.utils.aoa_to_sheet(sheetData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, "Export")
  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer
}