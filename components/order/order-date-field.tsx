"use client"

import { forwardRef, useId, useRef } from "react"
import { Calendar, ChevronDown } from "lucide-react"

import { formatOrderDatePicker } from "@/lib/format/date"
import { cn } from "@/lib/utils"

type OrderDateFieldProps = {
  id?: string
  value: string
  min?: string
  onChange: (isoDate: string) => void
  placeholder?: string
  warmSurface?: boolean
  invalid?: boolean
  optionalHint?: string
}

export const OrderDateField = forwardRef<HTMLDivElement, OrderDateFieldProps>(
  function OrderDateField(
    {
      id: idProp,
      value,
      min,
      onChange,
      placeholder = "Choisir une date",
      warmSurface = false,
      invalid = false,
      optionalHint,
    },
    ref
  ) {
    const autoId = useId()
    const id = idProp ?? autoId
    const inputRef = useRef<HTMLInputElement>(null)
    const display = value ? formatOrderDatePicker(value) : ""

    const openPicker = () => {
      const input = inputRef.current
      if (!input) return
      input.focus({ preventScroll: true })
      try {
        input.showPicker()
      } catch {
        input.click()
      }
    }

    return (
      <div ref={ref} className="relative">
        <input
          ref={inputRef}
          id={id}
          type="date"
          lang="fr-FR"
          min={min}
          value={value}
          aria-invalid={invalid}
          onChange={(e) => onChange(e.target.value)}
          className="pointer-events-none absolute h-px w-px opacity-0"
          tabIndex={-1}
        />
        <button
          type="button"
          aria-labelledby={`${id}-label`}
          aria-describedby={optionalHint ? `${id}-hint` : undefined}
          aria-haspopup="dialog"
          onClick={openPicker}
          className={cn(
            "flex h-12 w-full items-center gap-2.5 rounded-xl border-2 px-3.5 text-left shadow-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-navy/25 focus-visible:ring-offset-1",
            warmSurface ? "bg-brand-warm-field" : "bg-white",
            invalid
              ? "border-amber-600 ring-2 ring-amber-200/80"
              : "border-primary/20 hover:border-primary/35",
            value ? "text-brand-navy" : "text-brand-muted"
          )}
        >
          <span
            className={cn(
              "flex size-9 shrink-0 items-center justify-center rounded-lg",
              value ? "bg-primary/12 text-primary" : "bg-brand-navy/[0.06] text-brand-navy/45"
            )}
            aria-hidden
          >
            <Calendar className="size-[1.05rem]" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[15px] font-semibold leading-snug">
              {display || placeholder}
            </span>
            {value ? (
              <span className="mt-0.5 block text-[11px] font-medium text-brand-muted">
                Appuyez pour modifier
              </span>
            ) : null}
          </span>
          <ChevronDown
            className="size-4 shrink-0 text-brand-navy/35"
            aria-hidden
          />
        </button>
        {optionalHint ? (
          <span id={`${id}-hint`} className="sr-only">
            {optionalHint}
          </span>
        ) : null}
      </div>
    )
  }
)
