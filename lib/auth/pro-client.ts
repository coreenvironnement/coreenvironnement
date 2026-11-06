import type { SupabaseClient, User } from "@supabase/supabase-js"

import {
  findAuthUserIdByEmail,
  isAuthEmailConfirmed,
  sendParticulierConfirmationForEmail,
  type ParticulierClientLinkResult,
} from "@/lib/auth/particulier-client"

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

async function createProOrderAuthUser(
  supabase: SupabaseClient,
  email: string,
  contactNom: string | null
): Promise<User | null> {
  const normalized = normalizeEmail(email)
  const { data, error } = await supabase.auth.admin.createUser({
    email: normalized,
    email_confirm: false,
    user_metadata: {
      full_name: contactNom?.trim() || null,
      signup_source: "pro_order",
    },
  })

  if (error) {
    if (/already|registered|exists/i.test(error.message)) {
      return findAuthUserIdByEmail(supabase, normalized)
    }
    console.error("[pro-client] createUser:", error.message)
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
    console.error("[pro-client] profile update:", error.message)
  }
}

/**
 * Lie une demande pro enregistrée en commande à un compte auth (création ou rattachement).
 */
export async function ensureProClientForCommande(
  supabase: SupabaseClient,
  commandeId: string,
  options?: { sendConfirmationEmail?: "initial" | false }
): Promise<ParticulierClientLinkResult | null> {
  const { data: commande, error } = await supabase
    .from("commandes")
    .select(
      "id, audience, contact_email, contact_nom, contact_telephone, client_id, payment_status, statut"
    )
    .eq("id", commandeId)
    .maybeSingle()

  if (error || !commande) {
    console.error("[pro-client] commande load:", error?.message)
    return null
  }

  if (commande.audience !== "professionnel") {
    return null
  }

  const paidOrInvoice =
    commande.payment_status === "waived" || commande.payment_status === "paid"
  if (!paidOrInvoice || commande.statut === "annulee") {
    return null
  }

  const email =
    typeof commande.contact_email === "string" ? commande.contact_email.trim() : ""
  if (!email) return null

  const contactNom =
    typeof commande.contact_nom === "string" ? commande.contact_nom : null
  const contactPhone =
    typeof commande.contact_telephone === "string" ? commande.contact_telephone : null

  let user: User | null = null
  let createdUser = false

  if (commande.client_id) {
    const { data: byId, error: userError } = await supabase.auth.admin.getUserById(
      commande.client_id
    )
    if (userError) {
      console.error("[pro-client] getUserById:", userError.message)
    }
    user = byId.user ?? null
  }

  if (!user) {
    user = await findAuthUserIdByEmail(supabase, email)
  }

  if (!user) {
    user = await createProOrderAuthUser(supabase, email, contactNom)
    createdUser = Boolean(user)
  }

  if (!user?.id) {
    return { userId: null, emailConfirmed: false, confirmationEmailSent: false }
  }

  if (commande.client_id !== user.id) {
    const { error: linkError } = await supabase
      .from("commandes")
      .update({ client_id: user.id })
      .eq("id", commandeId)
      .is("client_id", null)

    if (linkError) {
      console.error("[pro-client] link client_id:", linkError.message)
    }
  }

  await syncProfileFromOrder(supabase, user.id, contactNom, contactPhone)

  const emailConfirmed = isAuthEmailConfirmed(user)
  let confirmationEmailSent = false

  if (
    options?.sendConfirmationEmail === "initial" &&
    createdUser &&
    !emailConfirmed
  ) {
    const sendResult = await sendParticulierConfirmationForEmail(supabase, email)
    confirmationEmailSent = sendResult.sent
  }

  return {
    userId: user.id,
    emailConfirmed,
    confirmationEmailSent,
  }
}

export function authUserIdForProContactEmail(
  user: User | null | undefined,
  contactEmail: string
): string | null {
  if (!user?.id || !user.email) return null
  if (normalizeEmail(user.email) !== normalizeEmail(contactEmail)) return null
  return user.id
}
