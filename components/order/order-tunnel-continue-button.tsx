"use client"

import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type OrderTunnelContinueButtonProps = {
  children?: ReactNode
  disabled?: boolean
  onClick: () => void
  className?: string
}

/** CTA tunnel (corps + chevron vert à droite, style hero / Good Collect). */
export function OrderTunnelContinueButton({
  children = "Continuer",
  disabled,
  onClick,
  className,
}: OrderTunnelContinueButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "group flex min-h-12 w-full items-stretch overflow-hidden rounded-xl text-left text-[15px] font-semibold leading-snug shadow-sm transition-colors",
        disabled
          ? "cursor-not-allowed bg-[#E4E7EC] text-[#667085]"
          : "bg-brand-navy text-white shadow-[0_8px_24px_-8px_rgb(24_53_116/0.35)] hover:bg-[#152d66]",
        className
      )}
    >
      <span className="flex min-w-0 flex-1 items-center px-4 py-3">{children}</span>
      <span
        className={cn(
          "flex w-12 shrink-0 items-center justify-center bg-brand-green text-white transition-colors",
          !disabled && "group-hover:bg-[#19752B]"
        )}
        aria-hidden
      >
        <ChevronRight className="size-5" strokeWidth={2.25} />
      </span>
    </button>
  )
}
