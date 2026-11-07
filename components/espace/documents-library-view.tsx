import { FileText } from "lucide-react"

import { DocumentDownloadButton } from "@/components/dashboard/document-download-button"
import { ChantierSubscriptionGate } from "@/components/espace/chantier-subscription-gate"
import { EspacePageHeader, EspacePanel } from "@/components/espace/espace-panel"
import { formatDateFr } from "@/lib/format/date"
import type { LibraryDocument } from "@/lib/dashboard/documents-library"

export function DocumentsLibraryView({
  documents,
  locked,
}: {
  documents: LibraryDocument[]
  locked: boolean
}) {
  if (locked) {
    return (
      <div className="mx-auto max-w-4xl space-y-5">
        <EspacePageHeader title="Mes documents" meta="BI, pesée, BSD" />
        <ChantierSubscriptionGate />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <EspacePageHeader
        title="Mes documents"
        meta={`${documents.length} fichier${documents.length === 1 ? "" : "s"}`}
      />

      {documents.length === 0 ? (
        <EspacePanel className="text-center text-sm text-muted-foreground">
          Aucun document pour le moment.
        </EspacePanel>
      ) : (
        <EspacePanel className="p-0 overflow-hidden">
          <ul className="divide-y divide-[#35A238]/10">
            {documents.map((doc) => (
              <li
                key={doc.documentId}
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <FileText className="mt-0.5 size-5 shrink-0 text-[#35A238]" aria-hidden />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-brand-navy">{doc.typeLabel}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.chantierNom} · {doc.interventionNumero}
                      {doc.dateLabel ? ` · ${formatDateFr(doc.dateLabel)}` : null}
                    </p>
                  </div>
                </div>
                <DocumentDownloadButton
                  documentId={doc.documentId}
                  label="Télécharger"
                  fileName={doc.fileName}
                />
              </li>
            ))}
          </ul>
        </EspacePanel>
      )}
    </div>
  )
}
