import type { SupabaseClient, User } from "@supabase/supabase-js"

import {
  sendPasswordSetupEmailIfNeeded,
  userNeedsPasswordSetup,
} from "@/lib/auth/password-setup"
import { syncProfileClientKind } from "@/lib/auth/sync-profile-client-kind"

export type ParticulierClientLinkResult = {
  userId: string | null
  emailConfirmed: boolean
  needsPasswordSetup: boolean
  passwordSetupEmailSent: boolean
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isAuthEmailConfirmed(user: User | null | undefined): boolean {
  if (!user) return false
  return Boolean(user.email_confirmed_at)
}

export async function findAuthUserIdByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<User | null> {
  const normalized = normalizeEmail(email)
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 200,
    })
    if (error) {
      console.error("[particulier-client] listUsers:", error.message)
      return null
    }
    const match = data.users.find(
      (user) => user.email && normalizeEmail(user.email) === normalized
    )
    if (match) return match
    if (data.users.length < 200) break
  }
  return null
}

async function createParticulierAuthUser(
  supabase: SupabaseClient,
  email: string,
  contactNom: string | null
): Promise<User | null> {
  const normalized = normalizeEmail(email)
  const { data, error } = await supabase.auth.admin.createUser({
    email: normalized,
    email_confirm: true,
    user_metadata: {
      full_name: contactNom?.trim() || null,
      signup_source: "particulier_order",
    },
  })

  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      return findAuthUserIdByEmail(supabase, normalized)
    }
    console.error("[particulier-client] createUser:", error.message)
    return null
  }

  return data.user ?? null
}

async function syncProfileFromOrder(
  supabase: SupabaseClient,
  userId: string,
  contactNom: string | null,
  contactPhone: string | null
) {
  const patch: { full_name?: string; phone?: string } = {}
  if (contactNom?.trim()) patch.full_name = contactNom.trim()
  if (contactPhone?.trim()) patch.phone = contactPhone.trim()
  if (!Object.keys(patch).length) return

  const { error } = await supabase.from("profiles").update(patch).eq("id", userId)
  if (error) {
    console.error("[particulier-client] profile update:", error.message)
  }
}

/**
 * Lie une commande particulier payée à un compte auth (création ou rattachement).
 * Le compte est créé avec `email_confirm: true` ; l’e-mail CORE de commande
 * (notifyCommandeConfirmed) invite à se connecter sur /login par mot de passe.
 * Idempotent : safe à rappeler depuis le webhook ou le polling post-paiement.
 */
export async function ensureParticulierClientForCommande(
  supabase: SupabaseClient,
  commandeId: string
): Promise<ParticulierClientLinkResult | null> {
  const { data: commande, error } = await supabase
    .from("commandes")
    .select(
      "id, audience, contact_email, contact_nom, contact_telephone, client_id, payment_status"
    )
    .eq("id", commandeId)
    .maybeSingle()

  if (error || !commande) {
    console.error("[particulier-client] commande load:", error?.message)
    return null
  }

  if (commande.audience && commande.audience !== "particulier") {
    return null
  }

  const paid =
    commande.payment_status === "paid" || commande.payment_status === "waived"
  if (!paid) return null

  const email =
    typeof commande.contact_email === "string" ? commande.contact_email.trim() : ""
  if (!email) return null

  const contactNom =
    typeof commande.contact_nom === "string" ? commande.contact_nom : null
  const contactPhone =
    typeof commande.contact_telephone === "string" ? commande.contact_telephone : null

  let user: User | null = null

  if (commande.client_id) {
    const { data: byId, error: userError } = await supabase.auth.admin.getUserById(
      commande.client_id
    )
    if (userError) {
      console.error("[particulier-client] getUserById:", userError.message)
    }
    user = byId.user ?? null
  }

  if (!user) {
    user = await findAuthUserIdByEmail(supabase, email)
  }

  if (!user) {
    user = await createParticulierAuthUser(supabase, email, contactNom)
  }

  if (user?.id && !isAuthEmailConfirmed(user)) {
    const { data: confirmed, error: confirmError } = await supabase.auth.admin.updateUserById(
      user.id,
      { email_confirm: true }
    )
    if (confirmError) {
      console.error("[particulier-client] email_confirm:", confirmError.message)
    } else if (confirmed.user) {
      user = confirmed.user
    }
  }

  if (!user?.id) {
    return {
      userId: null,
      emailConfirmed: false,
      needsPasswordSetup: false,
      passwordSetupEmailSent: false,
    }
  }

  if (commande.client_id !== user.id) {
    const { error: linkError } = await supabase
      .from("commandes")
      .update({ client_id: user.id })
      .eq("id", commandeId)
      .is("client_id", null)

    if (linkError) {
      console.error("[particulier-client] link client_id:", linkError.message)
    }
  }

  await syncProfileFromOrder(supabase, user.id, contactNom, contactPhone)
  await syncProfileClientKind(supabase, user.id, "particulier")

  const setup = await sendPasswordSetupEmailIfNeeded(supabase, user)

  return {
    userId: user.id,
    emailConfirmed: isAuthEmailConfirmed(user),
    needsPasswordSetup: setup.needsPasswordSetup || userNeedsPasswordSetup(user),
    passwordSetupEmailSent: setup.sent,
  }
}
