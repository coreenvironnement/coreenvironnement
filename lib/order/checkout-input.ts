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
  contactPhone?: string
}
