import Link from "next/link"

import { DocumentDownloadButton } from "@/components/dashboard/document-download-button"
import { formatDateFr } from "@/lib/format/date"
import type { InterventionHistoryRow } from "@/lib/dashboard/chantier-data"
import { COLONNES_HISTORIQUE, TYPES_DOCUMENTS } from "@/lib/cdc/referentiels"

type Props = {
  rows: InterventionHistoryRow[]
}

const DOC_TYPES = TYPES_DOCUMENTS.map((d) => d.code)

export function InterventionHistoryTable({ rows }: Props) {
  return (
    <div className="overflow-x-auto rounded-xl border border-brand-navy/12 bg-background shadow-sm">
      <table className="w-full min-w-[1200px] text-left text-sm">
        <thead>
          <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground">
            {COLONNES_HISTORIQUE.map((col) => (
              <th key={col} className="px-3 py-3 font-medium whitespace-nowrap">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={COLONNES_HISTORIQUE.length}
                className="px-3 py-10 text-center text-muted-foreground"
              >
                Aucune intervention enregistrée pour ce chantier.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const docByType = Object.fromEntries(
                row.documents.map((d) => [d.documentType, d])
              )

              return (
                <tr key={row.id} className="border-b border-border/40 align-top">
                  <td className="px-3 py-3 font-mono text-xs">{row.numero}</td>
                  <td className="px-3 py-3 whitespace-nowrap">{formatDateFr(row.dateDemande)}</td>
                  <td className="px-3 py-3">{row.typeLabel}</td>
                  <td className="px-3 py-3">{row.contenantLabel}</td>
                  <td className="px-3 py-3">{row.dechetNom}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatDateFr(row.dateSouhaitee)}
                  </td>
                  <td className="px-3 py-3">{row.statutLabel}</td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {formatDateFr(row.dateReelle)}
                  </td>
                  <td className="px-3 py-3 max-w-[200px] text-muted-foreground">
                    {row.commentaire?.trim() ? row.commentaire : "—"}
                  </td>
                  {DOC_TYPES.map((type) => {
                    const doc = docByType[type]
                    return (
                      <td key={type} className="px-3 py-3">
                        {doc ? (
                          <DocumentDownloadButton
                            documentId={doc.id}
                            label="PDF"
                            fileName={doc.fileName}
                          />
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}

export function DashboardSubNav({
  chantierId,
  active,
}: {
  chantierId?: string
  active: "overview" | "historique"
}) {
  if (!chantierId) return null

  return (
    <nav className="flex flex-wrap gap-2 border-b border-border/60 pb-4">
      <Link
        href={`/dashboard?chantier=${chantierId}`}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          active === "overview"
            ? "bg-brand-navy text-white"
            : "text-muted-foreground hover:bg-muted/60 hover:text-brand-navy"
        }`}
        aria-current={active === "overview" ? "page" : undefined}
      >
        Statistiques
      </Link>
      <Link
        href={`/dashboard/historique?chantier=${chantierId}`}
        className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
          active === "historique"
            ? "bg-brand-navy text-white"
            : "text-muted-foreground hover:bg-muted/60 hover:text-brand-navy"
        }`}
        aria-current={active === "historique" ? "page" : undefined}
      >
        Historique des prestations
      </Link>
    </nav>
  )
}
