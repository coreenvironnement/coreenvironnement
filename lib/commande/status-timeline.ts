import type { LucideIcon } from "lucide-react"
import { CheckCircle2, Package, Truck, XCircle } from "lucide-react"

import { statutCommandeLabel } from "@/lib/commande/labels"

export type TimelineStep = {
  code: string
  label: string
  icon: LucideIcon
  state: "done" | "current" | "upcoming"
}

const HAPPY_PATH = [
  { code: "confirmee", label: "Confirmée", icon: CheckCircle2 },
  { code: "en_cours", label: "En cours", icon: Truck },
  { code: "livree", label: "Livrée", icon: Package },
] as const

const TERMINAL_ANNULEE = { code: "annulee", label: "Annulée", icon: XCircle }

export function buildCommandeTimeline(
  statut: string,
  paymentStatus: string | null
): { steps: TimelineStep[]; terminalLabel: string | null; isTerminalError: boolean } {
  if (statut === "annulee" || paymentStatus === "failed" || paymentStatus === "refund_failed") {
    return {
      steps: [],
      terminalLabel:
        statut === "annulee"
          ? statutCommandeLabel("annulee")
          : paymentStatus === "failed"
            ? "Paiement échoué"
            : "Remboursement échoué",
      isTerminalError: true,
    }
  }

  if (statut === "brouillon") {
    return {
      steps: [
        {
          code: "brouillon",
          label: "En préparation",
          icon: CheckCircle2,
          state: "current",
        },
        {
          code: "en_cours",
          label: HAPPY_PATH[1].label,
          icon: HAPPY_PATH[1].icon,
          state: "upcoming",
        },
        {
          code: "livree",
          label: HAPPY_PATH[2].label,
          icon: HAPPY_PATH[2].icon,
          state: "upcoming",
        },
      ],
      terminalLabel: null,
      isTerminalError: false,
    }
  }

  const order = ["confirmee", "en_cours", "livree"] as const
  const idx = order.indexOf(statut as (typeof order)[number])
  const currentIdx = idx >= 0 ? idx : 0

  const steps: TimelineStep[] = HAPPY_PATH.map((step, i) => ({
    ...step,
    state: i < currentIdx ? "done" : i === currentIdx ? "current" : "upcoming",
  }))

  return { steps, terminalLabel: null, isTerminalError: false }
}
