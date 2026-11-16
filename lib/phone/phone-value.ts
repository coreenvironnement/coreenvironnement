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
  return n
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
      return {
        dial: match.dial,
        national: formatNationalForDisplay(match.dial, match.national),
      }
    }
  }

  if (digits.startsWith("00") && digits.length > 4) {
    const intl = parseDialFromDigits(digits.slice(2))
    if (intl) {
      return {
        dial: intl.dial,
        national: formatNationalForDisplay(intl.dial, intl.national),
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