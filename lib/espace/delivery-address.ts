import type { AddressGeocodeHit } from "@/lib/geo/ban-api"

export type DeliveryAddressParts = {
  ligne: string
  codePostal: string
  ville: string
}

/** Découpe un libellé BAN en rue / CP / ville pour le profil particulier. */
export function deliveryAddressPartsFromBanHit(hit: AddressGeocodeHit): DeliveryAddressParts {
  const parts = parseDeliveryAddressComplete(hit.label)
  return {
    ligne: parts.ligne || hit.label,
    codePostal: hit.postcode.trim() || parts.codePostal,
    ville: hit.city.trim() || parts.ville,
  }
}

export function parseDeliveryAddressComplete(raw: string | null | undefined): DeliveryAddressParts {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) {
    return { ligne: "", codePostal: "", ville: "" }
  }

  const commaMatch = trimmed.match(/^(.+?),\s*(\d{5})\s+(.+)$/)
  if (commaMatch) {
    return {
      ligne: commaMatch[1].trim(),
      codePostal: commaMatch[2],
      ville: commaMatch[3].trim(),
    }
  }

  const lines = trimmed.split(/\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length >= 2) {
    const last = lines[lines.length - 1]
    const cpVille = last.match(/^(\d{5})\s+(.+)$/)
    if (cpVille) {
      return {
        ligne: lines.slice(0, -1).join("\n"),
        codePostal: cpVille[1],
        ville: cpVille[2].trim(),
      }
    }
  }

  const inlineCp = trimmed.match(/^(.+?)\s+(\d{5})\s+(.+)$/)
  if (inlineCp) {
    return {
      ligne: inlineCp[1].trim(),
      codePostal: inlineCp[2],
      ville: inlineCp[3].trim(),
    }
  }

  return { ligne: trimmed, codePostal: "", ville: "" }
}

export function buildDeliveryAddressComplete(parts: DeliveryAddressParts): string {
  const ligne = parts.ligne.trim()
  const cpVille = `${parts.codePostal.trim()} ${parts.ville.trim()}`.trim()
  if (ligne && cpVille) {
    return `${ligne}, ${cpVille}`
  }
  return ligne || cpVille
}

export function isValidFrenchPostcode(value: string): boolean {
  return /^\d{5}$/.test(value.trim())
}