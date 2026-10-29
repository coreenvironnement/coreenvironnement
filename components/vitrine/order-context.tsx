"use client"

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { OrderAudience } from "@/components/order/order-audience-toggle"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"

export type OrderIntentStart = "location" | "waste" | "auto"

export type OrderDraft = {
  audience: OrderAudience
  address: string
  selectedAddress: AddressGeocodeHit | null
}

const defaultDraft = (): OrderDraft => ({
  audience: "particulier",
  address: "",
  selectedAddress: null,
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
  resolveIntentPhase: () => "location" | "waste"
}

const OrderContext = createContext<OrderContextValue | null>(null)

function resolvePhase(intentStart: OrderIntentStart, draft: OrderDraft): "location" | "waste" {
  if (intentStart === "waste") return "waste"
  if (intentStart === "location") return "location"
  return draft.selectedAddress ? "waste" : "location"
}

export function VitrineOrderProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<OrderDraft>(defaultDraft)
  const [intentStart, setIntentStart] = useState<OrderIntentStart>("auto")

  const patchDraft = useCallback((patch: Partial<OrderDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }))
  }, [])

  const openOrder = useCallback((options?: OpenOrderOptions) => {
    setIntentStart(options?.intentStart ?? "auto")
    setOpen(true)
  }, [])

  const closeOrder = useCallback(() => setOpen(false), [])

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
    }),
    [open, intentStart, draft, patchDraft, openOrder, closeOrder, resolveIntentPhase]
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
