"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import Link from "next/link"
import { Recycle01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import {
  ArrowLeft,
  BrickWall,
  Calendar,
  ChevronRight,
  Hammer,
  Info,
  MapPinOff,
  Package,
  Recycle,
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
import { departementLabel } from "@/lib/geo/idf"
import {
  type BenneFamily,
  type Prestation,
  FAMILY_LABELS,
  prestationsByFamily,
  prestationById,
  systemLabel,
} from "@/lib/prestations"
import { ORDER_TUNNEL_STEPS } from "@/lib/order/tunnel-steps"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

export { ORDER_TUNNEL_STEPS } from "@/lib/order/tunnel-steps"

const steps = ORDER_TUNNEL_STEPS

const ORDER_SECTION_LABEL =
  "text-left text-[14px] font-semibold leading-snug text-brand-navy"

const ORDER_FIELD_LABEL =
  "block text-left text-xs font-medium text-[#667085]"

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
type StepId = "intent" | "forfait" | "payment"

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
  onStepIndexChange?: (index: number) => void
}

export function OrderWidget({ variant = "default", onStepIndexChange }: OrderWidgetProps) {
  const embedded = variant === "embedded"
  const prefersReducedMotion = useReducedMotion()
  const t = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }

  const [step, setStep] = useState<StepId>("intent")
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
  const [contactEmail, setContactEmail] = useState("")
  const [contactName, setContactName] = useState("")
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

  const goToPayment = () => {
    if (!selectedPrestationId) return
    if (!deliveryDate.length) {
      setAddressError("Indiquez une date de livraison souhaitée.")
      return
    }
    setAddressError(null)
    setStep("payment")
  }

  const currentStepIdx = steps.findIndex((s) => s.id === step)

  useEffect(() => {
    onStepIndexChange?.(currentStepIdx)
  }, [currentStepIdx, onStepIndexChange])

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

      <CardContent className={cn("relative space-y-3", embedded ? "px-1 pb-2 pt-0" : "pt-8")}>
        <div className="space-y-2">
          <p className={ORDER_SECTION_LABEL}>Vous êtes&nbsp;?</p>
          <div
            className="flex rounded-xl border border-brand-navy/10 bg-white p-1"
            role="group"
            aria-label="Type de client"
          >
            <button
              type="button"
              onClick={() => setAudience("particulier")}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition sm:text-sm",
                audience === "particulier"
                  ? "bg-[#35A238]/10 text-[#35A238] ring-1 ring-[#35A238]/30"
                  : "text-brand-navy/42 hover:text-brand-navy/65"
              )}
            >
              Particulier
            </button>
            <button
              type="button"
              onClick={() => setAudience("professionnel")}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition sm:text-sm",
                audience === "professionnel"
                  ? "bg-[#35A238]/10 text-[#35A238] ring-1 ring-[#35A238]/30"
                  : "text-brand-navy/42 hover:text-brand-navy/65"
              )}
            >
              Professionnel
            </button>
          </div>
        </div>

        {!embedded ? <OrderStepProgress currentStepIdx={currentStepIdx} /> : null}

        <AnimatePresence mode="wait">
          {step === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-2.5"
            >
              <p className={ORDER_SECTION_LABEL}>Où livrer votre benne&nbsp;?</p>

              <div className="space-y-1.5">
                <label htmlFor="order-address" className={ORDER_FIELD_LABEL}>
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
                />
                <p className="text-[0.65rem] text-muted-foreground">
                  Saisissez votre adresse et choisissez une suggestion (Île-de-France
                  uniquement).
                </p>
              </div>

              {selectedAddress && (
                <p className="rounded-xl border border-primary/25 bg-primary/8 px-3 py-2 text-center text-xs text-brand-green-dark">
                  Adresse en Île-de-France (
                  {departementLabel(selectedAddress.departementCode) ??
                    selectedAddress.departementCode}
                  · {selectedAddress.postcode} {selectedAddress.city}).
                </p>
              )}

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

              <div className="relative z-30 space-y-1.5">
                <label htmlFor="order-waste-family" className={ORDER_FIELD_LABEL}>
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

              {addressError && (
                <p className="text-center text-xs font-medium text-amber-800">
                  {addressError}
                </p>
              )}

              <Button
                type="button"
                className="h-11 w-full rounded-xl border-0 bg-[#2F9632] text-base font-semibold text-white shadow-lg shadow-[#2F9632]/25 hover:bg-[#19752B] disabled:cursor-not-allowed disabled:bg-[#2F9632] disabled:opacity-60 disabled:shadow-md"
                onClick={goToForfait}
                disabled={!canLeaveIntent}
              >
                Continuer vers les forfaits
                <ChevronRight className="ml-2 size-4" />
              </Button>
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
                <p className="mt-1 text-xs text-muted-foreground">
                  Prix H.T. Détail des déchets acceptés par forfait.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-brand-navy">
                    <Calendar className="size-3.5 text-brand-navy/50" aria-hidden />
                    Livraison souhaitée&nbsp;*
                  </label>
                  <Input
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
                  <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="size-3.5" aria-hidden />
                    Enlèvement souhaité (optionnel)
                  </label>
                  <Input
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

              {addressError && (
                <p className="text-center text-xs font-medium text-amber-800">
                  {addressError}
                </p>
              )}

              <div className="grid max-h-[min(60vh,420px)] gap-3 overflow-y-auto pr-1 sm:max-h-[min(70vh,520px)]">
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
                  disabled={!selectedPrestationId || !deliveryDate}
                  onClick={goToPayment}
                >
                  Valider le forfait
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
                <p className={ORDER_SECTION_LABEL}>Récapitulatif et paiement</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Montants H.T. La TVA applicable sera confirmée sur la facture.
                </p>
              </div>

              <ul className="divide-y divide-border rounded-2xl border border-primary/10 bg-white/95">
                <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between">
                  <span className="text-muted-foreground">Lieu</span>
                  <span className="font-medium text-brand-navy">
                    {selectedAddress.label}
                  </span>
                </li>
                <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between">
                  <span className="text-muted-foreground">Livraison souhaitée</span>
                  <span className="font-medium text-brand-navy">
                    {new Date(deliveryDate + "T12:00:00").toLocaleDateString(
                      "fr-FR"
                    )}
                  </span>
                </li>
                {pickupDate && (
                  <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between">
                    <span className="text-muted-foreground">Enlèvement souhaité</span>
                    <span className="font-medium text-brand-navy">
                      {new Date(pickupDate + "T12:00:00").toLocaleDateString(
                        "fr-FR"
                      )}
                    </span>
                  </li>
                )}
                <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between">
                  <span className="text-muted-foreground">Forfait</span>
                  <span className="text-right font-medium text-brand-navy">
                    {prestation.label}
                  </span>
                </li>
                <li className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-brand-navy">Total H.T.</span>
                  <span className="text-2xl font-bold tabular-nums text-primary">
                    {fmtHt(prestation.priceHt)}
                  </span>
                </li>
              </ul>

              <p className="text-center text-[0.7rem] text-muted-foreground">
                Dépassement tonnage : {fmtHt(prestation.surchargePerTonHt)} H.T. / t
                au-delà de {prestation.tonnageMax} t (facturation complémentaire).
              </p>

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
                <div className="space-y-3 rounded-xl border border-brand-navy/10 bg-white/90 p-4">
                  <p className="text-sm font-semibold text-brand-navy">Vos coordonnées</p>
                  <div className="space-y-1.5">
                    <label htmlFor="order-contact-email" className="text-xs font-medium text-muted-foreground">
                      E-mail (confirmation de commande)&nbsp;*
                    </label>
                    <Input
                      id="order-contact-email"
                      type="email"
                      autoComplete="email"
                      value={contactEmail}
                      onChange={(e) => {
                        setContactEmail(e.target.value)
                        setPayError(null)
                      }}
                      placeholder="vous@exemple.fr"
                      className="h-11 border-2 border-primary/15 bg-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="order-contact-name" className="text-xs font-medium text-muted-foreground">
                      Nom et prénom (optionnel)
                    </label>
                    <Input
                      id="order-contact-name"
                      autoComplete="name"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jean Dupont"
                      className="h-11 border border-border/80 bg-white"
                    />
                  </div>
                  <p className="text-[0.7rem] text-muted-foreground">
                    Paiement sécurisé Stripe (CB, Apple Pay, Google Pay selon votre
                    appareil) · montant TTC estimé (TVA 20&nbsp;%) :{" "}
                    <strong className="text-foreground">
                      {fmtHt(Math.round(prestation.priceHt * 1.2 * 100) / 100)}
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
                    setStep("forfait")
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
                        if (result?.error) {
                          setPayError(result.error)
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
          "relative flex flex-col gap-2 text-center text-[0.65rem] text-muted-foreground",
          embedded
            ? "border-0 bg-transparent px-1 py-3"
            : "border-t border-primary/5 bg-muted/30 py-4"
        )}
      >
        <span>
          Une question ?{" "}
          <a
            href={SITE_PHONE_HREF}
            className="font-semibold text-primary hover:underline"
          >
            {SITE_PHONE_DISPLAY}
          </a>
        </span>
        <span className="opacity-90">
          Intervention en Île-de-France (8 départements), traçabilité et conformité.
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
  return (
    <motion.div
      layout
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
        "flex w-full cursor-pointer flex-col rounded-2xl border p-4 text-left shadow-sm outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-brand-navy",
        selected
          ? "border-brand-navy bg-gradient-to-br from-accent to-white ring-2 ring-brand-navy"
          : "border-border/80 bg-card/90 hover:border-brand-navy/35"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {systemLabel(prestation.system)} · {prestation.volumeM3} m³
          </span>
          <p className="mt-1 font-semibold leading-snug text-brand-navy">
            {prestation.label}
          </p>
        </div>
        <span className="shrink-0 text-lg font-bold tabular-nums text-primary">
          {fmtHt(prestation.priceHt)}
        </span>
      </div>
      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
        Jusqu’à {prestation.tonnageMax} t inclus, dépassement{" "}
        {fmtHt(prestation.surchargePerTonHt)}/t.
      </p>
      <div className="mt-3 flex items-center justify-between gap-2">
        <Dialog>
          <DialogTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="xs"
                className="h-7 text-xs text-brand-navy"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              />
            }
          >
            <Info className="mr-1 size-3.5" />
            Déchets acceptés / exclus
          </DialogTrigger>
          <DialogContent className="max-h-[min(80vh,480px)] overflow-y-auto sm:max-w-md">
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
        <Package className="size-4 text-primary/80" aria-hidden />
      </div>
    </motion.div>
  )
}
