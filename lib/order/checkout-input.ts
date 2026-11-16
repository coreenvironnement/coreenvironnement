import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"

export type OrderCheckoutInput = {
  audience: "particulier" | "professionnel"
  address: string
  lat: number
  lng: number
  addressLabel: string
  postcode?: string
  departementCode?: string
  prestationId: string
  deliveryDate: string
  pickupDate?: string
  contactEmail: string
  contactName?: string
  contactFirstName?: string
  contactLastName?: string
  contactPhone?: string
  selectedAddress?: AddressGeocodeHit
  particulierWasteId?: ParticulierWasteOptionId | null
  /** Raison sociale (tunnel professionnel, paiement CB). */
  companyName?: string
}
