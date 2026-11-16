import type { SupabaseClient } from "@supabase/supabase-js"

import { writeAuditLog } from "@/lib/admin/audit-log"
import { commandeLivraisonPlanifieeEmail } from "@/lib/email/templates/commande-livraison-planifiee"
import { interventionProgrammeeEmail } from "@/lib/email/templates/intervention-programmee"
import { sendEmail } from "@/lib/email/send"
import { formatOrderReference } from "@/lib/commande/reference"
import { formatCreneauFrShort, parseAdminCreneauForm } from "@/lib/planning/creneau"

export type PlanificationResult =
  | { ok: true }
  | { ok: false; error: string }

async function chantierMemberEmails(
  supabase: SupabaseClient,
  chantierId: string
): Promise<string[]> {
  const { data: membres } = await supabase
    .from("chantier_membres")
    .select("invited_email, profiles ( email )")
    .eq("chantier_id", chantierId)
    .limit(8)

  const recipients = new Set<string>()
  for (const m of membres ?? []) {
    const mail =
      m.invited_email ?? (m.profiles as unknown as { email: string } | null)?.email ?? null
    if (mail) recipients.add(mail)
  }
  return [...recipients]
}

async function syncInterventionFromCommande(
  supabase: SupabaseClient,
  commandeId: string,
  atUtc: string,
  statut: "programme" | "en_cours_programmation"
) {
  await supabase
    .from("interventions")
    .update({
      planifiee_le: atUtc,
      statut,
      updated_at: new Date().toISOString(),
    })
    .eq("commande_id", commandeId)
}

async function syncCommandeFromIntervention(
  supabase: SupabaseClient,
  commandeId: string,
  atUtc: string
) {
  await supabase
    .from("commandes")
    .update({ livraison_planifiee_at: atUtc })
    .eq("id", commandeId)
}

export async function planifierCommandeLivraisonAdmin(
  supabase: SupabaseClient,
  userId: string | undefined,
  commandeId: string,
  formData: FormData,
  options?: { report?: boolean }
): Promise<PlanificationResult> {
  const parsed = parseAdminCreneauForm(formData)
  if ("error" in parsed) return { ok: false, error: parsed.error }

  const { data: commande, error: loadError } = await supabase
    .from("commandes")
    .select(
      "id, statut, payment_status, contact_email, contact_nom, adresse_complete, prestation_label"
    )
    .eq("id", commandeId)
    .single()

  if (loadError || !commande) {
    return { ok: false, error: "Commande introuvable." }
  }

  if (commande.payment_status !== "paid" && commande.payment_status !== "waived") {
    return { ok: false, error: "La commande doit être payée avant planification." }
  }

  if (commande.statut === "livree" || commande.statut === "annulee") {
    return { ok: false, error: "Cette commande ne peut plus être planifiée." }
  }

  const patch: { livraison_planifiee_at: string; statut?: string } = {
    livraison_planifiee_at: parsed.atUtc,
  }
  if (commande.statut === "confirmee") {
    patch.statut = "en_cours"
  }

  const { error: updateError } = await supabase.from("commandes").update(patch).eq("id", commandeId)
  if (updateError) return { ok: false, error: updateError.message }

  const { data: linked } = await supabase
    .from("interventions")
    .select("id")
    .eq("commande_id", commandeId)
    .maybeSingle()

  if (linked) {
    await syncInterventionFromCommande(supabase, commandeId, parsed.atUtc, "programme")
  }

  const creneauLabel = formatCreneauFrShort(parsed.atUtc) ?? parsed.atUtc
  const reference = formatOrderReference(commandeId)

  if (commande.contact_email) {
    const tpl = commandeLivraisonPlanifieeEmail({
      reference,
      creneauLabel,
      adresse: commande.adresse_complete,
      report: options?.report,
    })
    await sendEmail({ to: commande.contact_email, ...tpl })
  }

  await writeAuditLog(supabase, {
    entityType: "commande",
    entityId: commandeId,
    action: options?.report ? "livraison_reportee" : "livraison_planifiee",
    detail: { at: parsed.atUtc, creneauLabel },
    actorId: userId ?? null,
  })

  return { ok: true }
}

export async function planifierInterventionAdmin(
  supabase: SupabaseClient,
  userId: string | undefined,
  interventionId: string,
  chantierId: string,
  formData: FormData,
  options?: { report?: boolean }
): Promise<PlanificationResult> {
  const parsed = parseAdminCreneauForm(formData)
  if ("error" in parsed) return { ok: false, error: parsed.error }

  const prestataireRaw = String(formData.get("prestataire_id") ?? "").trim()

  const { data: intervention, error: loadError } = await supabase
    .from("interventions")
    .select("id, numero, statut, commande_id, chantiers ( nom )")
    .eq("id", interventionId)
    .single()

  if (loadError || !intervention) {
    return { ok: false, error: "Intervention introuvable." }
  }

  if (intervention.statut === "realisee" || intervention.statut === "annulee") {
    return { ok: false, error: "Cette intervention ne peut plus être replanifiée." }
  }

  const { error: updateError } = await supabase
    .from("interventions")
    .update({
      statut: "programme",
      planifiee_le: parsed.atUtc,
      date_souhaitee: parsed.dateYmd,
      prestataire_id: prestataireRaw || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", interventionId)

  if (updateError) return { ok: false, error: updateError.message }

  if (intervention.commande_id) {
    await syncCommandeFromIntervention(supabase, intervention.commande_id, parsed.atUtc)
    const { data: cmd } = await supabase
      .from("commandes")
      .select("statut")
      .eq("id", intervention.commande_id)
      .single()
    if (cmd?.statut === "confirmee") {
      await supabase.from("commandes").update({ statut: "en_cours" }).eq("id", intervention.commande_id)
    }
  }

  const creneauLabel = formatCreneauFrShort(parsed.atUtc) ?? parsed.atUtc
  const chantierNom =
    (intervention.chantiers as unknown as { nom: string } | null)?.nom ?? "votre chantier"

  const recipients = await chantierMemberEmails(supabase, chantierId)
  const tpl = interventionProgrammeeEmail({
    numero: intervention.numero,
    chantierNom,
    creneauLabel,
    report: options?.report,
  })
  for (const to of recipients) {
    await sendEmail({ to, ...tpl })
  }

  await writeAuditLog(supabase, {
    entityType: "intervention",
    entityId: interventionId,
    action: options?.report ? "intervention_reportee" : "intervention_planifiee",
    detail: { at: parsed.atUtc, creneauLabel, chantierId },
    actorId: userId ?? null,
  })

  return { ok: true }
}