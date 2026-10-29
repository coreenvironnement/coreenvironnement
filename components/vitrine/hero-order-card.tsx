"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"

import {
  AddressAutocomplete,
  type AddressGeocodeHit,
} from "@/components/order/address-autocomplete"
import {
  OrderAudienceToggle,
  ORDER_FIELD_SECTION_LABEL,
  type OrderAudience,
} from "@/components/order/order-audience-toggle"
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
        "hero-order-card order-tunnel-form relative z-20 flex w-full flex-col gap-5 p-5 sm:gap-5 sm:p-6",
        className
      )}
      aria-labelledby="hero-order-card-title"
    >
      <h2
        id="hero-order-card-title"
        className="text-left text-[17px] font-bold leading-snug tracking-[-0.02em] text-brand-navy sm:text-[18px]"
      >
        Votre tarif en deux informations
      </h2>

      <OrderAudienceToggle
        variant="hero"
        audience={audience}
        onChange={handleAudience}
      />

      <div className="space-y-2">
        <p className={cn(ORDER_FIELD_SECTION_LABEL, "text-[15px] sm:text-[15px]")}>
          Adresse de livraison
        </p>
        <AddressAutocomplete
          id="hero-order-address"
          value={address}
          selected={selectedAddress}
          placeholder="Rechercher une adresse…"
          onValueChange={(next) => {
            patchDraft({ address: next, selectedAddress: null })
            setAddressError(null)
          }}
          onSelect={handleAddressSelect}
          onClearSelection={() => patchDraft({ selectedAddress: null })}
          aria-invalid={addressError !== null && !selectedAddress}
          inputClassName="h-12 rounded-xl border-brand-green/15 bg-white"
          warmSurface={false}
        />
        <p className="text-[12px] leading-snug text-brand-muted sm:text-[13px]">
          Tarif calculé selon votre adresse et votre déchet.
        </p>
      </div>

      {addressError ? (
        <p className="-mt-2 text-center text-xs font-medium text-amber-800">{addressError}</p>
      ) : null}

      <button
        type="button"
        className="hero-order-card__cta group flex min-h-12 w-full items-center justify-between gap-3 rounded-xl bg-brand-navy px-4 py-3 text-left text-[15px] font-semibold leading-snug text-white shadow-[0_8px_24px_-8px_rgb(24_53_116/0.45)] transition-colors hover:bg-[#152d66] sm:text-base"
        onClick={continueToModal}
      >
        <span className="min-w-0 flex-1">Voir les bennes et tarifs disponibles</span>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-green text-white shadow-sm transition-colors group-hover:bg-[#19752B]"
          aria-hidden
        >
          <ChevronRight className="size-5" strokeWidth={2.25} />
        </span>
      </button>

      <div className="hero-order-card__footer space-y-1 pt-4 text-center text-[11px] leading-snug text-brand-muted sm:text-xs">
        <p>Dès 330 € HT · commande en 2 minutes</p>
        <p>Pas besoin d&apos;appeler pour connaître le prix.</p>
      </div>
    </div>
  )
}
