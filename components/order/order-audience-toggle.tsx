"use client"

import { Briefcase, User } from "lucide-react"

import { cn } from "@/lib/utils"

export type OrderAudience = "particulier" | "professionnel"

const ORDER_SECTION_LABEL =
  "text-left text-[14px] font-semibold leading-snug text-brand-navy"

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
        className="flex rounded-xl bg-brand-warm-muted/80 p-1"
        role="group"
        aria-label="Type de client"
      >
        {heroOptions.map((option) => {
          const active = audience === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex min-h-10 flex-1 items-center justify-center rounded-[0.65rem] px-3 text-[13px] font-semibold transition-all duration-200 sm:min-h-11 sm:text-sm",
                active
                  ? "bg-white text-brand-navy shadow-[0_1px_3px_rgb(24_53_116/0.12),0_4px_12px_-4px_rgb(24_53_116/0.15)]"
                  : "text-brand-muted hover:text-brand-navy"
              )}
            >
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
        className="flex rounded-full bg-primary/10 p-1"
        role="group"
        aria-label="Type de client"
      >
        {tunnelOptions.map((option) => {
          const active = audience === option.id
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(option.id)}
              className={cn(
                "flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full px-3 text-[13px] font-semibold transition-colors duration-200 sm:text-sm",
                active
                  ? "bg-brand-green text-white shadow-[0_1px_2px_rgba(27,65,143,0.12)]"
                  : "text-[#8A847C] hover:text-brand-navy"
              )}
            >
              <option.Icon className="size-4 shrink-0" aria-hidden />
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export { ORDER_SECTION_LABEL as ORDER_FIELD_SECTION_LABEL }
