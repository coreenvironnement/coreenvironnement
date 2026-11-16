import { cache } from "react"
import type { SupabaseClient, User } from "@supabase/supabase-js"

import { getClientNavContext, type ClientNavContext } from "@/lib/auth/client-nav-context"
import { createClient } from "@/lib/supabase/server"

export const getSupabaseServerClient = cache(async (): Promise<SupabaseClient> => {
  return createClient()
})

export const getAuthUser = cache(async (): Promise<User | null> => {
  const supabase = await getSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user ?? null
})

export type EspaceProfileRow = {
  full_name: string | null
  email: string | null
  role: string | null
}

export const getEspaceProfile = cache(
  async (userId: string): Promise<EspaceProfileRow | null> => {
    const supabase = await getSupabaseServerClient()
    const { data } = await supabase
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", userId)
      .maybeSingle()
    return data
  }
)

export const getCachedClientNavContext = cache(
  async (userId: string): Promise<ClientNavContext> => {
    const supabase = await getSupabaseServerClient()
    return getClientNavContext(supabase, userId)
  }
)