"use client"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

import { uploadInterventionDocument } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { TYPES_DOCUMENTS } from "@/lib/cdc/referentiels"

type Props = {
  interventionId: string
  chantierId: string
  existing: Record<string, string | undefined>
}

export function DocumentUploadRow({ interventionId, chantierId, existing }: Props) {
  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleUpload(documentType: string, file: File | undefined) {
    if (!file) return
    setLoading(documentType)
    setMessage(null)

    const formData = new FormData()
    formData.set("intervention_id", interventionId)
    formData.set("chantier_id", chantierId)
    formData.set("document_type", documentType)
    formData.set("file", file)

    const result = await uploadInterventionDocument(formData)
    setLoading(null)

    if (result.error) {
      setMessage(result.error)
    } else {
      setMessage("Document enregistré.")
      window.location.reload()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {TYPES_DOCUMENTS.map(({ code, label }) => (
          <DocumentUploadButton
            key={code}
            label={label}
            uploaded={existing[code]}
            loading={loading === code}
            onSelect={(file) => handleUpload(code, file)}
          />
        ))}
      </div>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </div>
  )
}

function DocumentUploadButton({
  label,
  uploaded,
  loading,
  onSelect,
}: {
  label: string
  uploaded?: string
  loading: boolean
  onSelect: (file: File | undefined) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          onSelect(e.target.files?.[0])
          e.target.value = ""
        }}
      />
      <Button
        type="button"
        variant={uploaded ? "secondary" : "outline"}
        size="sm"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="size-3.5" aria-hidden />
        {loading ? "…" : uploaded ? `${label} ✓` : label}
      </Button>
    </div>
  )
}
