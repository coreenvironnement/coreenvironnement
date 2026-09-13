"use client"

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { Loader2, MapPin } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  searchBanAddresses,
  type AddressGeocodeHit,
} from "@/lib/geo/ban-api"
import { cn } from "@/lib/utils"

const DEBOUNCE_MS = 300
const MIN_QUERY_LENGTH = 3

type AddressAutocompleteProps = {
  id?: string
  value: string
  selected: AddressGeocodeHit | null
  onValueChange: (value: string) => void
  onSelect: (hit: AddressGeocodeHit) => void
  onClearSelection: () => void
  disabled?: boolean
  className?: string
  inputClassName?: string
  placeholder?: string
  "aria-invalid"?: boolean
}

export function AddressAutocomplete({
  id,
  value,
  selected,
  onValueChange,
  onSelect,
  onClearSelection,
  disabled,
  className,
  inputClassName,
  placeholder = "Numéro, rue, code postal et ville",
  "aria-invalid": ariaInvalid,
}: AddressAutocompleteProps) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressGeocodeHit[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const closeList = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
  }, [])

  useEffect(() => {
    const q = value.trim()
    if (q.length < MIN_QUERY_LENGTH || selected?.label === q) {
      setSuggestions([])
      setLoading(false)
      setFetchError(null)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setFetchError(null)
      try {
        const results = await searchBanAddresses(q, 5, controller.signal)
        if (controller.signal.aborted) return
        setSuggestions(results)
        setOpen(results.length > 0)
        setActiveIndex(results.length > 0 ? 0 : -1)
      } catch {
        if (controller.signal.aborted) return
        setSuggestions([])
        setFetchError("Impossible de charger les suggestions d'adresse.")
        setOpen(false)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [value, selected?.label])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeList()
      }
    }
    // Capture phase: close before sibling controls (e.g. waste-type Select) receive the click.
    document.addEventListener("pointerdown", onPointerDown, true)
    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  }, [closeList])

  const pickSuggestion = (hit: AddressGeocodeHit) => {
    onSelect(hit)
    closeList()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      if (event.key === "Escape") closeList()
      return
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((i) => (i + 1) % suggestions.length)
        break
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
        break
      case "Enter":
        event.preventDefault()
        if (activeIndex >= 0 && suggestions[activeIndex]) {
          pickSuggestion(suggestions[activeIndex]!)
        }
        break
      case "Escape":
        event.preventDefault()
        closeList()
        break
    }
  }

  const activeOptionId =
    activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <MapPin
        className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-brand-navy/40"
        aria-hidden
      />
      <Input
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={activeOptionId}
        aria-autocomplete="list"
        aria-invalid={ariaInvalid}
        autoComplete="off"
        disabled={disabled}
        value={value}
        onChange={(e) => {
          onValueChange(e.target.value)
          if (selected && e.target.value !== selected.label) {
            onClearSelection()
          }
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        onBlur={() => {
          window.setTimeout(() => closeList(), 0)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "h-14 border-2 border-primary/20 bg-white pl-12 pr-11 text-base shadow-sm focus-visible:border-primary/50 focus-visible:ring-brand-navy/30",
          inputClassName
        )}
      />
      {loading ? (
        <Loader2
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-brand-navy/40"
          aria-hidden
        />
      ) : null}

      {open && suggestions.length > 0 ? (
        <ul
          id={listboxId}
          role="listbox"
          aria-label="Suggestions d'adresse en Île-de-France"
          className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-primary/15 bg-white py-1 shadow-lg"
        >
          {suggestions.map((hit, index) => (
            <li
              key={`${hit.label}-${index}`}
              id={`${listboxId}-option-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              className={cn(
                "cursor-pointer px-4 py-2.5 text-left text-sm text-brand-navy transition-colors",
                index === activeIndex ? "bg-primary/10" : "hover:bg-muted/60"
              )}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pickSuggestion(hit)}
            >
              <span className="font-medium">{hit.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                {hit.postcode} {hit.city}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {fetchError ? (
        <p className="mt-1 text-xs text-amber-800" role="status">
          {fetchError}
        </p>
      ) : null}
    </div>
  )
}

export type { AddressGeocodeHit }
