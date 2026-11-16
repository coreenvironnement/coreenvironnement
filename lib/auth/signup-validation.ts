import type { AuthResponse } from "@supabase/supabase-js"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function normalizeSignupEmail(raw: string): string {
  return raw.trim().toLowerCase()
}

export function isValidSignupEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email)
}

/** Supabase renvoie souvent succès sans erreur si l’e-mail existe déjà (confirmations activées). */
export function isSignUpDuplicate(
  data: AuthResponse["data"] | null | undefined
): boolean {
  const identities = data?.user?.identities
  return Array.isArray(identities) && identities.length === 0
}

export const SIGNUP_EXISTING_EMAIL_MESSAGE =
  "Un compte existe déjà pour cet e-mail."

export function signUpErrorLooksLikeDuplicate(message: string): boolean {
  return /already|registered|exists/i.test(message)
}