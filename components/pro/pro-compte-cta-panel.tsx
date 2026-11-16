import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  CalendarClock,
  FolderKey,
  Truck,
  Users,
} from "lucide-react"

import { comptePro } from "@/lib/cdc/contenu-vitrine"
import { cn } from "@/lib/utils"

const BENEFIT_ICONS = [CalendarClock, Truck, BarChart3] as const

function parseBenefit(point: string) {
  const sep = point.indexOf(" : ")
  if (sep === -1) return { title: point, body: "" }
  return {
    title: point.slice(0, sep),
    body: point.slice(sep + 3),
  }
}

export function ProCompteCtaPanel({ className }: { className?: string }) {
  const benefits = comptePro.reassurance.points.map(parseBenefit)

  return (
    <div
      className={cn(
        "card-vitrine relative overflow-hidden p-0",
        "shadow-[0_1px_2px_rgb(14_32_16/0.03),0_12px_40px_-12px_rgb(14_32_16/0.12)]",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-green/80 via-brand-green to-brand-green/70"
        aria-hidden
      />

      <div className="space-y-6 p-6 sm:space-y-7 sm:p-8">
        <header className="space-y-3 text-center sm:text-left">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-start sm:justify-between">
            <h2 className="text-pretty text-xl font-semibold tracking-tight text-brand-navy sm:text-[1.35rem]">
              {comptePro.reassurance.titre}
            </h2>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-green/25 bg-[#35A238]/10 px-3 py-1 text-[12px] font-semibold tracking-wide text-[#1e6b24] sm:text-[13px]">
              <Users className="size-3.5" strokeWidth={2.25} aria-hidden />
              {comptePro.abonnement}
            </span>
          </div>
        </header>

        <ul className="grid list-none gap-3 p-0 sm:grid-cols-1 sm:gap-3.5">
          {benefits.map((item, index) => {
            const Icon = BENEFIT_ICONS[index] ?? CalendarClock
            return (
              <li
                key={item.title}
                className="flex gap-3 rounded-xl border border-[#c5cfc9]/70 bg-[#f7faf8]/90 p-3.5 sm:gap-3.5 sm:p-4"
              >
                <span
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#35A238]/12 sm:size-11"
                  aria-hidden
                >
                  <Icon
                    className="size-[18px] text-[#35A238] sm:size-5"
                    strokeWidth={1.75}
                  />
                </span>
                <div className="min-w-0 space-y-0.5 pt-0.5 text-left">
                  <p className="text-[13px] font-semibold leading-snug text-brand-navy sm:text-[14px]">
                    {item.title}
                  </p>
                  <p className="text-pretty text-[12px] leading-relaxed text-brand-muted sm:text-[13px]">
                    {item.body}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        <div
          className="h-px w-full bg-gradient-to-r from-transparent via-brand-border to-transparent"
          aria-hidden
        />

        <div className="flex flex-col gap-5 sm:gap-6">
          <div className="flex flex-col items-center gap-2.5 text-center sm:flex-row sm:items-start sm:gap-3.5 sm:text-left">
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-green/20 bg-white shadow-[0_2px_8px_-2px_rgb(14_32_16/0.08)]"
              aria-hidden
            >
              <FolderKey className="size-[18px] text-brand-green" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 space-y-1">
              <h3 className="text-lg font-semibold tracking-tight text-brand-navy">
                Créer ou accéder à votre dossier
              </h3>
              <p className="text-pretty text-sm leading-relaxed text-brand-muted">
                Même page de connexion que les particuliers : après identification, vous
                complétez votre dossier entreprise dans l&apos;espace client.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/inscription?type=professionnel&next=/espace/compte"
              className="btn btn-accent group inline-flex min-h-12 flex-1 items-center justify-center gap-2 sm:flex-initial sm:px-8"
            >
              Créer un compte pro
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.25}
                aria-hidden
              />
            </Link>
            <Link
              href="/login?next=/espace/compte"
              className="btn btn-outline inline-flex min-h-12 flex-1 items-center justify-center sm:flex-initial sm:min-w-[10.5rem]"
            >
              Se connecter
            </Link>
          </div>

          <p className="text-center text-[12px] leading-relaxed text-brand-muted/90 sm:text-left sm:text-[13px]">
            {comptePro.reassurance.footer}
          </p>
        </div>
      </div>
    </div>
  )
}