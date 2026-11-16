"use server"

import type { SignupAccountType } from "@/lib/auth/signup-type"
import type { ProSignupDraft } from "@/lib/auth/pro-signup-draft"
import { parseProSignupDraft } from "@/lib/auth/pro-signup-draft"
import { findAuthUserIdByEmail } from "@/lib/auth/particulier-client"
import { syncProfileClientKind } from "@/lib/auth/sync-profile-client-kind"
import {
  isValidSignupEmail,
  normalizeSignupEmail,
} from "@/lib/auth/signup-validation"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient, getSupabaseServiceConfigError } from "@/lib/supabase/service"

/** Vérifie côté serveur si un compte auth existe déjà pour cet e-mail. */
export async function checkSignupEmailAccountExists(
  rawEmail: string
): Promise<{ exists: boolean }> {
  const email = normalizeSignupEmail(rawEmail)
  if (!email || !isValidSignupEmail(email)) {
    return { exists: false }
  }
  if (getSupabaseServiceConfigError()) {
    return { exists: false }
  }
  const service = createServiceClient()
  const user = await findAuthUserIdByEmail(service, email)
  return { exists: Boolean(user) }
}

async function upsertCompteProDraft(
  supabase: Awaited<ReturnType<typeof createClient>>,
  profileId: string,
  draft: ProSignupDraft
) {
  const { data: existing } = await supabase
    .from("comptes_pro")
    .select("id, status")
    .eq("profile_id", profileId)
    .maybeSingle()

  if (existing?.status === "approved") return

  const payload = {
    profile_id: profileId,
    raison_sociale: draft.raison_sociale,
    siret: draft.siret,
    code_naf: draft.code_naf,
    adresse_siege: draft.adresse_siege,
    contact_nom: draft.contact_nom,
    contact_fonction: draft.contact_fonction,
    contact_telephone: draft.contact_telephone,
    contact_email: draft.contact_email,
    status: "pending" as const,
    updated_at: new Date().toISOString(),
  }

  if (existing) {
    await supabase.from("comptes_pro").update(payload).eq("id", existing.id)
  } else {
    await supabase.from("comptes_pro").insert(payload)
  }
}

/** Après inscription réussie (session active). */
export async function finalizeSignupProfile(
  accountType: SignupAccountType
): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id) return

  await supabase.auth.updateUser({
    data: {
      password_initialized_at: new Date().toISOString(),
    },
  })

  const signupPhone =
    typeof user.user_metadata?.signup_phone === "string"
      ? user.user_metadata.signup_phone.trim()
      : ""
  if (signupPhone) {
    await supabase.from("profiles").update({ phone: signupPhone }).eq("id", user.id)
  }

  if (getSupabaseServiceConfigError()) return

  const service = createServiceClient()
  await syncProfileClientKind(
    service,
    user.id,
    accountType === "professionnel" ? "professionnel" : "particulier"
  )

  if (accountType === "professionnel") {
    await ensureProSignupDraftFromMetadata()
  }
}

/** Après confirmation e-mail (callback) ou session immédiate. */
export async function ensureProSignupDraftFromMetadata(): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return
  const signupPhone =
    typeof user.user_metadata?.signup_phone === "string"
      ? user.user_metadata.signup_phone.trim()
      : ""
  if (signupPhone) {
    await supabase.from("profiles").update({ phone: signupPhone }).eq("id", user.id)
  }
  const draft = parseProSignupDraft(user.user_metadata?.pro_signup_draft)
  if (!draft) return
  await upsertCompteProDraft(supabase, user.id, draft)
}
