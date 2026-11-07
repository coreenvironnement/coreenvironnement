"use client"

import { useEffect, useRef, useState } from "react"
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
import { useOrderAudienceSession } from "@/lib/auth/use-order-audience-session"
import { getEntryPriceTtcParticulier } from "@/lib/seo/pricing-snapshot"
import { cn } from "@/lib/utils"

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
  const sessionAudience = useOrderAudienceSession()
  const initialDefaultAppliedRef = useRef(false)

  useEffect(() => {
    if (sessionAudience.loading) {
      initialDefaultAppliedRef.current = false
      return
    }

    if (sessionAudience.locked && sessionAudience.audience) {
      if (draft.audience !== sessionAudience.audience) {
        patchDraft({ audience: sessionAudience.audience })
      }
      return
    }

    if (!initialDefaultAppliedRef.current) {
      initialDefaultAppliedRef.current = true
      patchDraft({ audience: defaultAudience })
    }
  }, [
    sessionAudience.loading,
    sessionAudience.locked,
    sessionAudience.audience,
    defaultAudience,
    draft.audience,
    patchDraft,
  ])

  const showAudienceToggle = !sessionAudience.loading && !sessionAudience.locked
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
          ? "Préparez votre demande de benne"
          : "Trouvez votre benne et consultez son tarif"}
      </h2>

      <div className="w-full">
        {showAudienceToggle ? (
          <OrderAudienceToggle
            variant="hero"
            audience={audience}
            onChange={handleAudience}
          />
        ) : sessionAudience.loading ? null : (
          <p className="rounded-xl bg-white/60 px-3 py-2 text-center text-[13px] font-medium text-brand-navy">
            {isPro ? "Demande professionnelle" : "Commande particulier"}
          </p>
        )}
      </div>

      <div className="w-full space-y-2">
        <p
          className={cn(
            ORDER_FIELD_SECTION_LABEL,
            "text-[15px] max-lg:text-center lg:text-left sm:text-[15px]"
          )}
        >
          {isPro ? "Où se trouve votre chantier ?" : "Où faut-il livrer la benne ?"}
        </p>
        <AddressAutocomplete
          id="hero-order-address"
          className="hero-order-card__address"
          value={address}
          selected={selectedAddress}
          placeholder="Saisissez l’adresse de livraison"
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
              ? "Votre adresse permet d’afficher les bennes et les tarifs HT proposés dans votre secteur."
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
          {isPro ? "Voir les bennes et les tarifs HT" : "Voir les bennes et les tarifs"}
        </span>
        <ChevronRight
          className="size-5 shrink-0 transition-transform group-hover:translate-x-0.5"
          strokeWidth={2.25}
          aria-hidden
        />
      </button>

      {isPro ? (
        <p className="text-center text-[12px] leading-snug text-brand-muted sm:text-[13px]">
          Vous pourrez vérifier votre demande avant de l’envoyer.
        </p>
      ) : null}

      <div
        className={cn(
          "hero-order-card__footer pt-4 text-center leading-snug",
          isPro
            ? "text-[11px] text-brand-muted sm:text-xs"
            : "text-[15px] font-semibold text-brand-navy sm:text-base"
        )}
      >
        <p>
          {isPro
            ? "Les modalités d’intervention et de règlement sont précisées avec notre équipe."
            : minTtcLabel
              ? `Dès ${minTtcLabel} € TTC`
              : "Le tarif dépend de votre adresse, des déchets et de la benne choisie."}
        </p>
      </div>
    </div>
  )
}
