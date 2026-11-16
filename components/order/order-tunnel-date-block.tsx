import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { OrderTunnelDateVisual, type DateVisualKind } from "./order-tunnel-date-visual"

type OrderTunnelDateBlockProps = {
  kind: DateVisualKind
  labelId: string
  label: ReactNode
  labelClassName?: string
  children: ReactNode
}

/** Carte date : visuel + libellé + champ sur un seul bloc. */
export function OrderTunnelDateBlock({
  kind,
  labelId,
  label,
  labelClassName,
  children,
}: OrderTunnelDateBlockProps) {
  return (
    <article className="order-tunnel-date-block mx-auto w-full max-w-[17rem] overflow-hidden rounded-2xl border border-primary/12 bg-white shadow-sm ring-1 ring-primary/[0.06] sm:max-w-none">
      <OrderTunnelDateVisual kind={kind} integrated />
      <div className="space-y-1.5 px-2.5 py-2 text-center sm:px-3 sm:py-2.5">
        <p
          id={labelId}
          className={cn("text-xs font-semibold leading-snug text-brand-navy", labelClassName)}
        >
          {label}
        </p>
        {children}
      </div>
    </article>
  )
}