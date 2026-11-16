"use client"

import { useEffect, useId, useMemo, useRef, useState } from "react"
import { ChevronDown, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  CALLING_CODES,
  DEFAULT_CALLING_DIAL,
  filterCallingCodes,
} from "@/lib/phone/calling-codes"
import {
  buildInternationalPhone,
  parseContactPhone,
} from "@/lib/phone/phone-value"
import { cn } from "@/lib/utils"

function countryFlagEmoji(iso2: string): string {
  if (iso2.length !== 2) return ""
  const upper = iso2.toUpperCase()
  return String.fromCodePoint(
    ...[...upper].map((char) => 0x1f1e6 - 65 + char.charCodeAt(0))
  )
}

type PhoneInputWithCountryProps = {
  id: string
  value: string
  onChange: (international: string) => void
  className?: string
  inputClassName?: string
  autoComplete?: string
  disabled?: boolean
  /** Aligné tunnel embarqué (fond crème). */
  warmSurface?: boolean
  /** Champs auth vitrine (bordure / placeholder comme `form-field-input`). */
  variant?: "default" | "vitrine"
}

export function PhoneInputWithCountry({
  id,
  value,
  onChange,
  className,
  inputClassName,
  autoComplete = "tel",
  disabled,
  warmSurface = true,
  variant = "default",
}: PhoneInputWithCountryProps) {
  const vitrine = variant === "vitrine"
  const parsed = useMemo(() => parseContactPhone(value), [value])
  const [dial, setDial] = useState(parsed.dial)
  const [national, setNational] = useState(parsed.national)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const rootRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const listId = useId()

  useEffect(() => {
    setDial(parsed.dial)
    setNational(parsed.national)
  }, [parsed.dial, parsed.national])

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
      }
    }
    document.addEventListener("mousedown", onDoc)
    return () => document.removeEventListener("mousedown", onDoc)
  }, [open])

  useEffect(() => {
    if (open) {
      window.requestAnimationFrame(() => searchRef.current?.focus())
    }
  }, [open])

  const filtered = useMemo(() => filterCallingCodes(query), [query])
  const selected =
    CALLING_CODES.find((c) => c.dial === dial) ??
    CALLING_CODES.find((c) => c.dial === DEFAULT_CALLING_DIAL)!

  function emit(d: string, n: string) {
    onChange(buildInternationalPhone(d, n))
  }

  function pickCode(nextDial: string) {
    setDial(nextDial)
    setOpen(false)
    setQuery("")
    emit(nextDial, national)
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex w-full overflow-hidden",
          vitrine ? "rounded-2xl" : "rounded-xl",
          vitrine
            ? "h-11 min-h-11 border border-[#35A238]/18 bg-white shadow-sm focus-within:border-[#35A238] focus-within:shadow-[0_0_0_3px_rgb(53_162_56/0.2)] sm:h-12"
            : cn(
                "h-11 border-2 border-primary/15",
                warmSurface ? "bg-brand-warm-field" : "bg-white",
                "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-[var(--form-focus-halo,color-mix(in_srgb,var(--ring)_22%,transparent))]"
              ),
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <button
          type="button"
          className={cn(
            "flex shrink-0 items-center gap-0.5 border-r px-2.5 text-sm font-semibold text-brand-navy",
            vitrine
              ? "min-h-11 border-[#35A238]/18 hover:bg-[#ECF4E9]/40 sm:min-h-12"
              : "border-primary/15 hover:bg-white/40"
          )}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-base leading-none" aria-hidden>
            {countryFlagEmoji(selected.iso2)}
          </span>
          <span className="tabular-nums">+{selected.dial}</span>
          <ChevronDown className="size-4 opacity-60" aria-hidden />
        </button>
        {vitrine ? (
          <input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete={autoComplete}
            disabled={disabled}
            value={national}
            placeholder={dial === "33" ? "6 12 34 56 78" : "Numéro"}
            onChange={(e) => {
              const next = e.target.value
              setNational(next)
              emit(dial, next)
            }}
            className={cn(
              "form-field-input !h-full min-h-0 flex-1 !rounded-none !border-0 !bg-transparent !px-3 !shadow-none",
              "!ring-0 focus-visible:!ring-0 focus-visible:!shadow-none",
              "placeholder:text-brand-muted/55",
              inputClassName
            )}
          />
        ) : (
          <Input
            id={id}
            type="tel"
            inputMode="tel"
            autoComplete={autoComplete}
            disabled={disabled}
            value={national}
            placeholder={dial === "33" ? "6 12 34 56 78" : "Numéro"}
            onChange={(e) => {
              const next = e.target.value
              setNational(next)
              emit(dial, next)
            }}
            className={cn(
              "h-full min-h-0 flex-1 rounded-none border-0 bg-transparent px-3 shadow-none ring-0",
              "placeholder:text-muted-foreground/80",
              "focus-visible:ring-0 focus-visible:ring-offset-0",
              inputClassName
            )}
          />
        )}
      </div>

      {open ? (
        <div className="absolute z-40 mt-1 w-full min-w-[min(100%,18.5rem)] rounded-xl border border-[#35A238]/25 bg-white shadow-lg">
          <div className="border-b border-primary/10 p-2">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Pays ou indicatif…"
                autoComplete="off"
                className="h-10 w-full rounded-lg border border-primary/15 bg-brand-warm-field pl-9 pr-3 text-sm text-brand-navy outline-none focus-visible:border-brand-green/40"
              />
            </div>
          </div>
          <ul
            id={listId}
            role="listbox"
            className="max-h-[min(50vh,14rem)] overscroll-contain overflow-y-auto py-1 [-webkit-overflow-scrolling:touch]"
          >
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-muted-foreground">Aucun pays</li>
            ) : (
              filtered.map((c) => (
                <li key={c.iso2} role="option" aria-selected={c.dial === dial}>
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left text-sm",
                      c.dial === dial ? "bg-[#ECF4E9] font-medium" : "hover:bg-[#ECF4E9]/70"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickCode(c.dial)}
                  >
                    <span className="text-brand-navy">{c.name}</span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      +{c.dial}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  )
}