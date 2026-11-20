"use server"

import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

import type Stripe from "stripe"

import { writeAuditLog } from "@/lib/admin/audit-log"
import {
  planifierCommandeLivraisonAdmin,
  planifierInterventionAdmin,
} from "@/lib/admin/planification-admin"
import { formatCreneauFrShort, parseAdminCreneauForm } from "@/lib/planning/creneau"
import { requireAdmin } from "@/lib/auth/require-admin"
import { syncProfileClientKind } from "@/lib/auth/sync-profile-client-kind"
import { sendCommandeCancellationIfClaimed } from "@/lib/commande/cancellation-email"
import {
  canCreateInterventionFromCommande,
  chantierNomFromCommande,
  contenantCodeForCommande,
  interventionCommentFromCommande,
} from "@/lib/commande/intervention-from-commande"
import { notifyCompteProReviewed } from "@/lib/email/notifications"
import { sendEmail } from "@/lib/email/send"
import { interventionProgrammeeEmail } from "@/lib/email/templates/intervention-programmee"
import { getStripe, isStripePaymentConfigured } from "@/lib/stripe/server"
import { syncCommandeFromRefund } from "@/lib/stripe/sync-commande"
import { createServiceClient } from "@/lib/supabase/service"
import type { SupabaseClient } from "@supabase/supabase-js"

const BUCKET = "intervention-documents"
const PRO_BUCKET = "compte-pro-documents"

async function assertAdmin() {
  const { supabase, user } = await requireAdmin()
  return { supabase, user }
}

