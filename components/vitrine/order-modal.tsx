"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, TruckIcon } from "@hugeicons/core-free-icons"

import { OrderWidget } from "@/components/order-widget"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"
import { OrderModalStepper } from "./order-modal-stepper"
import { useVitrineOrder } from "./order-context"

export function VitrineOrderModal() {
  const { open, closeOrder } = useVitrineOrder()
  const [stepIndex, setStepIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

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
        "fixed inset-0 z-[70] h-[100dvh] w-screen overscroll-none",
        open ? "" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <div
        onClick={closeOrder}
        className={cn(
          "absolute inset-0 bg-brand-navy/55 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="absolute inset-0 flex h-[100dvh] w-screen items-stretch justify-center sm:h-full sm:w-full sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Commander une benne"
          className={cn(
            "relative flex h-[100dvh] max-h-none w-screen flex-col overflow-hidden rounded-none border border-brand-border bg-brand-bg pb-[env(safe-area-inset-bottom)] shadow-[var(--shadow-vitrine-pop)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "sm:h-auto sm:max-h-[92svh] sm:w-full sm:max-w-[540px] sm:rounded-2xl sm:pb-0",
            open
              ? "translate-y-0 opacity-100 sm:scale-100"
              : "translate-y-8 opacity-0 sm:translate-y-4 sm:scale-[0.97]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="shrink-0 border-b border-brand-border px-4 pb-3 pt-3.5 sm:px-6 sm:pb-4 sm:pt-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3 sm:gap-3.5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-bg-alt text-brand-green sm:h-12 sm:w-12">
                  <HugeiconsIcon icon={TruckIcon} size={22} strokeWidth={VITRINE_ICON_STROKE} />
                </span>
                <div className="min-w-0 pt-0.5">
                  <h2 className="text-[18px] font-bold leading-tight text-brand-navy sm:text-[20px]">
                    Commander une benne
                  </h2>
                  <p className="mt-1.5 text-[12px] leading-snug text-brand-muted sm:text-[13px]">
                    Paiement sécurisé · Intervention sous 24 h en Île-de-France
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeOrder}
                aria-label="Fermer"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-brand-muted transition-colors hover:bg-brand-bg-alt hover:text-brand-navy"
              >
                <HugeiconsIcon icon={Cancel01Icon} size={18} strokeWidth={VITRINE_ICON_STROKE} />
              </button>
            </div>
          </div>

          <div className="shrink-0 px-4 py-2.5 sm:px-6 sm:py-3">
            <OrderModalStepper stepIndex={stepIndex} />
          </div>

          <div
            ref={scrollContainerRef}
            className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 pb-3 pt-0.5 sm:px-6 sm:pb-4 sm:pt-1"
          >
            <OrderWidget
              variant="embedded"
              open={open}
              onStepIndexChange={setStepIndex}
              onClose={closeOrder}
              scrollContainerRef={scrollContainerRef}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
