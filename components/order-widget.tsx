"use client"

import { useEffect, useMemo, useState } from "react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion"
import {
  ArrowLeft,
  CheckCircle2,
  Construction,
  Leaf,
  Loader2,
  MapPin,
  MapPinOff,
  Package,
  Sparkles,
  TreePine,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  ELIANCOURT_CENTER,
  DEFAULT_INTERVENTION_RADIUS_KM,
  haversineDistanceKm,
  isWithinRadiusKm,
} from "@/lib/geo/haversine"
import { mockGeocodeAddress, type MockGeocodeHit } from "@/lib/geo/mock-geocode"
import { cn } from "@/lib/utils"

const steps = [
  { id: "address" as const, label: "Chantier" },
  { id: "waste" as const, label: "Déchet" },
  { id: "summary" as const, label: "Résumé" },
]

export type WasteTypeId = "gravats" | "dib" | "bois" | "verts"

const wasteTypes: Array<{
  id: WasteTypeId
  title: string
  description: string
  prixIndicatif: number
  Icon: typeof Construction
}> = [
  {
    id: "gravats",
    title: "Gravats",
    description: "Béton, briques — benne lourde",
    prixIndicatif: 349,
    Icon: Construction,
  },
  {
    id: "dib",
    title: "DIB (tout-venant)",
    description: "Mélangé hors dangereux",
    prixIndicatif: 289,
    Icon: Package,
  },
  {
    id: "bois",
    title: "Bois",
    description: "Palette, hors traité CU",
    prixIndicatif: 269,
    Icon: TreePine,
  },
  {
    id: "verts",
    title: "Déchets verts",
    description: "Tonte, coupe, léger",
    prixIndicatif: 239,
    Icon: Leaf,
  },
]

const demoSuggestions = [
  { label: "Élancourt", value: "78280 Élancourt", hint: "Dans la zone" },
  { label: "Trappes", value: "Trappes centre", hint: "Dans la zone" },
  { label: "Paris", value: "Paris 75015", hint: "Hors zone démo" },
] as const

type StepId = "address" | "waste" | "summary"

type Audience = "particulier" | "professionnel"

