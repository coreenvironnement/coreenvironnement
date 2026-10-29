"use client"

import Image from "next/image"

import {
  PARTICULIER_WASTE_OPTIONS,
  type ParticulierWasteOptionId,
} from "@/lib/order/particulier-waste-options"
import { cn } from "@/lib/utils"

export function ParticulierWastePicker({
  value,
  onChange,
}: {
  value: ParticulierWasteOptionId | null
  onChange: (id: ParticulierWasteOptionId) => void
}) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:gap-3.5"
      role="radiogroup"
      aria-label="Que souhaitez-vous jeter ?"
    >
      {PARTICULIER_WASTE_OPTIONS.map((option) => {
        const selected = value === option.id
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.id)}
            className={cn(
              "flex flex-col overflow-hidden rounded-xl border bg-white text-left shadow-sm outline-none transition-[border-color,box-shadow]",
              "focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
              selected
                ? "border-brand-green ring-1 ring-brand-green/25"
                : "border-[#E4E7EC] hover:border-brand-green/35"
            )}
          >
            <div className="relative aspect-[4/3] w-full bg-[#F2F4F7]">
              <Image
                src={option.imageSrc}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 540px) 44vw, 220px"
              />
              <span
                className={cn(
                  "absolute right-2 top-2 flex size-[22px] items-center justify-center rounded-full border-2 bg-white shadow-sm",
                  selected ? "border-brand-green" : "border-[#D0D5DD]"
                )}
                aria-hidden
              >
                {selected ? (
                  <span className="size-2.5 rounded-full bg-brand-green" />
                ) : null}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1 px-2.5 pb-3 pt-2.5 sm:px-3 sm:pb-3.5 sm:pt-3">
              <span className="text-[13px] font-bold leading-snug text-brand-navy sm:text-[14px]">
                {option.title}
              </span>
              <span className="text-[11px] leading-snug text-brand-muted sm:text-[12px]">
                {option.description}
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
