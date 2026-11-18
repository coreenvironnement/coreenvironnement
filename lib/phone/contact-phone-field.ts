"use client"

import { useCallback } from "react"

import { useDebouncedInvalidField } from "@/lib/forms/use-debounced-invalid-field"
import { CONTACT_PHONE_INVALID_MESSAGE } from "@/lib/phone/contact-phone-messages"
import { isValidContactPhone } from "@/lib/phone/phone-value"

export { CONTACT_PHONE_INVALID_MESSAGE }

export type ContactPhoneFieldState = {
  showError: boolean
  invalid: boolean
  onBlur: () => void
  onInternationalInput: (international: string) => void
  markSubmitted: () => void
}

/** Erreur après pause de saisie (~500 ms), blur, submit ou collage international invalide. */
export function useContactPhoneField(value: string): ContactPhoneFieldState {
  const { showError, invalid, onBlur, markSubmitted } = useDebouncedInvalidField(
    value,
    isValidContactPhone
  )

  const onInternationalInput = useCallback(
    (international: string) => {
      if (!isValidContactPhone(international)) {
        markSubmitted()
      }
    },
    [markSubmitted]
  )

  return {
    showError,
    invalid,
    onBlur,
    onInternationalInput,
    markSubmitted,
  }
}