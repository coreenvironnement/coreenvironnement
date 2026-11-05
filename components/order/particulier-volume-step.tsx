"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  Box,
  Info,
  Loader2,
  Phone,
  Ruler,
  Sparkles,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { OrderTunnelContinueButton } from "@/components/order/order-tunnel-continue-button"
import type { OrderAudience } from "@/components/order/order-audience-toggle"
import type { ParticulierWasteOptionId } from "@/lib/order/particulier-waste-options"
import {
  availableVolumesForFamily,
  recommendBenneVolume,
  recommendedMarginPercentForFamily,
  recommendedMarginPercentForWaste,
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

function volumeEstimatorImageSrc(imageFile: string): string {
  return `/images/${encodeURIComponent(imageFile)}`
}

const ESTIMATOR_MODE_OPTIONS: ReadonlyArray<{
  id: EstimatorMode
  label: string
  hint: string
  imageFile: string
  imageAlt: string
}> = [
  {
    id: "regular",
    label: "Tas régulier",
    hint: "Longueur × largeur × hauteur (m)",
    imageFile: "Tas rectangulaire de gravats de chantier-2.png",
    imageAlt: "Tas rectangulaire de gravats de chantier",
  },
  {
    id: "irregular",
    label: "Tas irrégulier",
    hint: "L × l × hauteur moyenne estimée",
    imageFile: "Tas de gravats de chantier-1.png",
    imageAlt: "Tas irrégulier de gravats de chantier",
  },
  {
    id: "bags",
    label: "Sacs / litres",
    hint: "Nombre × capacité (100 L = 0,1 m³)",
    imageFile: "Big bag rempli de gravats-3.png",
    imageAlt: "Big bag rempli de gravats",
  },
]

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

function defaultVolumeMarginPercent(
  family: BenneFamily,
  wasteId: ParticulierWasteOptionId | null
): number {
  if (wasteId) return recommendedMarginPercentForWaste(wasteId)
  return recommendedMarginPercentForFamily(family)
}

function VolumeDisclaimer() {
  return (
    <div
      className="rounded-xl border border-brand-navy/10 bg-brand-warm-field/90 px-3.5 py-3 text-[12px] leading-snug text-brand-navy sm:text-[13px]"
      role="note"
    >
      <div className="flex gap-2">
        <Info
          className="mt-0.5 size-4 shrink-0 text-brand-green"
          aria-hidden
        />
        <p>
          L&apos;estimation reste indicative : la forme du tas, la nature des
          déchets et leur poids influencent le choix de la benne. Vérifiez
          également les limites de poids et de remplissage indiquées pour la
          benne choisie.
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
  selected,
  accent,
}: {
  title: string
  description: string
  icon: typeof Ruler
  onClick: () => void
  selected?: boolean
  accent?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex w-full flex-col rounded-2xl border-2 p-4 text-left shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/45 focus-visible:ring-offset-2",
        selected
          ? "border-brand-green bg-brand-green/5 shadow-md ring-1 ring-brand-green/20"
          : accent
            ? "border-brand-green/40 bg-gradient-to-br from-white to-brand-warm-field hover:border-brand-green hover:shadow-md"
            : "border-primary/15 bg-white hover:border-brand-green/30 hover:shadow-md"
      )}
    >
      <span
        className={cn(
          "mb-3 inline-flex size-11 items-center justify-center rounded-xl",
          accent ? "bg-brand-green/15 text-brand-green" : "bg-brand-green/8 text-brand-navy"
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
        <div className="relative flex size-16 items-center justify-center rounded-full bg-brand-green text-white shadow-lg">
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
      <div className="h-1 w-full max-w-[200px] overflow-hidden rounded-full bg-brand-green/10">
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
  /** Particulier : option déchet UI. Pro : omis (catalogue familial). */
  wasteId?: ParticulierWasteOptionId | null
  audience?: OrderAudience
  embedded?: boolean
  onBackToWaste: () => void
  onContinue: (
    volumeM3: number | null,
    origin: "estimated" | "chosen"
  ) => void
}

export function ParticulierVolumeStep({
  family,
  wasteId = null,
  audience = "particulier",
  embedded,
  onBackToWaste,
  onContinue,
}: ParticulierVolumeStepProps) {
  const isPro = audience === "professionnel"
  const volumes = useMemo(() => availableVolumesForFamily(family), [family])
  const [view, setView] = useState<View>("choice")
  const [estimatorMode, setEstimatorMode] = useState<EstimatorMode>("regular")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [bagCount, setBagCount] = useState("")
  const [litersPerBag, setLitersPerBag] = useState("100")
  const [marginPercent, setMarginPercent] = useState(() =>
    defaultVolumeMarginPercent(family, wasteId)
  )
  const [result, setResult] = useState<VolumeRecommendation | null>(null)
  const [knownPick, setKnownPick] = useState<number | null>(null)
  const [choiceHighlight, setChoiceHighlight] = useState<"known" | "estimate" | null>(
    null
  )

  const resetEstimatorInputs = () => {
    setLength("")
    setWidth("")
    setHeight("")
    setBagCount("")
    setLitersPerBag("100")
    setMarginPercent(defaultVolumeMarginPercent(family, wasteId))
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
    const rec = recommendBenneVolume(estimated, family, wasteId ?? null, marginPercent)
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
      ? "Quel volume de déchets souhaitez-vous évacuer ?"
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
              Choisissez un volume si vous le connaissez, ou utilisez
              l&apos;estimateur pour vous aider à l&apos;évaluer.
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
              description="Sélectionnez directement le volume correspondant à votre besoin."
              icon={Box}
              selected={choiceHighlight === "known"}
              onClick={() => {
                setChoiceHighlight("known")
                setView("known")
              }}
            />
            <ChoiceCard
              title="J'ai besoin d'une estimation"
              description="Estimez votre volume à partir des dimensions du tas ou du nombre de sacs."
              icon={Sparkles}
              accent
              selected={choiceHighlight === "estimate"}
              onClick={() => {
                setChoiceHighlight("estimate")
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
                      ? "border-brand-green bg-primary/10 shadow-sm"
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
            className="grid gap-3 sm:grid-cols-3"
          >
            {ESTIMATOR_MODE_OPTIONS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setEstimatorMode(item.id)
                  setView("estimator-form")
                }}
                className="flex flex-col overflow-hidden rounded-xl border-2 border-primary/12 bg-white text-left shadow-sm transition-[border-color,box-shadow] hover:border-brand-green/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
              >
                <div className="relative aspect-[4/3] w-full bg-[#F2F4F7]">
                  <Image
                    src={volumeEstimatorImageSrc(item.imageFile)}
                    alt={item.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 88vw, 200px"
                  />
                </div>
                <span className="px-2.5 pb-3 pt-2.5 sm:px-3">
                  <span className="block text-[14px] font-semibold text-brand-navy">
                    {item.label}
                  </span>
                  <span className="mt-0.5 block text-[12px] leading-snug text-brand-muted">
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
              {wasteId === "terre_cailloux" ? (
                <p className="text-[12px] leading-snug text-brand-muted">
                  Marge recommandée 20&nbsp;% pour terre et cailloux
                </p>
              ) : null}
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
            <div className="rounded-2xl border-2 border-brand-green/15 bg-gradient-to-br from-white to-brand-warm-field p-4 text-center shadow-sm">
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

            {result.extraBennesMessage ? (
              <div
                className="rounded-xl border border-brand-green/20 bg-brand-green/5 px-3.5 py-3 text-[13px] leading-snug text-brand-navy"
                role="status"
              >
                {result.extraBennesMessage}
              </div>
            ) : null}

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
              onClick={() =>
                onContinue(result.recommendedVolumeM3, "estimated")
              }
            >
              {isPro ? "Voir les forfaits adaptés" : "Voir les bennes adaptées"}
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
            onClick={() => onContinue(knownPick, "chosen")}
          >
            {isPro
              ? "Continuer vers le choix de forfait"
              : "Continuer vers le choix de benne"}
          </OrderTunnelContinueButton>
        </div>
      ) : null}

      {view === "choice" ? (
        <p className="py-1 text-center text-[13px] text-brand-muted">
          Besoin d&apos;un conseil ?{" "}
          <a
            href={SITE_PHONE_HREF}
            className="font-semibold text-brand-green hover:text-brand-green-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
          >
            {SITE_PHONE_DISPLAY}
          </a>
        </p>
      ) : null}
    </div>
  )
}
