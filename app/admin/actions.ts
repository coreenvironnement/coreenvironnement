"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { requireAdmin } from "@/lib/auth/require-admin"
import {
  canCreateInterventionFromCommande,
  chantierNomFromCommande,
  contenantCodeForCommande,
  interventionCommentFromCommande,
} from "@/lib/commande/intervention-from-commande"
import { notifyCompteProReviewed } from "@/lib/email/notifications"
import { createServiceClient } from "@/lib/supabase/service"

const BUCKET = "intervention-documents"
const PRO_BUCKET = "compte-pro-documents"

async function assertAdmin() {
  const { supabase, user } = await requireAdmin()
  return { supabase, user }
}

function revalidateAdmin(chantierId?: string) {
  revalidatePath("/admin")
  revalidatePath("/admin/chantiers")
  if (chantierId) {
    revalidatePath(`/admin/chantiers/${chantierId}`)
  }
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/historique")
  revalidatePath("/admin/comptes-pro")
  revalidatePath("/pro")
}

function revalidateComptePro(compteId: string) {
  revalidatePath("/admin/comptes-pro")
  revalidatePath(`/admin/comptes-pro/${compteId}`)
  revalidatePath("/pro")
}

function revalidateCommande(commandeId: string, chantierId?: string) {
  revalidatePath("/admin")
  revalidatePath("/admin/commandes")
  revalidatePath(`/admin/commandes/${commandeId}`)
  if (chantierId) {
    revalidatePath("/admin/chantiers")
    revalidatePath(`/admin/chantiers/${chantierId}`)
  }
}

export async function createChantier(formData: FormData): Promise<void> {
  const { supabase } = await assertAdmin()

  const nom = String(formData.get("nom") ?? "").trim()
  const adresse = String(formData.get("adresse") ?? "").trim()
  const code_affaire = String(formData.get("code_affaire") ?? "").trim()

  if (!nom) {
    redirect(`/admin/chantiers?error=${encodeURIComponent("Le nom du chantier est obligatoire.")}`)
  }

  const { data, error } = await supabase
    .from("chantiers")
    .insert({
      nom,
      adresse: adresse || null,
      code_affaire: code_affaire || null,
    })
    .select("id")
    .single()

  if (error) {
    redirect(`/admin/chantiers?error=${encodeURIComponent(error.message)}`)
  }

  revalidateAdmin(data.id)
  redirect(`/admin/chantiers/${data.id}`)
}

export async function updateChantier(chantierId: string, formData: FormData): Promise<void> {
  const { supabase } = await assertAdmin()

  const nom = String(formData.get("nom") ?? "").trim()
  const adresse = String(formData.get("adresse") ?? "").trim()
  const code_affaire = String(formData.get("code_affaire") ?? "").trim()
  const is_active = formData.get("is_active") === "on"
  const prestataireRaw = String(formData.get("prestataire_id") ?? "").trim()
  const prestataire_id = prestataireRaw || null

  if (!nom) {
    return
  }

  const { error } = await supabase
    .from("chantiers")
    .update({
      nom,
      adresse: adresse || null,
      code_affaire: code_affaire || null,
      is_active,
      prestataire_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chantierId)

  if (error) {
    return
  }

  revalidateAdmin(chantierId)
}

export async function addChantierMember(chantierId: string, formData: FormData) {
  const { supabase, user } = await assertAdmin()

  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const sendInvite = formData.get("send_invite") === "on"
  const contact_prenom = String(formData.get("contact_prenom") ?? "").trim() || null
  const contact_nom = String(formData.get("contact_nom") ?? "").trim() || null
  const contact_fonction = String(formData.get("contact_fonction") ?? "").trim() || null
  const contact_entreprise = String(formData.get("contact_entreprise") ?? "").trim() || null

  if (!email || !email.includes("@")) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("E-mail invalide.")}`
    )
  }

  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, email")
    .ilike("email", email)
    .maybeSingle()

  const { error } = await supabase.from("chantier_membres").insert({
    chantier_id: chantierId,
    profile_id: existingProfile?.id ?? null,
    invited_email: existingProfile ? null : email,
    contact_prenom,
    contact_nom,
    contact_fonction,
    contact_entreprise,
    created_by: user.id,
  })

  if (error) {
    const message =
      error.code === "23505"
        ? "Cet e-mail est déjà lié à ce chantier."
        : error.message
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent(message)}`
    )
  }

  let inviteNote = existingProfile ? "linked" : "pending"

  if (sendInvite && !existingProfile) {
    try {
      const service = createServiceClient()
      const headersList = await headers()
      const origin =
        headersList.get("origin") ??
        process.env.NEXT_PUBLIC_SITE_URL ??
        "http://localhost:3000"

      const { error: inviteError } = await service.auth.admin.inviteUserByEmail(
        email,
        {
          redirectTo: `${origin}/auth/callback?next=/dashboard`,
        }
      )

      if (inviteError) {
        inviteNote = `invite_failed:${inviteError.message}`
      } else {
        inviteNote = "invite_sent"
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invitation impossible"
      inviteNote = `invite_failed:${message}`
    }
  }

  revalidateAdmin(chantierId)
  redirect(`/admin/chantiers/${chantierId}?member=${encodeURIComponent(inviteNote)}`)
}

