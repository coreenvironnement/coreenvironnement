"use server"

import type { SignupAccountType } from "@/lib/auth/signup-type"
import { syncProfileClientKind } from "@/lib/auth/sync-profile-client-kind"
import { createClient } from "@/lib/supabase/server"
import { createServiceClient, getSupabaseServiceConfigError } from "@/lib/supabase/service"

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

  if (getSupabaseServiceConfigError()) return

  const service = createServiceClient()
  await syncProfileClientKind(
    service,
    user.id,
    accountType === "professionnel" ? "professionnel" : "particulier"
  )
}
