"use client"

import { Briefcase, Check, User } from "lucide-react"

import { cn } from "@/lib/utils"

export type OrderAudience = "particulier" | "professionnel"

const ORDER_SECTION_LABEL =
  "text-left text-[14px] font-semibold leading-snug text-brand-navy"

const SEGMENT_TRACK =
  "flex w-full border border-brand-green/14 p-1 shadow-[0_1px_2px_rgb(14_32_16/0.04)]"

const SEGMENT_BUTTON_BASE =
  "flex flex-1 items-center justify-center gap-1.5 px-3 text-[13px] font-semibold outline-none motion-safe:transition-[color,background-color,box-shadow,outline] motion-safe:duration-200 motion-reduce:transition-none focus-visible:ring-2 focus-visible:ring-brand-green/35 focus-visible:ring-offset-1 sm:text-sm"

const SEGMENT_INACTIVE = "text-brand-muted hover:text-brand-navy"

type OrderAudienceToggleProps = {
  audience: OrderAudience
  onChange: (value: OrderAudience) => void
  subdued?: boolean
  /** Hero : sans label, toggle type Good Collect (pill blanc actif). */
  variant?: "tunnel" | "hero"
}

export function OrderAudienceToggle({
  audience,
  onChange,
  subdued,
  variant = "tunnel",
}: OrderAudienceToggleProps) {
  const heroOptions = [
    { id: "particulier" as const, label: "Particulier" },
    { id: "professionnel" as const, label: "Professionnel" },
  ] as const

  const tunnelOptions = [
    { id: "particulier" as const, label: "Particulier", Icon: User },
    { id: "professionnel" as const, label: "Professionnel", Icon: Briefcase },
  ] as const

  if (variant === "hero") {
    return (
      <div
        className={cn(
          "order-audience-toggle--hero",
          SEGMENT_TRACK,
          "rounded-xl bg-brand-warm-field"
        )}
        role="radiogroup"
        aria-label="Type de client"
      >
        {heroOptions.map((option) => {
          const active = audience === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.id)}
              className={cn(
                SEGMENT_BUTTON_BASE,
                "min-h-10 rounded-[0.65rem] sm:min-h-11",
                active
                  ? "form-choice--selected bg-white text-brand-navy shadow-[0_1px_3px_rgb(14_32_16/0.12),0_4px_12px_-4px_rgb(14_32_16/0.15)]"
                  : SEGMENT_INACTIVE
              )}
            >
              {active ? (
                <Check className="size-3.5 shrink-0 text-brand-green" aria-hidden />
              ) : null}
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div className="space-y-2.5">
      <p
        className={cn(
          ORDER_SECTION_LABEL,
          subdued && "text-[13px] font-semibold sm:text-[14px]"
        )}
      >
        Vous êtes&nbsp;?
      </p>
      <div
        className={cn(
          SEGMENT_TRACK,
          "rounded-full bg-primary/10"
        )}
        role="radiogroup"
        aria-label="Type de client"
      >
        {tunnelOptions.map((option) => {
          const active = audience === option.id
          return (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(option.id)}
              className={cn(
                SEGMENT_BUTTON_BASE,
                "min-h-11 gap-1.5 rounded-full",
                active
                  ? "form-choice--selected bg-brand-green text-white shadow-[0_1px_2px_rgba(53,162,56,0.25)]"
                  : SEGMENT_INACTIVE
              )}
            >
              {active ? (
                <Check className="size-3.5 shrink-0 opacity-95" aria-hidden />
              ) : (
                <option.Icon className="size-4 shrink-0" aria-hidden />
              )}
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { ORDER_SECTION_LABEL as ORDER_FIELD_SECTION_LABEL }