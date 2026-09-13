"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  MapPinIcon,
  Timer01Icon,
  TwentyFourHoursClockIcon,
} from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"

const REASSURANCE = [
  {
    icon: TwentyFourHoursClockIcon,
    label: "Intervention 24h",
    description: "Une réponse rapide sur vos chantiers",
  },
  {
    icon: Timer01Icon,
    label: "Commande en 3 min",
    description: "Simple, rapide, 100 % en ligne",
  },
  {
    icon: MapPinIcon,
    label: "Toute l'Île-de-France",
    description: "À vos côtés partout dans la région",
  },
] as const

type VitrineHeroReassuranceProps = {
  className?: string
}

export function VitrineHeroReassurance({ className }: VitrineHeroReassuranceProps) {
  return (
    <aside
      aria-label="Nos engagements"
      className={cn("animate-fade-up relative isolate w-full", className)}
      style={{ animationDelay: "380ms" }}
    >
      {/* Mobile — bandeau vert compact, défilant si besoin */}
      <div
        role="list"
        className="flex snap-x snap-mandatory overflow-x-auto bg-brand-green [-ms-overflow-style:none] [scrollbar-width:none] md:hidden [&::-webkit-scrollbar]:hidden"
      >
        {REASSURANCE.map((item) => (
          <div
            key={item.label}
            role="listitem"
            className="flex min-w-[33.333%] flex-1 snap-center items-center justify-center gap-2 px-3 py-3.5"
          >
            <HugeiconsIcon
              icon={item.icon}
              size={18}
              strokeWidth={VITRINE_ICON_STROKE}
              className="shrink-0 text-white"
              aria-hidden
            />
            <span className="whitespace-nowrap text-[12px] font-semibold leading-none text-white">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop — extension premium intégrée au hero */}
      <div
        role="list"
        className="relative hidden bg-[linear-gradient(180deg,#132a59_0%,#0e1e42_48%,#0b1732_100%)] md:block"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-[#F3F7F5]/[0.06]"
        />

        <div className="container-x relative grid grid-cols-3 py-7 lg:py-8">
          {REASSURANCE.map((item, index) => (
            <div
              key={item.label}
              role="listitem"
              className={cn(
                "flex items-start gap-4 px-6 lg:gap-5 lg:px-8 xl:px-10",
                index > 0 && "border-l border-white/[0.06]"
              )}
            >
              <span className="relative flex size-14 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px] lg:size-[3.75rem] lg:rounded-[0.875rem]">
                <span
                  aria-hidden
                  className="absolute -right-0.5 -top-0.5 size-2 rounded-full border-2 border-[#0b1732] bg-brand-green"
                />
                <HugeiconsIcon
                  icon={item.icon}
                  size={24}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="text-white"
                  aria-hidden
                />
              </span>

              <div className="min-w-0 pt-0.5">
                <p className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-white lg:text-base">
                  {item.label}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-[#94A3B8] lg:mt-1.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
