import {
  DEFAULT_CALLING_DIAL,
  parseDialFromDigits,
} from "@/lib/phone/calling-codes"

export function phoneDigitsOnly(value: string): string {
  return value.replace(/\D/g, "")
}

/** Numéro national affiché (ex. 06… pour la France). */
export function nationalDigitsForStorage(dial: string, nationalInput: string): string {
  let n = phoneDigitsOnly(nationalInput)
  if (dial === "33" && n.startsWith("0")) {
    n = n.slice(1)
  }
  if (n.startsWith(dial) && n.length > dial.length + 5) {
    const stripped = n.slice(dial.length)
    if (dial === "33") {
      if (stripped.length === 9 || (stripped.length === 10 && stripped.startsWith("0"))) {
        n = stripped.startsWith("0") ? stripped.slice(1) : stripped
      }
    } else if (stripped.length >= 6) {
      n = stripped
    }
  }
  return n
}

/** Saisie internationale explicite ou collage E.164 dans le champ national. */
export function inputLooksLikeInternational(rawInput: string): boolean {
  const trimmed = rawInput.trim()
  if (!trimmed) return false
  if (trimmed.startsWith("+")) return true

  const digits = phoneDigitsOnly(trimmed)
  if (digits.startsWith("00") && digits.length > 4) return true

  const match = parseDialFromDigits(digits)
  if (!match) return false

  const minNationalLen = match.dial === "33" ? 9 : 6
  return digits.length >= match.dial.length + minNationalLen
}

/**
 * Interprète onChange / paste / autofill du champ national :
 * garde la saisie nationale ou découpe indicatif + numéro national.
 */
export function resolvePhoneNationalFieldInput(
  rawInput: string,
  currentDial: string
): ParsedContactPhone {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    return { dial: currentDial, national: "" }
  }

  if (inputLooksLikeInternational(trimmed)) {
    const normalized =
      trimmed.startsWith("+") || /^00/.test(trimmed.replace(/\s/g, ""))
        ? trimmed
        : `+${phoneDigitsOnly(trimmed)}`
    return parseContactPhone(normalized)
  }

  return {
    dial: currentDial,
    national: trimmed,
  }
}

export function buildInternationalPhone(dial: string, nationalInput: string): string {
  const n = nationalDigitsForStorage(dial, nationalInput)
  if (!n.length) return ""
  return `+${dial}${n}`
}

export type ParsedContactPhone = {
  dial: string
  national: string
}

export function parseContactPhone(value: string): ParsedContactPhone {
  const trimmed = value.trim()
  if (!trimmed) {
    return { dial: DEFAULT_CALLING_DIAL, national: "" }
  }

  const digits = phoneDigitsOnly(trimmed)
  if (trimmed.startsWith("+") && digits.length > 0) {
    const match = parseDialFromDigits(digits)
    if (match) {
      const national = nationalDigitsForStorage(match.dial, match.national)
      return {
        dial: match.dial,
        national: formatNationalForDisplay(match.dial, national),
      }
    }
  }

  if (digits.startsWith("00") && digits.length > 4) {
    const intl = parseDialFromDigits(digits.slice(2))
    if (intl) {
      const national = nationalDigitsForStorage(intl.dial, intl.national)
      return {
        dial: intl.dial,
        national: formatNationalForDisplay(intl.dial, national),
      }
    }
  }

  return {
    dial: DEFAULT_CALLING_DIAL,
    national: digits,
  }
}

export function formatNationalForDisplay(dial: string, nationalDigits: string): string {
  if (dial === "33" && nationalDigits.length === 9 && !nationalDigits.startsWith("0")) {
    return `0${nationalDigits}`
  }
  return nationalDigits
}

export function isValidContactPhone(value: string): boolean {
  const parsed = parseContactPhone(value)
  const national = nationalDigitsForStorage(parsed.dial, parsed.national)
  if (!national.length) return false

  if (parsed.dial === "33") {
    return national.length === 9
  }

  const fullLen = parsed.dial.length + national.length
  return fullLen >= 10 && fullLen <= 15 && national.length >= 6
}

export function formatContactPhoneDisplay(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const parsed = parseContactPhone(trimmed)
  if (!parsed.national) return trimmed
  return `+${parsed.dial} ${parsed.national}`
}

/** Format E.164 canonique pour formulaires (`+33612345678`). */
export function normalizeContactPhoneForStorage(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return ""
  const parsed = parseContactPhone(trimmed)
  return buildInternationalPhone(parsed.dial, parsed.national)
}