function revalidateAdmin(chantierId?: string) {
  revalidatePath("/admin")
  revalidatePath("/admin/chantiers")
  revalidatePath("/admin/interventions")
  revalidatePath("/admin/clients")
  if (chantierId) {
    revalidatePath(`/admin/chantiers/${chantierId}`)
  }
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/historique")
  revalidatePath("/admin/comptes-pro")
  revalidatePath("/admin/prestataires")
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
  revalidatePath("/admin/interventions")
  revalidatePath(`/admin/interventions/${commandeId}`)
  revalidatePath(`/admin/interventions/${commandeId}`)
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
  if (!adresse) {
    redirect(
      `/admin/chantiers?error=${encodeURIComponent("L’adresse du chantier est obligatoire.")}`
    )
  }

  const { data, error } = await supabase
    .from("chantiers")
    .insert({
      nom,
      adresse,
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
  await updateInterventionStatutAdmin(interventionId, chantierId, formData, {
    redirectToInterventions: false,
  })
}

export async function updateInterventionStatutAdmin(
  interventionId: string,
  chantierId: string,
  formData: FormData,
  options?: { redirectToInterventions?: boolean }
): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const statut = String(formData.get("statut") ?? "")
  const date_reelle = String(formData.get("date_reelle") ?? "")
  const commentaire = String(formData.get("commentaire") ?? "").trim()
  const prestataireRaw = String(formData.get("prestataire_id") ?? "")
  const poidsRaw = String(formData.get("poids_reel_kg") ?? "").trim()

  const poids_reel_kg = poidsRaw ? Number(poidsRaw) : null

  const hasPlanFields = Boolean(formData.get("date") || formData.get("plan_date"))
  let planifiee_le: string | undefined
  let plan_dateYmd: string | undefined
  if (hasPlanFields) {
    const planPatch = parseAdminCreneauForm(formData)
    if ("error" in planPatch) {
      redirect(
        `/admin/interventions/${interventionId}?error=${encodeURIComponent(planPatch.error)}`
      )
    }
    planifiee_le = planPatch.atUtc
    plan_dateYmd = planPatch.dateYmd
  }

  const updateRow: Record<string, unknown> = {
    statut,
    date_reelle: date_reelle || null,
    commentaire: commentaire || null,
    prestataire_id: prestataireRaw || null,
    poids_reel_kg: poids_reel_kg != null && !Number.isNaN(poids_reel_kg) ? poids_reel_kg : null,
    updated_at: new Date().toISOString(),
  }
  if (planifiee_le) {
    updateRow.planifiee_le = planifiee_le
    updateRow.date_souhaitee = plan_dateYmd
  }

  const { error } = await supabase.from("interventions").update(updateRow).eq("id", interventionId)

  if (error) {
    if (options?.redirectToInterventions !== false) {
      redirect(
        `/admin/interventions/${interventionId}?error=${encodeURIComponent(error.message)}`
      )
    }
    return
  }

  await writeAuditLog(supabase, {
    entityType: "intervention",
    entityId: interventionId,
    action: "statut_modifie",
    detail: { statut, date_reelle, poids_reel_kg },
    actorId: user.id,
  })

  if (statut === "programme") {
    const { data: meta } = await supabase
      .from("interventions")
      .select("numero, date_souhaitee, planifiee_le, commande_id, chantiers ( nom )")
      .eq("id", interventionId)
      .single()
    const chantierNom =
      (meta?.chantiers as unknown as { nom: string } | null)?.nom ?? "votre chantier"
    const { data: membres } = await supabase
      .from("chantier_membres")
      .select("invited_email, profiles ( email )")
      .eq("chantier_id", chantierId)
      .limit(3)
    const recipients = new Set<string>()
    for (const m of membres ?? []) {
      const mail =
        m.invited_email ??
        (m.profiles as unknown as { email: string } | null)?.email ??
        null
      if (mail) recipients.add(mail)
    }
    const creneauLabel =
      formatCreneauFrShort(meta?.planifiee_le as string | null) ??
      meta?.date_souhaitee ??
      date_reelle
    const tpl = interventionProgrammeeEmail({
      numero: meta?.numero ?? interventionId,
      chantierNom,
      creneauLabel,
    })
    for (const to of recipients) {
      await sendEmail({ to, ...tpl })
    }
    if (meta?.commande_id && meta?.planifiee_le) {
      await supabase
        .from("commandes")
        .update({ livraison_planifiee_at: meta.planifiee_le as string })
        .eq("id", meta.commande_id)
    }
  }

  revalidateAdmin(chantierId)
  revalidatePath(`/admin/interventions/${interventionId}`)

  if (options?.redirectToInterventions !== false) {
    redirect(`/admin/interventions/${interventionId}?ok=statut`)
  }
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
    .select("status, contact_email, contact_nom, raison_sociale, profile_id")
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

  if (decision === "approve" && compteBefore?.profile_id) {
    await syncProfileClientKind(supabase, compteBefore.profile_id, "professionnel")
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

type DeletableBrouillonRow = {
  id: string
  statut: string
  payment_status: string | null
  stripe_payment_intent_id: string | null
}

type DeletableBrouillonCheck =
  | { ok: true; commande: DeletableBrouillonRow }
  | { ok: false; reason: string }

async function assertDeletableBrouillon(
  supabase: SupabaseClient,
  commandeId: string
): Promise<DeletableBrouillonCheck> {
  const { data: commande, error } = await supabase
    .from("commandes")
    .select("id, statut, payment_status, stripe_payment_intent_id")
    .eq("id", commandeId)
    .maybeSingle()

  if (error || !commande) {
    return { ok: false, reason: "Commande introuvable." }
  }

  if (commande.statut !== "brouillon") {
    return { ok: false, reason: "Seuls les brouillons peuvent être supprimés." }
  }

  const payment = commande.payment_status ?? "pending"
  if (payment !== "pending") {
    return { ok: false, reason: "Ce brouillon ne peut pas être supprimé (paiement en cours)." }
  }

  const { data: interventions } = await supabase
    .from("interventions")
    .select("id, statut")
    .eq("commande_id", commandeId)

  for (const row of interventions ?? []) {
    if (row.statut !== "annulee") {
      return {
        ok: false,
        reason: "Une intervention active est liée à ce brouillon.",
      }
    }
  }

  return { ok: true, commande: commande as DeletableBrouillonRow }
}

async function cancelDraftStripePaymentIntent(paymentIntentId: string | null) {
  if (!paymentIntentId?.trim() || !isStripePaymentConfigured()) return
  try {
    const stripe = getStripe()
    await stripe.paymentIntents.cancel(paymentIntentId)
  } catch (err) {
    console.error("[deleteCommandeBrouillon] cancel payment intent:", err)
  }
}

function redirectAfterBrouillonDelete(returnTo: string, params: { ok?: string; error?: string }) {
  const url = new URL(returnTo, "http://local")
  if (params.ok) url.searchParams.set("ok", params.ok)
  if (params.error) url.searchParams.set("error", params.error)
  redirect(`${url.pathname}${url.search}`)
}

async function deleteCommandeBrouillonById(
  supabase: SupabaseClient,
  userId: string | undefined,
  commandeId: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const check = await assertDeletableBrouillon(supabase, commandeId)
  if (!check.ok) {
    return { ok: false, reason: check.reason }
  }

  await cancelDraftStripePaymentIntent(check.commande.stripe_payment_intent_id)

  const { error: deleteError } = await supabase.from("commandes").delete().eq("id", commandeId)
  if (deleteError) {
    return { ok: false, reason: deleteError.message }
  }

  await writeAuditLog(supabase, {
    entityType: "commande",
    entityId: commandeId,
    action: "delete_brouillon",
    actorId: userId ?? null,
  })

  return { ok: true }
}

function redirectAdminPlan(returnTo: string, params: { ok?: string; error?: string }) {
  const url = new URL(returnTo, "http://local")
  if (params.ok) url.searchParams.set("ok", params.ok)
  if (params.error) url.searchParams.set("error", params.error)
  redirect(`${url.pathname}${url.search}`)
}

export async function planifierCommandeLivraison(
  commandeId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const returnTo = sanitizeAdminReturnPath(String(formData.get("returnTo") ?? ""))
  const result = await planifierCommandeLivraisonAdmin(supabase, user?.id, commandeId, formData)
  if (!result.ok) {
    redirectAdminPlan(returnTo, { error: result.error })
  }
  revalidateAdmin()
  revalidateCommande(commandeId)
  revalidatePath("/espace/commandes")
  redirectAdminPlan(returnTo, { ok: "planned" })
}

export async function reporterCommandeLivraison(
  commandeId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const returnTo = sanitizeAdminReturnPath(String(formData.get("returnTo") ?? ""))
  const result = await planifierCommandeLivraisonAdmin(supabase, user?.id, commandeId, formData, {
    report: true,
  })
  if (!result.ok) {
    redirectAdminPlan(returnTo, { error: result.error })
  }
  revalidateAdmin()
  revalidateCommande(commandeId)
  revalidatePath("/espace/commandes")
  redirectAdminPlan(returnTo, { ok: "rescheduled" })
}

export async function planifierIntervention(
  interventionId: string,
  chantierId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const returnTo = sanitizeAdminReturnPath(String(formData.get("returnTo") ?? ""))
  const result = await planifierInterventionAdmin(
    supabase,
    user?.id,
    interventionId,
    chantierId,
    formData
  )
  if (!result.ok) {
    redirectAdminPlan(returnTo, { error: result.error })
  }
  revalidateAdmin(chantierId)
  revalidatePath(`/admin/interventions/${interventionId}`)
  revalidatePath("/dashboard/historique")
  revalidatePath("/espace/chantier")
  redirectAdminPlan(returnTo, { ok: "planned" })
}

export async function reporterIntervention(
  interventionId: string,
  chantierId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const returnTo = sanitizeAdminReturnPath(String(formData.get("returnTo") ?? ""))
  const result = await planifierInterventionAdmin(
    supabase,
    user?.id,
    interventionId,
    chantierId,
    formData,
    { report: true }
  )
  if (!result.ok) {
    redirectAdminPlan(returnTo, { error: result.error })
  }
  revalidateAdmin(chantierId)
  revalidatePath(`/admin/interventions/${interventionId}`)
  revalidatePath("/dashboard/historique")
  revalidatePath("/espace/chantier")
  redirectAdminPlan(returnTo, { ok: "rescheduled" })
}

function sanitizeAdminReturnPath(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed.startsWith("/admin")) {
    return "/admin/interventions?vue=brouillon"
  }
  return trimmed
}

export async function deleteCommandeBrouillon(
  commandeId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const returnTo = sanitizeAdminReturnPath(String(formData.get("returnTo") ?? ""))

  const result = await deleteCommandeBrouillonById(supabase, user?.id, commandeId)
  if (!result.ok) {
    redirectAfterBrouillonDelete(returnTo, { error: result.reason })
  }

  revalidateAdmin()
  revalidatePath(`/admin/commandes/${commandeId}`)
  redirectAfterBrouillonDelete(returnTo, { ok: "deleted" })
}

export async function deleteCommandesBrouillonBulk(formData: FormData): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const returnTo = sanitizeAdminReturnPath(String(formData.get("returnTo") ?? ""))
  const ids = [...new Set(formData.getAll("ids").map((v) => String(v).trim()).filter(Boolean))]

  if (ids.length === 0) {
    redirectAfterBrouillonDelete(returnTo, { error: "Aucun brouillon sélectionné." })
  }

  let deleted = 0
  const skipped: string[] = []

  for (const id of ids) {
    const result = await deleteCommandeBrouillonById(supabase, user?.id, id)
    if (result.ok) {
      deleted += 1
      revalidatePath(`/admin/commandes/${id}`)
    } else {
      skipped.push(result.reason)
    }
  }

  revalidateAdmin()

  if (deleted === 0) {
    redirectAfterBrouillonDelete(returnTo, {
      error: skipped[0] ?? "Impossible de supprimer la sélection.",
    })
  }

  const ok =
    skipped.length === 0
      ? `deleted_${deleted}`
      : `deleted_${deleted}_skipped_${skipped.length}`
  redirectAfterBrouillonDelete(returnTo, { ok })
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
    redirect(`/admin/interventions/${commandeId}`)
  }

  const patch: { statut: string; livree_at?: string } = { statut }
  if (statut === "livree") {
    patch.livree_at = new Date().toISOString()
  }

  const { error } = await supabase.from("commandes").update(patch).eq("id", commandeId)

  if (error) {
    redirect(
      `/admin/commandes/${commandeId}?error=${encodeURIComponent(error.message)}`
    )
  }

  revalidateCommande(commandeId)
  redirect(`/admin/interventions/${commandeId}`)
}

