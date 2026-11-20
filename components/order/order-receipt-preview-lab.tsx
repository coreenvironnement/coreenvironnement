"use client"

import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { getOrderDemoSuccessScreenProps } from "@/lib/order/dev-order-demo"
import { cn } from "@/lib/utils"

import { OrderReceiptConfirmation } from "./order-receipt-confirmation"
import type { ReceiptPrinterStage } from "./receipt-printer"

export function OrderReceiptPreviewLab() {
  const demo = getOrderDemoSuccessScreenProps()
  const [playKey, setPlayKey] = useState(0)
  const [embedded, setEmbedded] = useState(true)
  const [soundsOn, setSoundsOn] = useState(true)
  const [stageOverride, setStageOverride] = useState<ReceiptPrinterStage | "auto">("auto")

  const replay = useCallback(() => {
    setStageOverride("auto")
    setPlayKey((k) => k + 1)
  }, [])

  return (
    <div className="mx-auto w-full max-w-md space-y-6 px-4 py-10">
      <header className="space-y-2 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-green">
          Aperçu interne
        </p>
        <h1 className="text-xl font-semibold text-brand-navy">
          Confirmation « ticket imprimante »
        </h1>
        <p className="text-sm leading-relaxed text-brand-muted">
          Prototype supprimable : animation + ticket unique (pas de double récap). À
          valider avant branchement sur le tunnel réel.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" variant="outline" size="sm" onClick={replay}>
          Rejouer l&apos;animation
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setEmbedded((v) => !v)}
        >
          {embedded ? "Vue large" : "Vue modale"}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setSoundsOn((v) => !v)}
        >
          {soundsOn ? "Sons activés" : "Sons désactivés"}
        </Button>
        {(
          [
            ["processing", "Traitement"],
            ["printing", "Impression"],
            ["complete", "Terminé"],
          ] as const
        ).map(([stage, label]) => (
          <Button
            key={stage}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setStageOverride(stage)}
          >
            {label}
          </Button>
        ))}
      </div>

      <div
        className={cn(
          "mx-auto rounded-2xl border border-brand-green/14 bg-brand-warm-field/80 p-3 shadow-sm",
          embedded ? "max-w-[min(100%,380px)]" : "max-w-lg"
        )}
      >
        <OrderReceiptConfirmation
          key={`${playKey}-${stageOverride}`}
          {...demo}
          embedded={embedded}
          autoPlay={stageOverride === "auto"}
          initialStage={stageOverride === "auto" ? "processing" : stageOverride}
          soundsEnabled={soundsOn}
          onClose={() => undefined}
        />
        <p className="mt-2 text-center text-[11px] text-brand-muted">
          Données démo (même jeu que <code className="text-[10px]">?demo=order-success</code>)
        </p>
      </div>
    </div>
  )
}