export async function updateChantierMemberForm(
  memberId: string,
  chantierId: string,
  formData: FormData
) {
  const { supabase } = await assertAdmin()

  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const contact_prenom = String(formData.get("contact_prenom") ?? "").trim() || null
  const contact_nom = String(formData.get("contact_nom") ?? "").trim() || null
  const contact_fonction = String(formData.get("contact_fonction") ?? "").trim() || null
  const contact_entreprise = String(formData.get("contact_entreprise") ?? "").trim() || null

  if (!email || !email.includes("@")) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("E-mail invalide.")}`
    )
  }

  const { data: member } = await supabase
    .from("chantier_membres")
    .select("profile_id")
    .eq("id", memberId)
    .single()

  if (!member) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("Contact introuvable.")}`
    )
  }

  const payload: Record<string, unknown> = {
    contact_prenom,
    contact_nom,
    contact_fonction,
    contact_entreprise,
  }

  if (!member.profile_id) {
    payload.invited_email = email
  }

  const { error } = await supabase
    .from("chantier_membres")
    .update(payload)
    .eq("id", memberId)

  if (error) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent(error.message)}`
    )
  }

  revalidateAdmin(chantierId)
  redirect(`/admin/chantiers/${chantierId}?member=updated`)
}

export async function removeChantierMember(memberId: string, chantierId: string) {
  const { supabase } = await assertAdmin()

  const { error } = await supabase
    .from("chantier_membres")
    .delete()
    .eq("id", memberId)

  if (error) {
    return { error: error.message }
  }

  revalidateAdmin(chantierId)
  return { success: true }
}

export async function removeChantierMemberForm(
  memberId: string,
  chantierId: string,
  _formData: FormData
) {
  await removeChantierMember(memberId, chantierId)
  redirect(`/admin/chantiers/${chantierId}?member=removed`)
}

export async function createIntervention(chantierId: string, formData: FormData): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const type_intervention_id = String(formData.get("type_intervention_id") ?? "")
  const contenant_id = String(formData.get("contenant_id") ?? "")
  const dechet_type_id = String(formData.get("dechet_type_id") ?? "")
  const statut = String(formData.get("statut") ?? "en_cours_programmation")
  const date_demande = String(formData.get("date_demande") ?? "")
  const date_souhaitee = String(formData.get("date_souhaitee") ?? "")
  const date_reelle = String(formData.get("date_reelle") ?? "")
  const commentaire = String(formData.get("commentaire") ?? "").trim()

  if (!type_intervention_id || !contenant_id || !dechet_type_id || !date_demande) {
    return
  }

  const { error } = await supabase.from("interventions").insert({
    chantier_id: chantierId,
    type_intervention_id,
    contenant_id,
    dechet_type_id,
    statut,
    date_demande,
    date_souhaitee: date_souhaitee || null,
    date_reelle: date_reelle || null,
    commentaire: commentaire || null,
    created_by: user.id,
  })

  if (error) {
    return
  }

  revalidateAdmin(chantierId)
}

export async function updateInterventionStatut(
  interventionId: string,
  chantierId: string,
  formData: FormData
): Promise<void> {
  const { supabase } = await assertAdmin()

  const statut = String(formData.get("statut") ?? "")
  const date_reelle = String(formData.get("date_reelle") ?? "")
  const commentaire = String(formData.get("commentaire") ?? "").trim()

  const { error } = await supabase
    .from("interventions")
    .update({
      statut,
      date_reelle: date_reelle || null,
      commentaire: commentaire || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", interventionId)

  if (error) {
    return
  }

  revalidateAdmin(chantierId)
}

export async function upsertStatsDechet(chantierId: string, formData: FormData): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const dechet_type_id = String(formData.get("dechet_type_id") ?? "")
  const tonnage_t = Number(formData.get("tonnage_t") ?? 0)

  if (!dechet_type_id || tonnage_t < 0) {
    return
  }

  const { error } = await supabase.from("chantier_stats_dechets").upsert(
    {
      chantier_id: chantierId,
      dechet_type_id,
      tonnage_t,
      periode_debut: null,
      periode_fin: null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "chantier_id,dechet_type_id,periode_debut,periode_fin" }
  )

  if (error) {
    return
  }

  revalidateAdmin(chantierId)
}

export async function upsertStatsValorisation(chantierId: string, formData: FormData) {
  const { supabase, user } = await assertAdmin()

  const valorisation_pct = Number(formData.get("valorisation_pct") ?? 0)
  const elimination_pct = Number(formData.get("elimination_pct") ?? 0)

  if (
    valorisation_pct < 0 ||
    valorisation_pct > 100 ||
    elimination_pct < 0 ||
    elimination_pct > 100
  ) {
    return { error: "Pourcentages entre 0 et 100." }
  }

  const { error } = await supabase.from("chantier_stats_valorisation").upsert(
    {
      chantier_id: chantierId,
      valorisation_pct,
      elimination_pct,
      periode_debut: null,
      periode_fin: null,
      updated_by: user.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "chantier_id,periode_debut,periode_fin" }
  )

  if (error) {
    return { error: error.message }
  }

  revalidateAdmin(chantierId)
  return { success: true }
}

export async function uploadInterventionDocument(formData: FormData) {
  await assertAdmin()

  const interventionId = String(formData.get("intervention_id") ?? "")
  const chantierId = String(formData.get("chantier_id") ?? "")
  const documentType = String(formData.get("document_type") ?? "")
  const file = formData.get("file")

  if (!interventionId || !chantierId || !documentType) {
    return { error: "Paramètres manquants." }
  }

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Fichier requis." }
  }

  if (file.type !== "application/pdf") {
    return { error: "Seuls les fichiers PDF sont acceptés." }
  }

  const service = createServiceClient()
  const storagePath = `${interventionId}/${documentType}/${Date.now()}-${file.name}`

  const buffer = Buffer.from(await file.arrayBuffer())
  const { error: uploadError } = await service.storage
    .from(BUCKET)
    .upload(storagePath, buffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  const { supabase, user } = await assertAdmin()

  const { error: docError } = await supabase.from("intervention_documents").upsert(
    {
      intervention_id: interventionId,
      document_type: documentType,
      storage_path: storagePath,
      file_name: file.name,
      mime_type: file.type,
      file_size_bytes: file.size,
      uploaded_by: user.id,
      uploaded_at: new Date().toISOString(),
    },
    { onConflict: "intervention_id,document_type" }
  )

  if (docError) {
    return { error: docError.message }
  }

  revalidateAdmin(chantierId)
  return { success: true }
}

export async function reviewComptePro(compteId: string, formData: FormData): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const decision = String(formData.get("decision") ?? "")
  const payment_mode = String(formData.get("payment_mode") ?? "")
  const review_notes = String(formData.get("review_notes") ?? "").trim()

  if (decision !== "approve" && decision !== "reject") {
    return
  }

  if (decision === "approve" && payment_mode !== "cb_required" && payment_mode !== "invoice") {
    return
  }

  const { data: compteBefore } = await supabase
    .from("comptes_pro")
    .select("status, contact_email, contact_nom, raison_sociale")
    .eq("id", compteId)
    .single()

  const { error } = await supabase
    .from("comptes_pro")
    .update({
      status: decision === "approve" ? "approved" : "rejected",
      payment_mode: decision === "approve" ? payment_mode : null,
      review_notes: review_notes || null,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", compteId)

  if (error) {
    return
  }

  if (
    compteBefore?.status === "pending" &&
    compteBefore.contact_email &&
    compteBefore.contact_nom &&
    compteBefore.raison_sociale
  ) {
    await notifyCompteProReviewed({
      contactEmail: compteBefore.contact_email,
      contactNom: compteBefore.contact_nom,
      raisonSociale: compteBefore.raison_sociale,
      approved: decision === "approve",
      paymentMode: decision === "approve" ? payment_mode : null,
      reviewNotes: review_notes || null,
    })
  }

  revalidateComptePro(compteId)
}

export async function getCompteProDocumentUrl(compteId: string, kind: "kbis" | "rib") {
  const { supabase } = await assertAdmin()

  const { data: compte, error } = await supabase
    .from("comptes_pro")
    .select("kbis_storage_path, rib_storage_path")
    .eq("id", compteId)
    .single()

  if (error || !compte) {
    return { error: "Dossier introuvable." }
  }

  const storagePath = kind === "kbis" ? compte.kbis_storage_path : compte.rib_storage_path
  if (!storagePath) {
    return { error: "Document absent." }
  }

  const service = createServiceClient()
  const { data: signed, error: signError } = await service.storage
    .from(PRO_BUCKET)
    .createSignedUrl(storagePath, 120)

  if (signError || !signed?.signedUrl) {
    return { error: signError?.message ?? "Impossible de générer le lien." }
  }

  const fileName = storagePath.split("/").pop() ?? `${kind}.pdf`
  return { url: signed.signedUrl, fileName }
}

const STATUTS_COMMANDE_VALIDES = [
  "brouillon",
  "confirmee",
  "en_cours",
  "livree",
  "annulee",
] as const

export async function updateCommandeStatut(commandeId: string, formData: FormData): Promise<void> {
  const { supabase } = await assertAdmin()

  const statut = String(formData.get("statut") ?? "").trim()
  if (!STATUTS_COMMANDE_VALIDES.includes(statut as (typeof STATUTS_COMMANDE_VALIDES)[number])) {
    redirect(`/admin/commandes/${commandeId}`)
  }

  const { error } = await supabase.from("commandes").update({ statut }).eq("id", commandeId)

  if (error) {
    redirect(
      `/admin/commandes/${commandeId}?error=${encodeURIComponent(error.message)}`
    )
  }

  revalidateCommande(commandeId)
  redirect(`/admin/commandes/${commandeId}`)
}

export async function createInterventionFromCommande(commandeId: string): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const { data: commande, error: commandeError } = await supabase
    .from("commandes")
    .select(
      "id, adresse_complete, type_dechet_id, volume_m3, date_livraison, contact_nom, contact_email, prestation_label, payment_status, statut"
    )
    .eq("id", commandeId)
    .single()

  if (commandeError || !commande) {
    redirect("/admin/commandes")
  }

  const { data: existing } = await supabase
    .from("interventions")
    .select("id")
    .eq("commande_id", commandeId)
    .maybeSingle()

  const eligibility = canCreateInterventionFromCommande(commande, Boolean(existing))
  if (!eligibility.ok) {
    redirect(
      `/admin/commandes/${commandeId}?error=${encodeURIComponent(eligibility.reason)}`
    )
  }

  const [{ data: typeDepose }, { data: contenant }] = await Promise.all([
    supabase.from("types_intervention").select("id").eq("code", "depose").maybeSingle(),
    supabase
      .from("types_contenants")
      .select("id")
      .eq("code", contenantCodeForCommande(commande.volume_m3))
      .maybeSingle(),
  ])

  if (!typeDepose?.id || !contenant?.id) {
    redirect(
      `/admin/commandes/${commandeId}?error=${encodeURIComponent("Référentiel intervention incomplet (type dépose ou contenant).")}`
    )
  }

  const { data: chantier, error: chantierError } = await supabase
    .from("chantiers")
    .insert({
      nom: chantierNomFromCommande(commande),
      adresse: commande.adresse_complete,
      is_active: true,
    })
    .select("id")
    .single()

  if (chantierError || !chantier) {
    redirect(
      `/admin/commandes/${commandeId}?error=${encodeURIComponent(chantierError?.message ?? "Impossible de créer le chantier.")}`
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  const { data: intervention, error: interventionError } = await supabase
    .from("interventions")
    .insert({
      chantier_id: chantier.id,
      commande_id: commandeId,
      type_intervention_id: typeDepose.id,
      contenant_id: contenant.id,
      dechet_type_id: commande.type_dechet_id,
      statut: "programme",
      date_demande: today,
      date_souhaitee: commande.date_livraison,
      commentaire: interventionCommentFromCommande(commande),
      created_by: user.id,
    })
    .select("id, numero")
    .single()

  if (interventionError || !intervention) {
    redirect(
      `/admin/commandes/${commandeId}?error=${encodeURIComponent(interventionError?.message ?? "Impossible de créer l'intervention.")}`
    )
  }

  if (commande.statut === "confirmee") {
    await supabase.from("commandes").update({ statut: "en_cours" }).eq("id", commandeId)
  }

  revalidateCommande(commandeId, chantier.id)
  redirect(
    `/admin/commandes/${commandeId}?intervention=${encodeURIComponent(intervention.numero)}`
  )
}
