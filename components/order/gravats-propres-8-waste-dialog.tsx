"use client"

import { Check, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SITE_IMAGES } from "@/lib/media/site-images"
import { cn } from "@/lib/utils"

const MATERIALS_ILLUSTRATION = SITE_IMAGES.tunnel.gravatsAcceptesSprite

const MATERIAL_GROUPS = [
  { label: "Briques et tuiles", backgroundPosition: "0% 50%" },
  { label: "Béton et parpaings", backgroundPosition: "50% 50%" },
  { label: "Terre et cailloux", backgroundPosition: "100% 50%" },
] as const

function SectionCheckIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-[1.35rem] shrink-0 items-center justify-center rounded-full bg-brand-green text-white",
        className
      )}
      aria-hidden
    >
      <Check className="size-3 stroke-[3]" />
    </span>
  )
}

function ProhibitionIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn("size-9 shrink-0 sm:size-10", className)}
    >
      <circle cx="20" cy="20" r="17.5" stroke="#E11D48" strokeWidth="2.5" />
      <path
        d="M10.5 20h19"
        stroke="#E11D48"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

type GravatsPropres8WasteDialogProps = {
  showTtc: boolean
}

export function GravatsPropres8WasteDialog({
  showTtc,
}: GravatsPropres8WasteDialogProps) {
  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="xs"
            className="mt-1.5 h-auto min-h-7 px-0 py-0.5 text-left text-xs font-medium text-brand-navy underline-offset-2 hover:underline"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onKeyDown={(e: React.KeyboardEvent) => e.stopPropagation()}
          />
        }
      >
        <Info className="mr-1 size-3.5 shrink-0 opacity-70" />
        {showTtc
          ? "Voir les déchets acceptés et interdits"
          : "Déchets acceptés / exclus"}
      </DialogTrigger>
      <DialogContent
        overlayClassName="z-[80]"
        className={cn(
          "z-[80] flex max-h-[min(90vh,640px)] w-[calc(100%-1.5rem)] max-w-[22.5rem] flex-col gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 text-brand-navy shadow-[0_12px_48px_rgba(23,32,51,0.14)] ring-0 sm:max-w-[22.5rem]",
          "font-[family-name:var(--font-body)]"
        )}
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain px-5 pb-5 pt-4 sm:px-6 sm:pb-6 sm:pt-5">
          <DialogHeader className="gap-1 text-center sm:text-center">
            <DialogTitle className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-brand-navy">
              Benne à chaîne 8 m³
            </DialogTitle>
            <p className="text-sm font-medium text-brand-muted">Gravats propres</p>
          </DialogHeader>

          <div
            className="mx-auto mt-4 h-px w-full max-w-[18rem] bg-brand-border/80"
            aria-hidden
          />

          <section className="mt-5" aria-labelledby="gp8-accepted-heading">
            <h3
              id="gp8-accepted-heading"
              className="flex items-center justify-center gap-2 text-center text-[15px] font-bold text-brand-navy"
            >
              <SectionCheckIcon />
              Ce que vous pouvez jeter
            </h3>

            <ul className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
              {MATERIAL_GROUPS.map((group) => (
                <li
                  key={group.label}
                  className="flex min-w-0 flex-col items-center gap-2"
                >
                  <div
                    className="relative h-[4.5rem] w-full max-w-[6.75rem] overflow-hidden sm:h-[5.25rem] sm:max-w-[7.25rem]"
                    role="img"
                    aria-label={`Illustration : ${group.label} acceptés dans une benne gravats propres`}
                  >
                    <div
                      className="absolute inset-0 scale-[1.08] bg-no-repeat mix-blend-lighten"
                      style={{
                        backgroundImage: `url('${MATERIALS_ILLUSTRATION}')`,
                        backgroundSize: "300% auto",
                        backgroundPosition: group.backgroundPosition,
                      }}
                      aria-hidden
                    />
                  </div>
                  <p className="flex w-full items-start justify-center gap-1 text-center text-[10px] font-semibold leading-tight text-brand-navy sm:text-[11px]">
                    <SectionCheckIcon className="mt-px size-3.5" />
                    <span className="text-balance">{group.label}</span>
                  </p>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-center text-[11px] leading-snug text-brand-muted sm:text-xs">
              Uniquement des gravats propres et de la terre non polluée.
            </p>
          </section>

          <section
            className="mt-5 rounded-xl border border-rose-200/90 bg-rose-50/90 px-3.5 py-3.5 sm:px-4"
            aria-labelledby="gp8-forbidden-heading"
          >
            <div className="flex gap-3">
              <ProhibitionIcon className="mt-0.5" />
              <div className="min-w-0 space-y-1.5 text-left">
                <h3
                  id="gp8-forbidden-heading"
                  className="text-[13px] font-bold leading-snug text-rose-800 sm:text-sm"
                >
                  À ne pas mettre dans cette benne
                </h3>
                <p className="text-[12px] font-bold leading-snug text-brand-navy sm:text-[13px]">
                  Plâtre, plaques de plâtre et déchets dangereux
                </p>
                <p className="text-[11px] leading-snug text-brand-muted sm:text-xs">
                  Exemples&nbsp;: amiante, peinture, produits chimiques.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="shrink-0 border-t border-brand-border/40 bg-white px-5 py-4 sm:px-6">
          <DialogClose
            render={
              <Button
                type="button"
                className="h-11 w-full rounded-xl bg-brand-green text-base font-bold text-white shadow-none hover:bg-brand-green-dark"
              />
            }
          >
            J&apos;ai compris
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  )
}
