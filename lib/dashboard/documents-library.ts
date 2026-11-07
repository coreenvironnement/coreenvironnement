import type { SupabaseClient } from "@supabase/supabase-js"

import { STATUTS_INTERVENTION, TYPES_DOCUMENTS } from "@/lib/cdc/referentiels"
import { getUserChantiers, loadChantierInterventions } from "@/lib/dashboard/chantier-data"

export type LibraryDocument = {
  documentId: string
  fileName: string
  typeLabel: string
  interventionNumero: string
  chantierNom: string
  chantierId: string
  dateLabel: string | null
}

export async function loadUserDocumentsLibrary(
  supabase: SupabaseClient,
  userId: string
): Promise<LibraryDocument[]> {
  const chantiers = await getUserChantiers(supabase, userId)
  if (chantiers.length === 0) return []

  const statutLabels = Object.fromEntries(
    STATUTS_INTERVENTION.map((s) => [s.code, s.label])
  )
  const documentLabels = Object.fromEntries(
    TYPES_DOCUMENTS.map((d) => [d.code, d.label])
  )

  const out: LibraryDocument[] = []

  for (const chantier of chantiers) {
    const rows = await loadChantierInterventions(
      supabase,
      chantier.id,
      statutLabels,
      documentLabels
    )
    for (const row of rows) {
      for (const doc of row.documents) {
        out.push({
          documentId: doc.id,
          fileName: doc.fileName,
          typeLabel: doc.label,
          interventionNumero: row.numero,
          chantierNom: chantier.nom,
          chantierId: chantier.id,
          dateLabel: row.dateReelle ?? row.dateDemande,
        })
      }
    }
  }

  return out.sort((a, b) => (b.dateLabel ?? "").localeCompare(a.dateLabel ?? ""))
}
