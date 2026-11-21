"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { Loader2, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { EntrepriseLookupResult } from "@/lib/entreprise/recherche-entreprises"
import { cn } from "@/lib/utils"

export type EntrepriseLookupExtra = {
  codeNaf?: string | null
  adresseSiege?: string | null
  ville?: string | null
  codePostal?: string | null
  adresseLigne?: string | null
  adresseUneLigne?: string | null
  adresseMultiligne?: string | null
}

type SuggestionSource = "raison" | "siret"

type Props = {
  raisonSociale: {
    id?: string
    name: string
    label?: string
    required?: boolean
    placeholder?: string
  }
  siret: {
    id?: string
    name: string
    label?: string
    required?: boolean
    placeholder?: string
  }
  raisonSocialeValue?: string
  siretValue?: string
  onRaisonSocialeChange?: (value: string) => void
  onSiretChange?: (value: string) => void
  onEntrepriseSelected?: (data: EntrepriseLookupResult) => void
  onExtra?: (extra: EntrepriseLookupExtra) => void
  className?: string
  inputClassName?: string
  /** Champs natifs (styles vitrine waitlist) */
  nativeInputs?: boolean
  /** Remplissage contrôlé adresse / CP / ville (optionnel) */
  adresseFields?: {
    adresse?: { id?: string; name: string; label?: string }
    codePostal?: { id?: string; name: string; label?: string }
    ville?: { id?: string; name: string; label?: string }
    values?: { adresse?: string; codePostal?: string; ville?: string }
    onAdresseChange?: (v: string) => void
    onCodePostalChange?: (v: string) => void
    onVilleChange?: (v: string) => void
  }
}

type PanelRect = { top: number; left: number; width: number }

