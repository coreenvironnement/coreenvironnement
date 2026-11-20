"use client"

import { useState } from "react"

import { AddressAutocomplete } from "@/components/order/address-autocomplete"
import type { AddressGeocodeHit } from "@/lib/geo/ban-api"

type ChantierAdresseFieldProps = {
  id: string
  name: string
  placeholder?: string
  defaultValue?: string
  inputClassName?: string
  required?: boolean
}

export function ChantierAdresseField({
  id,
  name,
  placeholder = "Numéro, rue, code postal ou ville",
  defaultValue = "",
  inputClassName,
  required,
}: ChantierAdresseFieldProps) {
  const [query, setQuery] = useState(defaultValue)
  const [selected, setSelected] = useState<AddressGeocodeHit | null>(null)

  return (
    <>
      <input type="hidden" name={name} value={query.trim()} required={required} />
      <AddressAutocomplete
        id={id}
        value={query}
        selected={selected}
        onValueChange={(next) => {
          setQuery(next)
          if (selected && selected.label !== next) {
            setSelected(null)
          }
        }}
        onSelect={(hit) => {
          setQuery(hit.label)
          setSelected(hit)
        }}
        onClearSelection={() => setSelected(null)}
        placeholder={placeholder}
        inputClassName={inputClassName}
      />
    </>
  )
}