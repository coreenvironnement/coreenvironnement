"use client"

import { createContext, useCallback, useContext, useMemo, useState } from "react"

type OrderContextValue = {
  open: boolean
  openOrder: () => void
  closeOrder: () => void
}

const OrderContext = createContext<OrderContextValue | null>(null)

export function VitrineOrderProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  const openOrder = useCallback(() => setOpen(true), [])
  const closeOrder = useCallback(() => setOpen(false), [])

  const value = useMemo(
    () => ({ open, openOrder, closeOrder }),
    [open, openOrder, closeOrder]
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
