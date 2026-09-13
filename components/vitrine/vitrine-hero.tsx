"use client"

import Image from "next/image"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  MapPinIcon,
  Timer01Icon,
  TwentyFourHoursClockIcon,
} from "@hugeicons/core-free-icons"

import { hero } from "@/lib/cdc/contenu-vitrine"

import { BenneIcon } from "./benne-icon"
import { VITRINE_ICON_STROKE } from "./icons"
import { useVitrineOrder } from "./order-context"

const REASSURANCE = [
  { icon: TwentyFourHoursClockIcon, label: "Intervention 24h" },
  { icon: Timer01Icon, label: "Commande en 3 min" },
  { icon: MapPinIcon, label: "Toute l'Île-de-France" },
] as const

export function VitrineHero() {
  const { openOrder } = useVitrineOrder()

  return (
    <section
      id="accueil"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-brand-navy"
    >
      <Image
        src="/images/hero-paris-truck-mobile.png"
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="scale-105 object-cover object-center animate-zoom md:hidden"
      />
      <Image
        src="/images/hero-paris-truck-desktop.png"
        alt={hero.imageAlt}
        fill
        priority
        sizes="100vw"
        className="hidden scale-105 object-cover object-[55%_center] animate-zoom md:block"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,53,116,0.58)_0%,rgba(24,53,116,0.2)_38%,rgba(24,53,116,0.24)_58%,rgba(24,53,116,0.62)_100%)] md:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(24,53,116,0.92)_0%,rgba(24,53,116,0.72)_34%,rgba(24,53,116,0.35)_62%,rgba(24,53,116,0.38)_100%)] md:block"
      />

      <div className="container-x relative z-10 pb-16 pt-24 sm:pb-28 sm:pt-[6.25rem] lg:pb-32 lg:pt-32">
        <div className="relative max-w-[760px] lg:max-w-[640px] xl:max-w-[680px] lg:-translate-y-2">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-3 -inset-y-5 rounded-[1.25rem] bg-[radial-gradient(ellipse_95%_110%_at_0%_48%,rgba(24,53,116,0.5)_0%,rgba(24,53,116,0.26)_48%,transparent_78%)] sm:hidden"
          />
          <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
            <span className="vitrine-label inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.08] py-1.5 pl-3 pr-4 text-white/90 backdrop-blur-md">
              Gestion des déchets · Île-de-France
            </span>
          </div>

          <h1
            className="animate-fade-up mt-5 text-[clamp(1.82rem,5.35vw,2.17rem)] leading-[1.1] text-white [text-shadow:0_2px_18px_rgba(24,53,116,0.55)] sm:mt-6 sm:text-[clamp(2.15rem,4.4vw,3.45rem)] sm:leading-[1.08] sm:[text-shadow:none]"
            style={{ animationDelay: "140ms" }}
          >
            <span className="block">{hero.titre1Ligne1}</span>
            <span className="mt-1 block">{hero.titre1Ligne2}</span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-[520px] text-[17px] leading-[1.84] text-white/95 [text-shadow:0_1px_12px_rgba(24,53,116,0.5)] sm:mt-6 sm:max-w-[540px] sm:text-[18px] sm:leading-[1.72] sm:[text-shadow:none]"
            style={{ animationDelay: "220ms" }}
          >
            {hero.titre2}
          </p>

          <div
            className="animate-fade-up mt-9 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: "300ms" }}
          >
            <button type="button" onClick={openOrder} className="btn btn-accent group w-full sm:w-auto">
              {hero.cta}
              <BenneIcon className="h-[18px] w-[18px] shrink-0" />
            </button>
            <a
              href="#services"
              className="btn btn-ghost-light w-full border-white/45 text-white sm:w-auto hover:border-white/60"
            >
              Découvrir nos services
            </a>
          </div>

          <ul
            className="animate-fade-up mt-7 flex flex-row flex-wrap items-center gap-x-0.5 gap-y-1.5 sm:mt-11 sm:gap-x-0 sm:gap-y-2"
            style={{ animationDelay: "380ms" }}
          >
            {REASSURANCE.map((item, i) => (
              <li key={item.label} className="group/reassurance flex items-center">
                {i > 0 ? (
                  <span
                    aria-hidden="true"
                    className="mx-1.5 h-2.5 w-px shrink-0 bg-white/10 sm:mx-0 sm:mr-5 sm:h-3"
                  />
                ) : null}
                <span
                  aria-hidden
                  className="mr-1.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[7px] border border-white/[0.28] bg-white/[0.14] sm:mr-2 sm:h-8 sm:w-8 sm:rounded-[10px]"
                >
                  <HugeiconsIcon
                    icon={item.icon}
                    size={16}
                    strokeWidth={VITRINE_ICON_STROKE}
                    className="scale-[0.75] text-white transition-colors duration-200 sm:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/reassurance:text-[#35A238]"
                  />
                </span>
                <span className="text-[11px] font-medium leading-none tracking-[0.01em] text-white sm:text-[14px] sm:leading-normal sm:tracking-[0.02em] [text-shadow:0_1px_12px_rgba(24,53,116,0.55)]">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
