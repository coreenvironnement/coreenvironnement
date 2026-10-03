"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Image from "next/image"
import Link from "next/link"
import { Recycle01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeft,
  BrickWall,
  Briefcase,
  Calendar,
  ChevronRight,
  Hammer,
  Headphones,
  Info,
  MapPin,
  MapPinOff,
  Recycle,
  User,
} from "lucide-react"

import {
  AddressAutocomplete,
  type AddressGeocodeHit,
} from "@/components/order/address-autocomplete"

import { VITRINE_ICON_STROKE } from "@/components/vitrine/icons"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { startOrderCheckout } from "@/app/order/actions"
import {
  type BenneFamily,
  type Prestation,
  FAMILY_LABELS,
  prestationsByFamily,
  prestationById,
  systemLabel,
} from "@/lib/prestations"
import { priceBreakdownFromHt } from "@/lib/order/prestation-mapping"
import {
  ORDER_TUNNEL_STEPS,
  type OrderTunnelStepId,
} from "@/lib/order/tunnel-steps"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

export { ORDER_TUNNEL_STEPS } from "@/lib/order/tunnel-steps"

const steps = ORDER_TUNNEL_STEPS

const ORDER_SECTION_LABEL =
  "text-left text-[14px] font-semibold leading-snug text-brand-navy"

const ORDER_HELP_TEXT =
  "flex items-start gap-1.5 text-[11px] leading-snug text-brand-muted sm:text-[12px]"

/** Visuels forfait — mapping par volume (données métier inchangées). */
const BENNE_VISUAL_BY_VOLUME: Record<number, string> = {
  8: "/images/benne-8m3.png",
  10: "/images/benne-10m3.png",
  15: "/images/benne-15m3.png",
  20: "/images/benne-20m3.png",
  30: "/images/benne-30m3.png",
}

function AudienceToggle({
  audience,
  onChange,
  subdued,
}: {
  audience: Audience
  onChange: (value: Audience) => void
  subdued?: boolean
}) {
  return (
    <div className="space-y-2.5">
      <p
        className={cn(
          ORDER_SECTION_LABEL,
          subdued && "text-[13px] font-semibold sm:text-[14px]"
        )}
      >
        Vous êtes&nbsp;?
      </p>
      <div
        className="grid grid-cols-2 gap-2.5"
        role="group"
        aria-label="Type de client"
      >
        <button
          type="button"
          onClick={() => onChange("particulier")}
          className={cn(
            "flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 bg-white px-2 py-2.5 text-[13px] font-semibold transition sm:text-sm",
            audience === "particulier"
              ? "border-[#35A238] text-[#35A238]"
              : "border-brand-navy/10 text-brand-navy/42 hover:border-brand-navy/20 hover:text-brand-navy/65"
          )}
        >
          <User className="size-4 shrink-0" aria-hidden />
          Particulier
        </button>
        <button
          type="button"
          onClick={() => onChange("professionnel")}
          className={cn(
            "flex min-h-[44px] items-center justify-center gap-2 rounded-xl border-2 bg-white px-2 py-2.5 text-[13px] font-semibold transition sm:text-sm",
            audience === "professionnel"
              ? "border-[#35A238] text-[#35A238]"
              : "border-brand-navy/10 text-brand-navy/42 hover:border-brand-navy/20 hover:text-brand-navy/65"
          )}
        >
          <Briefcase className="size-4 shrink-0" aria-hidden />
          Professionnel
        </button>
      </div>
    </div>
  )
}

const FAMILIES: BenneFamily[] = [
  "melange_dnd",
  "gravats_melanges",
  "gravats_propres",
]

const FAMILY_ICONS: Record<BenneFamily, LucideIcon> = {
  melange_dnd: Recycle,
  gravats_melanges: Hammer,
  gravats_propres: BrickWall,
}

type Audience = "particulier" | "professionnel"

function fmtHt(n: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(n)
}

function todayISODate() {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d.toISOString().slice(0, 10)
}

