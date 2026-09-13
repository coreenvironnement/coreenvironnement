"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  ArrowRight01Icon,
  ArrowUpRight02Icon,
  BellIcon,
  Building02Icon,
  Calendar03Icon,
  ChartColumnIcon,
  CheckmarkCircle02Icon,
  ChevronDownIcon,
  ContainerIcon,
  Download04Icon,
  File02Icon,
  FileValidationIcon,
  Location01Icon,
  Pdf01Icon,
  Recycle03Icon,
  Tick02Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons"

import { espaceClientVitrine } from "@/lib/cdc/contenu-vitrine"
import { cn } from "@/lib/utils"

import { VITRINE_ICON_STROKE } from "./icons"

const BENEFIT_ICONS = [TruckIcon, File02Icon, ChartColumnIcon] as const

const FRACTIONS = [
  { name: "DIB", value: 46, color: "bg-brand-navy" },
  { name: "Gravats", value: 28, color: "bg-brand-sky" },
  { name: "Bois", value: 16, color: "bg-brand-green" },
  { name: "Plâtre", value: 10, color: "bg-[#AEBBD3]" },
]

const KPIS = [
  { label: "Tonnage total", value: "12,4", unit: "t", featured: false },
  { label: "Valorisation", value: "92", unit: "%", featured: true },
  { label: "Interventions", value: "8", unit: "", featured: false },
]

const DOCUMENTS = [
  { name: "Bon d'intervention", meta: "PDF · 214 Ko", icon: Pdf01Icon },
  { name: "Bon de pesée", meta: "PDF · 188 Ko", icon: Pdf01Icon },
  { name: "BSD", meta: "PDF · 342 Ko", icon: FileValidationIcon },
]

const HISTORY = [
  {
    id: "#CE-00241",
    date: "12/09/2026",
    container: "Benne 15 m³",
    waste: "DIB",
    status: "Réalisée" as const,
    doc: true,
  },
  {
    id: "#CE-00242",
    date: "14/09/2026",
    container: "Benne 10 m³",
    waste: "Gravats",
    status: "Programmée" as const,
    doc: false,
  },
]

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])

  return reduced
}

function useReveal<T extends HTMLElement>(reduced: boolean, threshold = 0.15) {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (reduced) {
      setShown(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, threshold])

  return { ref, shown }
}

