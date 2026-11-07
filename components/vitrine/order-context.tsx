"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import { HOME_VOLUME_ESTIMATOR_HASH } from "@/lib/seo/early-local-links"

import type { OrderAudience } from "@/components/order/order-audience-toggle"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"
import type { BenneFamily } from "@/lib/prestations"

export type OrderIntentStart = "location" | "waste" | "auto" | "estimator"

export type OrderDraft = {
  audience: OrderAudience
  address: string
  selectedAddress: AddressGeocodeHit | null
  /** Prérempli depuis l’estimateur vitrine (évite de redemander le déchet). */
  particulierWasteId?: ParticulierWasteOptionId | null
  family?: BenneFamily | null
  volumeHintM3?: number | null
  volumeHintOrigin?: "estimated" | "chosen" | "unknown"
}

const defaultDraft = (): OrderDraft => ({
  audience: "particulier",
  address: "",
  selectedAddress: null,
  particulierWasteId: null,
  family: null,
  volumeHintM3: null,
  volumeHintOrigin: "unknown",
})

type OpenOrderOptions = {
  intentStart?: OrderIntentStart
}

type OrderContextValue = {
  open: boolean
  intentStart: OrderIntentStart
  draft: OrderDraft
  patchDraft: (patch: Partial<OrderDraft>) => void
  openOrder: (options?: OpenOrderOptions) => void
  closeOrder: () => void
  resolveIntentPhase: () => "location" | "waste" | "volume"
  /** Incrémenté à chaque demande d’ouverture de l’estimateur vitrine. */
  volumeEstimatorRequestId: number
  openVolumeEstimator: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)

function resolvePhase(
  intentStart: OrderIntentStart,
  draft: OrderDraft
): "location" | "waste" | "volume" {
  if (intentStart === "estimator") {
    if (!draft.selectedAddress) return "location"
    return draft.particulierWasteId ? "volume" : "waste"
  }
  if (intentStart === "waste") return "waste"
  if (intentStart === "location") return "location"
  return draft.selectedAddress ? "waste" : "location"
}

function scrollToVolumeEstimatorSection() {
  const anchor = document.getElementById(HOME_VOLUME_ESTIMATOR_HASH)
  const conseils = document.getElementById("conseils")
  ;(anchor ?? conseils)?.scrollIntoView({ behavior: "smooth", block: "start" })
  if (typeof window !== "undefined") {
    const nextHash = `#${HOME_VOLUME_ESTIMATOR_HASH}`
    if (window.location.hash !== nextHash) {
      window.history.replaceState(null, "", nextHash)
    }
  }
}

export function VitrineOrderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<OrderDraft>(defaultDraft)
  const [intentStart, setIntentStart] = useState<OrderIntentStart>("auto")
  const [volumeEstimatorRequestId, setVolumeEstimatorRequestId] = useState(0)

  const patchDraft = useCallback((patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const openOrder = useCallback((options?: OpenOrderOptions) => {
    setIntentStart(options?.intentStart ?? "auto")
    setOpen(true)
  }, [])

  const closeOrder = useCallback(() => setOpen(false), [])

  const openVolumeEstimator = useCallback(() => {
    scrollToVolumeEstimatorSection()
    setVolumeEstimatorRequestId((n) => n + 1)
  }, [])

  const resolveIntentPhase = useCallback(
    () => resolvePhase(intentStart, draft),
    [intentStart, draft]
  )

  const value = useMemo(
    () => ({
      open,
      intentStart,
      draft,
      patchDraft,
      openOrder,
      closeOrder,
      resolveIntentPhase,
      volumeEstimatorRequestId,
      openVolumeEstimator,
    }),
    [
      open,
      intentStart,
      draft,
      patchDraft,
      openOrder,
      closeOrder,
      resolveIntentPhase,
      volumeEstimatorRequestId,
      openVolumeEstimator,
    ]
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useVitrineOrder() {
  const ctx = useContext(OrderContext)
  if (!ctx) {
    throw new Error("useVitrineOrder must be used within VitrineOrderProvider")
  }
  return ctx
}
