"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertTriangle,
  ArrowLeft,
  Box,
  Layers,
  Loader2,
  Phone,
  Ruler,
  ShoppingBag,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { OrderTunnelContinueButton } from "@/components/order/order-tunnel-continue-button"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"
import {
  availableVolumesForFamily,
  recommendBenneVolume,
  volumeFromBagsM3,
  volumeFromDimensionsM3,
  type VolumeRecommendation,
} from "@/lib/order/volume-estimator"
import type { BenneFamily } from "@/lib/prestations"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

type View =
  | "choice"
  | "known"
  | "estimator-mode"
  | "estimator-form"
  | "computing"
  | "result"

type EstimatorMode = "regular" | "irregular" | "bags"

const LOADING_MS = 950
const LOADING_STEPS = [
  "Volume estimé…",
  "Type de déchet…",
  "Capacité indicative…",
] as const

function parseDim(raw: string): number {
  const n = parseFloat(raw.replace(",", "."))
  return Number.isFinite(n) && n > 0 ? n : 0
}

function VolumeDisclaimer() {
  return (
    <div
      className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-3.5 py-3 text-[12px] leading-snug text-amber-950 sm:text-[13px]"
      role="note"
    >
      <div className="flex gap-2">
        <AlertTriangle
          className="mt-0.5 size-4 shrink-0 text-amber-700"
          aria-hidden
        />
        <p>
          Outil d&apos;aide à la décision,{" "}
          <strong>sans garantie</strong>. Aucun calculateur n&apos;est fiable à
          100&nbsp;% : forme du tas, foisonnement et remplissage réel peuvent
          fausser le résultat.{" "}
          <strong>Vous restez responsable</strong> du volume et du poids
          chargés.
        </p>
      </div>
    </div>
  )
}

function ChoiceCard({
  title,
  description,
  icon: Icon,
  onClick,
  accent,
}: {
  title: string
  description: string
  icon: typeof Ruler
  onClick: () => void
  accent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col rounded-2xl border-2 p-4 text-left shadow-sm transition-all",
        accent
          ? "border-brand-green/40 bg-gradient-to-br from-white to-brand-warm-field hover:border-brand-green hover:shadow-md"
          : "border-primary/15 bg-white hover:border-brand-navy/30 hover:shadow-md"
      )}
    >
      <span
        className={cn(
          "mb-3 inline-flex size-11 items-center justify-center rounded-xl",
          accent ? "bg-brand-green/15 text-brand-green" : "bg-brand-navy/8 text-brand-navy"
        )}
      >
        <Icon className="size-5" strokeWidth={2} aria-hidden />
      </span>
      <span className="text-[15px] font-bold leading-snug text-brand-navy">
        {title}
      </span>
      <span className="mt-1.5 text-[12px] leading-snug text-brand-muted sm:text-[13px]">
        {description}
      </span>
    </button>
  )
}

function DimField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <label className="block space-y-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
        {label}
      </span>
      <Input
        inputMode="decimal"
        placeholder="0"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 border-2 border-primary/15 bg-white text-base font-medium text-brand-navy"
      />
    </label>
  )
}

