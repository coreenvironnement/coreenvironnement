"use client"

import type { LucideIcon } from "lucide-react"
import { BrickWall, ChevronDown, Hammer, Recycle } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type BenneFamily, FAMILY_LABELS } from "@/lib/prestations"
import { cn } from "@/lib/utils"

const FAMILIES: BenneFamily[] = [
  "melange_dnd",
  "gravats_melanges",
  "gravats_propres",
]

const FAMILY_ICONS: Record<BenneFamily, LucideIcon> = {
  melange_dnd: Recycle,
  gravats_melanges: Hammer,
  gravats_propres: BrickWall,
}

/** Langage particulier → famille tarifaire (étape intention). */
export const WASTE_SITUATIONS: ReadonlyArray<{
  family: BenneFamily
  title: string
  subtitle: string
  Icon: LucideIcon
}> = [
  {
    family: "gravats_melanges",
    title: "Travaux maison",
    subtitle: "Carrelage, placo, briques, un peu de tout",
    Icon: Hammer,
  },
  {
    family: "gravats_propres",
    title: "Gros œuvre / terrassement",
    subtitle: "Béton, tuiles propres, terre propre",
    Icon: BrickWall,
  },
  {
    family: "melange_dnd",
    title: "Débarras / mélange",
    subtitle: "Meubles, bois, plastique, emballages…",
    Icon: Recycle,
  },
]

function orderFieldBg(embedded: boolean) {
  return embedded ? "bg-brand-warm-field text-brand-navy" : "bg-white"
}

export function WasteSituationPicker({
  family,
  onSelectFamily,
  warmSurface,
}: {
  family: BenneFamily | null
  onSelectFamily: (family: BenneFamily) => void
  warmSurface?: boolean
}) {
  return (
    <div
      className="grid gap-2.5"
      role="group"
      aria-label="Situation et type de déchet"
    >
      {WASTE_SITUATIONS.map(({ family: fid, title, subtitle, Icon }) => {
        const selected = family === fid
        return (
          <button
            key={fid}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelectFamily(fid)}
            className={cn(
              "flex w-full items-start gap-3 rounded-2xl border-2 p-3.5 text-left shadow-sm outline-none transition-colors",
              "focus-visible:border-brand-navy focus-visible:ring-2 focus-visible:ring-brand-navy/25",
              selected
                ? "border-brand-navy bg-primary/10"
                : warmSurface
                  ? "border-primary/20 bg-brand-warm-field hover:border-brand-navy/35 hover:bg-primary/[0.06]"
                  : "border-border/80 bg-card/90 hover:border-brand-navy/35"
            )}
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-xl",
                selected ? "bg-primary/15" : "bg-brand-navy/[0.06]"
              )}
            >
              <Icon
                className={cn(
                  "size-[1.2rem]",
                  selected ? "text-primary" : "text-brand-navy/55"
                )}
                aria-hidden
              />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[15px] font-semibold leading-snug text-brand-navy">
                {title}
              </span>
              <span className="mt-0.5 block text-xs leading-snug text-brand-muted">
                {subtitle}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

export function WasteFamilySelect({
  family,
  onSelectFamily,
  embedded,
  id = "order-waste-family",
}: {
  family: BenneFamily | null
  onSelectFamily: (family: BenneFamily) => void
  embedded: boolean
  id?: string
}) {
  return (
    <div className="relative space-y-0">
      <label htmlFor={id} className="sr-only">
        Type de déchet
      </label>
      <div className="relative">
        <Select
          value={family ?? ""}
          onValueChange={(v) => {
            if (!v) return
            onSelectFamily(v as BenneFamily)
          }}
        >
          <SelectTrigger
            id={id}
            className={cn(
              "h-12 w-full max-w-none items-center justify-between rounded-xl border-2 border-primary/20 py-0 pl-4 pr-4 text-base shadow-sm focus-visible:border-primary/50 focus-visible:ring-brand-navy/30 data-[size=default]:h-12",
              orderFieldBg(embedded)
            )}
            size="default"
          >
            <SelectValue placeholder="Choisissez le type de déchet">
              {(value) => {
                if (!value) {
                  return (
                    <span className="flex min-w-0 items-center gap-2.5">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-navy/[0.06] text-brand-navy/45">
                        <Recycle className="size-[1.15rem]" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1 text-left">
                        <span className="block truncate text-[15px] font-semibold leading-snug text-brand-muted">
                          Choisissez le type de déchet
                        </span>
                        <span className="mt-0.5 block text-[11px] font-medium text-brand-muted/80">
                          Gravats, mélange DND…
                        </span>
                      </span>
                    </span>
                  )
                }
                const fid = value as BenneFamily
                const meta = FAMILY_LABELS[fid]
                const Icon = FAMILY_ICONS[fid]
                if (!meta || !Icon) return null
                return (
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon
                        className="size-[1.15rem] text-primary"
                        aria-hidden
                      />
                    </span>
                    <span className="truncate font-medium text-brand-navy">
                      {meta.title}
                    </span>
                  </span>
                )
              }}
            </SelectValue>
          </SelectTrigger>
          <SelectContent
            side="bottom"
            align="start"
            sideOffset={6}
            alignItemWithTrigger={false}
            className="z-[100] rounded-xl border-primary/15 bg-brand-warm-field text-brand-navy"
          >
            {FAMILIES.map((fid) => {
              const meta = FAMILY_LABELS[fid]
              const Icon = FAMILY_ICONS[fid]
              return (
                <SelectItem
                  key={fid}
                  value={fid}
                  label={meta.title}
                  className="cursor-pointer py-3 hover:bg-primary/10 focus:bg-primary/10 data-highlighted:bg-primary/10 data-selected:bg-primary/10"
                >
                  <span className="flex w-full items-start gap-3 text-left">
                    <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Icon
                        className="size-[1.15rem] text-primary"
                        aria-hidden
                      />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="font-medium leading-snug text-brand-navy">
                        {meta.title}
                      </span>
                      <span className="text-xs font-normal leading-snug text-brand-muted">
                        {meta.description}
                      </span>
                    </span>
                  </span>
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export function WasteFamilyExactListDisclosure({
  family,
  onSelectFamily,
  embedded,
}: {
  family: BenneFamily | null
  onSelectFamily: (family: BenneFamily) => void
  embedded: boolean
}) {
  return (
    <details className="group rounded-xl border border-primary/15 bg-brand-warm-field/50 open:pb-3 open:pt-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5 text-xs font-semibold text-brand-navy marker:content-none [&::-webkit-details-marker]:hidden">
        <span>Choisir le type exact dans la liste</span>
        <ChevronDown
          className="size-4 shrink-0 text-brand-muted transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="px-3 pt-1">
        <WasteFamilySelect
          id="order-waste-family-exact"
          family={family}
          onSelectFamily={onSelectFamily}
          embedded={embedded}
        />
      </div>
    </details>
  )
}