export async function createInterventionFromCommande(commandeId: string): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const { data: commande, error: commandeError } = await supabase
    .from("commandes")
    .select(
      "id, adresse_complete, type_dechet_id, volume_m3, date_livraison, livraison_planifiee_at, contact_nom, contact_email, prestation_label, payment_status, statut"
    )
    .eq("id", commandeId)
    .single()

  if (commandeError || !commande) {
    redirect("/admin/interventions")
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
      statut: commande.livraison_planifiee_at ? "programme" : "en_cours_programmation",
      date_demande: today,
      date_souhaitee: commande.date_livraison,
      planifiee_le: commande.livraison_planifiee_at ?? null,
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

function redirectCommandeError(commandeId: string, message: string): never {
  redirect(`/admin/commandes/${commandeId}?error=${encodeURIComponent(message)}`)
}

function stripeObjectId(
  value: string | { id: string } | null | undefined
): string | null {
  if (!value) return null
  return typeof value === "string" ? value : value.id
}

function latestCharge(intent: Stripe.PaymentIntent): Stripe.Charge | null {
  const charge = intent.latest_charge
  if (!charge || typeof charge === "string") return null
  return charge
}

async function resolvePaymentIntentForCommande(
  stripe: Stripe,
  commande: {
    id: string
    stripe_payment_intent_id: string | null
    stripe_checkout_session_id: string | null
  }
): Promise<Stripe.PaymentIntent> {
  let paymentIntentId = commande.stripe_payment_intent_id

  if (!paymentIntentId && commande.stripe_checkout_session_id) {
    const session = await stripe.checkout.sessions.retrieve(
      commande.stripe_checkout_session_id
    )
    if (session.metadata?.commande_id && session.metadata.commande_id !== commande.id) {
      throw new Error("Session Stripe non liée à cette commande.")
    }
    paymentIntentId = stripeObjectId(session.payment_intent)
  }

  if (!paymentIntentId) {
    throw new Error("Aucun paiement Stripe associé à cette commande.")
  }

  const intent = await stripe.paymentIntents.retrieve(paymentIntentId, {
    expand: ["latest_charge"],
  })

  const metaCommandeId = intent.metadata?.commande_id
  if (metaCommandeId && metaCommandeId !== commande.id) {
    throw new Error("PaymentIntent Stripe non lié à cette commande.")
  }

  return intent
}

export async function cancelCommande(commandeId: string): Promise<void> {
  const { supabase } = await assertAdmin()

  const { data: commande, error } = await supabase
    .from("commandes")
    .select("id, payment_status, statut")
    .eq("id", commandeId)
    .single()

  if (error || !commande) {
    redirect("/admin/interventions")
  }

  const paymentStatusBefore = commande.payment_status

  const { error: updateError } = await supabase
    .from("commandes")
    .update({ statut: "annulee" })
    .eq("id", commandeId)

  if (updateError) {
    redirectCommandeError(commandeId, updateError.message)
  }

  await sendCommandeCancellationIfClaimed(supabase, commandeId, paymentStatusBefore)

  revalidateCommande(commandeId)
  redirect(`/admin/commandes/${commandeId}?ok=cancelled`)
}

export async function cancelAndRefundCommande(commandeId: string): Promise<void> {
  const { supabase } = await assertAdmin()

  if (!isStripePaymentConfigured()) {
    redirectCommandeError(commandeId, "Paiement Stripe non configuré.")
  }

  const { data: commande, error } = await supabase
    .from("commandes")
    .select(
      "id, payment_status, stripe_payment_intent_id, stripe_checkout_session_id"
    )
    .eq("id", commandeId)
    .single()

  if (error || !commande) {
    redirect("/admin/interventions")
  }

  if (commande.payment_status !== "paid") {
    redirectCommandeError(
      commandeId,
      commande.payment_status === "refunded" ||
        commande.payment_status === "refund_pending"
        ? "Remboursement déjà en cours ou effectué."
        : "Remboursement possible uniquement pour une commande payée."
    )
  }

  let stripe: Stripe
  try {
    stripe = getStripe()
  } catch {
    redirectCommandeError(commandeId, "Paiement Stripe non configuré.")
  }

  let intent: Stripe.PaymentIntent
  try {
    intent = await resolvePaymentIntentForCommande(stripe, commande)
  } catch (err) {
    redirectCommandeError(
      commandeId,
      err instanceof Error ? err.message : "Impossible de retrouver le paiement Stripe."
    )
  }

  if (!commande.stripe_payment_intent_id) {
    await supabase
      .from("commandes")
      .update({ stripe_payment_intent_id: intent.id })
      .eq("id", commande.id)
  }

  const charge = latestCharge(intent)
  if (charge?.refunded) {
    await syncCommandeFromRefund(supabase, {
      paymentIntentId: intent.id,
      refundId: charge.refunds?.data?.[0]?.id ?? null,
      outcome: "succeeded",
      isFullRefund: true,
    })
    revalidateCommande(commandeId)
    redirect(`/admin/commandes/${commandeId}?ok=already_refunded`)
  }

  const amount = intent.amount_received || intent.amount
  if (!amount || amount <= 0) {
    redirectCommandeError(commandeId, "Montant Stripe introuvable pour le remboursement.")
  }

  const { data: claimed, error: claimError } = await supabase
    .from("commandes")
    .update({
      payment_status: "refund_pending",
      statut: "annulee",
      stripe_payment_intent_id: intent.id,
    })
    .eq("id", commandeId)
    .eq("payment_status", "paid")
    .select("id, payment_status")
    .maybeSingle()

  if (claimError) {
    redirectCommandeError(commandeId, claimError.message)
  }
  if (!claimed) {
    redirectCommandeError(commandeId, "Remboursement déjà en cours ou commande non payée.")
  }

  try {
    await stripe.refunds.create({
      payment_intent: intent.id,
      amount,
    })
  } catch (err) {
    await supabase
      .from("commandes")
      .update({ payment_status: "refund_failed" })
      .eq("id", commandeId)
    redirectCommandeError(
      commandeId,
      err instanceof Error ? err.message : "Échec de la création du remboursement Stripe."
    )
  }

  await sendCommandeCancellationIfClaimed(supabase, commandeId, "paid")

  revalidateCommande(commandeId)
  redirect(`/admin/commandes/${commandeId}?ok=refund_pending`)
}

function calendarDateParisFromIso(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso))
}

