import type { PrestataireTauxSummary } from "@/lib/admin/prestataire-taux-summary"
import { formatTauxPctShort } from "@/lib/admin/prestataire-taux-summary"
import { cn } from "@/lib/utils"

const TRACK = "#E8EDF2"

const TYPE_BAR_COLORS: Record<string, string> = {
  dib: "#5B9A8B",
  gravats_propres: "#6B8FC4",
  plastiques: "#C9967E",
  platres: "#B8A066",
  bois_a: "#7FA362",
  bois_b: "#9B8BB8",
}

const DEFAULT_BAR = "#6B9E86"

function barColor(code: string) {
  return TYPE_BAR_COLORS[code] ?? DEFAULT_BAR
}

function shortTypeLabel(code: string, nom: string): string {
  const map: Record<string, string> = {
    dib: "DIB",
    gravats_propres: "Gravats",
    plastiques: "Plastiques",
    platres: "Plâtre",
    bois_a: "Bois A",
    bois_b: "Bois B",
  }
  return map[code] ?? nom
}

function TauxBar({
  label,
  valuePct,
  color,
  compact,
}: {
  label: string
  valuePct: number
  color: string
  compact?: boolean
}) {
  const clamped = Math.min(100, Math.max(0, valuePct))
  const fill = clamped <= 0 ? `${color}55` : color

  return (
    <li
      className={cn(
        "grid items-center gap-2",
        compact
          ? "grid-cols-[3.75rem_1fr_2rem] gap-x-1.5"
          : "grid-cols-[4.5rem_1fr_2.25rem] gap-2.5"
      )}
    >
      <span
        className="truncate text-left text-[10px] font-medium text-muted-foreground"
        title={label}
      >
        {label}
      </span>
      <div
        className={cn("overflow-hidden rounded-full", compact ? "h-1.5" : "h-2.5")}
        style={{ backgroundColor: TRACK }}
      >
        <div
          className="h-full rounded-full"
          style={{ width: `${clamped}%`, backgroundColor: fill }}
        />
      </div>
      <span
        className="text-right text-[10px] font-semibold tabular-nums leading-none"
        style={{ color }}
      >
        {formatTauxPctShort(clamped)}
      </span>
    </li>
  )
}

type Props = {
  summary: PrestataireTauxSummary | undefined
  compact?: boolean
}

export function PrestataireValorisationBars({ summary, compact = true }: Props) {
  const shellClass = cn(
    "w-full min-w-0 rounded-lg border border-[#35A238]/10 bg-white/95",
    compact ? "px-3 py-2" : "rounded-xl px-4 py-3.5",
    "shadow-[0_1px_1px_rgba(15,23,42,0.04)]"
  )

  if (!summary) {
    return (
      <div className={cn(shellClass, "text-[10px] text-muted-foreground")} role="status">
        Taux non renseignés
      </div>
    )
  }

  const ariaLabel = [
    `Taux ${summary.annee}`,
    `Moyenne ${formatTauxPctShort(summary.valorisationMoyennePct)} %`,
    ...summary.parType.map(
      (t) => `${t.nom} ${formatTauxPctShort(t.tauxPct)} %`
    ),
  ].join(", ")

  return (
    <section className={shellClass} aria-label={ariaLabel}>
      <div className="mb-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 border-b border-border/30 pb-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-navy/75">
          Valorisation {summary.annee}
        </p>
        <p className="text-[10px] text-muted-foreground">
          <span className="font-semibold tabular-nums text-[#2F5F48]">
            {formatTauxPctShort(summary.valorisationMoyennePct)} %
          </span>
          <span className="mx-1">moy.</span>
          <span className="font-semibold tabular-nums text-slate-500">
            {formatTauxPctShort(summary.eliminationMoyennePct)} %
          </span>
          <span>élim.</span>
        </p>
      </div>
      <ul
        className={cn(
          "gap-x-3 gap-y-1",
          compact ? "grid grid-cols-1 sm:grid-cols-2" : "space-y-2"
        )}
      >
        {summary.parType.map((t) => (
          <TauxBar
            key={t.code}
            label={shortTypeLabel(t.code, t.nom)}
            valuePct={t.tauxPct}
            color={barColor(t.code)}
            compact={compact}
          />
        ))}
      </ul>
    </section>
  )
}