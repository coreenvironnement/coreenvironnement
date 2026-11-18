"use client"

import { useCallback, useState } from "react"

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

/** Affiche l’erreur après blur, submit ou collage international invalide — pas au simple focus vide. */
export function useContactPhoneField(value: string): ContactPhoneFieldState {
  const [touched, setTouched] = useState(false)
  const [submitPing, setSubmitPing] = useState(false)

  const invalid = !isValidContactPhone(value)
  const showError = (touched || submitPing) && invalid

  const onBlur = useCallback(() => {
    setTouched(true)
  }, [])

  const onInternationalInput = useCallback((international: string) => {
    if (!isValidContactPhone(international)) {
      setSubmitPing(true)
    }
  }, [])

  const markSubmitted = useCallback(() => {
    setTouched(true)
    setSubmitPing(true)
  }, [])

  return {
    showError,
    invalid: showError,
    onBlur,
    onInternationalInput,
    markSubmitted,
  }
}