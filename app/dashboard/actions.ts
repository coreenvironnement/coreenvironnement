"use server"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"
import { userHasChantierAccess } from "@/lib/dashboard/chantier-data"

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

  const intervention = doc.interventions as { chantier_id: string } | null
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
