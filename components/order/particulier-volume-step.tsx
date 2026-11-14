"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ChevronRight, Info, Pencil } from "lucide-react"
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
import { benneLabelForVolume } from "@/lib/order/benne-display-labels"
import {
  benneImageAltForVolume,
  benneImageForVolume,
} from "@/lib/commande/benne-visual"
import { SITE_IMAGES } from "@/lib/media/site-images"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { LoaderCore } from "@/components/ui/loader-core"
import { VolumeEstimatorMeasureLottie } from "@/components/order/volume-estimator-measure-lottie"

type View =
  | "choice"
  | "known"
  | "estimator-mode"
  | "estimator-form"
  | "computing"
  | "result"

type EstimatorMode = "regular" | "irregular" | "bags"

const VOLUME_INTENT_KNOWN = {
  src: SITE_IMAGES.tunnel.benneGravatsVue,
  alt: "Benne de location verte — choisir directement la capacité en m³",
} as const

const VOLUME_INTENT_GUIDE = {
  src: SITE_IMAGES.tunnel.ampouleVolume,
  alt: "Illustration pour l’estimation guidée du volume de benne",
} as const

const VOLUME_RESULT_PHONE = {
  src: SITE_IMAGES.tunnel.telephoneVolume,
  alt: "Appeler pour affiner le volume de benne recommandé",
} as const

function totalBennesForRecommendation(
  estimatedM3: number,
  recommendedVolumeM3: number
): number {
  if (recommendedVolumeM3 <= 0) return 1
  return Math.max(1, Math.ceil(estimatedM3 / recommendedVolumeM3))
}

const ESTIMATOR_MODE_OPTIONS: ReadonlyArray<{
  id: EstimatorMode
  label: string
  hint: string
  imageSrc: string
  imageAlt: string
}> = [
  {
    id: "regular",
    label: "Tas régulier",
    hint: "",
    imageSrc: SITE_IMAGES.tunnel.volumeRectangulaire,
    imageAlt: "Tas rectangulaire de gravats de chantier pour estimer le volume",
  },
  {
    id: "irregular",
    label: "Tas irrégulier",
    hint: "",
    imageSrc: SITE_IMAGES.tunnel.volumeIrregulier,
    imageAlt: "Tas irrégulier de gravats pour estimer le volume de benne",
  },
  {
    id: "bags",
    label: "Sac big bag",
    hint: "",
    imageSrc: SITE_IMAGES.tunnel.volumeBigBag,
    imageAlt: "Big bag rempli de gravats pour l’estimation en sacs",
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
  imageSrc,
  imageAlt,
  selected,
  onClick,
}: {
  label: string
  hint: string
  imageSrc: string
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
        "order-tunnel-estimator-card flex w-full items-center gap-2.5 overflow-hidden rounded-xl border-2 bg-white text-left shadow-sm outline-none transition-[border-color,box-shadow]",
        "p-2.5 focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2",
        "sm:flex-col sm:items-stretch sm:p-0",
        selected
          ? "border-brand-green ring-1 ring-brand-green/25"
          : "border-primary/12 hover:border-brand-green/35 sm:border-primary/12"
      )}
    >
      <div className="order-tunnel-estimator-card__media relative h-20 w-[100px] shrink-0 overflow-hidden rounded-lg bg-[#F2F4F7] sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain p-0.5 sm:object-cover sm:p-0 lg:object-contain"
          sizes="(max-width: 640px) 100px, 200px"
        />
      </div>
      <span className="order-tunnel-estimator-card__body flex min-w-0 flex-1 items-center gap-2 sm:block sm:px-3 sm:pb-3 sm:pt-2.5">
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

const LOADING_MS = 1020
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
        "order-tunnel-known-volume-card relative isolate min-h-[5.25rem] overflow-hidden rounded-xl border-2 px-3 py-4 text-center shadow-sm transition-[border-color,box-shadow]",
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

