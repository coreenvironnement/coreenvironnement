"use server"

import { getPostLoginRedirectPath } from "@/lib/auth/post-login-path"
import { createClient } from "@/lib/supabase/server"

/** À appeler juste après connexion réussie (session établie côté client et serveur). */
export async function getPostLoginDestination(next: string | null): Promise<string> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return "/login"
  }
  return getPostLoginRedirectPath(supabase, user.id, next)
}
