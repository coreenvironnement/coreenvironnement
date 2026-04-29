"use client"

import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Info,
  MapPin,
  MapPinOff,
  Package,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

function StepCircle({
  stepIndex,
  currentStepIdx,
}: {
  stepIndex: number
  currentStepIdx: number
}) {
  const done = currentStepIdx > stepIndex
  const active = currentStepIdx === stepIndex
  const prefersReducedMotion = useReducedMotion()
  const fade = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <div
      className={cn(
        "relative flex h-9 min-h-9 w-9 min-w-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-xs font-semibold tabular-nums transition-colors sm:h-10 sm:min-h-10 sm:w-10 sm:min-w-10 sm:text-sm",
        done && "border-2 border-primary bg-primary text-primary-foreground shadow-sm",
        active && !done && "border-2 border-primary bg-primary text-primary-foreground shadow-md",
        !active && !done &&
          "border-2 border-primary/40 bg-primary/[0.1] text-primary"
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        {done ? (
          <motion.span
            key="done"
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="flex items-center justify-center"
          >
            <CheckCircle2 className="size-[1.125rem] sm:size-5" aria-hidden />
          </motion.span>
        ) : (
          <motion.span
            key="num"
            initial={{ opacity: prefersReducedMotion ? 1 : 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            className="flex items-center justify-center"
          >
            {stepIndex + 1}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
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

  const syncZoneCheck = (raw: string): boolean => {
    const trimmed = raw.trim()
    if (!trimmed.length) return false
    const hit = mockGeocodeAddress(trimmed)
    const dist = haversineDistanceKm(hit, ELIANCOURT_CENTER)
    const ok = isWithinRadiusKm(hit)
    setGeocode(hit)
    setDistanceKm(Math.round(dist * 10) / 10)
    setOutOfZone(!ok)
    setZoneOk(ok)
    return ok
  }

  const handleAddressBlur = () => {
    const raw = address.trim()
    setAddressError(null)
    if (!raw.length) {
      resetZone()
      return
    }
    syncZoneCheck(raw)
  }

  const canLeaveIntent = zoneOk && family !== null && !outOfZone

  const goToForfait = () => {
    const raw = address.trim()
    setAddressError(null)
    if (!raw.length) {
      setAddressError("Indiquez l’adresse de livraison de la benne.")
      return
    }
    if (!family) {
      setAddressError("Choisissez un type de déchet dans la liste.")
      return
    }
    const ok = syncZoneCheck(raw)
    if (!ok) {
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

  return (
    <Card className="relative mx-auto w-full max-w-xl overflow-hidden border-white/70 bg-card/95 shadow-[0_22px_70px_-32px_color-mix(in_srgb,var(--brand-navy)_38%,transparent)] ring-1 ring-primary/15 backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-brand-navy/[0.05]" />

      <CardContent className="relative space-y-6 pt-8">
        <div className="space-y-2">
          <p className="text-center text-xs font-medium uppercase tracking-wide text-primary">
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
                  ? "bg-primary/12 text-primary shadow-sm ring-2 ring-primary/35"
                  : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
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
                  ? "bg-primary/12 text-primary shadow-sm ring-2 ring-primary/35"
                  : "text-muted-foreground hover:bg-white/50 hover:text-foreground"
              )}
            >
              Professionnel
            </button>
          </div>
          <p className="text-primary/90 text-center text-[0.72rem] leading-relaxed sm:text-xs">
            {audience === "professionnel"
              ? "Chantiers et pros du BTP, livraisons et rotations adaptées."
              : "Maison, jardin ou petit chantier, même parcours simple."}
          </p>
        </div>

        <div className="mb-2 flex items-center justify-center gap-1 sm:gap-2">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <StepCircle stepIndex={i} currentStepIdx={currentStepIdx} />
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "mx-1 h-0.5 w-3 rounded-full sm:w-6",
                    currentStepIdx > i ? "bg-primary" : "bg-primary/40"
                  )}
                />
              )}
            </div>
          ))}
        </div>
        <div className="mb-6 flex max-w-md justify-center gap-2 sm:gap-6">
          {steps.map((s, i) => {
            const active = currentStepIdx === i
            return (
              <span
                key={`${s.id}-label`}
                className={cn(
                  "max-w-[28%] flex-1 truncate text-center text-[0.65rem] font-medium leading-tight text-primary uppercase tracking-wide opacity-95 sm:text-xs",
                  active && "font-semibold opacity-100"
                )}
              >
                {s.label}
              </span>
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
              <div className="space-y-1 text-center">
                <p className="text-lg font-semibold text-primary sm:text-xl">
                  Où livrer la benne&nbsp;?
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                  Saisissez votre adresse complète, puis quittez le champ ou appuyez sur
                  Entrée. La zone se contrôle automatiquement. Livraison possible dans un
                  rayon de {DEFAULT_INTERVENTION_RADIUS_KM}&nbsp;km autour d’Élancourt.
                  Les forfaits s’affichent à l’étape suivante.
                </p>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="order-address"
                  className="block text-left text-sm font-semibold text-primary"
                >
                  Adresse de livraison
                </label>
                <div className="relative">
                  <MapPin
                    className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-primary"
                    aria-hidden
                  />
                  <Input
                    id="order-address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                      setOutOfZone(false)
                      setZoneOk(false)
                      setAddressError(null)
                    }}
                    onBlur={handleAddressBlur}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        ;(e.target as HTMLInputElement).blur()
                      }
                    }}
                    placeholder="Numéro, rue, code postal et ville"
                    className="h-14 border-2 border-primary/20 bg-white pl-12 pr-4 text-base shadow-sm focus-visible:border-primary/50 focus-visible:ring-brand-navy/30"
                    autoComplete="street-address"
                  />
                </div>
              </div>

              {zoneOk && geocode && (
                <p className="rounded-xl border border-primary/25 bg-primary/8 px-3 py-2 text-center text-xs text-brand-green-dark">
                  Adresse reconnue dans la zone ({geocode.label}, {distanceKm} km).
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
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-2">
                <label
                  htmlFor="order-waste-family"
                  className="block text-left text-sm font-semibold text-primary"
                >
                  Type de déchet
                </label>
                <Select
                  value={family ?? undefined}
                  onValueChange={(v) => {
                    setFamily(v as BenneFamily)
                    setAddressError(null)
                  }}
                >
                  <SelectTrigger
                    id="order-waste-family"
                    className="h-auto min-h-12 w-full max-w-none justify-between rounded-xl border-2 border-primary/20 bg-white px-4 py-3 text-left text-[0.9375rem] shadow-sm focus-visible:border-primary/40 data-[size=default]:h-auto dark:bg-white/95 [&_[data-slot=select-value]]:min-h-[2.75rem] [&_[data-slot=select-value]]:items-center"
                    size="default"
                  >
                    <SelectValue placeholder="Choisissez le type de déchet dans la liste" />
                  </SelectTrigger>
                  <SelectContent
                    side="bottom"
                    align="start"
                    className="rounded-xl border-primary/15"
                  >
                    {FAMILIES.map((fid) => {
                      const meta = FAMILY_LABELS[fid]
                      return (
                        <SelectItem key={fid} value={fid} className="cursor-pointer py-3">
                          <span className="flex flex-col gap-0.5 text-left">
                            <span className="font-medium text-foreground">
                              {meta.title}
                            </span>
                            <span className="text-xs font-normal text-muted-foreground">
                              {meta.description}
                            </span>
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
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
                <CardDescription className="text-base font-semibold text-primary">
                  Choisissez votre forfait
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  Prix H.T. Détail des déchets acceptés par forfait.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Calendar className="size-3.5" aria-hidden />
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
                  Récapitulatif et paiement
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  Montants H.T. La TVA applicable sera confirmée sur la facture.
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
          Intervention sur les Yvelines (78), traçabilité et conformité.
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
