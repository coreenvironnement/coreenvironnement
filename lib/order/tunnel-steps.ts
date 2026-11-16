export const ORDER_TUNNEL_STEPS_PRO = [
  { id: "intent" as const, label: "Votre demande" },
  { id: "forfait" as const, label: "Forfait" },
  { id: "infos" as const, label: "Informations" },
  { id: "recap" as const, label: "Récapitulatif" },
  { id: "payment" as const, label: "Paiement" },
] as const

export const ORDER_TUNNEL_STEPS_PARTICULIER = [
  { id: "intent" as const, label: "Votre demande" },
  { id: "forfait" as const, label: "Benne" },
  { id: "infos-dates" as const, label: "Dates" },
  { id: "infos-contact" as const, label: "Coordonnées" },
  { id: "recap" as const, label: "Récapitulatif" },
  { id: "payment" as const, label: "Paiement" },
] as const

/** @deprecated Préférer getOrderTunnelSteps(audience) */
export const ORDER_TUNNEL_STEPS = ORDER_TUNNEL_STEPS_PRO

export type OrderTunnelStepId =
  | (typeof ORDER_TUNNEL_STEPS_PRO)[number]["id"]
  | (typeof ORDER_TUNNEL_STEPS_PARTICULIER)[number]["id"]

export function getOrderTunnelSteps(
  audience: "particulier" | "professionnel"
): ReadonlyArray<{ id: OrderTunnelStepId; label: string }> {
  if (audience === "particulier") {
    return ORDER_TUNNEL_STEPS_PARTICULIER
  }
  return ORDER_TUNNEL_STEPS_PRO.map((step) => {
    if (step.id === "payment") {
      return { ...step, label: "Envoi" }
    }
    return step
  })
}

export function isTunnelInfosStep(step: OrderTunnelStepId): boolean {
  return step === "infos" || step === "infos-dates" || step === "infos-contact"
}

export function recapContactStep(audience: "particulier" | "professionnel"): OrderTunnelStepId {
  return audience === "particulier" ? "infos-contact" : "infos"
}

export function recapDatesStep(audience: "particulier" | "professionnel"): OrderTunnelStepId {
  return audience === "particulier" ? "infos-dates" : "infos"
}