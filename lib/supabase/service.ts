import { createClient } from "@supabase/supabase-js"

const SUPABASE_SERVICE_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const

/** Variables absentes côté serveur (Vercel prod, server actions, webhooks). */
export function getMissingSupabaseServiceEnv(): string[] {
  return SUPABASE_SERVICE_ENV.filter((name) => !process.env[name]?.trim())
}

export function getSupabaseServiceConfigError(): string | null {
  const missing = getMissingSupabaseServiceEnv()
  if (missing.length === 0) {
    return null
  }

  return `Variables Supabase service role manquantes: ${missing.join(", ")}`
}

export function createServiceClient() {
  const configError = getSupabaseServiceConfigError()
  if (configError) {
    throw new Error(configError)
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
