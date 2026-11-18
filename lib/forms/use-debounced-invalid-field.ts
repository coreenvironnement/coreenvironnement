"use client"

import { useCallback, useEffect, useRef, useState } from "react"

/** Pause après la dernière frappe avant d’afficher une erreur de format (tunnel, inscription). */
export const CONTACT_FIELD_DEBOUNCE_MS = 500

export type DebouncedInvalidFieldState = {
  showError: boolean
  invalid: boolean
  onBlur: () => void
  markSubmitted: () => void
}

export function shouldShowFieldValidationError(
  valid: boolean,
  flags: { touched: boolean; submitPing: boolean; idleInvalid: boolean }
): boolean {
  return (flags.touched || flags.submitPing || flags.idleInvalid) && !valid
}

/**
 * Erreur de format après debounce à l’arrêt de la saisie, immédiatement retirée si redevient valide.
 * Blur et submit forcent l’affichage (champ requis vide ou invalide).
 */
export function useDebouncedInvalidField(
  value: string,
  isValid: (value: string) => boolean,
  debounceMs: number = CONTACT_FIELD_DEBOUNCE_MS
): DebouncedInvalidFieldState {
  const [touched, setTouched] = useState(false)
  const [submitPing, setSubmitPing] = useState(false)
  const [idleInvalid, setIdleInvalid] = useState(false)

  const valueRef = useRef(value)
  valueRef.current = value

  const isValidRef = useRef(isValid)
  isValidRef.current = isValid

  const valid = isValid(value)

  useEffect(() => {
    if (valid) {
      setIdleInvalid(false)
      return
    }

    setIdleInvalid(false)
    const timer = window.setTimeout(() => {
      setIdleInvalid(!isValidRef.current(valueRef.current))
    }, debounceMs)

    return () => window.clearTimeout(timer)
  }, [value, valid, debounceMs])

  const showError = shouldShowFieldValidationError(valid, {
    touched,
    submitPing,
    idleInvalid,
  })

  const onBlur = useCallback(() => {
    setTouched(true)
  }, [])

  const markSubmitted = useCallback(() => {
    setTouched(true)
    setSubmitPing(true)
  }, [])

  return {
    showError,
    invalid: showError,
    onBlur,
    markSubmitted,
  }
}