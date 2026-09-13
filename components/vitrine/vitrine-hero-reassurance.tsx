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

const MOBILE_CAROUSEL_ITEMS = [...REASSURANCE, REASSURANCE[0]] as const

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
      {/* Mobile — bandeau navy premium, carrousel horizontal */}
      <div
        role="list"
        aria-roledescription="carousel"
        className="hero-reassurance-carousel relative overflow-hidden bg-[linear-gradient(180deg,#132a59_0%,#0e1e42_48%,#0b1732_100%)] md:hidden"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-6 bg-gradient-to-b from-transparent to-[#F3F7F5]/[0.06]"
        />

        <div className="hero-reassurance-carousel__track flex">
          {MOBILE_CAROUSEL_ITEMS.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              role="listitem"
              aria-hidden={index === MOBILE_CAROUSEL_ITEMS.length - 1 ? true : undefined}
              className="flex min-w-full shrink-0 items-center justify-center gap-3 px-5 py-3.5"
            >
              <span className="relative flex size-11 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-[2px]">
                <span
                  aria-hidden
                  className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full border-2 border-[#0b1732] bg-brand-green"
                />
                <HugeiconsIcon
                  icon={item.icon}
                  size={20}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="text-white"
                  aria-hidden
                />
              </span>

              <div className="min-w-0 text-left">
                <p className="text-[14px] font-semibold leading-snug tracking-[-0.01em] text-white">
                  {item.label}
                </p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-[#94A3B8]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
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
