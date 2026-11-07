"use client"

import { useEffect, useState } from "react"

import { ParticulierVolumeStep } from "@/components/order/particulier-volume-step"
import { ParticulierWastePicker } from "@/components/order/particulier-waste-picker"
import { OrderTunnelContinueButton } from "@/components/order/order-tunnel-continue-button"
import {
  particulierWasteOptionById,
  type ParticulierWasteOptionId,
} from "@/lib/order/particulier-waste-options"
import type { BenneFamily } from "@/lib/prestations"

import { useVitrineOrder } from "./order-context"

export function VitrineVolumeEstimator({
  compactTop = false,
  launchId = 0,
}: {
  compactTop?: boolean
  /** Incrémenté par `openVolumeEstimator` — enchaîne vers l’estimateur si le déchet est déjà choisi. */
  launchId?: number
}) {
  const { openOrder, patchDraft, draft } = useVitrineOrder()
  const [particulierWasteId, setParticulierWasteId] =
    useState<ParticulierWasteOptionId | null>(draft.particulierWasteId ?? null)
  const [family, setFamily] = useState<BenneFamily | null>(() => {
    const id = draft.particulierWasteId
    if (!id) return null
    return particulierWasteOptionById(id)?.family ?? null
  })

  const beginEstimate = (wasteId: ParticulierWasteOptionId | null = particulierWasteId) => {
    if (!wasteId) return
    const mapped = particulierWasteOptionById(wasteId)
    if (mapped) setFamily(mapped.family)
  }

  useEffect(() => {
    if (launchId === 0) return
    if (family && particulierWasteId) return
    if (particulierWasteId) beginEstimate(particulierWasteId)
  }, [launchId, particulierWasteId, family])

  const handleContinueOrder = (
    volumeM3: number | null,
    origin: "estimated" | "chosen"
  ) => {
    if (!particulierWasteId || !family || volumeM3 == null) return
    patchDraft({
      audience: "particulier",
      particulierWasteId,
      family,
      volumeHintM3: volumeM3,
      volumeHintOrigin: origin,
    })
    openOrder({ intentStart: "estimator" })
  }

  if (family && particulierWasteId) {
    return (
      <div className={compactTop ? "text-left" : "mt-5 text-left"}>
        <ParticulierVolumeStep
          family={family}
          wasteId={particulierWasteId}
          addressPending
          estimateOnly
          onBackToWaste={() => setFamily(null)}
          onContinue={handleContinueOrder}
        />
      </div>
    )
  }

  return (
    <div
      className={
        compactTop ? "space-y-3 text-left" : "mt-5 space-y-3 text-left"
      }
    >
      <h3 className="text-[16px] font-semibold leading-snug text-brand-navy sm:text-[17px]">
        Quel type de déchets souhaitez-vous évacuer ?
      </h3>
      <ParticulierWastePicker
        value={particulierWasteId}
        onChange={(id) => {
          setParticulierWasteId(id)
          setFamily(null)
        }}
      />
      <OrderTunnelContinueButton
        disabled={!particulierWasteId}
        onClick={beginEstimate}
      >
        Estimer mon volume
      </OrderTunnelContinueButton>
    </div>
  )
}
