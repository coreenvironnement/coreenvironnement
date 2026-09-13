"use server"

import { revalidatePath } from "next/cache"

import { createClient } from "@/lib/supabase/server"
import { createServiceClient } from "@/lib/supabase/service"

const BUCKET = "compte-pro-documents"
const ALLOWED_MIME = new Set(["application/pdf", "image/jpeg", "image/png"])
const MAX_BYTES = 10 * 1024 * 1024

function validateDocument(file: FormDataEntryValue | null, label: string) {
  if (!(file instanceof File) || file.size === 0) {
    return { error: `${label} obligatoire.` }
  }
  if (file.size > MAX_BYTES) {
    return { error: `${label} : taille max 10 Mo.` }
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { error: `${label} : PDF, JPEG ou PNG uniquement.` }
  }
  return { file }
}

async function uploadProDocument(
  profileId: string,
  kind: "kbis" | "rib",
  file: File
): Promise<{ path?: string; error?: string }> {
  const service = createServiceClient()
  const storagePath = `${profileId}/${kind}/${Date.now()}-${file.name}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error } = await service.storage.from(BUCKET).upload(storagePath, buffer, {
    contentType: file.type,
    upsert: true,
  })

  if (error) {
    return { error: error.message }
  }

  return { path: storagePath }
}

export async function submitComptePro(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Connectez-vous pour soumettre une demande de compte pro." }
  }

  const raison_sociale = String(formData.get("raison_sociale") ?? "").trim()
  const siret = String(formData.get("siret") ?? "").trim()
  const code_naf = String(formData.get("code_naf") ?? "").trim()
  const adresse_siege = String(formData.get("adresse_siege") ?? "").trim()
  const contact_nom = String(formData.get("contact_nom") ?? "").trim()
  const contact_fonction = String(formData.get("contact_fonction") ?? "").trim()
  const contact_telephone = String(formData.get("contact_telephone") ?? "").trim()
  const contact_email = String(formData.get("contact_email") ?? "").trim().toLowerCase()

  if (!raison_sociale || !contact_nom || !contact_email || !contact_email.includes("@")) {
    return { error: "Raison sociale, nom du contact et e-mail professionnel sont obligatoires." }
  }

  const kbisCheck = validateDocument(formData.get("kbis"), "KBIS")
  if ("error" in kbisCheck && kbisCheck.error) return { error: kbisCheck.error }

  const ribCheck = validateDocument(formData.get("rib"), "RIB")
  if ("error" in ribCheck && ribCheck.error) return { error: ribCheck.error }

  const { data: existing } = await supabase
    .from("comptes_pro")
    .select("id, status")
    .eq("profile_id", user.id)
    .maybeSingle()

  if (existing?.status === "approved") {
    return { error: "Votre compte pro est déjà validé." }
  }

  if (existing?.status === "pending") {
    return {
      error:
        "Une demande est déjà en cours d'examen. Notre service financier vous répond sous 24 h.",
    }
  }

  const kbisUpload = await uploadProDocument(user.id, "kbis", kbisCheck.file!)
  if (kbisUpload.error) return { error: kbisUpload.error }

  const ribUpload = await uploadProDocument(user.id, "rib", ribCheck.file!)
  if (ribUpload.error) return { error: ribUpload.error }

  const payload = {
    profile_id: user.id,
    raison_sociale,
    siret: siret || null,
    code_naf: code_naf || null,
    adresse_siege: adresse_siege || null,
    contact_nom,
    contact_fonction: contact_fonction || null,
    contact_telephone: contact_telephone || null,
    contact_email,
    kbis_storage_path: kbisUpload.path,
    rib_storage_path: ribUpload.path,
    status: "pending" as const,
    payment_mode: null,
    review_notes: null,
    reviewed_by: null,
    reviewed_at: null,
    updated_at: new Date().toISOString(),
  }

  const { error } = existing
    ? await supabase.from("comptes_pro").update(payload).eq("id", existing.id)
    : await supabase.from("comptes_pro").insert(payload)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/pro")
  revalidatePath("/dashboard")
  revalidatePath("/admin/comptes-pro")

  return { success: true }
}
