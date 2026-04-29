"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Info,
  Loader2,
  MapPin,
  MapPinOff,
  Package,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
  ELIANCOURT_CENTER,
  DEFAULT_INTERVENTION_RADIUS_KM,
  haversineDistanceKm,
  isWithinRadiusKm,
} from "@/lib/geo/haversine"
import { mockGeocodeAddress, type MockGeocodeHit } from "@/lib/geo/mock-geocode"
import {
  type BenneFamily,
  type Prestation,
  FAMILY_LABELS,
  prestationsByFamily,
  prestationById,
  systemLabel,
} from "@/lib/prestations"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

const steps = [
  { id: "intent" as const, label: "Votre demande" },
  { id: "forfait" as const, label: "Forfait" },
  { id: "payment" as const, label: "Paiement" },
]

const FAMILIES: BenneFamily[] = [
  "melange_dnd",
  "gravats_melanges",
  "gravats_propres",
]

const demoSuggestions = [
  { label: "Élancourt", value: "78280 Élancourt", hint: "Dans la zone" },
  { label: "Trappes", value: "Trappes centre", hint: "Dans la zone" },
  { label: "Paris", value: "Paris 75015", hint: "Hors zone démo" },
] as const

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

export function OrderWidget() {
  const prefersReducedMotion = useReducedMotion()
  const t = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }

  const [step, setStep] = useState<StepId>("intent")
  const [audience, setAudience] = useState<Audience>("particulier")
  const [address, setAddress] = useState("")
  const [geocode, setGeocode] = useState<MockGeocodeHit | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [zoneOk, setZoneOk] = useState(false)
  const [outOfZone, setOutOfZone] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [chipDemoHint, setChipDemoHint] = useState(false)
  const [family, setFamily] = useState<BenneFamily | null>(null)
  const [deliveryDate, setDeliveryDate] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [selectedPrestationId, setSelectedPrestationId] = useState<
    string | null
  >(null)
  const [paymentStub, setPaymentStub] = useState(false)

  const prestation = useMemo(
    () => (selectedPrestationId ? prestationById(selectedPrestationId) : null),
    [selectedPrestationId]
  )

  const filteredPrestations = useMemo(
    () => (family ? prestationsByFamily(family) : []),
    [family]
  )

  useEffect(() => {
    if (step !== "payment") setPaymentStub(false)
  }, [step])

  const resetZone = () => {
    setZoneOk(false)
    setOutOfZone(false)
    setGeocode(null)
    setDistanceKm(null)
  }

  const runZoneCheck = (raw: string) => {
    const hit = mockGeocodeAddress(raw)
    const dist = haversineDistanceKm(hit, ELIANCOURT_CENTER)
    const ok = isWithinRadiusKm(hit)
    setGeocode(hit)
    setDistanceKm(Math.round(dist * 10) / 10)
    setOutOfZone(!ok)
    setZoneOk(ok)
    return ok
  }

  const handleVerifyAddress = () => {
    const raw = address.trim()
    setAddressError(null)
    if (!raw.length) {
      setAddressError("Indiquez l’adresse de livraison de la benne.")
      resetZone()
      return
    }
    setChecking(true)
    setChipDemoHint(false)
    window.setTimeout(() => {
      runZoneCheck(raw)
      setChecking(false)
    }, prefersReducedMotion ? 0 : 480)
  }

  const applyDemoSuggestion = (value: string) => {
    setAddress(value)
    setAddressError(null)
    setChipDemoHint(true)
    setChecking(true)
    window.setTimeout(() => {
      runZoneCheck(value)
      setChecking(false)
    }, prefersReducedMotion ? 0 : 450)
  }

  const canLeaveIntent =
    zoneOk &&
    family !== null &&
    deliveryDate.length > 0 &&
    !outOfZone

  const goToForfait = () => {
    if (!canLeaveIntent) {
      if (!zoneOk) setAddressError("Vérifiez d’abord que l’adresse est dans la zone.")
      else if (!family) setAddressError("Choisissez un type de déchet.")
      else if (!deliveryDate) setAddressError("Indiquez une date de livraison souhaitée.")
      return
    }
    setAddressError(null)
    setStep("forfait")
  }

  const goToPayment = () => {
    if (!selectedPrestationId) return
    setStep("payment")
  }

  const currentStepIdx = steps.findIndex((s) => s.id === step)

  return (
    <Card className="relative mx-auto w-full max-w-xl overflow-hidden border-white/70 bg-card/95 shadow-[0_22px_70px_-32px_color-mix(in_srgb,var(--brand-navy)_38%,transparent)] ring-1 ring-primary/15 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-brand-navy/[0.05]" />

      <CardContent className="relative space-y-6 pt-8">
        <div className="space-y-2">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-brand-navy">
            Vous êtes&nbsp;?
          </p>
          <div
            className="flex rounded-2xl border border-brand-navy/12 bg-muted/50 p-1"
            role="group"
            aria-label="Type de client"
          >
            <button
              type="button"
              onClick={() => setAudience("particulier")}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-semibold transition sm:text-sm",
                audience === "particulier"
                  ? "bg-card text-brand-navy shadow-sm ring-1 ring-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Particulier
            </button>
            <button
              type="button"
              onClick={() => setAudience("professionnel")}
              className={cn(
                "flex-1 rounded-xl py-2.5 text-xs font-semibold transition sm:text-sm",
                audience === "professionnel"
                  ? "bg-card text-brand-navy shadow-sm ring-1 ring-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Professionnel
            </button>
          </div>
          <p className="text-center text-[0.72rem] leading-relaxed text-muted-foreground sm:text-xs">
            {audience === "professionnel"
              ? "Chantiers et pros du BTP — livraisons et rotations adaptées."
              : "Maison, jardin ou petit chantier — même parcours simple."}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-1 sm:gap-2">
          {steps.map((s, i) => {
            const active = currentStepIdx === i
            const done = currentStepIdx > i
            return (
              <div key={s.id} className="flex items-center">
                <motion.div
                  className={cn(
                    "flex h-8 min-w-[2rem] items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors sm:h-9 sm:min-w-[2.5rem] sm:px-2.5 sm:text-[0.75rem]",
                    done && "bg-primary text-primary-foreground shadow-sm",
                    active && !done && "bg-brand-navy text-white shadow-md",
                    !active && !done && "bg-muted text-muted-foreground"
                  )}
                  layout
                  transition={t}
                >
                  {done ? (
                    <CheckCircle2 className="size-4 sm:size-[1.125rem]" />
                  ) : (
                    i + 1
                  )}
                </motion.div>
                {i < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 w-3 rounded-full bg-border sm:w-6",
                      currentStepIdx > i && "bg-primary"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-5"
            >
              <div className="text-center">
                <CardDescription className="text-base font-medium text-brand-navy">
                  Adresse & type de flux
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  Livraison dans un rayon de {DEFAULT_INTERVENTION_RADIUS_KM}&nbsp;km
                  autour d’Élancourt — forfaits visibles à l’étape suivante.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-navy" />
                  <Input
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                      setOutOfZone(false)
                      setZoneOk(false)
                      setAddressError(null)
                      setChipDemoHint(false)
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleVerifyAddress())
                    }
                    placeholder="Adresse complète ou ville (ex. 78280 Élancourt)"
                    className="h-11 border-primary/15 bg-white/90 pl-10 pr-4 text-base shadow-inner focus-visible:ring-brand-navy/40"
                    autoComplete="street-address"
                  />
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {demoSuggestions.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => applyDemoSuggestion(d.value)}
                      className="rounded-full border border-primary/10 bg-accent/70 px-3 py-1.5 text-xs font-medium text-primary transition hover:border-brand-navy/35"
                    >
                      <span>{d.label}</span>
                      <span className="ml-1.5 text-muted-foreground">
                        · {d.hint}
                      </span>
                    </button>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="h-10 w-full rounded-xl border-brand-navy/20"
                  onClick={handleVerifyAddress}
                  disabled={checking}
                >
                  {checking ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 size-4" />
                  )}
                  Vérifier l’adresse
                </Button>
              </div>

              {zoneOk && geocode && (
                <p className="rounded-xl border border-primary/25 bg-primary/8 px-3 py-2 text-center text-xs text-brand-green-dark">
                  Adresse dans la zone — {geocode.label} ({distanceKm} km)
                </p>
              )}

              <AnimatePresence>
                {outOfZone && geocode && distanceKm !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/95 to-white p-4 text-left text-sm text-rose-950"
                  >
                    <div className="flex gap-3">
                      <MapPinOff className="size-5 shrink-0 text-rose-700" />
                      <div>
                        <p className="font-semibold">Hors zone d’intervention</p>
                        <p className="mt-1 text-rose-900/90">
                          Environ {distanceKm} km de notre base. Appelez le{" "}
                          <a
                            href={SITE_PHONE_HREF}
                            className="font-semibold underline decoration-rose-400"
                          >
                            {SITE_PHONE_DISPLAY}
                          </a>{" "}
                          pour étudier un cas particulier.
                        </p>
                        {chipDemoHint && (
                          <p className="mt-2 text-xs text-rose-800/80">
                            Suggestion démo — modifiez l’adresse pour tester.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-3">
                <p className="text-center text-xs font-semibold uppercase tracking-wide text-brand-navy">
                  Type de déchet
                </p>
                <div className="grid gap-2 sm:grid-cols-1">
                  {FAMILIES.map((fid) => {
                    const meta = FAMILY_LABELS[fid]
                    const selected = family === fid
                    return (
                      <button
                        key={fid}
                        type="button"
                        onClick={() => setFamily(fid)}
                        className={cn(
                          "rounded-2xl border p-3 text-left transition",
                          selected
                            ? "border-primary bg-primary/10 ring-2 ring-primary/30"
                            : "border-border/80 hover:border-brand-navy/25"
                        )}
                      >
                        <span className="font-semibold text-brand-navy">
                          {meta.title}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {meta.description}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-brand-navy">
                    <Calendar className="size-3.5" />
                    Date de livraison souhaitée *
                  </label>
                  <Input
                    type="date"
                    min={todayISODate()}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="h-10 border-primary/15"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Calendar className="size-3.5" />
                    Enlèvement souhaité (optionnel)
                  </label>
                  <Input
                    type="date"
                    min={deliveryDate || todayISODate()}
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="h-10 border-primary/15"
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
                className="h-11 w-full rounded-xl bg-primary text-base font-semibold shadow-lg shadow-primary/25"
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
              <div className="text-center">
                <CardDescription className="text-base font-medium text-brand-navy">
                  Choisissez votre forfait
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  Prix H.T. — détail des déchets acceptés par forfait.
                </p>
              </div>

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
                  onClick={() => setStep("intent")}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl sm:flex-1"
                  disabled={!selectedPrestationId}
                  onClick={goToPayment}
                >
                  Valider le forfait
                  <ChevronRight className="ml-2 size-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {step === "payment" && prestation && geocode && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              transition={t}
              className="space-y-5"
            >
              <div className="text-center">
                <CardDescription className="text-base font-medium text-brand-navy">
                  Récapitulatif & paiement
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  Montants H.T. — la TVA applicable sera confirmée sur la facture.
                </p>
              </div>

              <ul className="divide-y divide-border rounded-2xl border border-primary/10 bg-white/95">
                <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:justify-between">
                  <span className="text-muted-foreground">Lieu</span>
                  <span className="font-medium text-brand-navy">
                    {geocode.label}
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

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl"
                  onClick={() => setStep("forfait")}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                <Button
                  type="button"
                  className="h-11 flex-1 rounded-xl text-base font-semibold shadow-lg"
                  onClick={() => setPaymentStub(true)}
                >
                  Payer en ligne
                </Button>
              </div>

              {paymentStub && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-brand-navy/20 bg-muted/50 px-3 py-3 text-center text-xs text-muted-foreground"
                >
                  Paiement en ligne : branchement Stripe / prestataire à venir.
                  Votre demande peut être finalisée par téléphone au{" "}
                  <a href={SITE_PHONE_HREF} className="font-semibold text-primary">
                    {SITE_PHONE_DISPLAY}
                  </a>
                  .
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="relative flex flex-col gap-2 border-t border-primary/5 bg-muted/30 py-4 text-center text-[0.65rem] text-muted-foreground">
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
          Intervention sur les Yvelines (78) — traçabilité et conformité.
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
        Jusqu’à {prestation.tonnageMax} t inclus — dépassement{" "}
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
