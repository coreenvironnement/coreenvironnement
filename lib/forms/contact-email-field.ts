"use client"

import { isValidSignupEmail, normalizeSignupEmail } from "@/lib/auth/signup-validation"
import {
  useDebouncedInvalidField,
  type DebouncedInvalidFieldState,
} from "@/lib/forms/use-debounced-invalid-field"

export const CONTACT_EMAIL_INVALID_MESSAGE = "Indiquez une adresse e-mail valide."

export function isValidContactEmailInput(raw: string): boolean {
  const normalized = normalizeSignupEmail(raw)
  return normalized.length > 0 && isValidSignupEmail(normalized)
}

export type ContactEmailFieldState = DebouncedInvalidFieldState

export function useContactEmailField(value: string): ContactEmailFieldState {
  return useDebouncedInvalidField(value, isValidContactEmailInput)
}