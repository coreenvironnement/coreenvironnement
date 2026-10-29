"use client"

import Image from "next/image"

import { hero } from "@/lib/cdc/contenu-vitrine"
import type { SeoVariant } from "@/lib/seo/landing-variants"
import {
  SITE_GOOGLE_MAPS_PIN_SRC,
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
        "group inline-flex max-w-full items-center gap-2.5 rounded-full border border-white/22 bg-white/[0.1] py-1.5 pl-1.5 pr-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_28px_-14px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-300 hover:border-white/38 hover:bg-white/[0.14]",
        className
      )}
      aria-label={`Note Google ${ratingLabel} sur 5, ${SITE_GOOGLE_REVIEW_COUNT} avis — voir sur Google Maps`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white p-1.5 shadow-sm">
        <Image
          src={SITE_GOOGLE_MAPS_PIN_SRC}
          alt=""
          width={28}
          height={28}
          className="size-7 object-contain"
          aria-hidden
        />
      </span>
      <span className="min-w-0 text-left text-[13px] font-semibold leading-snug text-white sm:text-[14px]">
        Note Google {ratingLabel}{" "}
        <span className="font-medium text-white/88">
          ({SITE_GOOGLE_REVIEW_COUNT} avis)
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
          <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
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
