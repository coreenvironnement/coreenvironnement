"use client"

import { forwardRef, useEffect, useId, useRef } from "react"
import { Calendar, ChevronDown } from "lucide-react"

import { formatOrderDatePicker } from "@/lib/format/date"
import { cn } from "@/lib/utils"

type OrderDateFieldProps = {
  id?: string
  value: string
  min?: string
  onChange: (isoDate: string) => void
  /** Safari iOS peut ignorer `min` : appelé si l’utilisateur choisit une date antérieure à `min`. */
  onBeforeMin?: () => void
  placeholder?: string
  warmSurface?: boolean
  invalid?: boolean
  optionalHint?: string
  /** Champ plus compact (tunnel dates côte à côte). */
  compact?: boolean
}

export const OrderDateField = forwardRef<HTMLDivElement, OrderDateFieldProps>(
  function OrderDateField(
    {
      id: idProp,
      value,
      min,
      onChange,
      onBeforeMin,
      placeholder = "Choisir une date",
      warmSurface = false,
      invalid = false,
      optionalHint,
      compact = false,
    },
    ref
  ) {
    const autoId = useId()
    const id = idProp ?? autoId
    const inputRef = useRef<HTMLInputElement>(null)
    const display = value ? formatOrderDatePicker(value) : ""

    useEffect(() => {
      const input = inputRef.current
      if (!input) return
      if (input.value !== value) {
        input.value = value
      }
    }, [value])

    const openPicker = () => {
      const input = inputRef.current
      if (!input) return
      if (min) {
        input.min = min
      }
      input.focus({ preventScroll: true })
      try {
        input.showPicker()
      } catch {
        input.click()
      }
    }

    const handleNativeChange = (next: string) => {
      if (min && next.length && next < min) {
        const input = inputRef.current
        if (input) {
          input.value = value
        }
        onBeforeMin?.()
        return
      }
      onChange(next)
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
          onChange={(e) => handleNativeChange(e.target.value)}
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
            "flex w-full items-center rounded-xl border-2 text-left shadow-sm transition-colors",
            compact ? "h-10 gap-2 px-2.5" : "h-12 gap-2.5 px-3.5",
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
              "flex shrink-0 items-center justify-center rounded-lg",
              compact ? "size-8" : "size-9",
              value ? "bg-primary/12 text-primary" : "bg-brand-green/[0.06] text-brand-navy/45"
            )}
            aria-hidden
          >
            <Calendar className={compact ? "size-4" : "size-[1.05rem]"} />
          </span>
          <span className="min-w-0 flex-1 text-center">
            <span
              className={cn(
                "block leading-snug font-semibold",
                compact ? "text-[13px]" : "truncate text-[15px]"
              )}
            >
              {display || placeholder}
            </span>
            {value && !compact ? (
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
