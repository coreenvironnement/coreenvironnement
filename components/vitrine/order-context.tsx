"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

import {
  parseOrderDemoParam,
  type OrderDemoMode,
} from "@/lib/order/dev-order-demo"

import { HOME_VOLUME_ESTIMATOR_HASH } from "@/lib/seo/early-local-links"

import type { OrderAudience } from "@/components/order/order-audience-toggle"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"
import type { ParticulierTunnelResume } from "@/lib/order/particulier-tunnel-resume"
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
  /** Menu mobile du header ouvert (masque la barre d’actions basse). */
  headerMenuOpen: boolean
  setHeaderMenuOpen: (open: boolean) => void
  /** Reprise tunnel depuis e-mail devis (consommé une fois à l’ouverture). */
  queueTunnelResume: (resume: ParticulierTunnelResume) => void
  takeTunnelResume: () => ParticulierTunnelResume | null
  /** Prévisualisation post-paiement (`?demo=…`, développement uniquement). */
  orderDemo: OrderDemoMode | null
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

export function VitrineOrderProvider({
  children,
  initialOrderDemo = null,
}: {
  children: ReactNode
  initialOrderDemo?: OrderDemoMode | null
}) {
  const [open, setOpen] = useState(Boolean(initialOrderDemo))
  const [draft, setDraft] = useState<OrderDraft>(defaultDraft)
  const [intentStart, setIntentStart] = useState<OrderIntentStart>("auto")
  const [volumeEstimatorRequestId, setVolumeEstimatorRequestId] = useState(0)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const [orderDemo, setOrderDemo] = useState<OrderDemoMode | null>(
    initialOrderDemo ?? null
  )
  const tunnelResumeRef = useRef<ParticulierTunnelResume | null>(null)

  useEffect(() => {
    const demo = parseOrderDemoParam(
      new URLSearchParams(window.location.search).get("demo")
    )
    if (!demo) return
    setOrderDemo(demo)
    setOpen(true)
  }, [])

  const queueTunnelResume = useCallback((resume: ParticulierTunnelResume) => {
    tunnelResumeRef.current = resume
  }, [])

  const takeTunnelResume = useCallback(() => {
    const value = tunnelResumeRef.current
    tunnelResumeRef.current = null
    return value
  }, [])

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
      headerMenuOpen,
      setHeaderMenuOpen,
      queueTunnelResume,
      takeTunnelResume,
      orderDemo,
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
      headerMenuOpen,
      queueTunnelResume,
      takeTunnelResume,
      orderDemo,
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