export function OrderWidget() {
  const prefersReducedMotion = useReducedMotion()
  const t = prefersReducedMotion
    ? { duration: 0.01 }
    : { duration: 0.38, ease: [0.22, 1, 0.36, 1] as const }

  const [step, setStep] = useState<StepId>("address")
  const [address, setAddress] = useState("")
  const [geocode, setGeocode] = useState<MockGeocodeHit | null>(null)
  const [distanceKm, setDistanceKm] = useState<number | null>(null)
  const [outOfZone, setOutOfZone] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [checking, setChecking] = useState(false)
  const [selectedWaste, setSelectedWaste] = useState<WasteTypeId | null>(
    null
  )
  const [chipDemoHint, setChipDemoHint] = useState(false)
  const [submitStubMessage, setSubmitStubMessage] = useState(false)
  const [audience, setAudience] = useState<Audience>("particulier")

  useEffect(() => {
    if (step !== "summary") setSubmitStubMessage(false)
  }, [step])

  const waste = useMemo(
    () => wasteTypes.find((w) => w.id === selectedWaste) ?? null,
    [selectedWaste]
  )

  const resetZoneState = () => {
    setOutOfZone(false)
    setGeocode(null)
    setDistanceKm(null)
  }

  const handleVerify = () => {
    const raw = address.trim()
    setAddressError(null)
    if (!raw.length) {
      setAddressError("Indiquez l’adresse de livraison de la benne.")
      resetZoneState()
      return
    }

    setChecking(true)
    setChipDemoHint(false)
    /* Petit délai pour l’effet “vérification” en démo */
    window.setTimeout(() => {
      const hit = mockGeocodeAddress(raw)
      const dist = haversineDistanceKm(hit, ELIANCOURT_CENTER)
      const ok = isWithinRadiusKm(hit)

      setGeocode(hit)
      setDistanceKm(Math.round(dist * 10) / 10)

      setChecking(false)
      if (!ok) {
        setOutOfZone(true)
        setStep("address")
        return
      }
      setOutOfZone(false)
      setStep("waste")
    }, prefersReducedMotion ? 0 : 520)
  }

  const applyDemoSuggestion = (value: string) => {
    setAddress(value)
    setAddressError(null)
    setChipDemoHint(true)
    setOutOfZone(false)
    setChecking(true)
    const delay = prefersReducedMotion ? 0 : 480
    window.setTimeout(() => {
      const hit = mockGeocodeAddress(value)
      const dist = haversineDistanceKm(hit, ELIANCOURT_CENTER)
      const ok = isWithinRadiusKm(hit)
      setGeocode(hit)
      setDistanceKm(Math.round(dist * 10) / 10)
      setChecking(false)
      setOutOfZone(!ok)
      if (ok) {
        setStep("waste")
      } else {
        setStep("address")
      }
    }, delay)
  }

  const goSummary = () => {
    if (selectedWaste) setStep("summary")
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
              ? "Chantiers, entreprises du BTP : livraisons et rotations adaptées à votre planning."
              : "Maison, jardin ou petit chantier — même processus simple et réactif."}
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8 flex items-center justify-center gap-1 sm:gap-2">
          {steps.map((s, i) => {
            const active = currentStepIdx === i
            const done = currentStepIdx > i
            return (
              <div key={s.id} className="flex items-center">
                <motion.div
                  className={cn(
                    "flex h-8 min-w-[2rem] items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors sm:h-9 sm:min-w-[2.75rem] sm:px-3 sm:text-[0.8rem]",
                    done && "bg-brand-green text-white shadow-sm shadow-brand-green/25",
                    active &&
                      !done &&
                      "bg-primary text-primary-foreground shadow-md",
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
                      "mx-1 h-0.5 w-4 rounded-full bg-border sm:w-8",
                      currentStepIdx > i && "bg-brand-green"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {step === "address" && (
            <motion.div
              key="step-address"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }}
              transition={t}
              className="space-y-4"
            >
              <div className="text-center">
                <CardDescription className="text-base font-medium text-brand-navy">
                  {audience === "professionnel"
                    ? "Où livrer la benne sur le chantier&nbsp;?"
                    : "Où livrer la benne&nbsp;?"}
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  Démo locale — saisissez une adresse&nbsp;; la zone est contrôlée
                  automatiquement.
                  {audience === "professionnel"
                    ? " Préparez l’accès poids lourds si besoin."
                    : " Indiquez un accès praticable pour la benne."}
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-brand-navy" />
                  <Input
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value)
                      if (outOfZone) setOutOfZone(false)
                      setAddressError(null)
                      setChipDemoHint(false)
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleVerify())
                    }
                    placeholder="Adresse complète ou ville (ex. 78280 Élancourt)"
                    className="h-11 border-primary/15 bg-white/90 pl-10 pr-4 text-base shadow-inner shadow-primary/5 focus-visible:ring-brand-navy/40"
                    autoComplete="street-address"
                  />
                </div>
                {addressError && (
                  <p className="text-xs font-medium text-amber-800">
                    {addressError}
                  </p>
                )}

                <div className="flex flex-wrap justify-center gap-2">
                  {demoSuggestions.map((d) => (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => applyDemoSuggestion(d.value)}
                      className="rounded-full border border-primary/10 bg-accent/70 px-3 py-1.5 text-xs font-medium text-primary transition hover:border-brand-navy/35 hover:bg-accent"
                    >
                      <span>{d.label}</span>
                      <span className="ml-1.5 text-muted-foreground">
                        · {d.hint}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <AnimatePresence>
                {outOfZone && geocode && distanceKm !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={t}
                    className="overflow-hidden rounded-2xl border border-rose-200/80 bg-gradient-to-br from-rose-50/95 to-white p-4 text-left shadow-sm"
                  >
                    <div className="flex gap-3">
                      <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 text-rose-700">
                        <MapPinOff className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <p className="text-sm font-semibold text-rose-950">
                          Hors zone d’intervention
                        </p>
                        <p className="text-sm leading-relaxed text-rose-900/90">
                          Cette adresse est à environ{" "}
                          <strong>{distanceKm} km</strong> de notre base
                          d’Élancourt. Aujourd’hui nous intervenons dans un rayon
                          de {DEFAULT_INTERVENTION_RADIUS_KM}&nbsp;km pour garantir
                          une réponse terrain immédiate.
                        </p>
                        {chipDemoHint && (
                          <p className="text-xs text-rose-800/80">
                            Suggestion démo appliquée — modifiez l’adresse pour
                            tester un autre cas.
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                type="button"
                className="h-11 w-full rounded-xl bg-primary text-base font-semibold shadow-lg shadow-primary/25 transition hover:shadow-primary/35"
                onClick={handleVerify}
                disabled={checking}
              >
                {checking ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Vérification…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 size-4 opacity-90" />
                    Vérifier la disponibilité
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {step === "waste" && (
            <motion.div
              key="step-waste"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }}
              transition={t}
              className="space-y-5"
            >
              <div className="rounded-xl border border-brand-green/20 bg-brand-green-soft/15 px-3 py-2 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-green-dark">
                  Zone desservie
                </p>
                <p className="truncate text-sm text-brand-navy">
                  {geocode?.label ?? address.trim()}
                  {distanceKm !== null ? (
                    <span className="text-muted-foreground">
                      {" "}
                      · {distanceKm} km · base Élancourt
                    </span>
                  ) : null}
                </p>
              </div>

              <div>
                <CardDescription className="text-center text-base font-medium text-foreground">
                  Quel déchet doit partir en benne&nbsp;?
                </CardDescription>
              </div>

              <motion.div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {wasteTypes.map((w, i) => {
                  const selected = selectedWaste === w.id
                  return (
                    <motion.button
                      key={w.id}
                      type="button"
                      layout
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...t, delay: prefersReducedMotion ? 0 : i * 0.05 }}
                      onClick={() => setSelectedWaste(w.id)}
                      className={cn(
                        "flex flex-col items-start rounded-2xl border p-4 text-left shadow-sm outline-none ring-offset-2 transition hover:border-brand-navy/45 focus-visible:ring-2 focus-visible:ring-brand-navy",
                        selected
                          ? "border-brand-navy bg-gradient-to-br from-accent to-white shadow-[0_12px_40px_-20px_color-mix(in_srgb,var(--brand-navy)_45%,transparent)] ring-2 ring-brand-navy"
                          : "border-border/80 bg-card/90 hover:bg-white"
                      )}
                    >
                      <span
                        className={cn(
                          "mb-3 flex size-11 items-center justify-center rounded-xl",
                          selected
                            ? "bg-primary text-primary-foreground"
                            : "bg-primary/10 text-primary"
                        )}
                      >
                        <w.Icon className="size-6" aria-hidden />
                      </span>
                      <span className="font-semibold text-brand-navy">
                        {w.title}
                      </span>
                      <span className="mt-1 text-xs leading-snug text-muted-foreground">
                        {w.description}
                      </span>
                      <span className="mt-3 text-xs font-semibold text-brand-green-dark">
                        À partir de {w.prixIndicatif}&nbsp;€ TTC*
                      </span>
                    </motion.button>
                  )
                })}
              </motion.div>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl border-primary/15"
                  onClick={() => {
                    setChipDemoHint(false)
                    setSelectedWaste(null)
                    setStep("address")
                  }}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Adresse
                </Button>
                <Button
                  type="button"
                  className="h-10 flex-1 rounded-xl sm:max-w-[200px]"
                  disabled={!selectedWaste}
                  onClick={goSummary}
                >
                  Continuer
                </Button>
              </div>
            </motion.div>
          )}

          {step === "summary" && waste && geocode && (
            <motion.div
              key="step-summary"
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }}
              transition={t}
              className="space-y-5"
            >
              <div className="text-center">
                <CardDescription className="text-base font-medium text-foreground">
                  Récapitulatif — estimation immédiate
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tarification directe et transparente — valeur indicative avant
                  validation terrain par nos équipes.
                </p>
              </div>

              <motion.ul
                className="divide-y divide-border rounded-2xl border border-primary/10 bg-white/95"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 1 }}
              >
                <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground">Chantier</span>
                  <span className="font-medium text-brand-navy">
                    {geocode.label}
                  </span>
                </li>
                <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground">
                    Distance / base Élancourt
                  </span>
                  <span className="font-medium text-brand-navy">
                    {distanceKm !== null ? `${distanceKm} km` : "—"}
                  </span>
                </li>
                <li className="flex flex-col gap-0.5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-muted-foreground">Flux</span>
                  <span className="font-medium text-brand-navy">{waste.title}</span>
                </li>
                <li className="flex flex-col gap-1 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-semibold text-brand-navy">
                    Estimation à partir de
                  </span>
                  <motion.span
                    className="text-2xl font-bold tabular-nums text-brand-green-dark"
                    initial={{ scale: prefersReducedMotion ? 1 : 0.96 }}
                    animate={{ scale: 1 }}
                    transition={t}
                  >
                    {waste.prixIndicatif}&nbsp;€ TTC
                  </motion.span>
                </li>
              </motion.ul>

              <p className="text-center text-[0.7rem] leading-relaxed text-muted-foreground">
                * Montant indicatif location / rotation standard. Nous prenons en
                charge la planification, la conformité et le suivi enlèvement.
              </p>

              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button
                  variant="outline"
                  type="button"
                  className="h-10 rounded-xl border-primary/15"
                  onClick={() => setStep("waste")}
                >
                  <ArrowLeft className="mr-2 size-4" />
                  Retour
                </Button>
                <Button
                  type="button"
                  className="h-11 flex-1 rounded-xl text-base font-semibold shadow-lg shadow-primary/20"
                  onClick={() => setSubmitStubMessage(true)}
                >
                  Valider et être rappelé
                </Button>
              </div>

              {submitStubMessage && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-brand-green/30 bg-brand-green-soft/25 px-3 py-2 text-center text-xs font-medium text-brand-green-dark"
                >
                  Démo : la finalisation sera branchée sur Supabase — votre
                  demande est prête à être enregistrée.
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="relative border-t border-primary/5 bg-muted/30 py-3 text-center text-[0.65rem] text-muted-foreground">
        Intervention prioritaire sur les Yvelines (78) — traçabilité documentaire
        incluse.
      </CardFooter>
    </Card>
  )
}
