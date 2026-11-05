"use client"

import { useEffect, useState } from "react"
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
import { getEntryPriceTtcParticulier } from "@/lib/seo/pricing-snapshot"
import { cn } from "@/lib/utils"

import { GoogleRatingBadge } from "./google-rating-badge"
import { useVitrineOrder } from "./order-context"

type HeroOrderCardProps = {
  className?: string
  /** Présélectionne le profil (ex. page /professionnels). */
  defaultAudience?: OrderAudience
}

export function HeroOrderCard({
  className,
  defaultAudience = "particulier",
}: HeroOrderCardProps) {
  const { draft, patchDraft, openOrder } = useVitrineOrder()

  useEffect(() => {
    if (defaultAudience !== draft.audience) {
      patchDraft({ audience: defaultAudience })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync once on mount / page
  }, [defaultAudience])
  const [addressError, setAddressError] = useState<string | null>(null)

  const audience = draft.audience ?? defaultAudience
  const address = draft.address
  const selectedAddress = draft.selectedAddress
  const isPro = audience === "professionnel"

  const minTtc = getEntryPriceTtcParticulier()
  const minTtcLabel =
    Number.isFinite(minTtc) && minTtc > 0
      ? minTtc.toLocaleString("fr-FR", { maximumFractionDigits: 0 })
      : null

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
        "hero-order-card order-tunnel-form relative z-20 flex w-full flex-col gap-5 p-5 max-lg:items-center max-lg:text-center sm:gap-5 sm:p-6 lg:items-stretch lg:text-left",
        className
      )}
      aria-labelledby="hero-order-card-title"
    >
      <h2
        id="hero-order-card-title"
        className="w-full text-[17px] font-bold leading-snug tracking-[-0.02em] text-brand-navy sm:text-[18px] lg:text-left"
      >
        {isPro
          ? "Votre demande de benne, en ligne"
          : "Trouvez votre benne et consultez son tarif"}
      </h2>

      {!isPro ? (
        <GoogleRatingBadge
          variant="card"
          className="w-fit max-w-full lg:w-auto lg:self-start"
        />
      ) : null}

      <div className="w-full">
        <OrderAudienceToggle
          variant="hero"
          audience={audience}
          onChange={handleAudience}
        />
      </div>

      <div className="w-full space-y-2">
        <p
          className={cn(
            ORDER_FIELD_SECTION_LABEL,
            "text-[15px] max-lg:text-center lg:text-left sm:text-[15px]"
          )}
        >
          {isPro ? "Adresse de livraison" : "Où faut-il livrer la benne ?"}
        </p>
        <AddressAutocomplete
          id="hero-order-address"
          className="hero-order-card__address"
          value={address}
          selected={selectedAddress}
          placeholder={
            isPro ? "Rechercher une adresse…" : "Saisissez l’adresse de livraison"
          }
          onValueChange={(next) => {
            patchDraft({ address: next, selectedAddress: null })
            setAddressError(null)
          }}
          onSelect={handleAddressSelect}
          onClearSelection={() => patchDraft({ selectedAddress: null })}
          aria-invalid={addressError !== null}
          aria-describedby={
            addressError ? "hero-order-address-error" : "hero-order-address-hint"
          }
          inputClassName="hero-order-card__address-input h-12 rounded-xl text-left"
          warmSurface={false}
        />
        {addressError ? (
          <p
            id="hero-order-address-error"
            className="text-xs font-medium text-amber-800 max-lg:text-center lg:text-left"
            role="alert"
          >
            {addressError}
          </p>
        ) : (
          <p
            id="hero-order-address-hint"
            className="text-[12px] leading-snug text-brand-muted max-lg:text-center lg:text-left sm:text-[13px]"
          >
            {isPro
              ? "Tarif HT selon adresse et déchet : demande sans paiement en ligne."
              : "Votre adresse permet d’afficher les bennes et tarifs proposés dans votre secteur."}
          </p>
        )}
      </div>

      <button
        type="button"
        className="hero-order-card__cta group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-green px-4 py-3 text-[15px] font-semibold leading-snug text-white shadow-[0_8px_24px_-8px_rgb(14_32_16/0.45)] transition-colors hover:bg-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 sm:text-base"
        onClick={continueToModal}
      >
        <span className="min-w-0 flex-1">
          {isPro ? "Continuer ma demande professionnelle" : "Voir les bennes et les tarifs"}
        </span>
        <ChevronRight
          className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      <div className="hero-order-card__footer pt-4 text-center text-[11px] leading-snug text-brand-muted sm:text-xs">
        <p>
          {isPro
            ? "Réponse sous 24 h, Île-de-France, interlocuteur dédié au suivi"
            : minTtcLabel
              ? `Dès ${minTtcLabel} € TTC`
              : "Le tarif dépend de votre adresse, des déchets et de la benne choisie."}
        </p>
      </div>
    </div>
  )
}
