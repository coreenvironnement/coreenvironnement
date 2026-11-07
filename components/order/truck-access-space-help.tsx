"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

import {
  TRUCK_ACCESS_SPACE_DISCLOSURE_LABEL,
  TRUCK_ACCESS_SPACE_HELP_TEXT,
} from "@/lib/order/truck-access-help"
import { cn } from "@/lib/utils"

import { CoreAccesCamionLottie } from "./core-acces-camion-lottie"

export function TruckAccessSpaceHelpBody({ playToken }: { playToken: number }) {
  return (
    <div className="truck-access-help__body font-[family-name:var(--font-body)]">
      <CoreAccesCamionLottie playToken={playToken} />
      <p className="truck-access-help__text mt-3 text-[13px] leading-relaxed text-brand-muted sm:text-[14px]">
        {TRUCK_ACCESS_SPACE_HELP_TEXT}
      </p>
    </div>
  )
}

type TruckAccessSpaceDisclosureProps = {
  className?: string
  embedded?: boolean
}

export function TruckAccessSpaceDisclosure({
  className,
  embedded = false,
}: TruckAccessSpaceDisclosureProps) {
  const [open, setOpen] = useState(false)
  const [playToken, setPlayToken] = useState(0)

  return (
    <details
      className={cn(
        "truck-access-help-disclosure group rounded-xl border open:pb-3",
        embedded
          ? "border-primary/15 bg-brand-warm-field/50"
          : "border-primary/15 bg-brand-warm-field/50",
        className
      )}
      onToggle={(event) => {
        const nextOpen = event.currentTarget.open
        setOpen(nextOpen)
        if (nextOpen) {
          setPlayToken((token) => token + 1)
        }
      }}
    >
      <summary className="truck-access-help-disclosure__summary flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-xs font-semibold text-brand-navy marker:content-none [&::-webkit-details-marker]:hidden">
        <span>{TRUCK_ACCESS_SPACE_DISCLOSURE_LABEL}</span>
        <ChevronDown
          className="size-4 shrink-0 text-brand-muted transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      {open ? (
        <div className="truck-access-help-disclosure__panel px-3 pt-1">
          <TruckAccessSpaceHelpBody playToken={playToken} />
        </div>
      ) : null}
    </details>
  )
}