export function EntrepriseLookupFields({
  raisonSociale,
  siret,
  raisonSocialeValue: raisonControlled,
  siretValue: siretControlled,
  onRaisonSocialeChange,
  onSiretChange,
  onEntrepriseSelected,
  onExtra,
  className,
  inputClassName,
  nativeInputs,
  adresseFields,
}: Props) {
  const listId = useId()
  const [raisonInternal, setRaisonInternal] = useState(raisonControlled ?? "")
  const [siretInternal, setSiretInternal] = useState(siretControlled ?? "")
  const [suggestions, setSuggestions] = useState<EntrepriseLookupResult[]>([])
  const [openSuggestions, setOpenSuggestions] = useState(false)
  const [suggestionSource, setSuggestionSource] = useState<SuggestionSource>("raison")
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [panelRect, setPanelRect] = useState<PanelRect>({ top: 0, left: 0, width: 0 })
  const [portalReady, setPortalReady] = useState(false)
  const [loadingSiret, setLoadingSiret] = useState(false)
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [lookupHint, setLookupHint] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipSearchRef = useRef(false)
  const raisonAnchorRef = useRef<HTMLDivElement>(null)
  const siretAnchorRef = useRef<HTMLDivElement>(null)

  const raison = raisonControlled !== undefined ? raisonControlled : raisonInternal
  const siretVal = siretControlled !== undefined ? siretControlled : siretInternal

  const setRaison = useCallback(
    (v: string) => {
      onRaisonSocialeChange?.(v)
      if (raisonControlled === undefined) setRaisonInternal(v)
    },
    [onRaisonSocialeChange, raisonControlled]
  )

  const setSiret = useCallback(
    (v: string) => {
      onSiretChange?.(v)
      if (siretControlled === undefined) setSiretInternal(v)
    },
    [onSiretChange, siretControlled]
  )

  useEffect(() => {
    if (raisonControlled !== undefined) setRaisonInternal(raisonControlled)
  }, [raisonControlled])

  useEffect(() => {
    if (siretControlled !== undefined) setSiretInternal(siretControlled)
  }, [siretControlled])

  useEffect(() => {
    setPortalReady(true)
  }, [])

  const syncPanelPosition = useCallback(() => {
    const anchor =
      suggestionSource === "siret" ? siretAnchorRef.current : raisonAnchorRef.current
    if (!anchor) return
    const rect = anchor.getBoundingClientRect()
    setPanelRect({
      top: rect.bottom + 4,
      left: rect.left,
      width: rect.width,
    })
  }, [suggestionSource])

  useEffect(() => {
    if (!openSuggestions || suggestions.length === 0) return
    syncPanelPosition()
    const onReflow = () => syncPanelPosition()
    window.addEventListener("resize", onReflow)
    window.addEventListener("scroll", onReflow, true)
    return () => {
      window.removeEventListener("resize", onReflow)
      window.removeEventListener("scroll", onReflow, true)
    }
  }, [openSuggestions, suggestions.length, syncPanelPosition, suggestionSource])

  const applyEntreprise = useCallback(
    (data: EntrepriseLookupResult) => {
      skipSearchRef.current = true
      setRaison(data.raisonSociale)
      setSiret(data.siret)
      setOpenSuggestions(false)
      setSuggestions([])
      setHighlightedIndex(-1)
      setLookupHint(null)
      onEntrepriseSelected?.(data)
      onExtra?.({
        codeNaf: data.codeNaf,
        adresseSiege: data.adresseSiege,
        ville: data.ville,
        codePostal: data.codePostal,
        adresseLigne: data.adresse.ligneVoie,
        adresseUneLigne: data.adresse.adresseUneLigne,
        adresseMultiligne: data.adresse.adresseMultiligne,
      })
      if (adresseFields) {
        if (data.adresse.ligneVoie) adresseFields.onAdresseChange?.(data.adresse.ligneVoie)
        if (data.adresse.codePostal) adresseFields.onCodePostalChange?.(data.adresse.codePostal)
        if (data.adresse.ville) adresseFields.onVilleChange?.(data.adresse.ville)
      }
      window.setTimeout(() => {
        skipSearchRef.current = false
      }, 400)
    },
    [adresseFields, onEntrepriseSelected, onExtra, setRaison, setSiret]
  )

  const lookupBySiret = useCallback(async () => {
    const digits = siretVal.replace(/\s/g, "").replace(/\D/g, "")
    if (digits.length !== 14) {
      setLookupHint("Saisissez 14 chiffres pour rechercher l’entreprise.")
      return
    }
    setLoadingSiret(true)
    setLookupHint(null)
    try {
      const res = await fetch(`/api/entreprise/search?siret=${digits}`)
      const json = (await res.json()) as { entreprise?: EntrepriseLookupResult; error?: string }
      if (!res.ok || !json.entreprise) {
        setLookupHint(json.error ?? "Entreprise introuvable.")
        return
      }
      applyEntreprise(json.entreprise)
    } catch {
      setLookupHint("Recherche impossible pour le moment.")
    } finally {
      setLoadingSiret(false)
    }
  }, [applyEntreprise, siretVal])

  useEffect(() => {
    if (skipSearchRef.current) return

    const q =
      suggestionSource === "siret"
        ? siretVal.replace(/\D/g, "")
        : raison.trim()

    if (q.length < 3) {
      setSuggestions([])
      setOpenSuggestions(false)
      setHighlightedIndex(-1)
      return
    }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoadingSuggestions(true)
      try {
        const res = await fetch(`/api/entreprise/search?q=${encodeURIComponent(q)}`)
        const json = (await res.json()) as { results?: EntrepriseLookupResult[] }
        const list = json.results ?? []
        setSuggestions(list)
        setOpenSuggestions(list.length > 0)
        setHighlightedIndex(list.length > 0 ? 0 : -1)
        if (list.length > 0) syncPanelPosition()
      } catch {
        setSuggestions([])
        setOpenSuggestions(false)
        setHighlightedIndex(-1)
      } finally {
        setLoadingSuggestions(false)
      }
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [raison, siretVal, suggestionSource, syncPanelPosition])

  const handleComboboxKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setOpenSuggestions(false)
        setHighlightedIndex(-1)
        return
      }
      if (suggestions.length === 0) return
      if (e.key === "ArrowDown") {
        e.preventDefault()
        if (!openSuggestions) setOpenSuggestions(true)
        setHighlightedIndex((i) => Math.min(i < 0 ? 0 : i + 1, suggestions.length - 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setHighlightedIndex((i) => Math.max(i < 0 ? 0 : i - 1, 0))
        return
      }
      if (e.key === "Enter" && openSuggestions && highlightedIndex >= 0) {
        e.preventDefault()
        const pick = suggestions[highlightedIndex]
        if (pick) applyEntreprise(pick)
      }
    },
    [applyEntreprise, highlightedIndex, openSuggestions, suggestions]
  )

  const raisonId = raisonSociale.id ?? "raison-sociale"
  const siretId = siret.id ?? "siret"

  const raisonLabel = raisonSociale.label ?? "Raison sociale"
  const siretLabel = siret.label ?? "Numéro SIRET"

  const activeOptionId =
    highlightedIndex >= 0 && suggestions[highlightedIndex]
      ? `${listId}-option-${highlightedIndex}`
      : undefined

  const suggestionsPortal =
    portalReady && openSuggestions && suggestions.length > 0
      ? createPortal(
          <ul
            id={listId}
            role="listbox"
            style={{
              position: "fixed",
              top: panelRect.top,
              left: panelRect.left,
              width: panelRect.width,
              zIndex: 9999,
            }}
            className="max-h-56 overflow-y-auto rounded-xl border border-[#35A238]/25 bg-white py-1 shadow-lg"
          >
            {suggestions.map((s, index) => (
              <li
                key={`${s.siret}-${s.raisonSociale}`}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
              >
                <button
                  type="button"
                  className={cn(
                    "flex w-full flex-col items-start px-3 py-2 text-left text-sm",
                    highlightedIndex === index ? "bg-[#ECF4E9]" : "hover:bg-[#ECF4E9]"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => applyEntreprise(s)}
                >
                  <span className="font-medium text-brand-navy">{s.raisonSociale}</span>
                  <span className="text-xs text-muted-foreground">
                    SIRET {s.siret}
                    {s.ville ? ` · ${s.codePostal ?? ""} ${s.ville}`.trim() : null}
                  </span>
                </button>
              </li>
            ))}
          </ul>,
          document.body
        )
      : null

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative z-10 space-y-2">
        <label htmlFor={raisonId} className="text-sm font-medium text-brand-navy">
          {raisonLabel}
          {raisonSociale.required ? " *" : null}
        </label>
        <div className="relative" ref={raisonAnchorRef}>
          {nativeInputs ? (
            <input
              id={raisonId}
              name={raisonSociale.name}
              required={raisonSociale.required}
              autoComplete="organization"
              value={raison}
              placeholder={raisonSociale.placeholder ?? "Rechercher une entreprise…"}
              onChange={(e) => {
                setLookupHint(null)
                setSuggestionSource("raison")
                setRaison(e.target.value)
              }}
              onFocus={() => {
                setSuggestionSource("raison")
                if (suggestions.length > 0) setOpenSuggestions(true)
              }}
              onKeyDown={handleComboboxKeyDown}
              className={inputClassName}
              role="combobox"
              aria-controls={listId}
              aria-expanded={openSuggestions && suggestionSource === "raison"}
              aria-activedescendant={
                openSuggestions && suggestionSource === "raison" ? activeOptionId : undefined
              }
              aria-autocomplete="list"
            />
          ) : (
            <Input
              id={raisonId}
              name={raisonSociale.name}
              required={raisonSociale.required}
              autoComplete="organization"
              value={raison}
              placeholder={raisonSociale.placeholder ?? "Rechercher une entreprise…"}
              onChange={(e) => {
                setLookupHint(null)
                setSuggestionSource("raison")
                setRaison(e.target.value)
              }}
              onFocus={() => {
                setSuggestionSource("raison")
                if (suggestions.length > 0) setOpenSuggestions(true)
              }}
              onKeyDown={handleComboboxKeyDown}
              className={inputClassName}
              role="combobox"
              aria-controls={listId}
              aria-expanded={openSuggestions && suggestionSource === "raison"}
              aria-activedescendant={
                openSuggestions && suggestionSource === "raison" ? activeOptionId : undefined
              }
              aria-autocomplete="list"
            />
          )}
          {loadingSuggestions && suggestionSource === "raison" ? (
            <Loader2
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-hidden
            />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          Saisissez le nom ou le SIRET : suggestions via le répertoire Sirene (API Entreprises).
        </p>
      </div>

      {suggestionSource === "raison" ? suggestionsPortal : null}

      <div className="relative z-10 space-y-2">
        <label htmlFor={siretId} className="text-sm font-medium text-brand-navy">
          {siretLabel}
          {siret.required ? " *" : (
            <span className="font-normal text-muted-foreground"> (optionnel)</span>
          )}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative sm:min-w-0 sm:flex-1" ref={siretAnchorRef}>
            {nativeInputs ? (
              <input
                id={siretId}
                name={siret.name}
                required={siret.required}
                inputMode="numeric"
                autoComplete="off"
                value={siretVal}
                placeholder={siret.placeholder ?? "123 456 789 00012"}
                onChange={(e) => {
                  setLookupHint(null)
                  setSuggestionSource("siret")
                  setSiret(e.target.value)
                }}
                onFocus={() => {
                  setSuggestionSource("siret")
                  const digits = siretVal.replace(/\D/g, "")
                  if (digits.length >= 3 && suggestions.length > 0) setOpenSuggestions(true)
                }}
                onBlur={() => {
                  const digits = siretVal.replace(/\D/g, "")
                  if (digits.length === 14) void lookupBySiret()
                }}
                onKeyDown={handleComboboxKeyDown}
                className={cn("w-full", inputClassName)}
                role="combobox"
                aria-controls={listId}
                aria-expanded={openSuggestions && suggestionSource === "siret"}
                aria-activedescendant={
                  openSuggestions && suggestionSource === "siret" ? activeOptionId : undefined
                }
                aria-autocomplete="list"
              />
            ) : (
              <Input
                id={siretId}
                name={siret.name}
                required={siret.required}
                inputMode="numeric"
                autoComplete="off"
                value={siretVal}
                placeholder={siret.placeholder ?? "123 456 789 00012"}
                onChange={(e) => {
                  setLookupHint(null)
                  setSuggestionSource("siret")
                  setSiret(e.target.value)
                }}
                onFocus={() => {
                  setSuggestionSource("siret")
                  const digits = siretVal.replace(/\D/g, "")
                  if (digits.length >= 3 && suggestions.length > 0) setOpenSuggestions(true)
                }}
                onBlur={() => {
                  const digits = siretVal.replace(/\D/g, "")
                  if (digits.length === 14) void lookupBySiret()
                }}
                onKeyDown={handleComboboxKeyDown}
                className={cn("w-full", inputClassName)}
                role="combobox"
                aria-controls={listId}
                aria-expanded={openSuggestions && suggestionSource === "siret"}
                aria-activedescendant={
                  openSuggestions && suggestionSource === "siret" ? activeOptionId : undefined
                }
                aria-autocomplete="list"
              />
            )}
            {loadingSuggestions && suggestionSource === "siret" ? (
              <Loader2
                className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
                aria-hidden
              />
            ) : null}
          </div>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 border-[#35A238]/30"
            onClick={() => void lookupBySiret()}
            disabled={loadingSiret}
          >
            {loadingSiret ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Search className="size-4" aria-hidden />
            )}
            Rechercher
          </Button>
        </div>
        {lookupHint ? (
          <p className="text-xs text-muted-foreground" role="status">
            {lookupHint}
          </p>
        ) : null}
      </div>

      {suggestionSource === "siret" ? suggestionsPortal : null}

      {adresseFields ? (
        <div className="grid gap-4 sm:grid-cols-6">
          {adresseFields.adresse ? (
            <div className="space-y-2 sm:col-span-6">
              <label
                htmlFor={adresseFields.adresse.id ?? "entreprise-adresse"}
                className="text-sm font-medium text-brand-navy"
              >
                {adresseFields.adresse.label ?? "Adresse"}
              </label>
              {nativeInputs ? (
                <input
                  id={adresseFields.adresse.id ?? "entreprise-adresse"}
                  name={adresseFields.adresse.name}
                  value={adresseFields.values?.adresse ?? ""}
                  onChange={(e) => adresseFields.onAdresseChange?.(e.target.value)}
                  autoComplete="street-address"
                  className={inputClassName}
                  placeholder="Numéro et voie"
                />
              ) : (
                <Input
                  id={adresseFields.adresse.id ?? "entreprise-adresse"}
                  name={adresseFields.adresse.name}
                  value={adresseFields.values?.adresse ?? ""}
                  onChange={(e) => adresseFields.onAdresseChange?.(e.target.value)}
                  autoComplete="street-address"
                />
              )}
            </div>
          ) : null}
          {adresseFields.codePostal ? (
            <div className="space-y-2 sm:col-span-2">
              <label
                htmlFor={adresseFields.codePostal.id ?? "entreprise-cp"}
                className="text-sm font-medium text-brand-navy"
              >
                {adresseFields.codePostal.label ?? "Code postal"}
              </label>
              {nativeInputs ? (
                <input
                  id={adresseFields.codePostal.id ?? "entreprise-cp"}
                  name={adresseFields.codePostal.name}
                  inputMode="numeric"
                  value={adresseFields.values?.codePostal ?? ""}
                  onChange={(e) => adresseFields.onCodePostalChange?.(e.target.value)}
                  autoComplete="postal-code"
                  className={inputClassName}
                  placeholder="75001"
                />
              ) : (
                <Input
                  id={adresseFields.codePostal.id ?? "entreprise-cp"}
                  name={adresseFields.codePostal.name}
                  inputMode="numeric"
                  value={adresseFields.values?.codePostal ?? ""}
                  onChange={(e) => adresseFields.onCodePostalChange?.(e.target.value)}
                  autoComplete="postal-code"
                />
              )}
            </div>
          ) : null}
          {adresseFields.ville ? (
            <div className="space-y-2 sm:col-span-4">
              <label
                htmlFor={adresseFields.ville.id ?? "entreprise-ville"}
                className="text-sm font-medium text-brand-navy"
              >
                {adresseFields.ville.label ?? "Ville"}
              </label>
              {nativeInputs ? (
                <input
                  id={adresseFields.ville.id ?? "entreprise-ville"}
                  name={adresseFields.ville.name}
                  value={adresseFields.values?.ville ?? ""}
                  onChange={(e) => adresseFields.onVilleChange?.(e.target.value)}
                  autoComplete="address-level2"
                  className={inputClassName}
                  placeholder="Paris"
                />
              ) : (
                <Input
                  id={adresseFields.ville.id ?? "entreprise-ville"}
                  name={adresseFields.ville.name}
                  value={adresseFields.values?.ville ?? ""}
                  onChange={(e) => adresseFields.onVilleChange?.(e.target.value)}
                  autoComplete="address-level2"
                />
              )}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}