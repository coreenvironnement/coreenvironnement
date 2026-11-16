import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"

/** Snapshot tunnel particulier pour reprise après e-mail devis (7 j). */
export type ParticulierTunnelResume = {
  v: 1
  prestationId: string
  address: string
  selectedAddress: AddressGeocodeHit
  particulierWasteId: ParticulierWasteOptionId | null
  deliveryDate: string
  pickupDate?: string
  contactFirstName: string
  contactLastName: string
  contactPhone: string
  contactEmail: string
}

export type DevisResumeApiBody = {
  prestationId?: string
  address?: string
  selectedAddress?: AddressGeocodeHit | null
  particulierWasteId?: ParticulierWasteOptionId | null
  deliveryDate?: string
  pickupDate?: string
  contactFirstName?: string
  contactLastName?: string
  contactPhone?: string
  contactEmail?: string
}

export function parseParticulierTunnelResume(
  raw: unknown
): ParticulierTunnelResume | null {
  if (!raw || typeof raw !== "object") return null
  const o = raw as Record<string, unknown>
  if (o.v !== 1) return null
  const selectedAddress = o.selectedAddress
  if (!selectedAddress || typeof selectedAddress !== "object") return null
  const sa = selectedAddress as Record<string, unknown>
  if (typeof sa.label !== "string" || typeof sa.lat !== "number" || typeof sa.lng !== "number") {
    return null
  }
  const resume = buildParticulierTunnelResume({
    prestationId: String(o.prestationId ?? ""),
    address: String(o.address ?? ""),
    selectedAddress: {
      label: sa.label,
      lat: sa.lat,
      lng: sa.lng,
      postcode: String(sa.postcode ?? ""),
      city: String(sa.city ?? ""),
      departementCode: String(sa.departementCode ?? ""),
      score: typeof sa.score === "number" ? sa.score : 0,
    },
    particulierWasteId:
      o.particulierWasteId === null || o.particulierWasteId === undefined
        ? null
        : (String(o.particulierWasteId) as ParticulierWasteOptionId),
    deliveryDate: String(o.deliveryDate ?? ""),
    pickupDate: o.pickupDate ? String(o.pickupDate) : undefined,
    contactFirstName: String(o.contactFirstName ?? ""),
    contactLastName: String(o.contactLastName ?? ""),
    contactPhone: String(o.contactPhone ?? ""),
    contactEmail: String(o.contactEmail ?? ""),
  })
  return resume
}

function selectedAddressFromCheckout(input: OrderCheckoutInput): AddressGeocodeHit | null {
  if (input.selectedAddress?.label) return input.selectedAddress
  const label = input.addressLabel?.trim() || input.address.trim()
  if (!label) return null
  return {
    label,
    lat: input.lat,
    lng: input.lng,
    postcode: input.postcode?.trim() ?? "",
    city: "",
    departementCode: input.departementCode?.trim() ?? "",
    score: 1,
  }
}

function splitContactFromCheckout(input: OrderCheckoutInput): {
  contactFirstName: string
  contactLastName: string
} {
  const first = input.contactFirstName?.trim() ?? ""
  const last = input.contactLastName?.trim() ?? ""
  if (first || last) return { contactFirstName: first, contactLastName: last || "—" }
  const name = input.contactName?.trim() ?? ""
  if (!name) return { contactFirstName: "", contactLastName: "" }
  const parts = name.split(/\s+/)
  if (parts.length === 1) return { contactFirstName: parts[0], contactLastName: "—" }
  return { contactFirstName: parts[0], contactLastName: parts.slice(1).join(" ") }
}

export function buildParticulierTunnelResumeFromCheckout(
  input: OrderCheckoutInput
): ParticulierTunnelResume | null {
  if (input.audience !== "particulier") return null
  const selectedAddress = selectedAddressFromCheckout(input)
  const { contactFirstName, contactLastName } = splitContactFromCheckout(input)
  return buildParticulierTunnelResume({
    prestationId: input.prestationId,
    address: input.address.trim() || selectedAddress?.label || "",
    selectedAddress,
    particulierWasteId: input.particulierWasteId ?? null,
    deliveryDate: input.deliveryDate,
    pickupDate: input.pickupDate,
    contactFirstName,
    contactLastName,
    contactPhone: input.contactPhone?.trim() ?? "",
    contactEmail: input.contactEmail.trim(),
  })
}

export function buildParticulierTunnelResume(
  body: DevisResumeApiBody
): ParticulierTunnelResume | null {
  const selectedAddress = body.selectedAddress
  const prestationId = String(body.prestationId ?? "").trim()
  const address = String(body.address ?? "").trim()
  const deliveryDate = String(body.deliveryDate ?? "").trim()
  const contactFirstName = String(body.contactFirstName ?? "").trim()
  const contactLastName = String(body.contactLastName ?? "").trim()
  const contactPhone = String(body.contactPhone ?? "").trim()
  const contactEmail = String(body.contactEmail ?? "").trim()

  if (
    !prestationId ||
    !address ||
    !selectedAddress?.label ||
    !deliveryDate ||
    !contactFirstName ||
    !contactLastName ||
    !contactPhone ||
    !contactEmail
  ) {
    return null
  }

  return {
    v: 1,
    prestationId,
    address,
    selectedAddress,
    particulierWasteId: body.particulierWasteId ?? null,
    deliveryDate,
    pickupDate: body.pickupDate?.trim() || undefined,
    contactFirstName,
    contactLastName,
    contactPhone,
    contactEmail,
  }
}