function MockPanel({
  title,
  action,
  children,
  className,
}: {
  title: string
  action?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("rounded-[14px] border border-brand-border bg-white", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-brand-border px-4 py-3">
        <p className="font-[family-name:var(--font-display)] text-[12.5px] font-semibold tracking-[-0.01em] text-brand-text">
          {title}
        </p>
        {action && (
          <span className="font-[family-name:var(--font-body)] text-[10.5px] font-medium tracking-[0.04em] text-brand-muted/80">
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: "Réalisée" | "Programmée" }) {
  const done = status === "Réalisée"
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] font-[family-name:var(--font-display)] text-[11px] font-semibold",
        done ? "bg-brand-green/10 text-brand-green-dark" : "bg-brand-sky/10 text-[#1878a4]"
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", done ? "bg-brand-green" : "bg-brand-sky")}
      />
      {status}
    </span>
  )
}

function MetaCell({
  label,
  value,
  withIcon = false,
}: {
  label: string
  value: string
  withIcon?: boolean
}) {
  return (
    <div className="min-w-0">
      <p className="font-[family-name:var(--font-body)] text-[9px] font-medium uppercase tracking-[0.13em] text-brand-muted/80">
        {label}
      </p>
      <p
        className={cn(
          "mt-0.5 flex items-center gap-1 truncate font-[family-name:var(--font-body)] text-[12px]",
          withIcon ? "text-brand-navy" : "text-brand-text"
        )}
      >
        {withIcon && (
          <HugeiconsIcon icon={Download04Icon} size={12} strokeWidth={VITRINE_ICON_STROKE} />
        )}
        {value}
      </p>
    </div>
  )
}

function DashboardMock({ reduced }: { reduced: boolean }) {
  const { ref, shown } = useReveal<HTMLDivElement>(reduced, 0.1)
  const R = 40
  const C = 2 * Math.PI * R
  const valorisation = 0.92

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-[20px] border border-white/10 bg-white shadow-[0_40px_90px_-40px_rgba(4,12,30,0.6),0_2px_6px_-2px_rgba(4,12,30,0.3)]"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0) scale(1)" : "translateY(20px) scale(0.985)",
        transition: reduced
          ? "none"
          : "opacity 800ms cubic-bezier(0.22,1,0.36,1), transform 800ms cubic-bezier(0.22,1,0.36,1)",
      }}
      role="img"
      aria-label="Aperçu illustratif de l'espace client CORE ENVIRONNEMENT : indicateurs, répartition des déchets, taux de valorisation, prochaine intervention et documents."
    >
      <div className="flex items-center justify-between gap-3 border-b border-brand-border bg-brand-bg px-4 py-2.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-brand-navy text-white">
            <HugeiconsIcon icon={ContainerIcon} size={15} strokeWidth={VITRINE_ICON_STROKE} />
          </span>
          <span className="font-[family-name:var(--font-display)] text-[13px] font-bold tracking-[-0.02em] text-brand-text">
            CORE
          </span>
          <span aria-hidden className="h-3.5 w-px bg-brand-border" />
          <span className="truncate font-[family-name:var(--font-body)] text-[11.5px] font-medium text-brand-muted">
            Espace client
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden h-7 w-7 items-center justify-center rounded-[8px] border border-brand-border text-brand-muted sm:inline-flex">
            <HugeiconsIcon icon={BellIcon} size={14} strokeWidth={VITRINE_ICON_STROKE} />
          </span>
          <span className="inline-flex h-7 items-center gap-1.5 rounded-[8px] border border-brand-border px-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#eef2f8] text-[8px] font-bold text-brand-navy">
              M
            </span>
            <span className="hidden font-[family-name:var(--font-body)] text-[11px] font-medium text-brand-text min-[420px]:inline">
              Martin
            </span>
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-display)] text-[17px] font-semibold tracking-[-0.025em] text-brand-text sm:text-[19px]">
              Bonjour, Entreprise Martin
            </p>
            <p className="mt-0.5 font-[family-name:var(--font-body)] text-[12.5px] text-brand-muted">
              Vue d&apos;ensemble
            </p>
          </div>
          <div className="w-full min-[480px]:w-auto">
            <p className="vitrine-label text-brand-muted/80">Chantier sélectionné</p>
            <div
              className="mt-1.5 flex w-full items-center justify-between gap-3 rounded-[10px] border border-brand-border bg-white px-3 py-2 min-[480px]:w-[230px]"
              aria-hidden
            >
              <span className="flex min-w-0 items-center gap-2">
                <HugeiconsIcon
                  icon={Building02Icon}
                  size={15}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="shrink-0 text-brand-navy"
                />
                <span className="truncate font-[family-name:var(--font-display)] text-[13px] font-semibold tracking-[-0.01em] text-brand-text">
                  Rénovation Paris 15e
                </span>
              </span>
              <HugeiconsIcon
                icon={ChevronDownIcon}
                size={15}
                strokeWidth={VITRINE_ICON_STROKE}
                className="shrink-0 text-brand-muted/80"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className={cn(
                "rounded-[12px] border px-3 py-3 sm:px-4",
                kpi.featured
                  ? "border-brand-green/30 bg-[#f6fbf7]"
                  : "border-brand-border bg-brand-bg"
              )}
            >
              <p className="vitrine-label text-brand-muted/80">{kpi.label}</p>
              <p className="mt-1.5 flex items-baseline gap-1">
                <span
                  className={cn(
                    "font-[family-name:var(--font-display)] text-[19px] font-bold leading-none tracking-[-0.035em] sm:text-[23px]",
                    kpi.featured ? "text-brand-green-dark" : "text-brand-text"
                  )}
                >
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span
                    className={cn(
                      "font-[family-name:var(--font-display)] text-[12px] font-semibold",
                      kpi.featured ? "text-brand-green" : "text-brand-muted/80"
                    )}
                  >
                    {kpi.unit}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <MockPanel title="Répartition des déchets" action="Sept. 2026">
            <div className="px-4 py-4">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#eef1f5]" aria-hidden>
                {FRACTIONS.map((f, i) => (
                  <span
                    key={f.name}
                    className={cn(f.color, "h-full")}
                    style={{
                      width: shown ? `${f.value}%` : "0%",
                      transition: reduced
                        ? "none"
                        : `width 900ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
                    }}
                  />
                ))}
              </div>
              <ul className="mt-4 space-y-2">
                {FRACTIONS.map((f) => (
                  <li key={f.name} className="flex items-center gap-2.5">
                    <span className={cn("h-2 w-2 shrink-0 rounded-full", f.color)} />
                    <span className="flex-1 font-[family-name:var(--font-body)] text-[12.5px] text-brand-text">
                      {f.name}
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[12.5px] font-semibold text-brand-muted">
                      {f.value} %
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </MockPanel>

          <MockPanel title="Traitement des déchets">
            <div className="flex items-center gap-4 px-4 py-4 sm:gap-5">
              <svg
                viewBox="0 0 100 100"
                className="h-[86px] w-[86px] shrink-0 -rotate-90 sm:h-[96px] sm:w-[96px]"
                aria-hidden
              >
                <circle cx="50" cy="50" r={R} fill="none" stroke="#eef1f5" strokeWidth="11" />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="#35A238"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  strokeDashoffset={shown ? C * (1 - valorisation) : C}
                  style={{
                    transition: reduced
                      ? "none"
                      : "stroke-dashoffset 1100ms cubic-bezier(0.22,1,0.36,1) 120ms",
                  }}
                />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="flex items-end gap-2">
                  <span className="font-[family-name:var(--font-display)] text-[26px] font-bold leading-none tracking-[-0.04em] text-brand-green-dark sm:text-[30px]">
                    92
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[14px] font-semibold text-brand-green">
                    %
                  </span>
                </div>
                <p className="mt-1 font-[family-name:var(--font-body)] text-[11.5px] text-brand-muted">
                  de valorisation
                </p>
                <ul className="mt-3.5 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-brand-green" />
                    <span className="flex-1 font-[family-name:var(--font-body)] text-[12px] text-brand-text">
                      Valorisation
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold text-brand-muted">
                      92 %
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#AEBBD3]" />
                    <span className="flex-1 font-[family-name:var(--font-body)] text-[12px] text-brand-text">
                      Élimination
                    </span>
                    <span className="font-[family-name:var(--font-display)] text-[12px] font-semibold text-brand-muted">
                      8 %
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </MockPanel>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <MockPanel title="Prochaine intervention">
            <div className="px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-[family-name:var(--font-display)] text-[13.5px] font-semibold tracking-[-0.01em] text-brand-text">
                    Rotation — Benne 15 m³
                  </p>
                  <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-[family-name:var(--font-body)] text-[12px] text-brand-muted">
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={14}
                        strokeWidth={VITRINE_ICON_STROKE}
                        className="text-brand-navy"
                      />
                      14 septembre
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={14}
                        strokeWidth={VITRINE_ICON_STROKE}
                        className="text-brand-navy"
                      />
                      Paris 15e
                    </span>
                  </p>
                </div>
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[#eef2f8] text-brand-navy">
                  <HugeiconsIcon icon={TruckIcon} size={17} strokeWidth={VITRINE_ICON_STROKE} />
                </span>
              </div>
              <div className="mt-3.5 border-t border-brand-border pt-3.5">
                <StatusBadge status="Programmée" />
              </div>
            </div>
          </MockPanel>

          <MockPanel title="Documents récents" action="Voir tout">
            <ul>
              {DOCUMENTS.map((doc, i) => (
                <li key={doc.name}>
                  <div
                    className={cn(
                      "flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-200 hover:bg-brand-bg",
                      i > 0 && "border-t border-brand-border"
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-[#eef2f8] text-brand-navy">
                        <HugeiconsIcon
                          icon={doc.icon}
                          size={15}
                          strokeWidth={VITRINE_ICON_STROKE}
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-[family-name:var(--font-display)] text-[12.5px] font-semibold tracking-[-0.01em] text-brand-text">
                          {doc.name}
                        </p>
                        <p className="font-[family-name:var(--font-body)] text-[10.5px] text-brand-muted/80">
                          {doc.meta}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-[8px] bg-brand-navy/5 px-2 py-1.5 font-[family-name:var(--font-body)] text-[11px] font-medium text-brand-navy">
                      <HugeiconsIcon icon={Download04Icon} size={13} strokeWidth={VITRINE_ICON_STROKE} />
                      <span className="hidden min-[420px]:inline">Télécharger</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </MockPanel>
        </div>

        <div className="mt-3 hidden overflow-hidden rounded-[14px] border border-brand-border lg:block">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-brand-bg">
                {["Intervention", "Date", "Contenant", "Déchets", "Statut", "Documents"].map(
                  (h) => (
                    <th
                      key={h}
                      className="vitrine-label px-4 py-2.5 text-left text-brand-muted/80"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((row) => (
                <tr key={row.id} className="border-t border-brand-border">
                  <td className="px-4 py-3 font-[family-name:var(--font-display)] text-[12.5px] font-semibold text-brand-navy">
                    {row.id}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-body)] text-[12.5px] text-brand-muted">
                    {row.date}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-body)] text-[12.5px] text-brand-text">
                    {row.container}
                  </td>
                  <td className="px-4 py-3 font-[family-name:var(--font-body)] text-[12.5px] text-brand-text">
                    {row.waste}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    {row.doc ? (
                      <span className="inline-flex items-center gap-1.5 font-[family-name:var(--font-body)] text-[12px] font-medium text-brand-navy">
                        <HugeiconsIcon icon={Download04Icon} size={13} strokeWidth={VITRINE_ICON_STROKE} />
                        Télécharger
                      </span>
                    ) : (
                      <span className="font-[family-name:var(--font-body)] text-[12.5px] text-[#c2cad6]">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 space-y-2 lg:hidden">
          {HISTORY.map((row) => (
            <div
              key={row.id}
              className="rounded-[14px] border border-brand-border bg-white px-4 py-3.5"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="font-[family-name:var(--font-display)] text-[12.5px] font-semibold text-brand-navy">
                  {row.id}
                </p>
                <StatusBadge status={row.status} />
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-y-2 border-t border-brand-border pt-2.5">
                <MetaCell label="Date" value={row.date} />
                <MetaCell label="Contenant" value={row.container} />
                <MetaCell label="Déchets" value={row.waste} />
                <MetaCell
                  label="Documents"
                  value={row.doc ? "Télécharger" : "—"}
                  withIcon={row.doc}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-brand-border pt-3.5">
          <span className="inline-flex items-center gap-2 font-[family-name:var(--font-body)] text-[10.5px] text-brand-muted/80">
            <HugeiconsIcon icon={Recycle03Icon} size={13} strokeWidth={VITRINE_ICON_STROKE} />
            Aperçu illustratif — données de démonstration
          </span>
          <span className="inline-flex shrink-0 items-center gap-1.5 font-[family-name:var(--font-display)] text-[12px] font-semibold text-brand-navy">
            Voir tout l&apos;historique
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={VITRINE_ICON_STROKE} />
          </span>
        </div>
      </div>
    </div>
  )
}

export function VitrineClientPortal() {
  const reduced = usePrefersReducedMotion()
  const intro = useReveal<HTMLDivElement>(reduced)
  const content = espaceClientVitrine

  return (
    <section
      id="espace-client"
      className="relative scroll-mt-[72px] overflow-hidden border-b border-white/10 bg-brand-navy py-16 text-white sm:py-20 lg:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(90%_70%_at_12%_0%,rgba(255,255,255,0.05)_0%,transparent_60%),radial-gradient(80%_60%_at_100%_100%,rgba(4,12,30,0.35)_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.14),transparent)]"
      />

      <div className="container-x relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14 xl:gap-20">
          <div
            ref={intro.ref}
            style={{
              opacity: intro.shown ? 1 : 0,
              transform: intro.shown ? "translateY(0)" : "translateY(16px)",
              transition: reduced
                ? "none"
                : "opacity 750ms cubic-bezier(0.22,1,0.36,1), transform 750ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <p className="section-eyebrow section-eyebrow--inverse">{content.eyebrow}</p>

            <h2 className="mt-5 text-[clamp(1.8rem,3.5vw,2.7rem)] font-bold leading-[1.13] tracking-[-0.032em]">
              {content.titre}
              <span className="block">{content.titreSuite}</span>
            </h2>

            <p className="mt-5 max-w-[31rem] text-[15.5px] leading-[1.7] text-white/68 sm:mt-6 sm:text-[16.5px]">
              {content.description}
            </p>

            <ul className="mt-8 space-y-3">
              {content.benefits.map((label, i) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-white/14 bg-white/5 text-brand-sky">
                    <HugeiconsIcon
                      icon={BENEFIT_ICONS[i] ?? TruckIcon}
                      size={17}
                      strokeWidth={VITRINE_ICON_STROKE}
                    />
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-[14.5px] font-medium tracking-[-0.01em] text-white/90">
                    {label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link href="/dashboard" className="btn btn-light group">
                {content.ctaPrimary}
                <HugeiconsIcon
                  icon={ArrowUpRight02Icon}
                  size={17}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <Link href="/login" className="btn btn-ghost-light">
                {content.ctaSecondary}
              </Link>
            </div>

            <p className="mt-5 flex items-center gap-2 font-[family-name:var(--font-body)] text-[12px] text-white/45">
              <HugeiconsIcon
                icon={Tick02Icon}
                size={14}
                strokeWidth={VITRINE_ICON_STROKE}
                className="text-brand-green"
              />
              {content.reassurance}
            </p>
          </div>

          <div className="relative">
            <DashboardMock reduced={reduced} />

            <div
              aria-hidden
              className="absolute -left-4 top-[16%] hidden animate-fade-in items-center gap-2.5 rounded-[14px] border border-brand-border bg-white px-3.5 py-3 shadow-[0_18px_40px_-22px_rgba(4,12,30,0.5)] xl:flex"
              style={{ animationDelay: "500ms" }}
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green/10 text-brand-green-dark">
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} strokeWidth={VITRINE_ICON_STROKE} />
              </span>
              <span>
                <span className="block font-[family-name:var(--font-display)] text-[12.5px] font-semibold tracking-[-0.01em] text-brand-text">
                  Intervention réalisée
                </span>
                <span className="block font-[family-name:var(--font-body)] text-[11px] text-brand-muted">
                  Bon de pesée disponible
                </span>
              </span>
            </div>

            <div
              aria-hidden
              className="absolute -right-4 bottom-[13%] hidden animate-fade-in rounded-[14px] border border-brand-border bg-white px-3.5 py-3 shadow-[0_18px_40px_-22px_rgba(4,12,30,0.5)] xl:block"
              style={{ animationDelay: "650ms" }}
            >
              <p className="flex items-start font-[family-name:var(--font-display)] font-bold leading-none tracking-[-0.04em] text-brand-green-dark">
                <span className="text-[13px]">+</span>
                <span className="text-[25px]">92</span>
                <span className="ml-0.5 text-[13px]">%</span>
              </p>
              <p className="mt-1 font-[family-name:var(--font-body)] text-[11px] text-brand-muted">
                de déchets valorisés
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
