"use client"

import { useEffect } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon, TruckIcon } from "@hugeicons/core-free-icons"

import { OrderWidget } from "@/components/order-widget"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"

export function VitrineOrderModal() {
  const { open, closeOrder } = useVitrineOrder()

  useEffect(() => {
    if (!open) return
    document.body.style.overflow = "hidden"
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeOrder()
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", onKey)
    }
  }, [open, closeOrder])

  return (
    <div
      className={cn("fixed inset-0 z-[70]", open ? "" : "pointer-events-none")}
      aria-hidden={!open}
    >
      <div
        onClick={closeOrder}
        className={cn(
          "absolute inset-0 bg-brand-navy/55 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
      />

      <div className="absolute inset-0 flex items-end justify-center sm:items-center sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Commander une benne"
          className={cn(
            "relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-2xl border border-brand-border bg-brand-bg shadow-[var(--shadow-vitrine-pop)] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:max-w-[520px] sm:rounded-2xl",
            open
              ? "translate-y-0 opacity-100 sm:scale-100"
              : "translate-y-8 opacity-0 sm:translate-y-4 sm:scale-[0.97]"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4 border-b border-brand-border px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3.5">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-bg-alt text-brand-green">
                <HugeiconsIcon icon={TruckIcon} size={22} strokeWidth={VITRINE_ICON_STROKE} />
              </span>
              <div>
                <h2 className="text-[17px] text-brand-navy">
                  Commander une benne
                </h2>
                <p className="mt-0.5 text-[13px] leading-snug text-brand-muted">
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

          <div className="overflow-y-auto px-3 py-3 sm:px-4 sm:py-4">
            <OrderWidget variant="embedded" />
          </div>
        </div>
      </div>
    </div>
  )
}
