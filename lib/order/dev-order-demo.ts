import type { OrderSuccessScreenProps } from "@/components/order/order-success-screen"
import { priceTtcFromHt } from "@/lib/order/prestation-mapping"
import type { OrderCheckoutInput } from "@/lib/order/checkout-input"
import { prestationById } from "@/lib/prestations"

export const ORDER_DEMO_QUERY_VALUES = ["order-success", "order-confirming"] as const

export type OrderDemoMode = (typeof ORDER_DEMO_QUERY_VALUES)[number]

export function parseOrderDemoParam(
  value: string | null | undefined
): OrderDemoMode | null {
  if (process.env.NODE_ENV !== "development") return null
  if (value === "order-success" || value === "order-confirming") return value
  return null
}

const DEMO_PRESTATION_ID = "dnd-ch-8"

const DEMO_CHECKOUT_INPUT: OrderCheckoutInput = {
  audience: "particulier",
  address: "12 rue des Acacias, 78990 Élancourt",
  lat: 48.7694,
  lng: 1.9589,
  addressLabel: "12 rue des Acacias, 78990 Élancourt",
  postcode: "78990",
  departementCode: "78",
  prestationId: DEMO_PRESTATION_ID,
  deliveryDate: "2026-11-22",
  pickupDate: "2026-11-29",
  contactEmail: "marie.dupont@example.com",
  contactName: "Marie Dupont",
  contactPhone: "+33612345678",
}

/** Données statiques pour `?demo=order-success` (développement uniquement). */
export function getOrderDemoSuccessScreenProps(): Omit<
  OrderSuccessScreenProps,
  "onClose"
> {
  const prestation = prestationById(DEMO_PRESTATION_ID)
  const amountTtcCents = prestation
    ? priceTtcFromHt(prestation.priceHt)
    : priceTtcFromHt(440)

  return {
    input: DEMO_CHECKOUT_INPUT,
    commandeId: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
    amountTtcCents,
    referenceNumero: "CE-2026-0847",
    contactEmail: DEMO_CHECKOUT_INPUT.contactEmail,
    emailConfirmed: true,
    needsPasswordSetup: false,
    passwordSetupEmailSent: false,
  }
}