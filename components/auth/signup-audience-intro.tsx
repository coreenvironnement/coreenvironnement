import Link from "next/link"
import { ArrowRight, Building2, Home, LogIn } from "lucide-react"

import type { OrderAudience } from "@/components/order/order-audience-toggle"
import { cn } from "@/lib/utils"

const OPTIONS = [
  {
    id: "particulier" as const,
    title: "Particulier",
    description: "Benne à domicile ou au jardin.",
    Icon: Home,
  },
  {
    id: "professionnel" as const,
    title: "Professionnel",
    description: "Chantiers et espace client entreprise.",
    Icon: Building2,
  },
] as const

type SignupAudienceIntroProps = {
  loginHref: string
  onSelect: (audience: OrderAudience) => void
}

export function SignupAudienceIntro({ loginHref, onSelect }: SignupAudienceIntroProps) {
  return (
    <div className="relative mt-2">
      <p className="text-center text-[14px] font-medium text-brand-muted">
        Choisissez votre profil pour la suite.
      </p>

      <ul className="mt-3 space-y-2.5 p-0" role="list">
        {OPTIONS.map((option) => (
          <li key={option.id}>
            <button
              type="button"
              onClick={() => onSelect(option.id)}
              className={cn(
                "group flex w-full items-center gap-3 rounded-xl border border-[#b8c9be]/90",
                "bg-white/90 p-3 text-left",
                "shadow-[inset_0_1px_0_rgb(255_255_255/0.85),0_1px_2px_rgb(14_32_16/0.04)]",
                "transition-[border-color,box-shadow,transform] duration-200",
                "hover:border-[#35A238]/40 hover:bg-white",
                "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40"
              )}
            >
              <span
                className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#35A238]/14 text-[#35A238]"
                aria-hidden
              >
                <option.Icon className="size-[22px]" strokeWidth={1.65} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-semibold text-brand-navy">
                  {option.title}
                </span>
                <span className="mt-0.5 block text-[12px] leading-snug text-brand-muted">
                  {option.description}
                </span>
              </span>
              <ArrowRight
                className="size-4 shrink-0 text-[#35A238]/75 transition-transform group-hover:translate-x-0.5"
                strokeWidth={2.25}
                aria-hidden
              />
            </button>
          </li>
        ))}
      </ul>

      <Link
        href={loginHref}
        className="mt-3.5 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl border border-[#35A238]/18 bg-[#ECF4E9]/55 text-[13px] font-semibold text-brand-navy transition-colors hover:border-[#35A238]/35 hover:bg-[#ECF4E9]"
      >
        <LogIn className="size-3.5 text-[#35A238]" strokeWidth={2} aria-hidden />
        J&apos;ai déjà un compte
      </Link>
    </div>
  )
}