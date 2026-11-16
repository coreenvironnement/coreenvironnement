"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"

import { OrderWidget } from "@/components/order-widget"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"
import { getOrderTunnelSteps } from "@/lib/order/tunnel-steps"

import { OrderModalStepper } from "./order-modal-stepper"
import { useVitrineOrder } from "./order-context"
import type { OrderDemoMode } from "@/lib/order/dev-order-demo"

function orderModalTitle(
  audience: "particulier" | "professionnel",
  stepIndex: number
): string {
  const stepId = getOrderTunnelSteps(audience)[stepIndex]?.id
  if (stepId === "infos-dates") {
    return "Dates de livraison"
  }
  if (stepId === "infos-contact") {
    return "Vos coordonnées"
  }
  if (stepId === "infos") {
    return audience === "particulier"
      ? "Préparer ma commande"
      : "Préparer ma demande"
  }
  if (stepId === "recap" && audience === "particulier") {
    return "Vérifier ma commande"
  }
  return audience === "particulier" ? "Choisir ma benne" : "Commander une benne"
}

function demoModalTitle(demo: OrderDemoMode | null): string | null {
  if (demo === "order-success") return "Commande confirmée"
  if (demo === "order-confirming") return "Paiement"
  return null
}

function isPostPaymentDemo(demo: OrderDemoMode | null): boolean {
  return demo === "order-success" || demo === "order-confirming"
}

function OrderModalCloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Fermer"
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-brand-muted transition-colors hover:bg-primary/10 hover:text-brand-navy"
    >
      <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={VITRINE_ICON_STROKE} />
    </button>
  )
}

export function VitrineOrderModal() {
  const { open, closeOrder, orderDemo } = useVitrineOrder()
  const [stepIndex, setStepIndex] = useState(0)
  const [postPaymentUi, setPostPaymentUi] = useState(false)
  const [audience, setAudience] = useState<"particulier" | "professionnel">(
    "particulier"
  )
  const [volumeIntentChoiceActive, setVolumeIntentChoiceActive] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) setPostPaymentUi(false)
  }, [open])

  const hideTunnelHeader = isPostPaymentDemo(orderDemo) || postPaymentUi
  const dialogAriaLabel =
    demoModalTitle(orderDemo) ??
    (postPaymentUi ? "Confirmation de commande" : orderModalTitle(audience, stepIndex))

  useEffect(() => {
    if (!open) return
    const html = document.documentElement
    const { overflow: prevHtmlOverflow } = html.style
    const { overflow: prevBodyOverflow, position: prevBodyPosition, top: prevBodyTop, left: prevBodyLeft, right: prevBodyRight, width: prevBodyWidth } =
      document.body.style
    const scrollY = window.scrollY
    html.style.overflow = "hidden"
    document.body.style.overflow = "hidden"
    document.body.style.position = "fixed"
    document.body.style.top = `-${scrollY}px`
    document.body.style.left = "0"
    document.body.style.right = "0"
    document.body.style.width = "100%"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOrder()
    window.addEventListener("keydown", onKey)
    return () => {
      html.style.overflow = prevHtmlOverflow
      document.body.style.overflow = prevBodyOverflow
      document.body.style.position = prevBodyPosition
      document.body.style.top = prevBodyTop
      document.body.style.left = prevBodyLeft
      document.body.style.right = prevBodyRight
      document.body.style.width = prevBodyWidth
      window.scrollTo(0, scrollY)
      window.removeEventListener("keydown", onKey)
    }
  }, [open, closeOrder])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] h-[100dvh] w-full max-w-[100vw] overflow-x-hidden overscroll-none",
        open ? "" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        onClick={closeOrder}
        className={cn(
          "absolute inset-0 bg-brand-forest/55 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        className={cn(
          "absolute inset-0 flex h-[100dvh] w-full max-w-[100vw] items-stretch justify-center overflow-x-hidden lg:h-full lg:items-center lg:p-6"
        )}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={dialogAriaLabel}
          className={cn(
            "order-tunnel-shell relative flex h-[100dvh] w-full min-w-0 max-w-[100vw] max-h-none flex-col overflow-hidden rounded-none border border-primary/15 pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-vitrine-pop)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:h-auto lg:max-h-[min(92svh,100dvh)] lg:w-full lg:max-w-[min(72rem,94vw)] lg:rounded-2xl lg:pb-0",
            open
              ? "translate-y-0 opacity-100 lg:scale-100"
              : "translate-y-8 opacity-0 lg:translate-y-4 lg:scale-[0.97]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {hideTunnelHeader ? (
            <div className="pointer-events-none absolute right-4 top-3.5 z-10 sm:right-6 sm:top-4">
              <div className="pointer-events-auto">
                <OrderModalCloseButton onClick={closeOrder} />
              </div>
            </div>
          ) : (
            <div className="order-tunnel-header shrink-0 border-b px-4 pb-3 pt-3.5 sm:px-6 sm:pb-4 sm:pt-5 lg:pb-2.5 lg:pt-3">
              <div className="grid grid-cols-[2.25rem_minmax(0,1fr)_2.25rem] items-start gap-x-2 pt-0.5 sm:gap-x-3">
                <span className="h-9 w-9 shrink-0" aria-hidden="true" />
                <div className="min-w-0 text-center">
                  <h2 className="text-[18px] font-bold leading-tight text-brand-navy sm:text-[20px]">
                    {orderModalTitle(audience, stepIndex)}
                  </h2>
                  {audience === "professionnel" ? (
                    <p className="mt-1 text-[12px] leading-snug text-brand-muted sm:text-[13px]">
                      Demande professionnelle, sans paiement en ligne
                    </p>
                  ) : null}
                </div>
                <div className="justify-self-end">
                  <OrderModalCloseButton onClick={closeOrder} />
                </div>
              </div>
              {!orderDemo ? (
                <div className="order-tunnel-stepper-wrap min-w-0 pt-2.5 sm:pt-3">
                  <OrderModalStepper
                    stepIndex={stepIndex}
                    audience={audience}
                    compact={volumeIntentChoiceActive}
                  />
                </div>
              ) : null}
            </div>
          )}

          <div
            ref={scrollContainerRef}
            className={cn(
              "order-tunnel-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-5 pb-3 sm:px-6 sm:pb-4",
              hideTunnelHeader ? "pt-3.5 sm:pt-4" : "pt-1 sm:pt-1.5"
            )}
          >
            <OrderWidget
              variant="embedded"
              open={open}
              onStepIndexChange={setStepIndex}
              onAudienceChange={setAudience}
              onClose={closeOrder}
              scrollContainerRef={scrollContainerRef}
              onVolumeIntentChoiceActive={setVolumeIntentChoiceActive}
              onPostPaymentUiChange={setPostPaymentUi}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