function formatRotationWishParis(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(iso))
}

export async function acceptRotationDemande(
  demandeId: string,
  chantierId: string
): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const { data: demande, error: demandeError } = await supabase
    .from("demandes_rotation")
    .select(
      "id, chantier_id, statut, souhaite_le, contenant_id, dechet_type_id, commentaire_client"
    )
    .eq("id", demandeId)
    .eq("chantier_id", chantierId)
    .maybeSingle()

  if (demandeError || !demande) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("Demande introuvable.")}`
    )
  }

  if (demande.statut !== "en_attente") {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("Cette demande a déjà été traitée.")}`
    )
  }

  const { data: typeRotation } = await supabase
    .from("types_intervention")
    .select("id")
    .eq("code", "rotation")
    .maybeSingle()

  if (!typeRotation?.id) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("Type rotation absent du référentiel.")}`
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  const wishLabel = formatRotationWishParis(demande.souhaite_le)
  const commentaire = [
    demande.commentaire_client,
    `Demande client : rotation souhaitée le ${wishLabel} (Europe/Paris).`,
  ]
    .filter(Boolean)
    .join(" — ")

  const { data: intervention, error: interventionError } = await supabase
    .from("interventions")
    .insert({
      chantier_id: chantierId,
      type_intervention_id: typeRotation.id,
      contenant_id: demande.contenant_id,
      dechet_type_id: demande.dechet_type_id,
      statut: "en_cours_programmation",
      date_demande: today,
      date_souhaitee: calendarDateParisFromIso(demande.souhaite_le),
      commentaire,
      created_by: user.id,
    })
    .select("id")
    .single()

  if (interventionError || !intervention) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent(interventionError?.message ?? "Impossible de créer l'intervention.")}`
    )
  }

  const { error: updateError } = await supabase
    .from("demandes_rotation")
    .update({
      statut: "prise_en_charge",
      intervention_id: intervention.id,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", demandeId)

  if (updateError) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent(updateError.message)}`
    )
  }

  revalidateAdmin(chantierId)
  revalidatePath("/espace/chantier")
  redirect(`/admin/chantiers/${chantierId}`)
}

export async function createPrestataire(formData: FormData): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const raison = String(formData.get("raison_sociale") ?? "").trim()
  if (!raison) return

  const { data, error } = await supabase
    .from("prestataires")
    .insert({
      nom: raison,
      raison_sociale: raison,
      siret: String(formData.get("siret") ?? "").trim() || null,
      adresse: String(formData.get("adresse") ?? "").trim() || null,
      code_postal: String(formData.get("code_postal") ?? "").trim() || null,
      ville: String(formData.get("ville") ?? "").trim() || null,
      email: String(formData.get("email") ?? "").trim() || null,
      telephone: String(formData.get("telephone") ?? "").trim() || null,
    })
    .select("id")
    .single()

  if (error || !data) return

  await writeAuditLog(supabase, {
    entityType: "prestataire",
    entityId: data.id,
    action: "creation",
    actorId: user.id,
  })

  revalidatePath("/admin/prestataires")
  redirect(`/admin/prestataires/${data.id}`)
}

export async function updatePrestataire(prestataireId: string, formData: FormData): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const raison = String(formData.get("raison_sociale") ?? "").trim()
  const { error } = await supabase
    .from("prestataires")
    .update({
      raison_sociale: raison || null,
      nom: raison || undefined,
      email: String(formData.get("email") ?? "").trim() || null,
      telephone: String(formData.get("telephone") ?? "").trim() || null,
      adresse: String(formData.get("adresse") ?? "").trim() || null,
      code_postal: String(formData.get("code_postal") ?? "").trim() || null,
      ville: String(formData.get("ville") ?? "").trim() || null,
      siret: String(formData.get("siret") ?? "").trim() || null,
      contact_nom: String(formData.get("contact_nom") ?? "").trim() || null,
      contact_email: String(formData.get("contact_email") ?? "").trim() || null,
      is_active: formData.get("is_active") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", prestataireId)

  if (error) {
    redirect(`/admin/prestataires/${prestataireId}?error=${encodeURIComponent(error.message)}`)
  }

  await writeAuditLog(supabase, {
    entityType: "prestataire",
    entityId: prestataireId,
    action: "mise_a_jour",
    actorId: user.id,
  })

  revalidatePath("/admin/prestataires")
  revalidatePath(`/admin/prestataires/${prestataireId}`)
  redirect(`/admin/prestataires/${prestataireId}?ok=1`)
}

async function deletePrestataireById(
  supabase: SupabaseClient,
  userId: string | undefined,
  prestataireId: string
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const { count: interventionCount, error: interventionError } = await supabase
    .from("interventions")
    .select("id", { count: "exact", head: true })
    .eq("prestataire_id", prestataireId)

  if (interventionError) {
    return { ok: false, reason: interventionError.message }
  }

  if ((interventionCount ?? 0) > 0) {
    const { count: commandeLinkCount } = await supabase
      .from("interventions")
      .select("id", { count: "exact", head: true })
      .eq("prestataire_id", prestataireId)
      .not("commande_id", "is", null)

    const n = interventionCount ?? 0
    const m = commandeLinkCount ?? 0
    const base = `Impossible de supprimer ce prestataire : il est rattaché à ${n} intervention${n > 1 ? "s" : ""}.`
    const commandePart =
      m > 0
        ? ` Dont ${m} liée${m > 1 ? "s" : ""} à une commande.`
        : ""
    return {
      ok: false,
      reason: `${base}${commandePart} Retirez-le des fiches concernées avant suppression.`,
    }
  }

  const { error: deleteError } = await supabase.from("prestataires").delete().eq("id", prestataireId)
  if (deleteError) {
    const code = deleteError.code ?? ""
    if (code === "23503") {
      return {
        ok: false,
        reason:
          "Impossible de supprimer ce prestataire : il est encore référencé par d'autres enregistrements.",
      }
    }
    return { ok: false, reason: deleteError.message }
  }

  await writeAuditLog(supabase, {
    entityType: "prestataire",
    entityId: prestataireId,
    action: "suppression",
    actorId: userId ?? null,
  })

  return { ok: true }
}

export async function deletePrestataire(
  prestataireId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await assertAdmin()
  const rawReturnTo = String(formData.get("returnTo") ?? "").trim()
  const returnTo =
    rawReturnTo.startsWith("/admin/prestataires") ? rawReturnTo : "/admin/prestataires"

  const result = await deletePrestataireById(supabase, user?.id, prestataireId)
  if (!result.ok) {
    redirectAfterBrouillonDelete(returnTo, { error: result.reason })
  }

  revalidatePath("/admin/prestataires")
  revalidatePath(`/admin/prestataires/${prestataireId}`)
  redirectAfterBrouillonDelete(returnTo, { ok: "deleted" })
}

export async function upsertChantierLigneTarifaire(
  chantierId: string,
  formData: FormData
): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const lineId = String(formData.get("line_id") ?? "").trim()
  const payload = {
    chantier_id: chantierId,
    label: String(formData.get("label") ?? "").trim() || "Ligne tarifaire",
    facturation_traitement:
      String(formData.get("facturation_traitement") ?? "forfait") === "poids" ? "poids" : "forfait",
    prix_vente_traitement_ht: Number(formData.get("prix_vente_traitement_ht") ?? 0),
    prix_achat_traitement_ht: Number(formData.get("prix_achat_traitement_ht") ?? 0),
    prix_vente_transport_ht: Number(formData.get("prix_vente_transport_ht") ?? 0),
    prix_achat_transport_ht: Number(formData.get("prix_achat_transport_ht") ?? 0),
    prix_vente_location_ht: Number(formData.get("prix_vente_location_ht") ?? 0),
    prix_achat_location_ht: Number(formData.get("prix_achat_location_ht") ?? 0),
    tonnage_inclus_kg:
      String(formData.get("tonnage_inclus_kg") ?? "").trim() === ""
        ? null
        : Number(formData.get("tonnage_inclus_kg")),
    updated_at: new Date().toISOString(),
  }

  const { error } = lineId
    ? await supabase.from("chantier_lignes_tarifaires").update(payload).eq("id", lineId)
    : await supabase.from("chantier_lignes_tarifaires").insert(payload)

  if (error) {
    redirect(`/admin/chantiers/${chantierId}?error=${encodeURIComponent(error.message)}`)
  }

  await writeAuditLog(supabase, {
    entityType: "chantier",
    entityId: chantierId,
    action: lineId ? "tarif_modifie" : "tarif_ajoute",
    actorId: user.id,
  })

  revalidateAdmin(chantierId)
  redirect(`/admin/chantiers/${chantierId}`)
}

export async function deactivateChantierLigneTarifaire(
  lineId: string,
  chantierId: string
): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const { error } = await supabase
    .from("chantier_lignes_tarifaires")
    .update({ is_active: false, updated_at: new Date().toISOString() })
    .eq("id", lineId)

  if (!error) {
    await writeAuditLog(supabase, {
      entityType: "chantier",
      entityId: chantierId,
      action: "tarif_desactive",
      detail: { lineId },
      actorId: user.id,
    })
  }

  revalidateAdmin(chantierId)
  redirect(`/admin/chantiers/${chantierId}`)
}

export async function rejectRotationDemande(
  demandeId: string,
  chantierId: string
): Promise<void> {
  const { supabase, user } = await assertAdmin()

  const { data: demande, error: demandeError } = await supabase
    .from("demandes_rotation")
    .select("id, statut")
    .eq("id", demandeId)
    .eq("chantier_id", chantierId)
    .maybeSingle()

  if (demandeError || !demande) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("Demande introuvable.")}`
    )
  }

  if (demande.statut !== "en_attente") {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent("Cette demande a déjà été traitée.")}`
    )
  }

  const { error: updateError } = await supabase
    .from("demandes_rotation")
    .update({
      statut: "refusee",
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", demandeId)

  if (updateError) {
    redirect(
      `/admin/chantiers/${chantierId}?error=${encodeURIComponent(updateError.message)}`
    )
  }

  revalidateAdmin(chantierId)
  revalidatePath("/espace/chantier")
  redirect(`/admin/chantiers/${chantierId}`)
}
