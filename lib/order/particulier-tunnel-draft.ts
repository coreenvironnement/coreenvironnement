import { isValidSignupEmail, normalizeSignupEmail } from "@/lib/auth/signup-validation"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import { isValidDeliveryDate } from "@/lib/order/delivery-dates"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"
import { isValidContactPhone } from "@/lib/phone/phone-value"

export type ParticulierTunnelDraftFields = {
  selectedAddress: AddressGeocodeHit | null
  prestationId: string
  deliveryDate: string
  contactFirstName: string
  contactLastName: string
  contactPhone: string
  contactEmail: string
  pickupDate?: string
  particulierWasteId?: ParticulierWasteOptionId | null
}

/** Coordonnées complètes (même critères que l’envoi devis). */
export function particulierTunnelDraftReady(fields: ParticulierTunnelDraftFields): boolean {
  if (!fields.selectedAddress?.label?.trim()) return false
  if (!fields.prestationId.trim()) return false
  if (!fields.deliveryDate.length || !isValidDeliveryDate(fields.deliveryDate)) return false
  if (!fields.contactFirstName.trim() || !fields.contactLastName.trim()) return false
  if (!isValidContactPhone(fields.contactPhone.trim())) return false
  const email = normalizeSignupEmail(fields.contactEmail)
  return isValidSignupEmail(email)
}

export function buildParticulierTunnelDraftInput(
  fields: ParticulierTunnelDraftFields,
  existingCommandeId?: string
): (OrderCheckoutInput & { existingCommandeId?: string }) | null {
  if (!particulierTunnelDraftReady(fields) || !fields.selectedAddress) return null

  const email = normalizeSignupEmail(fields.contactEmail)
  return {
    audience: "particulier",
    address: fields.selectedAddress.label,
    lat: fields.selectedAddress.lat,
    lng: fields.selectedAddress.lng,
    addressLabel: fields.selectedAddress.label,
    postcode: fields.selectedAddress.postcode,
    departementCode: fields.selectedAddress.departementCode,
    prestationId: fields.prestationId,
    deliveryDate: fields.deliveryDate,
    pickupDate: fields.pickupDate?.length ? fields.pickupDate : undefined,
    contactEmail: email,
    contactName:
      [fields.contactFirstName.trim(), fields.contactLastName.trim()].filter(Boolean).join(" ") ||
      undefined,
    contactFirstName: fields.contactFirstName.trim(),
    contactLastName: fields.contactLastName.trim(),
    contactPhone: fields.contactPhone.trim() || undefined,
    selectedAddress: fields.selectedAddress,
    particulierWasteId: fields.particulierWasteId ?? null,
    existingCommandeId,
  }
}