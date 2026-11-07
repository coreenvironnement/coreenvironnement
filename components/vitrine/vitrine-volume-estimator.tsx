"use client"

import { useState } from "react"

import { ParticulierVolumeStep } from "@/components/order/particulier-volume-step"
import { ParticulierWastePicker } from "@/components/order/particulier-waste-picker"
import { OrderTunnelContinueButton } from "@/components/order/order-tunnel-continue-button"
import {
  particulierWasteOptionById,
  type ParticulierWasteOptionId,
} from "@/lib/order/particulier-waste-options"
import type { BenneFamily } from "@/lib/prestations"

import { useVitrineOrder } from "./order-context"

export function VitrineVolumeEstimator() {
  const { openOrder, patchDraft } = useVitrineOrder()
  const [particulierWasteId, setParticulierWasteId] =
    useState<ParticulierWasteOptionId | null>(null)
  const [family, setFamily] = useState<BenneFamily | null>(null)

  const beginEstimate = () => {
    if (!particulierWasteId) return
    const mapped = particulierWasteOptionById(particulierWasteId)
    if (mapped) setFamily(mapped.family)
  }

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
      <div className="mt-5 text-left">
        <ParticulierVolumeStep
          family={family}
          wasteId={particulierWasteId}
          addressPending
          onBackToWaste={() => setFamily(null)}
          onContinue={handleContinueOrder}
        />
      </div>
    )
  }

  return (
    <div className="mt-5 space-y-3 text-left">
      <p className="text-[12px] leading-snug text-brand-muted">
        Choisissez votre type de déchet, puis estimez le volume sans
        renseigner d&apos;adresse.
      </p>
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