function VolumeIntentChoiceCard({
  title,
  description,
  imageSrc,
  imageAlt,
  onClick,
}: {
  title: string
  description: string
  imageSrc: string
  imageAlt: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="order-tunnel-volume-intent-card"
    >
      <span className="order-tunnel-volume-intent-card__icon">
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={56}
          height={56}
          className="size-full object-contain"
        />
      </span>
      <span className="order-tunnel-volume-intent-card__body">
        <span className="order-tunnel-volume-intent-card__title">{title}</span>
        <span className="order-tunnel-volume-intent-card__desc">{description}</span>
      </span>
      <ChevronRight
        className="order-tunnel-volume-intent-card__arrow shrink-0 text-brand-green"
        strokeWidth={2.25}
        aria-hidden
      />
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
      <LoaderCore caption={LOADING_STEPS[stepIdx]} />
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
  onViewChange?: (view: View) => void
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
  onViewChange,
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

  useEffect(() => {
    onViewChange?.(view)
  }, [view, onViewChange])

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

  const resultTotalBennes = useMemo(() => {
    if (!result?.recommendedVolumeM3) return 1
    return totalBennesForRecommendation(
      result.estimatedM3,
      result.recommendedVolumeM3
    )
  }, [result])

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
      ? "Quelle benne vous faut-il ?"
      : view === "known"
        ? "Choisissez votre volume"
        : view === "estimator-mode"
          ? "À quoi ressemblent vos déchets ?"
          : view === "estimator-form"
            ? estimatorMode === "bags"
              ? "Combien de sacs ?"
              : "Vos mesures (en mètres)"
            : view === "result"
              ? "Votre volume"
              : ""

  const isVolumeIntentChoice = view === "choice" && !estimateOnly

  return (
    <div className={cn(!embedded && "space-y-4")}>
      <div
        className={cn(
          embedded ? "order-tunnel-step__stack space-y-4" : "space-y-4",
          embedded &&
            isVolumeIntentChoice &&
            "order-tunnel-volume-intent-choice order-tunnel-volume-intent-choice--embedded"
        )}
      >
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
          {isVolumeIntentChoice ? (
            <p className="mt-1 text-[12px] leading-snug text-brand-muted sm:text-[13px]">
              Choisissez directement ou laissez-vous guider.
            </p>
          ) : null}
        </div>
      </div>

      {!estimateOnly && view === "known" ? <VolumeDisclaimer /> : null}
      {view === "result" ? <VolumeDisclaimer /> : null}

      <AnimatePresence mode="wait">
        {view === "choice" ? (
          <div
            key="choice"
            className="order-tunnel-volume-intent-choice__cards"
            role="group"
            aria-label="Comment choisir votre benne"
          >
            <VolumeIntentChoiceCard
              title="Je choisis ma benne"
              description="Je connais déjà la taille dont j’ai besoin."
              imageSrc={VOLUME_INTENT_KNOWN.src}
              imageAlt={VOLUME_INTENT_KNOWN.alt}
              onClick={() => setView("known")}
            />
            <VolumeIntentChoiceCard
              title="Aidez-moi à choisir"
              description="On vous aide à estimer le volume adapté."
              imageSrc={VOLUME_INTENT_GUIDE.src}
              imageAlt={VOLUME_INTENT_GUIDE.alt}
              onClick={() => {
                resetEstimatorInputs()
                setView("estimator-mode")
              }}
            />
          </div>
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
              className={cn(
                "grid grid-cols-2 gap-2.5 sm:gap-3",
                embedded && "order-tunnel-known-volume-grid"
              )}
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
            className={cn(
              "flex flex-col gap-2 sm:grid sm:grid-cols-3 sm:gap-3",
              embedded && "order-tunnel-estimator-grid"
            )}
            role="radiogroup"
            aria-label="Méthode d'estimation du volume"
          >
            {ESTIMATOR_MODE_OPTIONS.map((item) => (
              <EstimatorModeOptionCard
                key={item.id}
                label={item.label}
                hint={item.hint}
                imageSrc={item.imageSrc}
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
            className="order-tunnel-volume-result space-y-4"
          >
            <h2 className="text-center text-[20px] font-bold leading-snug text-brand-navy sm:text-[22px]">
              Votre estimation est prête
            </h2>

            {result.recommendedVolumeM3 ? (
              <div className="overflow-hidden rounded-2xl border-2 border-[#35A238] bg-[#EEF5EE] shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-stretch">
                  <div className="relative mx-auto aspect-[4/3] w-full max-w-[220px] shrink-0 bg-[#E8F0E8] sm:mx-0 sm:max-w-none sm:w-[42%] sm:min-h-[168px]">
                    <Image
                      src={benneImageForVolume(result.recommendedVolumeM3)}
                      alt={benneImageAltForVolume(result.recommendedVolumeM3)}
                      fill
                      sizes="(max-width: 640px) 220px, 240px"
                      className="object-contain p-3"
                    />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col justify-center gap-2.5 px-4 py-4 text-center sm:px-5 sm:py-5 sm:text-left">
                    <p className="text-[17px] font-bold leading-snug text-brand-navy sm:text-[18px]">
                      {benneLabelForVolume(
                        family,
                        result.recommendedVolumeM3,
                        wasteId ?? undefined
                      )}
                    </p>
                    <span className="mx-auto inline-flex w-fit items-center rounded-full bg-[#D9EBDA] px-3 py-1 text-[12px] font-semibold text-[#19752B] sm:mx-0">
                      1 benne pour cette commande
                    </span>
                    <p className="text-[14px] leading-snug text-brand-navy">
                      Votre estimation : environ{" "}
                      <span className="font-semibold tabular-nums">
                        {result.estimatedM3} m³
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-[14px] leading-snug text-brand-muted">
                {result.note ??
                  "Indiquez des mesures valides pour obtenir une recommandation."}
              </p>
            )}

            {result.recommendedVolumeM3 && resultTotalBennes > 1 ? (
              <div
                className="rounded-xl border border-[#35A238]/35 bg-[#EEF5EE] px-4 py-3.5 text-center sm:text-left"
                role="status"
              >
                <p className="text-[15px] font-bold leading-snug text-brand-navy">
                  Environ {resultTotalBennes} bennes au total
                </p>
                <p className="mt-1 text-[13px] leading-snug text-brand-navy">
                  Vous commandez une benne à la fois.
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
              <OrderTunnelContinueButton
                className="sm:min-w-0 sm:flex-1"
                disabled={!result.recommendedVolumeM3}
                onClick={() =>
                  onContinue(result.recommendedVolumeM3, "estimated")
                }
              >
                Continuer avec 1 benne
              </OrderTunnelContinueButton>
              <button
                type="button"
                onClick={() => setView("estimator-form")}
                className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-[#35A238] bg-white px-4 text-[15px] font-semibold text-brand-navy shadow-sm transition-colors hover:bg-[#EEF5EE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35A238]/45 focus-visible:ring-offset-2 sm:min-w-0 sm:flex-1"
              >
                <Pencil
                  className="size-5 shrink-0 text-[#35A238]"
                  strokeWidth={2}
                  aria-hidden
                />
                Modifier mes mesures
              </button>
            </div>

            <p className="flex flex-wrap items-center justify-center gap-1.5 text-center text-[13px] leading-snug text-brand-muted">
              <span>Une question ?</span>
              <Image
                src={VOLUME_RESULT_PHONE.src}
                alt={VOLUME_RESULT_PHONE.alt}
                width={22}
                height={22}
                className="size-[22px] shrink-0 object-contain"
              />
              <a
                href={SITE_PHONE_HREF}
                className="font-semibold text-brand-navy underline decoration-brand-green/50 underline-offset-2 transition-colors hover:text-[#19752B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35A238]/45 focus-visible:ring-offset-2"
              >
                {SITE_PHONE_DISPLAY}
              </a>
            </p>
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

      {isVolumeIntentChoice ? (
        <p className="order-tunnel-volume-intent-choice__footer text-center text-[13px] leading-snug text-brand-muted">
          Une question ? Appelez-nous au{" "}
          <a
            href={SITE_PHONE_HREF}
            className="font-semibold text-brand-green hover:text-[#19752B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#35A238]/45 focus-visible:ring-offset-2"
          >
            {SITE_PHONE_DISPLAY}
          </a>
        </p>
      ) : null}
      </div>
    </div>
  )
}
