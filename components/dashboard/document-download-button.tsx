"use client"

import { useState, useTransition } from "react"
import { Download, Loader2 } from "lucide-react"

import { getInterventionDocumentUrl } from "@/app/dashboard/actions"
import { Button } from "@/components/ui/button"

type Props = {
  documentId: string
  label: string
  fileName?: string
}

export function DocumentDownloadButton({ documentId, label, fileName }: Props) {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleDownload() {
    setError(null)
    startTransition(async () => {
      const result = await getInterventionDocumentUrl(documentId)
      if ("error" in result && result.error) {
        setError(result.error)
        return
      }
      if ("url" in result && result.url) {
        const anchor = document.createElement("a")
        anchor.href = result.url
        anchor.download = result.fileName ?? fileName ?? "document.pdf"
        anchor.target = "_blank"
        anchor.rel = "noopener noreferrer"
        anchor.click()
      }
    })
  }

  return (
    <div className="inline-flex flex-col gap-0.5">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownload}
        disabled={isPending}
        className="h-8 gap-1.5 px-2 text-xs"
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" aria-hidden />
        ) : (
          <Download className="size-3.5" aria-hidden />
        )}
        {label}
      </Button>
      {error ? <span className="text-[10px] text-destructive">{error}</span> : null}
    </div>
  )
}
