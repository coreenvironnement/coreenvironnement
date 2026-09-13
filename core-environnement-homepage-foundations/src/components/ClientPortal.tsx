import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
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
} from "@hugeicons/core-free-icons";
import { cn } from "../utils/cn";

type IconType = typeof Recycle03Icon;

const STROKE = 1.7;

/* Palette CORE ENVIRONNEMENT */
const NAVY = "#183574";
const GREEN = "#35A238";
const GREEN_DEEP = "#19752B";
const BLUE = "#269DD2";
const TEXT = "#172033";
const TEXT_2 = "#667085";
const BORDER = "#E3E9E6";

/* Nuances de la palette pour la répartition des déchets */
const FRACTIONS = [
  { name: "DIB", value: 46, color: NAVY },
  { name: "Gravats", value: 28, color: BLUE },
  { name: "Bois", value: 16, color: GREEN },
  { name: "Plâtre", value: 10, color: "#AEBBD3" },
];

const KPIS = [
  { label: "Tonnage total", value: "12,4", unit: "t", tone: "navy" as const },
  { label: "Valorisation", value: "92", unit: "%", tone: "green" as const },
  { label: "Interventions", value: "8", unit: "", tone: "navy" as const },
];

const DOCUMENTS = [
  { name: "Bon d’intervention", meta: "PDF · 214 Ko" },
  { name: "Bon de pesée", meta: "PDF · 188 Ko" },
  { name: "BSD", meta: "PDF · 342 Ko" },
];

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
];

/* ── Hooks ─────────────────────────────────────────────── */

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useReveal<T extends HTMLElement>(reduced: boolean, threshold = 0.15) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold]);
  return { ref, shown };
}

/* ── Atomes du mockup ──────────────────────────────────── */

function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("rounded-[14px] border bg-white", className)}
      style={{ borderColor: BORDER }}
    >
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-3"
        style={{ borderColor: BORDER }}
      >
        <p
          className="font-display text-[12.5px] font-semibold tracking-[-0.01em]"
          style={{ color: TEXT }}
        >
          {title}
        </p>
        {action && (
          <span
            className="font-sans text-[10.5px] font-medium tracking-[0.04em]"
            style={{ color: "#98a2b3" }}
          >
            {action}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: "Réalisée" | "Programmée" }) {
  const done = status === "Réalisée";
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[3px] font-display text-[11px] font-semibold"
      style={
        done
          ? { backgroundColor: "rgba(53,162,56,0.1)", color: GREEN_DEEP }
          : { backgroundColor: "rgba(38,157,210,0.1)", color: "#1878a4" }
      }
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: done ? GREEN : BLUE }}
      />
      {status}
    </span>
  );
}

/* ── Mockup du dashboard ───────────────────────────────── */

