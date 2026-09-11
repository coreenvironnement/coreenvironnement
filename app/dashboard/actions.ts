"use server"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import {
  getUserChantiers,
  loadChantierInterventions,
  userHasChantierAccess,
} from "@/lib/dashboard/chantier-data"
import {
  buildHistoriquePdfBase64,
  buildHistoriqueXlsxBase64,
  historiqueFilename,
} from "@/lib/dashboard/export-historique"
import { STATUTS_INTERVENTION, TYPES_DOCUMENTS } from "@/lib/cdc/referentiels"

const BUCKET = "intervention-documents"

export async function getInterventionDocumentUrl(documentId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié." }
  }

  const { data: doc, error: docError } = await supabase
    .from("intervention_documents")
    .select("id, storage_path, file_name, intervention_id, interventions(chantier_id)")
    .eq("id", documentId)
    .single()

  if (docError || !doc) {
    return { error: "Document introuvable." }
  }

  const intervention = doc.interventions as unknown as { chantier_id: string } | null
  const chantierId = intervention?.chantier_id

  if (!chantierId) {
    return { error: "Chantier introuvable." }
  }

  const allowed = await userHasChantierAccess(supabase, user.id, chantierId)
  if (!allowed) {
    return { error: "Accès refusé." }
  }

  const service = createServiceClient()
  const { data: signed, error: signError } = await service.storage
    .from(BUCKET)
    .createSignedUrl(doc.storage_path, 120)

  if (signError || !signed?.signedUrl) {
    return { error: signError?.message ?? "Impossible de générer le lien." }
  }

  return { url: signed.signedUrl, fileName: doc.file_name }
}

export async function exportHistorique(chantierId: string, format: "xlsx" | "pdf") {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié." }
  }

  const allowed = await userHasChantierAccess(supabase, user.id, chantierId)
  if (!allowed) {
    return { error: "Accès refusé." }
  }

  const chantiers = await getUserChantiers(supabase, user.id)
  const chantier = chantiers.find((c) => c.id === chantierId)
  const chantierNom = chantier?.nom ?? "Chantier"

  const statutLabels = Object.fromEntries(
    STATUTS_INTERVENTION.map((s) => [s.code, s.label])
  )
  const documentLabels = Object.fromEntries(
    TYPES_DOCUMENTS.map((d) => [d.code, d.label])
  )

  const rows = await loadChantierInterventions(
    supabase,
    chantierId,
    statutLabels,
    documentLabels
  )

  if (rows.length === 0) {
    return { error: "Aucune intervention à exporter pour ce chantier." }
  }

  if (format === "xlsx") {
    return {
      base64: buildHistoriqueXlsxBase64(rows),
      filename: historiqueFilename(chantierNom, "xlsx"),
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    }
  }

  return {
    base64: buildHistoriquePdfBase64(rows, chantierNom),
    filename: historiqueFilename(chantierNom, "pdf"),
    mimeType: "application/pdf",
  }
}
