export const ORDER_TUNNEL_STEPS = [
  { id: "intent" as const, label: "Votre demande" },
  { id: "forfait" as const, label: "Forfait" },
  { id: "infos" as const, label: "Informations" },
  { id: "recap" as const, label: "Récapitulatif" },
  { id: "payment" as const, label: "Paiement" },
] as const

export type OrderTunnelStepId = (typeof ORDER_TUNNEL_STEPS)[number]["id"]

export function getOrderTunnelSteps(
  audience: "particulier" | "professionnel"
): ReadonlyArray<{ id: OrderTunnelStepId; label: string }> {
  return ORDER_TUNNEL_STEPS.map((step) => {
    if (audience === "professionnel" && step.id === "payment") {
      return { ...step, label: "Envoi" }
    }
    if (audience === "particulier" && step.id === "forfait") {
      return { ...step, label: "Benne" }
    }
    return step
  })
}
