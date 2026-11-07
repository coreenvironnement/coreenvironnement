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
  volumeFromBagsM3,
  volumeFromDimensionsM3,
  type VolumeRecommendation,
} from "@/lib/order/volume-estimator"
import type { BenneFamily } from "@/lib/prestations"
import { benneImageForVolume } from "@/lib/commande/benne-visual"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { VolumeEstimatorMeasureLottie } from "@/components/order/volume-estimator-measure-lottie"

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
    hint: "",
    imageFile: "Tas rectangulaire de gravats de chantier-2.png",
    imageAlt: "Tas rectangulaire de gravats de chantier",
  },
  {
    id: "irregular",
    label: "Tas irrégulier",
    hint: "",
    imageFile: "Tas de gravats de chantier-1.png",
    imageAlt: "Tas irrégulier de gravats de chantier",
  },
  {
    id: "bags",
    label: "Sac big bag",
    hint: "",
    imageFile: "Big bag rempli de gravats-3.png",
    imageAlt: "Big bag rempli de gravats",
  },
]

function EstimatorModeSelectionIndicator({
  selected,
  className,
}: {
  selected: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 bg-white shadow-sm",
        selected ? "border-brand-green" : "border-[#D0D5DD]",
        className
      )}
      aria-hidden
    >
      {selected ? <span className="size-2.5 rounded-full bg-brand-green" /> : null}
    </span>
  )
}

function EstimatorModeOptionCard({
  label,
  hint,
  imageFile,
  imageAlt,
  selected,
  onClick,
}: {
  label: string
  hint: string
  imageFile: string
  imageAlt: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 overflow-hidden rounded-xl border-2 bg-white text-left shadow-sm outline-none transition-[border-color,box-shadow]",
        "p-2.5 focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        "sm:flex-col sm:items-stretch sm:p-0",
        selected
          ? "border-brand-green ring-1 ring-brand-green/25"
          : "border-primary/12 hover:border-brand-green/35 sm:border-primary/12"
      )}
    >
      <div className="order-tunnel-estimator-card__media relative h-20 w-[100px] shrink-0 overflow-hidden rounded-lg bg-[#F2F4F7] sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none">
        <Image
          src={volumeEstimatorImageSrc(imageFile)}
          alt={imageAlt}
          fill
          className="object-contain p-0.5 sm:object-cover sm:p-0"
          sizes="(max-width: 640px) 100px, 200px"
        />
      </div>
      <span className="flex min-w-0 flex-1 items-center gap-2 sm:block sm:px-3 sm:pb-3 sm:pt-2.5">
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold leading-snug text-brand-navy sm:text-[14px]">
            {label}
          </span>
          {hint ? (
            <span className="mt-0.5 block text-[11px] leading-snug text-brand-muted sm:text-[12px]">
              {hint}
            </span>
          ) : null}
        </span>
        <EstimatorModeSelectionIndicator
          selected={selected}
          className="sm:hidden"
        />
      </span>
    </button>
  )
}

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

function KnownVolumeCard({
  volumeM3,
  selected,
  onSelect,
}: {
  volumeM3: number
  selected: boolean
  onSelect: () => void
}) {
  const imageSrc = benneImageForVolume(volumeM3)

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "relative isolate min-h-[5.25rem] overflow-hidden rounded-xl border-2 px-3 py-4 text-center shadow-sm transition-[border-color,box-shadow]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        selected
          ? "border-brand-green bg-primary/10 ring-1 ring-brand-green/20"
          : "border-primary/15 bg-white hover:border-brand-green/40"
      )}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        aria-hidden
        sizes="(max-width: 640px) 45vw, 220px"
        className={cn(
          "pointer-events-none object-contain object-bottom pb-0.5 transition-opacity duration-200",
          selected ? "opacity-40" : "opacity-[0.22]"
        )}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          selected
            ? "bg-gradient-to-t from-white/90 via-white/65 to-white/40"
            : "bg-gradient-to-t from-white/95 via-white/78 to-white/50"
        )}
        aria-hidden
      />
      <span className="relative z-10 block text-2xl font-bold tabular-nums text-brand-navy">
        {volumeM3}
      </span>
      <span className="relative z-10 text-[12px] font-semibold text-brand-muted">
        m³
      </span>
    </button>
  )
}

