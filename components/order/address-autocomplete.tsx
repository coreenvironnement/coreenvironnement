"use client"

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react"
import { Loader2, MapPin, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  searchBanAddresses,
  type AddressGeocodeHit,
} from "@/lib/geo/ban-api"
import { cn } from "@/lib/utils"

const DEBOUNCE_MS = 280
const MIN_QUERY_LENGTH = 3
const SUGGESTION_LIMIT = 8

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
  warmSurface?: boolean
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
  warmSurface = false,
  "aria-invalid": ariaInvalid,
}: AddressAutocompleteProps) {
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<AddressGeocodeHit[]>([])
  const [activeIndex, setActiveIndex] = useState(-1)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [searchSettled, setSearchSettled] = useState(false)

  const trimmed = value.trim()
  const skipSearch =
    trimmed.length < MIN_QUERY_LENGTH || selected?.label === trimmed

  const closeList = useCallback(() => {
    setFocused(false)
    setActiveIndex(-1)
  }, [])

  useEffect(() => {
    if (skipSearch) {
      setSuggestions([])
      setLoading(false)
      setFetchError(null)
      setSearchSettled(false)
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setLoading(true)
      setFetchError(null)
      setSearchSettled(false)
      try {
        const results = await searchBanAddresses(
          trimmed,
          SUGGESTION_LIMIT,
          controller.signal
        )
        if (controller.signal.aborted) return
        setSuggestions(results)
        setActiveIndex(results.length > 0 ? 0 : -1)
        setSearchSettled(true)
      } catch {
        if (controller.signal.aborted) return
        setSuggestions([])
        setFetchError("Impossible de charger les suggestions d'adresse.")
        setSearchSettled(true)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [trimmed, skipSearch])

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        closeList()
      }
    }
    document.addEventListener("pointerdown", onPointerDown, true)
    return () => document.removeEventListener("pointerdown", onPointerDown, true)
  }, [closeList])

  const pickSuggestion = (hit: AddressGeocodeHit) => {
    onSelect(hit)
    closeList()
  }

  const showPanel =
    focused &&
    !disabled &&
    (loading ||
      fetchError !== null ||
      (searchSettled && !skipSearch) ||
      suggestions.length > 0)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showPanel || suggestions.length === 0) {
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

  const panelSurface = cn(
    "absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border border-primary/15 shadow-lg",
    warmSurface ? "bg-brand-warm-field" : "bg-white"
  )

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <MapPin
        className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-brand-navy/40"
        aria-hidden
      />
      <Input
        id={id}
        role="combobox"
        aria-expanded={showPanel}
        aria-controls={showPanel ? listboxId : undefined}
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
        onFocus={() => setFocused(true)}
        onBlur={() => {
          window.setTimeout(() => closeList(), 150)
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={cn(
          "h-14 border-2 border-primary/20 pl-12 pr-11 text-base shadow-sm focus-visible:border-primary/50 focus-visible:ring-brand-navy/30",
          warmSurface
            ? "bg-brand-warm-field text-brand-navy placeholder:text-brand-muted"
            : "bg-white",
          inputClassName
        )}
      />
      {loading ? (
        <Loader2
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-brand-navy/45"
          aria-hidden
        />
      ) : (
        <Search
          className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-brand-navy/25"
          aria-hidden
        />
      )}

      {showPanel ? (
        <div id={listboxId} role="presentation" className={panelSurface}>
          {loading ? (
            <div
              className="flex items-center gap-2 px-4 py-3 text-sm text-brand-muted"
              role="status"
              aria-live="polite"
            >
              <Loader2 className="size-4 shrink-0 animate-spin text-brand-navy/45" />
              Recherche d&apos;adresses…
            </div>
          ) : fetchError ? (
            <p className="px-4 py-3 text-sm text-amber-900" role="alert">
              {fetchError}
            </p>
          ) : suggestions.length > 0 ? (
            <ul
              role="listbox"
              aria-label="Suggestions d'adresse en Île-de-France"
              className="max-h-64 overflow-y-auto py-1"
            >
              {suggestions.map((hit, index) => (
                  <li
                    key={`${hit.label}-${hit.postcode}-${index}`}
                    id={`${listboxId}-option-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    className={cn(
                      "cursor-pointer px-4 py-2.5 text-left transition-colors hover:bg-primary/10",
                      index === activeIndex && "bg-primary/10"
                    )}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickSuggestion(hit)}
                  >
                    <span className="block text-sm font-medium leading-snug text-brand-navy">
                      {hit.label}
                    </span>
                  </li>
                ))}
            </ul>
          ) : searchSettled ? (
            <p className="px-4 py-3 text-sm text-brand-muted" role="status">
              Aucune adresse trouvée en Île-de-France. Ajoutez un numéro, une rue
              ou un code postal (75, 77, 78, 91, 92, 93, 94, 95).
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

export type { AddressGeocodeHit }
