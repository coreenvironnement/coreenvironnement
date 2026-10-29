"use client"

import Image from "next/image"
import { Star, StarHalf } from "lucide-react"

import { hero } from "@/lib/cdc/contenu-vitrine"
import type { SeoVariant } from "@/lib/seo/landing-variants"
import {
  SITE_GOOGLE_MAPS_URL,
  SITE_GOOGLE_RATING,
  SITE_GOOGLE_REVIEW_COUNT,
  SITE_PHONE_DISPLAY,
  SITE_PHONE_HREF,
} from "@/lib/site"
import { cn } from "@/lib/utils"

import { BenneIcon } from "./benne-icon"
import { VitrineHeroReassurance } from "./vitrine-hero-reassurance"
import { useVitrineOrder } from "./order-context"

type VitrineHeroProps = {
  seoVariant: SeoVariant
}

function HeroGoogleRatingBadge({ className }: { className?: string }) {
  const ratingLabel = SITE_GOOGLE_RATING.toLocaleString("fr-FR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })

  return (
    <a
      href={SITE_GOOGLE_MAPS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/22 bg-white/[0.09] py-1.5 pl-1.5 pr-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_-14px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-300 hover:border-white/38 hover:bg-white/[0.13]",
        className
      )}
      aria-label={`Note Google ${ratingLabel} sur 5, ${SITE_GOOGLE_REVIEW_COUNT} avis — voir sur Google Maps`}
    >
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm"
        aria-hidden
      >
        <svg viewBox="0 0 24 24" className="size-[1.05rem]" role="presentation">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      </span>
      <span className="min-w-0 text-left leading-tight">
        <span className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-white/75 sm:text-[10.5px]">
            Note Google
          </span>
          <span className="text-[15px] font-bold tabular-nums tracking-tight text-white sm:text-[16px]">
            {ratingLabel}
          </span>
          <span className="flex items-center gap-px" aria-hidden>
            {Array.from({ length: 4 }, (_, i) => (
              <Star
                key={i}
                className="size-3.5 fill-amber-300 text-amber-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]"
              />
            ))}
            <StarHalf className="size-3.5 fill-amber-300 text-amber-300 drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]" />
          </span>
        </span>
        <span className="mt-0.5 block text-[11px] font-medium text-white/82 sm:text-[12px]">
          ({SITE_GOOGLE_REVIEW_COUNT} avis)
          <span className="ml-1 hidden text-white/55 transition group-hover:text-white/75 sm:inline">
            · Voir sur Maps
          </span>
        </span>
      </span>
    </a>
  )
}

export function VitrineHero({ seoVariant }: VitrineHeroProps) {
  const { openOrder } = useVitrineOrder()

  return (
    <>
    <section
      id="accueil"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-brand-navy"
    >
      <div className="absolute inset-0 overflow-hidden md:hidden">
        <div className="hero-bg-frame hero-bg-frame--mobile relative">
          <Image
            src="/images/hero-paris-truck-mobile.png"
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
      </div>
      <div className="absolute inset-0 hidden overflow-hidden md:block">
        <div className="hero-bg-frame hero-bg-frame--desktop relative">
          <Image
            src="/images/hero-paris-truck-desktop.png"
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[55%_center]"
          />
        </div>
      </div>

      <div aria-hidden="true" className="hero-overlay hero-overlay--mobile md:hidden" />
      <div aria-hidden="true" className="hero-overlay hero-overlay--desktop hidden md:block" />

      <div className="container-x relative z-10 pb-16 pt-24 sm:pb-28 sm:pt-[6.25rem] lg:pb-32 lg:pt-32">
        <div className="relative max-w-[760px] lg:max-w-[640px] xl:max-w-[680px] lg:-translate-y-2">
          <div
            aria-hidden
            className="hero-readability-glow pointer-events-none absolute -inset-x-3 -inset-y-5 rounded-[1.25rem] md:-inset-x-10 md:-inset-y-12 md:rounded-[2rem]"
          />
          <div
            className="animate-fade-up flex flex-col items-start gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
            style={{ animationDelay: "60ms" }}
          >
            <span className="vitrine-label inline-flex max-w-full items-center gap-2 rounded-full border border-white/20 bg-white/[0.08] py-1 pl-2.5 pr-3 text-[11px] tracking-[0.12em] text-white/90 backdrop-blur-md sm:text-xs">
              {seoVariant.chipLabel ?? "Gestion des déchets · Île-de-France"}
            </span>
            <HeroGoogleRatingBadge />
          </div>

          <h1
            className="animate-fade-up mt-5 text-[clamp(1.82rem,5.35vw,2.17rem)] leading-[1.1] text-white [text-shadow:0_1px_28px_rgba(24,53,116,0.28),0_2px_56px_rgba(24,53,116,0.14)] sm:mt-6 sm:text-[clamp(2.15rem,4.4vw,3.45rem)] sm:leading-[1.08]"
            style={{ animationDelay: "140ms" }}
          >
            <span className="block">{seoVariant.h1Line1}</span>
            {seoVariant.h1Line2 ? (
              <span className="mt-1 block">{seoVariant.h1Line2}</span>
            ) : null}
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-[520px] text-[17px] leading-[1.84] text-white/95 [text-shadow:0_1px_22px_rgba(24,53,116,0.22)] sm:mt-6 sm:max-w-[540px] sm:text-[18px] sm:leading-[1.72]"
            style={{ animationDelay: "220ms" }}
          >
            {seoVariant.intro ?? hero.titre2}
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
              href={SITE_PHONE_HREF}
              aria-label={`Appeler Core Environnement au ${SITE_PHONE_DISPLAY}`}
              className="btn btn-ghost-light w-full border-white/45 text-white sm:w-auto hover:border-white/60"
            >
              {SITE_PHONE_DISPLAY}
            </a>
          </div>
          <p
            className="animate-fade-up mt-4 text-[15px] font-semibold leading-snug text-white [text-shadow:0_1px_22px_rgba(24,53,116,0.22)] sm:text-base"
            style={{ animationDelay: "360ms" }}
          >
            Dès 330 € pour une benne 8 m³, soit 396 € TTC.
          </p>
        </div>
      </div>
    </section>

    <VitrineHeroReassurance />
    </>
  )
}
