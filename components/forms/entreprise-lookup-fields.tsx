"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
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
  const [loadingSiret, setLoadingSiret] = useState(false)
  const [loadingName, setLoadingName] = useState(false)
  const [lookupHint, setLookupHint] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const skipNameSearchRef = useRef(false)

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

  const applyEntreprise = useCallback(
    (data: EntrepriseLookupResult) => {
      skipNameSearchRef.current = true
      setRaison(data.raisonSociale)
      setSiret(data.siret)
      setOpenSuggestions(false)
      setSuggestions([])
      setLookupHint(`Données INSEE : ${data.raisonSociale}`)
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
        skipNameSearchRef.current = false
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
    if (skipNameSearchRef.current) return
    const q = raison.trim()
    if (q.length < 3) {
      setSuggestions([])
      setOpenSuggestions(false)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoadingName(true)
      try {
        const res = await fetch(`/api/entreprise/search?q=${encodeURIComponent(q)}`)
        const json = (await res.json()) as { results?: EntrepriseLookupResult[] }
        const list = json.results ?? []
        setSuggestions(list)
        setOpenSuggestions(list.length > 0)
      } catch {
        setSuggestions([])
      } finally {
        setLoadingName(false)
      }
    }, 400)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [raison])

  const raisonId = raisonSociale.id ?? "raison-sociale"
  const siretId = siret.id ?? "siret"

  const raisonLabel = raisonSociale.label ?? "Raison sociale"
  const siretLabel = siret.label ?? "Numéro SIRET"

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative z-10 space-y-2">
        <label htmlFor={raisonId} className="text-sm font-medium text-brand-navy">
          {raisonLabel}
          {raisonSociale.required ? " *" : null}
        </label>
        <div className="relative">
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
                setRaison(e.target.value)
              }}
              onFocus={() => suggestions.length > 0 && setOpenSuggestions(true)}
              className={inputClassName}
              role="combobox"
              aria-controls={listId}
              aria-expanded={openSuggestions}
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
                setRaison(e.target.value)
              }}
              onFocus={() => suggestions.length > 0 && setOpenSuggestions(true)}
              className={inputClassName}
              role="combobox"
              aria-controls={listId}
              aria-expanded={openSuggestions}
            />
          )}
          {loadingName ? (
            <Loader2
              className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground"
              aria-hidden
            />
          ) : null}
        </div>
        {openSuggestions && suggestions.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-30 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-[#35A238]/25 bg-white py-1 shadow-lg"
          >
            {suggestions.map((s) => (
              <li key={`${s.siret}-${s.raisonSociale}`} role="option">
                <button
                  type="button"
                  className="flex w-full flex-col items-start px-3 py-2 text-left text-sm hover:bg-[#ECF4E9]"
                  onMouseDown={(e) => e.preventDefault()}
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
          </ul>
        ) : null}
        <p className="text-xs text-muted-foreground">
          Saisissez le nom : suggestions via le répertoire Sirene (API Entreprises).
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor={siretId} className="text-sm font-medium text-brand-navy">
          {siretLabel}
          {siret.required ? " *" : (
            <span className="font-normal text-muted-foreground"> (optionnel)</span>
          )}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                setSiret(e.target.value)
              }}
              onBlur={() => {
                const digits = siretVal.replace(/\D/g, "")
                if (digits.length === 14) void lookupBySiret()
              }}
              className={cn("sm:flex-1", inputClassName)}
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
                setSiret(e.target.value)
              }}
              onBlur={() => {
                const digits = siretVal.replace(/\D/g, "")
                if (digits.length === 14) void lookupBySiret()
              }}
              className={cn("sm:flex-1", inputClassName)}
            />
          )}
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
              <Input
                id={adresseFields.adresse.id ?? "entreprise-adresse"}
                name={adresseFields.adresse.name}
                value={adresseFields.values?.adresse ?? ""}
                onChange={(e) => adresseFields.onAdresseChange?.(e.target.value)}
                autoComplete="street-address"
              />
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
              <Input
                id={adresseFields.codePostal.id ?? "entreprise-cp"}
                name={adresseFields.codePostal.name}
                inputMode="numeric"
                value={adresseFields.values?.codePostal ?? ""}
                onChange={(e) => adresseFields.onCodePostalChange?.(e.target.value)}
                autoComplete="postal-code"
              />
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
              <Input
                id={adresseFields.ville.id ?? "entreprise-ville"}
                name={adresseFields.ville.name}
                value={adresseFields.values?.ville ?? ""}
                onChange={(e) => adresseFields.onVilleChange?.(e.target.value)}
                autoComplete="address-level2"
              />
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}