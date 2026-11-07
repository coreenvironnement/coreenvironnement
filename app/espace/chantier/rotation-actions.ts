"use server"

import { revalidatePath } from "next/cache"

import {
  isRotationAtLeast6hAhead,
  parisLocalToUtcMs,
  ROTATION_TOO_SOON_MESSAGE,
} from "@/lib/chantier/rotation-datetime"
import { loadChantierRotationContext } from "@/lib/chantier/rotation-context"
import { userHasChantierAccess } from "@/lib/dashboard/chantier-data"
import { createClient } from "@/lib/supabase/server"

export type RotationRequestResult =
  | { ok: true }
  | { ok: false; error: string }

export async function requestChantierRotation(
  _prev: RotationRequestResult | null,
  formData: FormData
): Promise<RotationRequestResult> {
  const chantierId = String(formData.get("chantier_id") ?? "").trim()
  const dateYmd = String(formData.get("date") ?? "").trim()
  const timeHm = String(formData.get("time") ?? "").trim()
  const commentaire = String(formData.get("commentaire") ?? "").trim()

  if (!chantierId || !dateYmd || !timeHm) {
    return { ok: false, error: "Date et heure sont obligatoires." }
  }

  if (!isRotationAtLeast6hAhead(dateYmd, timeHm)) {
    return { ok: false, error: ROTATION_TOO_SOON_MESSAGE }
  }

  const souhaiteUtc = parisLocalToUtcMs(dateYmd, timeHm)
  if (souhaiteUtc == null) {
    return { ok: false, error: "Date ou heure invalide." }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { ok: false, error: "Connectez-vous pour demander une rotation." }
  }

  const allowed = await userHasChantierAccess(supabase, user.id, chantierId)
  if (!allowed) {
    return { ok: false, error: "Vous n'avez pas accès à ce chantier." }
  }

  const ctx = await loadChantierRotationContext(supabase, chantierId)
  if (!ctx.canRequest || !ctx.contenantId || !ctx.dechetTypeId) {
    return {
      ok: false,
      error: ctx.blockedReason ?? "Impossible de demander une rotation pour le moment.",
    }
  }

  const { error } = await supabase.from("demandes_rotation").insert({
    chantier_id: chantierId,
    profile_id: user.id,
    contenant_id: ctx.contenantId,
    dechet_type_id: ctx.dechetTypeId,
    souhaite_le: new Date(souhaiteUtc).toISOString(),
    commentaire_client: commentaire || null,
    statut: "en_attente",
  })

  if (error) {
    return { ok: false, error: "Enregistrement impossible. Réessayez plus tard." }
  }

  revalidatePath("/espace/chantier")
  revalidatePath(`/admin/chantiers/${chantierId}`)
  return { ok: true }
}
