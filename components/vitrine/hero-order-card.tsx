"use client"

import { useState } from "react"
import { ChevronRight, Info } from "lucide-react"

import {
  AddressAutocomplete,
  type AddressGeocodeHit,
} from "@/components/order/address-autocomplete"
import {
  OrderAudienceToggle,
  ORDER_FIELD_SECTION_LABEL,
  type OrderAudience,
} from "@/components/order/order-audience-toggle"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useVitrineOrder } from "./order-context"

type HeroOrderCardProps = {
  className?: string
}

export function HeroOrderCard({ className }: HeroOrderCardProps) {
  const { draft, patchDraft, openOrder } = useVitrineOrder()
  const [addressError, setAddressError] = useState<string | null>(null)

  const audience = draft.audience
  const address = draft.address
  const selectedAddress = draft.selectedAddress

  const handleAudience = (value: OrderAudience) => {
    patchDraft({ audience: value })
    setAddressError(null)
  }

  const handleAddressSelect = (hit: AddressGeocodeHit) => {
    patchDraft({ address: hit.label, selectedAddress: hit })
    setAddressError(null)
  }

  const continueToModal = () => {
    setAddressError(null)
    if (!address.trim().length) {
      setAddressError("Indiquez l’adresse de livraison de la benne.")
      return
    }
    if (!selectedAddress) {
      setAddressError(
        "Sélectionnez une adresse dans la liste (Île-de-France uniquement)."
      )
      return
    }
    openOrder({ intentStart: "waste" })
  }

  return (
    <div
      className={cn(
        "hero-order-card order-tunnel-form relative z-20 w-full space-y-4 p-4 sm:p-5",
        className
      )}
      aria-labelledby="hero-order-card-title"
    >
      <div>
        <p
          id="hero-order-card-title"
          className="text-[13px] font-semibold text-brand-navy sm:text-sm"
        >
          Votre tarif en deux infos
        </p>
        <p className="mt-0.5 text-[12px] leading-snug text-brand-muted sm:text-[13px]">
          Particulier ou pro, puis adresse de livraison en Île-de-France.
        </p>
      </div>

      <OrderAudienceToggle audience={audience} onChange={handleAudience} subdued />

      <div className="space-y-2.5">
        <p className={ORDER_FIELD_SECTION_LABEL}>Où livrer votre benne&nbsp;?</p>
        <AddressAutocomplete
          id="hero-order-address"
          value={address}
          selected={selectedAddress}
          onValueChange={(next) => {
            patchDraft({ address: next, selectedAddress: null })
            setAddressError(null)
          }}
          onSelect={handleAddressSelect}
          onClearSelection={() => patchDraft({ selectedAddress: null })}
          aria-invalid={addressError !== null && !selectedAddress}
          inputClassName="h-12 rounded-xl"
          warmSurface
        />
        <p className="flex items-start gap-1.5 text-[11px] leading-snug text-brand-muted sm:text-[12px]">
          <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
          <span>
            Saisissez votre adresse en Île-de-France et choisissez une suggestion.
          </span>
        </p>
      </div>

      {addressError ? (
        <p className="text-center text-xs font-medium text-amber-800">{addressError}</p>
      ) : null}

      <Button
        type="button"
        className="h-11 w-full rounded-xl border-0 bg-[#2F9632] px-4 text-base font-semibold text-white shadow-lg shadow-[#2F9632]/25 hover:bg-[#19752B]"
        onClick={continueToModal}
      >
        <span className="flex w-full items-center justify-between gap-2">
          <span>Voir les tarifs disponibles</span>
          <ChevronRight className="size-4 shrink-0" aria-hidden />
        </span>
      </Button>

      <p className="text-center text-[11px] leading-snug text-brand-muted sm:text-xs">
        Pas besoin d&apos;appeler pour connaître le prix.
      </p>
    </div>
  )
}