function ComputingOverlay({ onDone }: { onDone: () => void }) {
  const [stepIdx, setStepIdx] = useState(0)

  useEffect(() => {
    const stepTimer = window.setInterval(() => {
      setStepIdx((i) => Math.min(i + 1, LOADING_STEPS.length - 1))
    }, LOADING_MS / LOADING_STEPS.length)

    const doneTimer = window.setTimeout(() => {
      window.clearInterval(stepTimer)
      onDone()
    }, LOADING_MS)

    return () => {
      window.clearInterval(stepTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 px-4 py-8 text-center">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-brand-green/20" />
        <div className="relative flex size-16 items-center justify-center rounded-full bg-brand-navy text-white shadow-lg">
          <Loader2 className="size-8 animate-spin" aria-hidden />
        </div>
      </div>
      <div>
        <p className="text-[15px] font-bold text-brand-navy">
          Analyse de votre estimation
        </p>
        <p className="mt-1 text-[13px] text-brand-muted" aria-live="polite">
          {LOADING_STEPS[stepIdx]}
        </p>
      </div>
      <div className="h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-brand-navy/10">
        <motion.div
          className="h-full rounded-full bg-brand-green"
          initial={{ width: "8%" }}
          animate={{ width: "100%" }}
          transition={{ duration: LOADING_MS / 1000, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

export type ParticulierVolumeStepProps = {
  family: BenneFamily
  wasteId: ParticulierWasteOptionId
  embedded?: boolean
  onBackToWaste: () => void
  onContinue: (knownVolumeM3: number | null) => void
}

export function ParticulierVolumeStep({
  family,
  wasteId,
  embedded,
  onBackToWaste,
  onContinue,
}: ParticulierVolumeStepProps) {
  const volumes = useMemo(() => availableVolumesForFamily(family), [family])
  const [view, setView] = useState<View>("choice")
  const [estimatorMode, setEstimatorMode] = useState<EstimatorMode>("regular")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [bagCount, setBagCount] = useState("")
  const [litersPerBag, setLitersPerBag] = useState("100")
  const [marginPercent, setMarginPercent] = useState(10)
  const [result, setResult] = useState<VolumeRecommendation | null>(null)
  const [knownPick, setKnownPick] = useState<number | null>(null)

  const resetEstimatorInputs = () => {
    setLength("")
    setWidth("")
    setHeight("")
    setBagCount("")
    setLitersPerBag("100")
    setMarginPercent(10)
    setResult(null)
  }

  const runEstimate = useCallback(() => {
    let estimated = 0
    if (estimatorMode === "bags") {
      estimated = volumeFromBagsM3(
        parseDim(bagCount),
        parseDim(litersPerBag)
      )
    } else {
      estimated = volumeFromDimensionsM3(
        parseDim(length),
        parseDim(width),
        parseDim(height)
      )
    }
    const rec = recommendBenneVolume(estimated, family, wasteId, marginPercent)
    setResult(rec)
  }, [
    bagCount,
    estimatorMode,
    family,
    height,
    length,
    litersPerBag,
    marginPercent,
    wasteId,
    width,
  ])

  const canCompute =
    estimatorMode === "bags"
      ? parseDim(bagCount) > 0 && parseDim(litersPerBag) > 0
      : parseDim(length) > 0 &&
        parseDim(width) > 0 &&
        parseDim(height) > 0

  const headerBack = () => {
    if (view === "choice") {
      onBackToWaste()
      return
    }
    if (view === "known") {
      setView("choice")
      setKnownPick(null)
      return
    }
    if (view === "estimator-mode" || view === "result") {
      resetEstimatorInputs()
      setView("choice")
      return
    }
    if (view === "estimator-form") {
      setView("estimator-mode")
      return
    }
  }

  const title =
    view === "choice"
      ? "Quelle capacité de benne vous faut-il ?"
      : view === "known"
        ? "Je connais le volume dont j’ai besoin"
        : view === "estimator-mode"
          ? "Comment estimer votre volume ?"
          : view === "estimator-form"
            ? estimatorMode === "bags"
              ? "Sacs ou contenants"
              : estimatorMode === "irregular"
                ? "Tas irrégulier (m³)"
                : "Tas régulier (m³)"
            : view === "result"
              ? "Estimation indicative"
              : ""

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5">
        <button
          type="button"
          aria-label="Retour"
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg border-2 border-brand-green/35 bg-white text-brand-navy shadow-sm transition-colors hover:border-brand-green hover:bg-brand-warm-field"
          onClick={headerBack}
        >
          <ArrowLeft className="size-[18px] text-brand-green" aria-hidden />
        </button>
        <div className="min-w-0 flex-1 pt-0.5">
          <h3 className="text-[17px] font-bold leading-snug text-brand-navy sm:text-[18px]">
            {title}
          </h3>
          {view === "choice" ? (
            <p className="mt-1 text-[12px] leading-snug text-brand-muted sm:text-[13px]">
              Le volume en m³ aide à choisir ; le type de déchet et le poids
              comptent aussi.
            </p>
          ) : null}
        </div>
      </div>

      <VolumeDisclaimer />

      <AnimatePresence mode="wait">
        {view === "choice" ? (
          <motion.div
            key="choice"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="grid gap-3 sm:grid-cols-2"
          >
            <ChoiceCard
              title="Je connais le volume"
              description="Vous savez déjà si vous avez besoin de 8, 10, 15 m³ ou plus."
              icon={Box}
              onClick={() => setView("known")}
            />
            <ChoiceCard
              title="Je ne sais pas — estimer"
              description="Calculez un ordre de grandeur à partir des dimensions ou des sacs."
              icon={Sparkles}
              accent
              onClick={() => {
                resetEstimatorInputs()
                setView("estimator-mode")
              }}
            />
          </motion.div>
        ) : null}

        {view === "known" ? (
          <motion.div
            key="known"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="space-y-3"
          >
            <p className="text-[13px] text-brand-muted">
              Capacités disponibles pour votre type de déchet :
            </p>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {volumes.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setKnownPick(v)}
                  className={cn(
                    "rounded-xl border-2 px-3 py-4 text-center transition-colors",
                    knownPick === v
                      ? "border-brand-navy bg-primary/10 shadow-sm"
                      : "border-primary/15 bg-white hover:border-brand-green/40"
                  )}
                >
                  <span className="block text-2xl font-bold tabular-nums text-brand-navy">
                    {v}
                  </span>
                  <span className="text-[12px] font-medium text-brand-muted">
                    m³
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}

        {view === "estimator-mode" ? (
          <motion.div
            key="est-mode"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2.5"
          >
            {(
              [
                {
                  id: "regular" as const,
                  label: "Tas régulier",
                  hint: "Longueur × largeur × hauteur (m)",
                  icon: Box,
                },
                {
                  id: "irregular" as const,
                  label: "Tas irrégulier",
                  hint: "L × l × hauteur moyenne estimée",
                  icon: Layers,
                },
                {
                  id: "bags" as const,
                  label: "Sacs / litres",
                  hint: "Nombre × capacité (100 L = 0,1 m³)",
                  icon: ShoppingBag,
                },
              ] as const
            ).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setEstimatorMode(item.id)
                  setView("estimator-form")
                }}
                className="flex w-full items-center gap-3 rounded-xl border-2 border-primary/12 bg-white px-3.5 py-3.5 text-left hover:border-brand-green/35"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-navy/8 text-brand-navy">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="block text-[14px] font-semibold text-brand-navy">
                    {item.label}
                  </span>
                  <span className="block text-[12px] text-brand-muted">
                    {item.hint}
                  </span>
                </span>
              </button>
            ))}
          </motion.div>
        ) : null}

        {view === "estimator-form" ? (
          <motion.div
            key="est-form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {estimatorMode !== "bags" ? (
              <>
                <p className="text-[12px] leading-snug text-brand-muted">
                  {estimatorMode === "irregular"
                    ? "Mesurez la longueur et la largeur max du tas, puis estimez une hauteur moyenne."
                    : "Exprimez chaque dimension en mètres. Ex. 3 × 2 × 1 = 6 m³."}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <DimField label="Long. (m)" value={length} onChange={setLength} />
                  <DimField label="Larg. (m)" value={width} onChange={setWidth} />
                  <DimField
                    label={estimatorMode === "irregular" ? "H. moy." : "Haut. (m)"}
                    value={height}
                    onChange={setHeight}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-[12px] leading-snug text-brand-muted">
                  1 000 litres = 1 m³. Ex. 20 sacs de 100 L ≈ 2 m³.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <DimField label="Nombre de sacs" value={bagCount} onChange={setBagCount} />
                  <DimField
                    label="Litres / sac"
                    value={litersPerBag}
                    onChange={setLitersPerBag}
                  />
                </div>
              </>
            )}

            <label className="block space-y-2">
              <span className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide text-brand-muted">
                <span>Marge de prudence</span>
                <span className="tabular-nums text-brand-navy">{marginPercent} %</span>
              </span>
              <input
                type="range"
                min={0}
                max={20}
                step={5}
                value={marginPercent}
                onChange={(e) => setMarginPercent(Number(e.target.value))}
                className="h-2 w-full accent-brand-green"
              />
            </label>

            <OrderTunnelContinueButton
              disabled={!canCompute}
              onClick={() => setView("computing")}
            >
              Calculer mon volume
            </OrderTunnelContinueButton>
          </motion.div>
        ) : null}

        {view === "computing" ? (
          <motion.div key="computing" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ComputingOverlay
              onDone={() => {
                runEstimate()
                setView("result")
              }}
            />
          </motion.div>
        ) : null}

        {view === "result" && result ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="rounded-2xl border-2 border-brand-navy/15 bg-gradient-to-br from-white to-brand-warm-field p-4 text-center shadow-sm">
              <p className="text-[12px] font-semibold uppercase tracking-wide text-brand-muted">
                Volume estimé
              </p>
              <p className="mt-1 text-4xl font-bold tabular-nums text-brand-navy">
                ≈ {result.estimatedM3}
                <span className="ml-1 text-xl font-semibold">m³</span>
              </p>
              {result.recommendedVolumeM3 ? (
                <p className="mt-3 text-[14px] leading-snug text-brand-navy">
                  Capacité{" "}
                  <strong>indicative</strong> avec marge :{" "}
                  <strong>{result.recommendedVolumeM3} m³</strong>
                </p>
              ) : null}
            </div>

            {result.note ? (
              <p className="text-[12px] leading-snug text-brand-muted">{result.note}</p>
            ) : null}

            <a
              href={SITE_PHONE_HREF}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-brand-green/35 bg-white py-3 text-[14px] font-semibold text-brand-navy transition-colors hover:bg-brand-warm-field"
            >
              <Phone className="size-4 text-brand-green" aria-hidden />
              Conseil : {SITE_PHONE_DISPLAY}
            </a>

            <OrderTunnelContinueButton
              disabled={!result.recommendedVolumeM3}
              onClick={() => onContinue(result.recommendedVolumeM3)}
            >
              Voir les bennes adaptées
            </OrderTunnelContinueButton>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {view === "known" ? (
        <div
          className={cn(
            embedded &&
              "sticky bottom-0 z-20 -mx-4 border-t border-primary/10 bg-gradient-to-t from-brand-warm via-brand-warm/95 to-brand-warm/80 px-4 pb-1 pt-3 sm:-mx-6 sm:px-6"
          )}
        >
          <OrderTunnelContinueButton
            disabled={knownPick === null}
            onClick={() => onContinue(knownPick)}
          >
            Continuer vers le choix de benne
          </OrderTunnelContinueButton>
        </div>
      ) : null}

      {view === "choice" ? (
        <a
          href={SITE_PHONE_HREF}
          className="flex items-center justify-center gap-2 py-1 text-[13px] font-semibold text-brand-green hover:text-[#19752B]"
        >
          <Phone className="size-4" aria-hidden />
          Un renseignement ? {SITE_PHONE_DISPLAY}
        </a>
      ) : null}
    </div>
  )
}