function DashboardMock({ reduced }: { reduced: boolean }) {
  const { ref, shown } = useReveal<HTMLDivElement>(reduced, 0.1);

  /* Donut : 92 % de valorisation */
  const R = 40;
  const C = 2 * Math.PI * R;
  const valorisation = 0.92;

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
      aria-label="Aperçu illustratif de l’espace client CORE ENVIRONNEMENT : indicateurs, répartition des déchets, taux de valorisation, prochaine intervention et documents."
    >
      {/* Barre d’application */}
      <div
        className="flex items-center justify-between gap-3 border-b px-4 py-2.5 sm:px-5"
        style={{ borderColor: BORDER, backgroundColor: "#FAFBFA" }}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px]"
            style={{ backgroundColor: NAVY, color: "#ffffff" }}
          >
            <HugeiconsIcon icon={ContainerIcon} size={15} strokeWidth={1.8} />
          </span>
          <span
            className="font-display text-[13px] font-bold tracking-[-0.02em]"
            style={{ color: TEXT }}
          >
            CORE
          </span>
          <span
            aria-hidden="true"
            className="h-3.5 w-px"
            style={{ backgroundColor: BORDER }}
          />
          <span
            className="truncate font-sans text-[11.5px] font-medium"
            style={{ color: TEXT_2 }}
          >
            Espace client
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span
            className="hidden h-7 w-7 items-center justify-center rounded-[8px] border sm:inline-flex"
            style={{ borderColor: BORDER, color: TEXT_2 }}
          >
            <HugeiconsIcon icon={BellIcon} size={14} strokeWidth={STROKE} />
          </span>
          <span
            className="inline-flex h-7 items-center gap-1.5 rounded-[8px] border px-2"
            style={{ borderColor: BORDER }}
          >
            <span
              className="inline-flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold"
              style={{ backgroundColor: "#eef2f8", color: NAVY }}
            >
              M
            </span>
            <span
              className="hidden font-sans text-[11px] font-medium min-[420px]:inline"
              style={{ color: TEXT }}
            >
              Martin
            </span>
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-5 lg:p-6">
        {/* En-tête + sélection de chantier */}
        <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-start min-[480px]:justify-between">
          <div className="min-w-0">
            <p
              className="font-display text-[17px] font-semibold tracking-[-0.025em] sm:text-[19px]"
              style={{ color: TEXT }}
            >
              Bonjour, Entreprise Martin
            </p>
            <p className="mt-0.5 font-sans text-[12.5px]" style={{ color: TEXT_2 }}>
              Vue d’ensemble
            </p>
          </div>

          <div className="w-full min-[480px]:w-auto">
            <p
              className="font-sans text-[9.5px] font-medium uppercase tracking-[0.16em]"
              style={{ color: "#98a2b3" }}
            >
              Chantier sélectionné
            </p>
            <button
              type="button"
              tabIndex={-1}
              className="mt-1.5 flex w-full items-center justify-between gap-3 rounded-[10px] border bg-white px-3 py-2 min-[480px]:w-[230px]"
              style={{ borderColor: BORDER }}
              aria-hidden="true"
            >
              <span className="flex min-w-0 items-center gap-2">
                <HugeiconsIcon
                  icon={Building02Icon}
                  size={15}
                  strokeWidth={STROKE}
                  className="shrink-0"
                  color={NAVY}
                />
                <span
                  className="truncate font-display text-[13px] font-semibold tracking-[-0.01em]"
                  style={{ color: TEXT }}
                >
                  Rénovation Paris 15e
                </span>
              </span>
              <HugeiconsIcon
                icon={ChevronDownIcon}
                size={15}
                strokeWidth={STROKE}
                className="shrink-0"
                color="#98a2b3"
              />
            </button>
          </div>
        </div>

        {/* Indicateurs */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {KPIS.map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-[12px] border px-3 py-3 sm:px-4"
              style={{
                borderColor: kpi.tone === "green" ? "#cfe5d5" : BORDER,
                backgroundColor: kpi.tone === "green" ? "#f6fbf7" : "#FAFBFA",
              }}
            >
              <p
                className="font-sans text-[9.5px] font-medium uppercase leading-tight tracking-[0.13em]"
                style={{ color: "#98a2b3" }}
              >
                {kpi.label}
              </p>
              <p className="mt-1.5 flex items-baseline gap-1">
                <span
                  className="font-display text-[19px] font-bold leading-none tracking-[-0.035em] sm:text-[23px]"
                  style={{ color: kpi.tone === "green" ? GREEN_DEEP : TEXT }}
                >
                  {kpi.value}
                </span>
                {kpi.unit && (
                  <span
                    className="font-display text-[12px] font-semibold"
                    style={{ color: kpi.tone === "green" ? GREEN : "#98a2b3" }}
                  >
                    {kpi.unit}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Visualisations */}
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          {/* Répartition */}
          <Panel title="Répartition des déchets" action="Sept. 2026">
            <div className="px-4 py-4">
              {/* Barre empilée */}
              <div
                className="flex h-2.5 w-full overflow-hidden rounded-full"
                style={{ backgroundColor: "#eef1f5" }}
                aria-hidden="true"
              >
                {FRACTIONS.map((f, i) => (
                  <span
                    key={f.name}
                    style={{
                      backgroundColor: f.color,
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
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: f.color }}
                    />
                    <span
                      className="flex-1 font-sans text-[12.5px]"
                      style={{ color: TEXT }}
                    >
                      {f.name}
                    </span>
                    <span
                      className="font-display text-[12.5px] font-semibold"
                      style={{ color: TEXT_2 }}
                    >
                      {f.value} %
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Panel>

          {/* Traitement / valorisation */}
          <Panel title="Traitement des déchets">
            <div className="flex items-center gap-4 px-4 py-4 sm:gap-5">
              <svg
                viewBox="0 0 100 100"
                className="h-[86px] w-[86px] shrink-0 -rotate-90 sm:h-[96px] sm:w-[96px]"
                aria-hidden="true"
              >
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke="#eef1f5"
                  strokeWidth="11"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={R}
                  fill="none"
                  stroke={GREEN}
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
                  <span
                    className="font-display text-[26px] font-bold leading-none tracking-[-0.04em] sm:text-[30px]"
                    style={{ color: GREEN_DEEP }}
                  >
                    92
                  </span>
                  <span
                    className="font-display text-[14px] font-semibold"
                    style={{ color: GREEN }}
                  >
                    %
                  </span>
                </div>
                <p className="mt-1 font-sans text-[11.5px]" style={{ color: TEXT_2 }}>
                  de valorisation
                </p>

                <ul className="mt-3.5 space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: GREEN }}
                    />
                    <span className="flex-1 font-sans text-[12px]" style={{ color: TEXT }}>
                      Valorisation
                    </span>
                    <span
                      className="font-display text-[12px] font-semibold"
                      style={{ color: TEXT_2 }}
                    >
                      92 %
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#AEBBD3" }}
                    />
                    <span className="flex-1 font-sans text-[12px]" style={{ color: TEXT }}>
                      Élimination
                    </span>
                    <span
                      className="font-display text-[12px] font-semibold"
                      style={{ color: TEXT_2 }}
                    >
                      8 %
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </Panel>
        </div>

        {/* Intervention + documents */}
        <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
          <Panel title="Prochaine intervention">
            <div className="px-4 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="font-display text-[13.5px] font-semibold tracking-[-0.01em]"
                    style={{ color: TEXT }}
                  >
                    Rotation — Benne 15 m³
                  </p>
                  <p
                    className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[12px]"
                    style={{ color: TEXT_2 }}
                  >
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        size={14}
                        strokeWidth={STROKE}
                        color={NAVY}
                      />
                      14 septembre
                    </span>
                    <span className="flex items-center gap-1.5">
                      <HugeiconsIcon
                        icon={Location01Icon}
                        size={14}
                        strokeWidth={STROKE}
                        color={NAVY}
                      />
                      Paris 15e
                    </span>
                  </p>
                </div>
                <span
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ backgroundColor: "#eef2f8", color: NAVY }}
                >
                  <HugeiconsIcon icon={TruckIcon} size={17} strokeWidth={STROKE} />
                </span>
              </div>
              <div className="mt-3.5 border-t pt-3.5" style={{ borderColor: BORDER }}>
                <StatusBadge status="Programmée" />
              </div>
            </div>
          </Panel>

          <Panel title="Documents récents" action="Voir tout">
            <ul>
              {DOCUMENTS.map((doc, i) => (
                <li key={doc.name}>
                  <div
                    className={cn(
                      "group flex items-center justify-between gap-3 px-4 py-3 transition-colors duration-200 hover:bg-[#FAFBFA]",
                      i > 0 && "border-t",
                    )}
                    style={{ borderColor: BORDER }}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px]"
                        style={{ backgroundColor: "#eef2f8", color: NAVY }}
                      >
                        <HugeiconsIcon
                          icon={i === 2 ? FileValidationIcon : Pdf01Icon}
                          size={15}
                          strokeWidth={STROKE}
                        />
                      </span>
                      <div className="min-w-0">
                        <p
                          className="truncate font-display text-[12.5px] font-semibold tracking-[-0.01em]"
                          style={{ color: TEXT }}
                        >
                          {doc.name}
                        </p>
                        <p
                          className="font-sans text-[10.5px]"
                          style={{ color: "#98a2b3" }}
                        >
                          {doc.meta}
                        </p>
                      </div>
                    </div>
                    <span
                      className="inline-flex shrink-0 items-center gap-1 rounded-[8px] px-2 py-1.5 font-sans text-[11px] font-medium transition-colors duration-200"
                      style={{ color: NAVY, backgroundColor: "rgba(24,53,116,0.05)" }}
                    >
                      <HugeiconsIcon icon={Download04Icon} size={13} strokeWidth={1.8} />
                      <span className="hidden min-[420px]:inline">Télécharger</span>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
        </div>

        {/* Historique — tableau desktop */}
        <div
          className="mt-3 hidden overflow-hidden rounded-[14px] border lg:block"
          style={{ borderColor: BORDER }}
        >
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ backgroundColor: "#FAFBFA" }}>
                {["Intervention", "Date", "Contenant", "Déchets", "Statut", "Documents"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-2.5 text-left font-sans text-[9.5px] font-medium uppercase tracking-[0.14em]"
                      style={{ color: "#98a2b3" }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((row) => (
                <tr key={row.id} style={{ borderTop: `1px solid ${BORDER}` }}>
                  <td
                    className="px-4 py-3 font-display text-[12.5px] font-semibold"
                    style={{ color: NAVY }}
                  >
                    {row.id}
                  </td>
                  <td className="px-4 py-3 font-sans text-[12.5px]" style={{ color: TEXT_2 }}>
                    {row.date}
                  </td>
                  <td className="px-4 py-3 font-sans text-[12.5px]" style={{ color: TEXT }}>
                    {row.container}
                  </td>
                  <td className="px-4 py-3 font-sans text-[12.5px]" style={{ color: TEXT }}>
                    {row.waste}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3">
                    {row.doc ? (
                      <span
                        className="inline-flex items-center gap-1.5 font-sans text-[12px] font-medium"
                        style={{ color: NAVY }}
                      >
                        <HugeiconsIcon icon={Download04Icon} size={13} strokeWidth={1.8} />
                        Télécharger
                      </span>
                    ) : (
                      <span className="font-sans text-[12.5px]" style={{ color: "#c2cad6" }}>
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Historique — cartes mobile */}
        <div className="mt-3 space-y-2 lg:hidden">
          {HISTORY.map((row) => (
            <div
              key={row.id}
              className="rounded-[14px] border bg-white px-4 py-3.5"
              style={{ borderColor: BORDER }}
            >
              <div className="flex items-center justify-between gap-3">
                <p
                  className="font-display text-[12.5px] font-semibold"
                  style={{ color: NAVY }}
                >
                  {row.id}
                </p>
                <StatusBadge status={row.status} />
              </div>
              <div
                className="mt-2.5 grid grid-cols-2 gap-y-2 border-t pt-2.5"
                style={{ borderColor: BORDER }}
              >
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

        {/* Pied du mockup */}
        <div
          className="mt-3 flex items-center justify-between gap-3 border-t pt-3.5"
          style={{ borderColor: BORDER }}
        >
          <span
            className="inline-flex items-center gap-2 font-sans text-[10.5px]"
            style={{ color: "#98a2b3" }}
          >
            <HugeiconsIcon icon={Recycle03Icon} size={13} strokeWidth={1.8} />
            Aperçu illustratif — données de démonstration
          </span>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 font-display text-[12px] font-semibold"
            style={{ color: NAVY }}
          >
            Voir tout l’historique
            <HugeiconsIcon icon={ArrowRight01Icon} size={14} strokeWidth={1.8} />
          </span>
        </div>
      </div>
    </div>
  );
}



function MetaCell({
  label,
  value,
  withIcon = false,
}: {
  label: string;
  value: string;
  withIcon?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p
        className="font-sans text-[9px] font-medium uppercase tracking-[0.13em]"
        style={{ color: "#98a2b3" }}
      >
        {label}
      </p>
      <p
        className="mt-0.5 flex items-center gap-1 truncate font-sans text-[12px]"
        style={{ color: withIcon ? NAVY : TEXT }}
      >
        {withIcon && <HugeiconsIcon icon={Download04Icon} size={12} strokeWidth={1.8} />}
        {value}
      </p>
    </div>
  );
}

/* ── Section ───────────────────────────────────────────── */

const BENEFITS: { icon: IconType; label: string }[] = [
  { icon: TruckIcon, label: "Suivi des interventions" },
  { icon: File02Icon, label: "Documents centralisés" },
  { icon: ChartColumnIcon, label: "Reporting chantier" },
];

export default function ClientPortal() {
  const reduced = usePrefersReducedMotion();
  const intro = useReveal<HTMLDivElement>(reduced);

  return (
    <section
      id="espace-client"
      className="relative scroll-mt-[72px] overflow-hidden py-20 sm:py-24 lg:py-[7.5rem]"
      style={{ backgroundColor: NAVY }}
    >
      {/* Profondeur très discrète — pas de gradient flashy */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 70% at 12% 0%, rgba(255,255,255,0.05) 0%, transparent 60%), radial-gradient(80% 60% at 100% 100%, rgba(4,12,30,0.35) 0%, transparent 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }}
      />

      <div className="container-x relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-14 xl:gap-20">
          {/* ── Contenu marketing ── */}
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
            <p className="inline-flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: GREEN }}
              />
              <span className="font-sans text-[11.5px] font-medium uppercase tracking-[0.22em] text-white/70">
                Espace client
              </span>
            </p>

            <h2 className="mt-5 font-display text-[clamp(1.8rem,3.5vw,2.7rem)] font-bold leading-[1.13] tracking-[-0.032em] text-white">
              Pilotez vos déchets.
              <span className="block">Pas vos relances.</span>
            </h2>

            <p
              className="mt-5 max-w-[31rem] text-[15.5px] leading-[1.7] sm:mt-6 sm:text-[16.5px]"
              style={{ color: "rgba(255,255,255,0.68)" }}
            >
              Suivez vos prestations, centralisez vos documents et consultez la
              traçabilité de vos déchets depuis un espace client disponible 24h/24.
            </p>

            {/* Bénéfices */}
            <ul className="mt-8 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b.label} className="flex items-center gap-3">
                  <span
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border"
                    style={{
                      borderColor: "rgba(255,255,255,0.14)",
                      backgroundColor: "rgba(255,255,255,0.05)",
                      color: "#8fd0e8",
                    }}
                  >
                    <HugeiconsIcon icon={b.icon} size={17} strokeWidth={STROKE} />
                  </span>
                  <span className="font-display text-[14.5px] font-medium tracking-[-0.01em] text-white/90">
                    {b.label}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#espace-client"
                className="btn group bg-white"
                style={{ color: NAVY }}
              >
                Découvrir l’espace client
                <HugeiconsIcon
                  icon={ArrowUpRight02Icon}
                  size={17}
                  strokeWidth={STROKE}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
              <a
                href="#espace-client"
                className="btn border text-white transition-colors duration-300 hover:bg-white/[0.07]"
                style={{ borderColor: "rgba(255,255,255,0.22)" }}
              >
                Se connecter
              </a>
            </div>

            <p
              className="mt-5 flex items-center gap-2 font-sans text-[12px]"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={1.8} color={GREEN} />
              Accès réservé aux clients CORE ENVIRONNEMENT
            </p>
          </div>

          {/* ── Mockup ── */}
          <div className="relative">
            <DashboardMock reduced={reduced} />

            {/* Micro-card flottante 1 */}
            <div
              aria-hidden="true"
              className="absolute -left-4 top-[16%] hidden animate-fade-in items-center gap-2.5 rounded-[14px] border bg-white px-3.5 py-3 shadow-[0_18px_40px_-22px_rgba(4,12,30,0.5)] xl:flex"
              style={{ borderColor: BORDER, animationDelay: "500ms" }}
            >
              <span
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: "rgba(53,162,56,0.1)", color: GREEN_DEEP }}
              >
                <HugeiconsIcon icon={CheckmarkCircle02Icon} size={17} strokeWidth={1.7} />
              </span>
              <span>
                <span
                  className="block font-display text-[12.5px] font-semibold tracking-[-0.01em]"
                  style={{ color: TEXT }}
                >
                  Intervention réalisée
                </span>
                <span
                  className="block font-sans text-[11px]"
                  style={{ color: TEXT_2 }}
                >
                  Bon de pesée disponible
                </span>
              </span>
            </div>

            {/* Micro-card flottante 2 */}
            <div
              aria-hidden="true"
              className="absolute -right-4 bottom-[13%] hidden animate-fade-in rounded-[14px] border bg-white px-3.5 py-3 shadow-[0_18px_40px_-22px_rgba(4,12,30,0.5)] xl:block"
              style={{ borderColor: BORDER, animationDelay: "650ms" }}
            >
              <p
                className="flex items-start font-display font-bold leading-none tracking-[-0.04em]"
                style={{ color: GREEN_DEEP }}
              >
                <span className="text-[13px]">+</span>
                <span className="text-[25px]">92</span>
                <span className="ml-0.5 text-[13px]">%</span>
              </p>
              <p className="mt-1 font-sans text-[11px]" style={{ color: TEXT_2 }}>
                de déchets valorisés
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
