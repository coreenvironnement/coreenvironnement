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
  if (audience !== "professionnel") return ORDER_TUNNEL_STEPS
  return ORDER_TUNNEL_STEPS.map((step) =>
    step.id === "payment" ? { ...step, label: "Envoi" } : step
  )
}