function VolumeDisclaimer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-brand-navy/10 bg-brand-warm-field/90 px-3.5 py-3 text-[12px] leading-snug text-brand-navy sm:text-[13px]",
        className
      )}
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
  /** Adresse non encore renseignée : libellé CTA orienté commande. */
  addressPending?: boolean
  /** Parcours vitrine « Estimer mon volume » : pas d’étape connaître / estimer. */
  estimateOnly?: boolean
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
  addressPending = false,
  estimateOnly = false,
  onBackToWaste,
  onContinue,
}: ParticulierVolumeStepProps) {
  const isPro = audience === "professionnel"
  const volumes = useMemo(() => availableVolumesForFamily(family), [family])
  const [view, setView] = useState<View>(estimateOnly ? "estimator-mode" : "choice")
  const [estimatorMode, setEstimatorMode] = useState<EstimatorMode>("regular")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [bagCount, setBagCount] = useState("")
  const [litersPerBag, setLitersPerBag] = useState("1000")
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
    setLitersPerBag("1000")
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
    const rec = recommendBenneVolume(estimated, family, wasteId ?? null)
    setResult(rec)
  }, [
    bagCount,
    estimatorMode,
    family,
    height,
    length,
    litersPerBag,
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
    if (view === "result" && estimateOnly) {
      resetEstimatorInputs()
      setView("estimator-mode")
      return
    }
    if (view === "estimator-mode") {
      if (estimateOnly) {
        onBackToWaste()
        return
      }
      resetEstimatorInputs()
      setView("choice")
      return
    }
    if (view === "result") {
      resetEstimatorInputs()
      setView(estimateOnly ? "estimator-mode" : "choice")
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
        ? "Choisissez votre volume"
        : view === "estimator-mode"
          ? "À quoi ressemble vos déchets ?"
          : view === "estimator-form"
            ? estimatorMode === "bags"
              ? "Combien de sacs ?"
              : "Vos mesures (en mètres)"
            : view === "result"
              ? "Votre volume"
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
          {view === "choice" && !estimateOnly ? (
            <p className="mt-1 text-[12px] leading-snug text-brand-muted sm:text-[13px]">
              Vous connaissez le volume ou vous préférez estimer ?
            </p>
          ) : null}
        </div>
      </div>

      {!estimateOnly && view === "known" ? <VolumeDisclaimer /> : null}
      {view === "result" ? <VolumeDisclaimer /> : null}

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
            <div
              className="grid grid-cols-2 gap-2.5 sm:gap-3"
              role="group"
              aria-label="Volumes de benne disponibles"
            >
              {volumes.map((v) => (
                <KnownVolumeCard
                  key={v}
                  volumeM3={v}
                  selected={knownPick === v}
                  onSelect={() => setKnownPick(v)}
                />
              ))}
            </div>
          </motion.div>
        ) : null}

        {view === "estimator-mode" ? (
          <motion.div
            key="est-mode"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-3"
            role="radiogroup"
            aria-label="Méthode d'estimation du volume"
          >
            {ESTIMATOR_MODE_OPTIONS.map((item) => (
              <EstimatorModeOptionCard
                key={item.id}
                label={item.label}
                hint={item.hint}
                imageFile={item.imageFile}
                imageAlt={item.imageAlt}
                selected={estimatorMode === item.id}
                onClick={() => {
                  setEstimatorMode(item.id)
                  setView("estimator-form")
                }}
              />
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
            <VolumeEstimatorMeasureLottie mode={estimatorMode} />
            {estimatorMode !== "bags" ? (
              <div className="grid grid-cols-3 gap-2 [&_label]:min-w-0">
                <DimField label="Longueur (m)" value={length} onChange={setLength} />
                <DimField label="Largeur (m)" value={width} onChange={setWidth} />
                <DimField
                  label={
                    estimatorMode === "irregular"
                      ? "Hauteur moy. (m)"
                      : "Hauteur (m)"
                  }
                  value={height}
                  onChange={setHeight}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 [&_label]:min-w-0">
                <DimField
                  label="Nombre de sacs"
                  value={bagCount}
                  onChange={setBagCount}
                />
                <DimField
                  label="Volume par sac (L)"
                  value={litersPerBag}
                  onChange={setLitersPerBag}
                />
              </div>
            )}

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
                  Capacité <strong>indicative</strong> :{" "}
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
              {addressPending
                ? "Je souhaite commander cette benne"
                : isPro
                  ? "Voir les forfaits adaptés"
                  : "Voir les bennes adaptées"}
            </OrderTunnelContinueButton>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {view === "known" ? (
        <div
          className={cn(
            embedded && "order-tunnel-step-nav"
          )}
        >
          <OrderTunnelContinueButton
            disabled={knownPick === null}
            onClick={() => onContinue(knownPick, "chosen")}
          >
            {addressPending
              ? "Je souhaite commander cette benne"
              : isPro
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
