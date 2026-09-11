"use client"

import { useState, useTransition } from "react"
import { FileSpreadsheet, FileText, Loader2 } from "lucide-react"

import { exportHistorique } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"

type Props = {
  chantierId: string
  disabled?: boolean
}

function downloadBase64(base64: string, filename: string, mimeType: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  const blob = new Blob([bytes], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function HistoriqueExportButtons({ chantierId, disabled }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleExport(format: "xlsx" | "pdf") {
    setError(null)
    startTransition(async () => {
      const result = await exportHistorique(chantierId, format)
      if ("error" in result && result.error) {
        setError(result.error)
        return
      }
      if ("base64" in result && result.base64 && result.filename && result.mimeType) {
        downloadBase64(result.base64, result.filename, result.mimeType)
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={disabled || isPending}
        onClick={() => handleExport("xlsx")}
        className="gap-1.5"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <FileSpreadsheet className="size-4" aria-hidden />
        )}
        Export Excel
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isPending}
        onClick={() => handleExport("pdf")}
        className="gap-1.5"
      >
        {isPending ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          <FileText className="size-4" aria-hidden />
        )}
        Export PDF
      </Button>
      {error ? <p className="w-full text-xs text-destructive">{error}</p> : null}
    </div>
  )
}
