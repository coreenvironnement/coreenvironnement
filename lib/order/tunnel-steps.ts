export const ORDER_TUNNEL_STEPS = [
  { id: "intent" as const, label: "Votre demande" },
  { id: "forfait" as const, label: "Forfait" },
  { id: "payment" as const, label: "Paiement" },
] as const

export type OrderTunnelStepId = (typeof ORDER_TUNNEL_STEPS)[number]["id"]
