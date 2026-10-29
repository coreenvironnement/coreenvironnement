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
}

export function OrderAudienceToggle({
  audience,
  onChange,
  subdued,
}: OrderAudienceToggleProps) {
  const options = [
    { id: "particulier" as const, label: "Particulier", Icon: User },
    { id: "professionnel" as const, label: "Professionnel", Icon: Briefcase },
  ]

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
        {options.map((option) => {
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