function OrderStepProgress({ currentStepIdx }: { currentStepIdx: number }) {
  const current = steps[currentStepIdx]
  const progress = ((currentStepIdx + 1) / steps.length) * 100

  return (
    <div className="mx-auto mb-2.5 max-w-md text-center" aria-live="polite">
      <p className="text-[0.625rem] font-medium leading-snug text-brand-navy/42">
        <span>Étape {currentStepIdx + 1} sur {steps.length}</span>
        <span aria-hidden className="mx-1.5 text-brand-navy/20">
          ·
        </span>
        <span className="text-brand-navy/58">{current.label}</span>
      </p>
      <div
        className="mx-auto mt-1 h-[2px] w-full max-w-[200px] overflow-hidden rounded-full bg-brand-navy/12 sm:max-w-[240px]"
        role="progressbar"
        aria-valuenow={currentStepIdx + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label={`Étape ${currentStepIdx + 1} sur ${steps.length} : ${current.label}`}
      >
        <div
          className="h-full rounded-full bg-[#35A238] transition-[width] duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

type OrderWidgetProps = {
  variant?: "default" | "embedded"
  open?: boolean
  onStepIndexChange?: (index: number) => void
}

export function OrderWidget({
  variant = "default",
  open = true,
  onStepIndexChange,
}: OrderWidgetProps) {
  const embedded = variant === "embedded"
  const prefersReducedMotion = useReducedMotion()
  const t = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }

  const [step, setStep] = useState<OrderTunnelStepId>("intent")
  const [audience, setAudience] = useState<Audience>("particulier")
  const [address, setAddress] = useState("")
  const [selectedAddress, setSelectedAddress] = useState<AddressGeocodeHit | null>(
    null
  )
  const [addressError, setAddressError] = useState<string | null>(null)
  const [family, setFamily] = useState<BenneFamily | null>(null)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [selectedPrestationId, setSelectedPrestationId] = useState<
    string | null
  >(null)
  const [contactFirstName, setContactFirstName] = useState("")
  const [contactLastName, setContactLastName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [payError, setPayError] = useState<string | null>(null)
  const [isPaying, startPayTransition] = useTransition()
  const prestation = useMemo(
    () => (selectedPrestationId ? prestationById(selectedPrestationId) : null),
    [selectedPrestationId]
  )

  const filteredPrestations = useMemo(
    () => (family ? prestationsByFamily(family) : []),
    [family]
  )

  useEffect(() => {
    if (step !== "payment") {
      setPayError(null)
    }
  }, [step])

  const clearAddressSelection = () => {
    setSelectedAddress(null)
  }

  const handleAddressSelect = (hit: AddressGeocodeHit) => {
    setAddress(hit.label)
    setSelectedAddress(hit)
    setAddressError(null)
  }

  const zoneOk = selectedAddress !== null
  const canLeaveIntent = zoneOk && family !== null

  const goToForfait = () => {
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
    if (!family) {
      setAddressError("Choisissez un type de déchet dans la liste.")
      return
    }
    setStep("forfait")
  }

  const goToInfos = () => {
    if (!selectedPrestationId) {
      setAddressError("Sélectionnez un forfait pour continuer.")
      return
    }
    setAddressError(null)
    setStep("infos")
  }

  const goToPayment = () => {
    if (!deliveryDate.length) {
      setAddressError("Indiquez une date de livraison souhaitée.")
      return
    }
    if (!contactFirstName.trim()) {
      setAddressError("Indiquez votre prénom.")
      return
    }
    if (!contactLastName.trim()) {
      setAddressError("Indiquez votre nom.")
      return
    }
    const phoneDigits = contactPhone.replace(/\D/g, "")
    if (phoneDigits.length < 10) {
      setAddressError("Indiquez un numéro de téléphone valide.")
      return
    }
    const email = contactEmail.trim()
    if (!email.length || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAddressError("Indiquez une adresse e-mail valide.")
      return
    }
    setAddressError(null)
    setStep("recap")
  }

  const contactName = [contactFirstName.trim(), contactLastName.trim()]
    .filter(Boolean)
    .join(" ")

  const currentStepIdx = steps.findIndex((s) => s.id === step)

  useEffect(() => {
    if (!open) return
    onStepIndexChange?.(currentStepIdx)
  }, [currentStepIdx, onStepIndexChange, open])

  return (
    <Card
      className={cn(
        "relative mx-auto w-full",
        embedded
          ? "max-w-none overflow-visible border-0 bg-transparent shadow-none ring-0"
          : "overflow-hidden max-w-xl border-white/70 bg-card/95 shadow-[0_22px_70px_-32px_color-mix(in_srgb,var(--brand-navy)_38%,transparent)] ring-1 ring-primary/15 backdrop-blur-sm"
      )}
    >
      {!embedded ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-brand-navy/[0.05]" />
      ) : null}

      <CardContent className={cn("relative space-y-3", embedded ? "px-0 pb-0 pt-0" : "pt-8")}>
        {!embedded ? <OrderStepProgress currentStepIdx={currentStepIdx} /> : null}

        <AnimatePresence mode="wait">
          {step === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className={cn(embedded ? "" : "space-y-4")}
            >
              <div
                className={cn(
                  embedded
                    ? "space-y-5 rounded-2xl bg-brand-bg-alt px-4 py-4 sm:space-y-6 sm:px-5 sm:py-5"
                    : "space-y-4"
                )}
              >
                <div className="flex gap-3 sm:gap-3.5">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70 text-brand-navy/35"
                    aria-hidden
                  >
                    <MapPin className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <p className={ORDER_SECTION_LABEL}>Où livrer votre benne&nbsp;?</p>
                    <div className="space-y-2">
                      <label htmlFor="order-address" className="sr-only">
                        Adresse de livraison
                      </label>
                      <AddressAutocomplete
                        id="order-address"
                        value={address}
                        selected={selectedAddress}
                        onValueChange={(next) => {
                          setAddress(next)
                          setAddressError(null)
                        }}
                        onSelect={handleAddressSelect}
                        onClearSelection={clearAddressSelection}
                        aria-invalid={addressError !== null && !selectedAddress}
                        inputClassName="rounded-xl"
                      />
                      <p className={ORDER_HELP_TEXT}>
                        <Info className="mt-0.5 size-3.5 shrink-0 opacity-55" aria-hidden />
                        <span>
                          Saisissez votre adresse en Île-de-France et choisissez une
                          suggestion.
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {address.trim().length >= 3 && !selectedAddress && !addressError && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/95 to-white p-3 text-left text-xs text-amber-950"
                    >
                      <div className="flex gap-2">
                        <MapPinOff className="size-4 shrink-0 text-amber-700" aria-hidden />
                        <p>
                          Choisissez une adresse dans la liste pour confirmer la zone
                          d’intervention (75, 77, 78, 91, 92, 93, 94, 95).
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative z-30 flex gap-3 sm:gap-3.5">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70 text-brand-navy/35"
                    aria-hidden
                  >
                    <Recycle className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-2.5">
                    <p className={ORDER_SECTION_LABEL}>Type de déchet</p>
                    <div className="relative space-y-0">
                      <label htmlFor="order-waste-family" className="sr-only">
                        Type de déchet
                      </label>
                      <div className="relative">
                        <HugeiconsIcon
                          icon={Recycle01Icon}
                          size={20}
                          strokeWidth={VITRINE_ICON_STROKE}
                          className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-brand-navy/40"
                          aria-hidden
                        />
                        <Select
                          value={family ?? undefined}
                          onValueChange={(v) => {
                            setFamily(v as BenneFamily)
                            setAddressError(null)
                          }}
                        >
                          <SelectTrigger
                            id="order-waste-family"
                            className="h-14 w-full max-w-none items-center justify-between rounded-xl border-2 border-primary/20 bg-white py-0 pl-12 pr-4 text-base shadow-sm focus-visible:border-primary/50 focus-visible:ring-brand-navy/30 data-[size=default]:h-14 dark:bg-white/95"
                            size="default"
                          >
                            <SelectValue placeholder="Choisissez le type de déchet dans la liste" />
                          </SelectTrigger>
                          <SelectContent
                            side="bottom"
                            align="start"
                            sideOffset={6}
                            className="z-[100] rounded-xl border-primary/15"
                          >
                            {FAMILIES.map((fid) => {
                              const meta = FAMILY_LABELS[fid]
                              const Icon = FAMILY_ICONS[fid]
                              return (
                                <SelectItem
                                  key={fid}
                                  value={fid}
                                  label={meta.title}
                                  className="cursor-pointer py-3"
                                >
                                  <span className="flex w-full items-start gap-3 text-left">
                                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                                      <Icon
                                        className="size-[1.15rem] text-primary"
                                        aria-hidden
                                      />
                                    </span>
                                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                      <span className="font-medium leading-snug text-foreground">
                                        {meta.title}
                                      </span>
                                      <span className="text-xs font-normal leading-snug text-muted-foreground">
                                        {meta.description}
                                      </span>
                                    </span>
                                  </span>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 sm:gap-3.5">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/70 text-brand-navy/35"
                    aria-hidden
                  >
                    <User className="size-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <AudienceToggle
                      audience={audience}
                      onChange={setAudience}
                      subdued={embedded}
                    />
                  </div>
                </div>

                {addressError && (
                  <p className="text-center text-xs font-medium text-amber-800">
                    {addressError}
                  </p>
                )}

                <Button
                  type="button"
                  className="mt-1 h-12 w-full rounded-xl border-0 bg-[#2F9632] px-4 text-base font-semibold text-white shadow-lg shadow-[#2F9632]/25 hover:bg-[#19752B] disabled:cursor-not-allowed disabled:bg-[#2F9632] disabled:opacity-60 disabled:shadow-md sm:h-11"
                  onClick={goToForfait}
                  disabled={!canLeaveIntent}
                >
                  <span className="flex w-full items-center justify-between gap-2">
                    <span>Voir les forfaits</span>
                    <ChevronRight className="size-4 shrink-0" aria-hidden />
                  </span>
                </Button>
              </div>
            </motion.div>
          )}

          {step === "forfait" && family && (
            <motion.div
              key="forfait"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-4"
            >
              <div>
                <p className={ORDER_SECTION_LABEL}>Choisissez votre forfait</p>
                <p className="mt-1 text-xs leading-snug text-muted-foreground">
                  Prix H.T. Détail des déchets acceptés par forfait.
                </p>
              </div>

              {addressError && (
                <p className="text-center text-xs font-medium text-amber-800">
                  {addressError}
                </p>
              )}

              <div
                className={cn(
                  "grid gap-3",
                  embedded
                    ? ""
                    : "max-h-[min(60vh,420px)] overflow-y-auto pr-1 sm:max-h-[min(70vh,520px)]"
                )}
              >
                {filteredPrestations.map((p, i) => (
                  <PrestationCard
                    key={p.id}
                    prestation={p}
                    selected={selectedPrestationId === p.id}
                    onSelect={() => setSelectedPrestationId(p.id)}
                    delay={prefersReducedMotion ? 0 : i * 0.04}
                    t={t}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl sm:flex-1"
                  onClick={() => {
                    setAddressError(null)
                    setStep("intent")
                  }}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl sm:flex-1"
                  disabled={!selectedPrestationId}
                  onClick={goToInfos}
                >
                  Continuer avec ce forfait
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "infos" && (
            <motion.div
              key="infos"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-5"
            >
              <div className="space-y-3">
                <p className={ORDER_SECTION_LABEL}>Quand souhaitez-vous la benne&nbsp;?</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-delivery-date"
                      className="flex items-center gap-1.5 text-xs font-semibold text-brand-navy"
                    >
                      <Calendar className="size-3.5 text-brand-navy/50" aria-hidden />
                      Date de livraison&nbsp;*
                    </label>
                    <Input
                      id="order-delivery-date"
                      type="date"
                      min={todayISODate()}
                      value={deliveryDate}
                      onChange={(e) => {
                        setDeliveryDate(e.target.value)
                        setAddressError(null)
                      }}
                      className="h-11 border-2 border-primary/15 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="order-pickup-date"
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
                    >
                      <Calendar className="size-3.5" aria-hidden />
                      Date d’enlèvement (optionnel)
                    </label>
                    <Input
                      id="order-pickup-date"
                      type="date"
                      min={deliveryDate || todayISODate()}
                      value={pickupDate}
                      onChange={(e) => {
                        setPickupDate(e.target.value)
                        setAddressError(null)
                      }}
                      className="h-11 border border-border/80 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className={ORDER_SECTION_LABEL}>Vos coordonnées</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="order-contact-firstname" className="text-xs font-semibold text-brand-navy">
                      Prénom&nbsp;*
                    </label>
                    <Input
                      id="order-contact-firstname"
                      autoComplete="given-name"
                      value={contactFirstName}
                      onChange={(e) => {
                        setContactFirstName(e.target.value)
                        setAddressError(null)
                      }}
                      className="h-11 border-2 border-primary/15 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="order-contact-lastname" className="text-xs font-semibold text-brand-navy">
                      Nom&nbsp;*
                    </label>
                    <Input
                      id="order-contact-lastname"
                      autoComplete="family-name"
                      value={contactLastName}
                      onChange={(e) => {
                        setContactLastName(e.target.value)
                        setAddressError(null)
                      }}
                      className="h-11 border-2 border-primary/15 bg-white"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="order-contact-phone" className="text-xs font-semibold text-brand-navy">
                    Téléphone&nbsp;*
                  </label>
                  <Input
                    id="order-contact-phone"
                    type="tel"
                    autoComplete="tel"
                    value={contactPhone}
                    onChange={(e) => {
                      setContactPhone(e.target.value)
                      setAddressError(null)
                    }}
                    className="h-11 border-2 border-primary/15 bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="order-contact-email" className="text-xs font-semibold text-brand-navy">
                    Email&nbsp;*
                  </label>
                  <Input
                    id="order-contact-email"
                    type="email"
                    autoComplete="email"
                    value={contactEmail}
                    onChange={(e) => {
                      setContactEmail(e.target.value)
                      setAddressError(null)
                      setPayError(null)
                    }}
                    className="h-11 border-2 border-primary/15 bg-white"
                  />
                </div>
              </div>

              {addressError && (
                <p className="text-center text-xs font-medium text-amber-800">
                  {addressError}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl sm:flex-1"
                  onClick={() => {
                    setAddressError(null)
                    setStep("forfait")
                  }}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                <Button
                  type="button"
                  className="h-11 rounded-xl text-base font-semibold shadow-lg sm:flex-1"
                  onClick={goToPayment}
                >
                  Vérifier ma commande
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "recap" && prestation && selectedAddress && (
            <motion.div
              key="recap"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-4"
            >
              <p className={ORDER_SECTION_LABEL}>Vérifiez votre commande</p>

              <section className="rounded-2xl border border-primary/10 bg-white/95 px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Votre benne
                  </h3>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-primary hover:underline"
                    onClick={() => setStep("forfait")}
                  >
                    Modifier
                  </button>
                </div>
                <p className="font-medium text-brand-navy">{prestation.label}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {systemLabel(prestation.system)} · {prestation.volumeM3} m³
                </p>
              </section>

              <section className="rounded-2xl border border-primary/10 bg-white/95 px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Livraison
                  </h3>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-primary hover:underline"
                    onClick={() => setStep("intent")}
                  >
                    Modifier
                  </button>
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li>
                    <span className="text-muted-foreground">Adresse · </span>
                    <span className="font-medium text-brand-navy">{selectedAddress.label}</span>
                  </li>
                  {family ? (
                    <li>
                      <span className="text-muted-foreground">Déchets · </span>
                      <span className="font-medium text-brand-navy">
                        {FAMILY_LABELS[family].title}
                      </span>
                    </li>
                  ) : null}
                  <li>
                    <span className="text-muted-foreground">Livraison · </span>
                    <span className="font-medium text-brand-navy">
                      {new Date(deliveryDate + "T12:00:00").toLocaleDateString("fr-FR")}
                    </span>
                  </li>
                  {pickupDate ? (
                    <li>
                      <span className="text-muted-foreground">Enlèvement · </span>
                      <span className="font-medium text-brand-navy">
                        {new Date(pickupDate + "T12:00:00").toLocaleDateString("fr-FR")}
                      </span>
                    </li>
                  ) : null}
                </ul>
                <button
                  type="button"
                  className="mt-2 text-[11px] font-medium text-primary hover:underline"
                  onClick={() => setStep("infos")}
                >
                  Modifier les dates
                </button>
              </section>

              <section className="rounded-2xl border border-primary/10 bg-white/95 px-4 py-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Vos coordonnées
                  </h3>
                  <button
                    type="button"
                    className="text-[11px] font-medium text-primary hover:underline"
                    onClick={() => setStep("infos")}
                  >
                    Modifier
                  </button>
                </div>
                <ul className="space-y-1.5 text-sm">
                  <li className="font-medium text-brand-navy">{contactName}</li>
                  <li className="text-brand-navy">{contactPhone}</li>
                  <li className="text-brand-navy">{contactEmail.trim()}</li>
                </ul>
              </section>

              <section className="rounded-2xl border border-primary/10 bg-white/95 px-4 py-3">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Prix
                </h3>
                {(() => {
                  const breakdown = priceBreakdownFromHt(prestation.priceHt)
                  return (
                    <ul className="space-y-1.5 text-sm">
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">Sous-total HT</span>
                        <span className="tabular-nums text-brand-navy">{fmtHt(breakdown.ht)}</span>
                      </li>
                      <li className="flex justify-between gap-3">
                        <span className="text-muted-foreground">TVA 20 %</span>
                        <span className="tabular-nums text-brand-navy">{fmtHt(breakdown.tva)}</span>
                      </li>
                      <li className="flex justify-between gap-3 pt-1 font-semibold text-brand-navy">
                        <span>Total TTC</span>
                        <span className="tabular-nums text-primary">{fmtHt(breakdown.ttc)}</span>
                      </li>
                    </ul>
                  )
                })()}
              </section>

              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl sm:flex-1"
                  onClick={() => setStep("infos")}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                <Button
                  type="button"
                  className="h-11 rounded-xl text-base font-semibold shadow-lg sm:flex-1"
                  onClick={() => setStep("payment")}
                >
                  Passer au paiement
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "payment" && prestation && selectedAddress && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-5"
            >
              <div>
                <p className={ORDER_SECTION_LABEL}>Paiement</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Vous allez être redirigé vers Stripe pour régler en toute sécurité.
                </p>
              </div>

              {audience === "professionnel" ? (
                <div className="rounded-xl border border-brand-navy/15 bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
                  <p className="font-medium text-brand-navy">Commande professionnelle</p>
                  <p className="mt-2">
                    Les pros validés commandent sur facture depuis leur espace client.{" "}
                    <Link href="/pro" className="font-semibold text-primary underline-offset-2 hover:underline">
                      Créer ou accéder à mon compte pro
                    </Link>
                    .
                  </p>
                </div>
              ) : (
                <div className="space-y-2 rounded-xl border border-brand-navy/10 bg-white/90 p-4">
                  <p className="text-sm font-semibold text-brand-navy">Paiement</p>
                  <p className="text-[0.7rem] text-muted-foreground">
                    Paiement sécurisé Stripe (CB, Apple Pay, Google Pay selon votre
                    appareil) · montant TTC estimé (TVA 20&nbsp;%) :{" "}
                    <strong className="text-foreground">
                      {fmtHt(priceBreakdownFromHt(prestation.priceHt).ttc)}
                    </strong>
                  </p>
                </div>
              )}

              {payError ? (
                <p className="text-center text-xs font-medium text-amber-800">{payError}</p>
              ) : null}

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl"
                  onClick={() => {
                    setAddressError(null)
                    setPayError(null)
                    setStep("recap")
                  }}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                {audience === "particulier" ? (
                  <Button
                    type="button"
                    className="h-11 flex-1 rounded-xl text-base font-semibold shadow-lg"
                    disabled={isPaying}
                    onClick={() => {
                      setPayError(null)
                      startPayTransition(async () => {
                        try {
                          const result = await startOrderCheckout({
                            audience,
                            address: selectedAddress.label,
                            lat: selectedAddress.lat,
                            lng: selectedAddress.lng,
                            addressLabel: selectedAddress.label,
                            postcode: selectedAddress.postcode,
                            departementCode: selectedAddress.departementCode,
                            prestationId: prestation.id,
                            deliveryDate,
                            pickupDate: pickupDate || undefined,
                            contactEmail: contactEmail.trim(),
                            contactName: contactName.trim() || undefined,
                          })
                          if ("error" in result) {
                            setPayError(result.error)
                            return
                          }
                          window.location.assign(result.checkoutUrl)
                        } catch {
                          setPayError(
                            "Une erreur est survenue lors du paiement. Réessayez ou contactez-nous."
                          )
                        }
                      })
                    }}
                  >
                    {isPaying ? "Redirection Stripe…" : "Payer en ligne"}
                  </Button>
                ) : null}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter
        className={cn(
          "relative flex flex-col text-center",
          embedded
            ? "gap-1.5 border-0 bg-transparent px-2 pb-1 pt-3 sm:px-3 sm:pt-4"
            : "gap-2 border-t border-primary/5 bg-muted/30 py-4 text-[0.65rem] text-muted-foreground"
        )}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center gap-1.5",
            embedded ? "text-[12px] text-brand-muted" : ""
          )}
        >
          {embedded ? (
            <Headphones className="size-3.5 shrink-0 text-brand-muted" aria-hidden />
          ) : null}
          Une question ?{" "}
          <a
            href={SITE_PHONE_HREF}
            className="font-semibold text-primary hover:underline"
          >
            {SITE_PHONE_DISPLAY}
          </a>
        </span>
      </CardFooter>
    </Card>
  )
}

function PrestationCard({
  prestation,
  selected,
  onSelect,
  delay,
  t,
}: {
  prestation: Prestation
  selected: boolean
  onSelect: () => void
  delay: number
  t: { duration: number; ease?: readonly [number, number, number, number] }
}) {
  const visualSrc = BENNE_VISUAL_BY_VOLUME[prestation.volumeM3]

  return (
    <motion.div
      role="button"
      tabIndex={0}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...t, delay }}
      onClick={() => onSelect()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect()
        }
      }}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2.5 rounded-2xl border-2 p-3 text-left shadow-sm outline-none transition-colors sm:gap-3 sm:p-3.5",
        "focus-visible:border-brand-navy",
        selected
          ? "border-brand-navy bg-gradient-to-br from-accent to-white"
          : "border-border/80 bg-card/90 hover:border-brand-navy/35"
      )}
    >
      <div className="flex h-[58px] w-[72px] shrink-0 items-center justify-center sm:h-[72px] sm:w-[92px]">
        {visualSrc ? (
          <Image
            src={visualSrc}
            alt={`Benne ${prestation.volumeM3} m³`}
            width={368}
            height={207}
            className="h-full w-full object-contain"
            sizes="92px"
          />
        ) : null}
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {systemLabel(prestation.system)} · {prestation.volumeM3} m³
        </span>
        <p className="mt-0.5 text-[13px] font-semibold leading-snug text-brand-navy sm:text-sm">
          {prestation.label}
        </p>
        <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted-foreground sm:text-xs">
          Jusqu’à {prestation.tonnageMax} t inclus, dépassement{" "}
          {fmtHt(prestation.surchargePerTonHt)}/t.
        </p>
        <Dialog>
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="mt-1.5 h-7 px-0 text-xs text-brand-navy"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            }
          >
            <Info className="mr-1 size-3.5" />
            Déchets acceptés / exclus
          </DialogTrigger>
          <DialogContent
            overlayClassName="z-[80]"
            className="z-[80] max-h-[min(80vh,480px)] overflow-y-auto sm:max-w-md"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle className="text-brand-navy">
                {prestation.label}
              </DialogTitle>
              <div className="space-y-3 pt-2 text-left text-sm">
                <div>
                  <p className="font-medium text-primary">Acceptés</p>
                  <p className="text-muted-foreground">
                    {prestation.acceptedSummary}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-rose-800">Exclus</p>
                  <p className="text-muted-foreground">
                    {prestation.excludedSummary}
                  </p>
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <span className="shrink-0 self-start pt-0.5 text-[15px] font-bold tabular-nums text-primary sm:text-lg">
        {fmtHt(prestation.priceHt)}
      </span>
    </motion.div>
  )
}
