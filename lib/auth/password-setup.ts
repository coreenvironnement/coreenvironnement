import type { SupabaseClient, User } from "@supabase/supabase-js"

import { getAppUrl } from "@/lib/email/config"
import { notifyPasswordSetup } from "@/lib/email/notifications"

const META_PASSWORD_INIT = "password_initialized_at"
const META_SETUP_SENT = "password_setup_sent_at"

export function userNeedsPasswordSetup(user: User | null | undefined): boolean {
  if (!user) return false
  const meta = user.user_metadata ?? {}
  if (typeof meta[META_PASSWORD_INIT] === "string" && meta[META_PASSWORD_INIT]) {
    return false
  }
  const source = typeof meta.signup_source === "string" ? meta.signup_source : ""
  if (source === "particulier_signup" || source === "pro_signup") {
    return false
  }
  return true
}

export async function sendPasswordSetupEmailIfNeeded(
  supabase: SupabaseClient,
  user: User
): Promise<{ sent: boolean; needsPasswordSetup: boolean }> {
  if (!userNeedsPasswordSetup(user)) {
    return { sent: false, needsPasswordSetup: false }
  }

  const meta = user.user_metadata ?? {}
  if (typeof meta[META_SETUP_SENT] === "string" && meta[META_SETUP_SENT]) {
    return { sent: false, needsPasswordSetup: true }
  }

  const email = user.email?.trim()
  if (!email) {
    return { sent: false, needsPasswordSetup: true }
  }

  const appUrl = getAppUrl()
  const redirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent("/reinitialiser-mot-de-passe")}`

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  })

  if (error || !data.properties?.action_link) {
    console.error("[password-setup] generateLink:", error?.message)
    return { sent: false, needsPasswordSetup: true }
  }

  const contactNom =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null

  const emailResult = await notifyPasswordSetup({
    contactEmail: email,
    contactNom,
    setupUrl: data.properties.action_link,
  })

  if (emailResult.sent) {
    const now = new Date().toISOString()
    await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: {
        ...meta,
        [META_SETUP_SENT]: now,
      },
    })
  }

  return {
    sent: emailResult.sent,
    needsPasswordSetup: true,
  }
}
