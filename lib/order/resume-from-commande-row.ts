import { isValidSignupEmail, normalizeSignupEmail } from "@/lib/auth/signup-validation"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import { searchBanAddresses } from "@/lib/geo/ban-api"
import {
  extractDepartementFromAddress,
  extractDepartementFromPostcode,
  isDepartementInIdf,
} from "@/lib/geo/idf"
import { mintDevisResumeHrefFromResume } from "@/lib/order/mint-devis-resume-href"
import { buildParticulierTunnelResume } from "@/lib/order/particulier-tunnel-resume"
import { isValidContactPhone } from "@/lib/phone/phone-value"

export type CommandeResumeSourceRow = {
  adresse_complete: string | null
  prestation_id: string | null
  date_livraison: string | null
  date_enlevement: string | null
  contact_nom: string | null
  contact_telephone: string | null
  contact_email: string | null
  departement_code: string | null
}

export type CommandeResumeEnrich = {
  fallbackEmail?: string | null
  fallbackContactName?: string | null
  fallbackPhone?: string | null
}

const IDF_DEPT_CENTROID: Record<string, { lat: number; lng: number }> = {
  "75": { lat: 48.8566, lng: 2.3522 },
  "77": { lat: 48.6283, lng: 2.835 },
  "78": { lat: 48.8035, lng: 1.9736 },
  "91": { lat: 48.5317, lng: 2.25 },
  "92": { lat: 48.8924, lng: 2.206 },
  "93": { lat: 48.9098, lng: 2.444 },
  "94": { lat: 48.7872, lng: 2.403 },
  "95": { lat: 49.0632, lng: 2.063 },
}

function splitContactName(raw: string | null | undefined): {
  contactFirstName: string
  contactLastName: string
} {
  const trimmed = (raw ?? "").trim()
  if (!trimmed) {
    return { contactFirstName: "", contactLastName: "" }
  }
  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return { contactFirstName: parts[0], contactLastName: "—" }
  }
  return {
    contactFirstName: parts[0],
    contactLastName: parts.slice(1).join(" "),
  }
}

function resolveContactFields(
  row: CommandeResumeSourceRow,
  enrich?: CommandeResumeEnrich
): {
  contactFirstName: string
  contactLastName: string
  contactPhone: string
  contactEmail: string
} | null {
  let { contactFirstName, contactLastName } = splitContactName(row.contact_nom)
  if (!contactFirstName && !contactLastName) {
    const fb = splitContactName(enrich?.fallbackContactName)
    contactFirstName = fb.contactFirstName
    contactLastName = fb.contactLastName
  }
  if (contactFirstName && !contactLastName) {
    contactLastName = "—"
  }
  if (!contactFirstName) {
    contactFirstName = "Client"
    contactLastName = contactLastName || "—"
  }

  const email = normalizeSignupEmail(
    row.contact_email?.trim() || enrich?.fallbackEmail?.trim() || ""
  )
  if (!isValidSignupEmail(email)) {
    return null
  }

  const phone =
    row.contact_telephone?.trim() || enrich?.fallbackPhone?.trim() || ""
  if (!isValidContactPhone(phone)) {
    return null
  }

  return { contactFirstName, contactLastName, contactPhone: phone, contactEmail: email }
}

function extractPostcodeFromAddress(address: string): string {
  return address.match(/\b(75|77|78|91|92|93|94|95)\d{3}\b/)?.[0] ?? ""
}

function extractCityFromAddress(address: string, postcode: string): string {
  if (!postcode) return ""
  const idx = address.lastIndexOf(postcode)
  if (idx < 0) return ""
  const after = address.slice(idx + postcode.length).trim()
  return after.split(",")[0]?.trim() ?? after
}

function fallbackAddressHit(
  address: string,
  departementCode: string | null
): AddressGeocodeHit | null {
  const label = address.trim()
  if (!label) return null

  const postcode = extractPostcodeFromAddress(label)
  const dept =
    departementCode?.trim() ||
    extractDepartementFromPostcode(postcode) ||
    extractDepartementFromAddress(label) ||
    ""

  if (!dept || !isDepartementInIdf(dept)) return null

  const centroid = IDF_DEPT_CENTROID[dept]
  if (!centroid) return null

  return {
    label,
    lat: centroid.lat,
    lng: centroid.lng,
    postcode: postcode || `${dept}000`,
    city: extractCityFromAddress(label, postcode),
    departementCode: dept,
    score: 0.25,
  }
}

async function resolveSelectedAddressForResume(
  address: string,
  departementCode: string | null
): Promise<AddressGeocodeHit | null> {
  const trimmed = address.trim()
  if (trimmed.length < 3) return fallbackAddressHit(trimmed, departementCode)

  try {
    const hits = await searchBanAddresses(trimmed, 8)
    const normalizedAddress = trimmed.toLowerCase()
    const selectedAddress =
      hits.find((h) => h.label.toLowerCase() === normalizedAddress) ??
      hits.find((h) => normalizedAddress.includes(h.label.toLowerCase())) ??
      hits.find((h) => h.label.toLowerCase().includes(normalizedAddress)) ??
      hits[0]

    if (selectedAddress) return selectedAddress
  } catch {
    /* BAN indisponible : repli sur coordonnées départementales */
  }

  return fallbackAddressHit(trimmed, departementCode)
}

/** Génère le lien vitrine `?reprise=` à partir d’un brouillon particulier en base. */
export async function buildDevisResumeHrefFromCommandeRow(
  row: CommandeResumeSourceRow,
  enrich?: CommandeResumeEnrich
): Promise<string | null> {
  const prestationId = row.prestation_id?.trim() ?? ""
  const address = (row.adresse_complete ?? "").trim()
  const deliveryDate = row.date_livraison?.trim() ?? ""

  const contact = resolveContactFields(row, enrich)
  if (!prestationId || !address || !deliveryDate || !contact) {
    return null
  }

  const selectedAddress = await resolveSelectedAddressForResume(
    address,
    row.departement_code
  )
  if (!selectedAddress) return null

  const resume = buildParticulierTunnelResume({
    prestationId,
    address,
    selectedAddress,
    particulierWasteId: null,
    deliveryDate,
    pickupDate: row.date_enlevement?.trim() || undefined,
    contactFirstName: contact.contactFirstName,
    contactLastName: contact.contactLastName,
    contactPhone: contact.contactPhone,
    contactEmail: contact.contactEmail,
  })

  if (!resume) return null

  return mintDevisResumeHrefFromResume(resume)
}