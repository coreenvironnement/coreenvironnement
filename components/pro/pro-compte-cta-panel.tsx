import Link from "next/link"
import {
  ArrowRight,
  CalendarDays,
  Check,
  Headphones,
  Laptop,
  Truck,
} from "lucide-react"

import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { cn } from "@/lib/utils"

const BENEFIT_ICONS = [CalendarDays, Truck, Headphones] as const

function parseBenefit(point: string) {
  const sep = point.indexOf(" : ")
  if (sep === -1) return { title: point, body: "" }
  return {
    title: point.slice(0, sep),
    body: point.slice(sep + 3),
  }
}

export function ProCompteSwoosh({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 164 14"
      fill="none"
      preserveAspectRatio="none"
      className={cn(
        "pointer-events-none absolute -bottom-1 left-1/2 h-[0.42em] w-[106%] -translate-x-1/2 text-brand-green",
        className
      )}
      aria-hidden
    >
      <path
        d="M3 10.5C28 2.5 52 1.5 82 6.5c22 3.8 48 2.5 79-3.5"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  )
}

export function ProCompteCtaPanel({ className }: { className?: string }) {
  const benefits = comptePro.reassurance.points.map(parseBenefit)

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex flex-col gap-5 sm:gap-6">
        <div
          className={cn(
            "card-vitrine border border-[#dce5df]/90 bg-white",
            "shadow-[0_2px_8px_rgb(14_32_16/0.04),0_16px_40px_-14px_rgb(14_32_16/0.1)]"
          )}
        >
        <div className="space-y-5 p-5 sm:space-y-6 sm:p-6 md:p-7">
          <h2 className="text-pretty text-lg font-bold tracking-tight text-brand-navy sm:text-xl">
            {comptePro.reassurance.titre}
          </h2>

          <ul className="m-0 grid list-none gap-0 p-0">
            {benefits.map((item, index) => {
              const Icon = BENEFIT_ICONS[index] ?? CalendarDays
              const isLast = index === benefits.length - 1
              return (
                <li
                  key={item.title}
                  className={cn(
                    "flex gap-3 py-4 sm:gap-4 sm:py-[1.125rem]",
                    !isLast && "border-b border-[#e4ebe6]"
                  )}
                >
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-brand-green/15 bg-brand-green/[0.07] sm:size-12"
                    aria-hidden
                  >
                    {index === 0 ? (
                      <span className="relative flex items-center justify-center">
                        <CalendarDays
                          className="size-5 text-brand-green sm:size-[22px]"
                          strokeWidth={1.65}
                        />
                        <span className="absolute text-[9px] font-bold leading-none text-brand-green sm:text-[10px]">
                          30
                        </span>
                      </span>
                    ) : (
                      <Icon
                        className="size-5 text-brand-green sm:size-[22px]"
                        strokeWidth={1.65}
                      />
                    )}
                  </span>
                  <span
                    className="hidden w-px shrink-0 self-stretch bg-[#dce5df] sm:block"
                    aria-hidden
                  />
                  <div className="min-w-0 space-y-1 pt-0.5 text-left">
                    <p className="text-[14px] font-semibold leading-snug text-brand-navy sm:text-[15px]">
                      {item.title}
                    </p>
                    <p className="text-pretty text-[13px] leading-relaxed text-brand-muted sm:text-[14px]">
                      {item.body}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        </div>

        <div className="space-y-3 sm:space-y-3.5">
          <Link
            href="/inscription?type=professionnel&next=/espace/compte"
            className="btn btn-accent group flex min-h-12 w-full items-center justify-center gap-2 rounded-full px-6 text-[15px] font-semibold sm:min-h-[3.25rem] sm:text-base"
          >
            {comptePro.ctaPrincipal}
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-0.5"
              strokeWidth={2.25}
              aria-hidden
            />
          </Link>

          <p className="flex items-center justify-center gap-2 text-center text-[13px] leading-relaxed text-brand-muted sm:text-sm">
            <Check
              className="size-4 shrink-0 text-brand-green"
              strokeWidth={2.5}
              aria-hidden
            />
            <span>{comptePro.sansAbonnementObligatoire}</span>
          </p>

          <p className="text-center text-[13px] text-brand-muted sm:text-sm">
            <span className="text-brand-muted/90">Déjà un compte ? </span>
            <Link
              href="/login?next=/espace/compte"
              className="font-semibold text-brand-navy underline-offset-2 transition-colors hover:text-brand-green hover:underline"
            >
              {comptePro.ctaConnexion}
            </Link>
          </p>
        </div>
      </div>

      <aside
        className="relative mt-0 overflow-hidden rounded-2xl border border-brand-green/20 bg-[#F3F8F4] px-4 pb-4 pt-9 sm:px-5 sm:pb-5 sm:pt-10"
        aria-labelledby="pro-option-docs-title"
      >
        <span className="absolute right-3 top-3 rounded-md border border-brand-green/25 bg-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-brand-green sm:right-4 sm:top-4 sm:text-[10px]">
          {comptePro.optionDocumentaire.badge}
        </span>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <span
            className="mx-auto flex size-14 shrink-0 items-center justify-center rounded-2xl border border-brand-green/15 bg-white text-brand-green shadow-[0_2px_10px_-4px_rgb(14_32_16/0.12)] sm:mx-0 sm:size-16"
            aria-hidden
          >
            <Laptop className="size-7 sm:size-8" strokeWidth={1.5} />
          </span>
          <div className="min-w-0 flex-1 space-y-1.5 pt-0.5 text-center sm:text-left">
            <h3
              id="pro-option-docs-title"
              className="text-pretty pr-16 text-[15px] font-semibold tracking-tight text-brand-navy sm:pr-20 sm:text-base"
            >
              {comptePro.optionDocumentaire.titre}
            </h3>
            <p className="text-pretty text-[13px] leading-relaxed text-brand-muted sm:text-[14px]">
              {comptePro.optionDocumentaire.texte}
            </p>
            <p className="text-[12.5px] font-medium leading-snug text-brand-muted sm:text-[13px]">
              {comptePro.optionDocumentaire.prix}
            </p>
          </div>
        </div>
      </aside>
    </div>
  )
}