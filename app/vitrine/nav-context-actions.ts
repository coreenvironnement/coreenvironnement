"use server"

import {
  getClientNavContext,
  type ClientNavContext,
} from "@/lib/auth/client-nav-context"
import { createClient } from "@/lib/supabase/server"

export type VitrineNavContext = ClientNavContext & {
  isAdmin?: boolean
}

export async function getVitrineNavContext(): Promise<VitrineNavContext> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { isLoggedIn: false, isAdmin: false }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()

  const ctx = await getClientNavContext(supabase, user.id)
  return {
    ...ctx,
    isAdmin: profile?.role === "admin",
  }
}
