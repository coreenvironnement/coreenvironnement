"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"

import { hero } from "@/lib/cdc/contenu-vitrine"
import type { SeoVariant } from "@/lib/seo/landing-variants"
import { SITE_PHONE_DISPLAY, SITE_PHONE_HREF } from "@/lib/site"
import { cn } from "@/lib/utils"

import type { OrderAudience } from "@/components/order/order-audience-toggle"

import { LocalBreadcrumbs } from "@/components/seo/local-breadcrumbs"
import type { LocalPage } from "@/lib/seo/local-copy"

import { GoogleRatingBadge } from "./google-rating-badge"
import { HeroOrderCard } from "./hero-order-card"
import {
  readVitrineScrollSolid,
  VITRINE_HEADER_TOTAL_OFFSET_CLASS,
  VITRINE_SCROLL_SOLID_THRESHOLD,
} from "./vitrine-header"
import { VitrineHeroReassurance } from "./vitrine-hero-reassurance"

function useHeroBackdropPinned() {
  const pathname = usePathname()
  const [pinned, setPinned] = useState(true)

  const sync = () => {
    setPinned((window.scrollY || document.documentElement.scrollTop || 0) <= VITRINE_SCROLL_SOLID_THRESHOLD)
  }

  useLayoutEffect(() => {
    sync()
    const raf = requestAnimationFrame(sync)
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setPinned(!readVitrineScrollSolid())
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("pageshow", onScroll)
    return () => {
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("pageshow", onScroll)
    }
  }, [pathname])

  return pinned
}

type VitrineHeroProps = {
  seoVariant: SeoVariant
  localPage?: LocalPage
  heroOrderAudience?: OrderAudience
}

function HeroPhoneBlock({ className }: { className?: string }) {
  return (
    <div className={cn("animate-fade-up space-y-1.5", className)} style={{ animationDelay: "340ms" }}>
      <p className="text-[15px] leading-snug text-white/92 [text-shadow:0_1px_18px_rgba(14,32,16,0.22)] sm:text-base">
        Un conseil pour choisir votre benne ?
      </p>
      <a
        href={SITE_PHONE_HREF}
        aria-label={`Appeler Core Environnement au ${SITE_PHONE_DISPLAY}`}
        className="inline-flex text-[17px] font-semibold text-white underline decoration-white/45 underline-offset-[5px] transition hover:decoration-white/75 sm:text-lg"
      >
        {SITE_PHONE_DISPLAY}
      </a>
    </div>
  )
}

export function VitrineHero({
  seoVariant,
  localPage,
  heroOrderAudience = "particulier",
}: VitrineHeroProps) {
  const backdropPinned = useHeroBackdropPinned()
  const isParticulier = heroOrderAudience === "particulier"
  const backdropLayerClass = backdropPinned
    ? "pointer-events-none fixed inset-x-0 top-0 z-[1] h-[100svh] overflow-hidden"
    : "pointer-events-none absolute inset-0 overflow-hidden"

  const introText = seoVariant.intro ?? hero.titre2

  return (
    <>
    <section
      id="accueil"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-transparent"
    >
      <div className={cn(backdropLayerClass, "md:hidden")}>
        <div className="hero-bg-frame hero-bg-frame--mobile relative h-full w-full">
          <Image
            src="/images/hero-paris-truck-mobile.png"
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        <div
          aria-hidden="true"
          className={cn(
            "hero-overlay hero-overlay--mobile",
            isParticulier && "hero-overlay--mobile-particulier"
          )}
        />
      </div>
      <div className={cn(backdropLayerClass, "hidden md:block")}>
        <div className="hero-bg-frame hero-bg-frame--desktop relative h-full w-full">
          <Image
            src="/images/hero-paris-truck-desktop.png"
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className={cn(
              "object-cover",
              isParticulier ? "object-[62%_center]" : "object-[55%_center]"
            )}
          />
        </div>
        <div
          aria-hidden="true"
          className={cn(
            "hero-overlay hero-overlay--desktop",
            isParticulier && "hero-overlay--desktop-particulier"
          )}
        />
      </div>

      <div
        className={cn(
          "container-x relative z-10 pb-16 sm:pb-28 lg:pb-32",
          VITRINE_HEADER_TOTAL_OFFSET_CLASS
        )}
      >
        {localPage ? (
          <div className="max-lg:flex max-lg:justify-center">
            <LocalBreadcrumbs page={localPage} />
          </div>
        ) : null}
        <div
          className={cn(
            "relative flex flex-col gap-6 max-lg:gap-5 lg:items-center lg:gap-12 xl:gap-14",
            isParticulier
              ? "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(380px,460px)]"
              : "lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center xl:grid-cols-[440px_minmax(0,1fr)] xl:gap-14"
          )}
        >
          <div
            className={cn(
              "relative order-1 mx-auto w-full max-lg:text-center lg:mx-0 lg:text-left",
              isParticulier
                ? "max-w-[760px] lg:col-start-1 lg:row-start-1 lg:max-w-[560px] lg:pr-2 xl:max-w-[580px]"
                : "max-w-[760px] lg:order-none lg:col-start-2 lg:row-start-1 lg:max-w-none lg:pl-2 xl:pl-6"
            )}
          >
            <div
              aria-hidden
              className={cn(
                "hero-readability-glow pointer-events-none absolute -inset-x-3 -inset-y-5 rounded-[1.25rem] md:-inset-x-10 md:-inset-y-12 md:rounded-[2rem]",
                !isParticulier && "lg:hidden"
              )}
            />
            <h1
              className={cn(
                "animate-fade-up mt-0 text-white [text-shadow:0_1px_28px_rgba(14,32,16,0.32),0_2px_56px_rgba(14,32,16,0.16)]",
                isParticulier
                  ? "max-lg:text-center lg:text-left text-[clamp(1.65rem,4.85vw,2rem)] leading-[1.12] sm:text-[clamp(1.95rem,3.8vw,3.1rem)] sm:leading-[1.1]"
                  : "max-lg:text-center lg:text-left text-[clamp(1.82rem,5.35vw,2.17rem)] leading-[1.1] sm:text-[clamp(2.15rem,4.4vw,3.45rem)] sm:leading-[1.08]"
              )}
              style={{ animationDelay: "140ms" }}
            >
              <span className="block">{seoVariant.h1Line1}</span>
              {seoVariant.h1Line2 ? (
                <span className="mt-1 block">{seoVariant.h1Line2}</span>
              ) : null}
            </h1>

            <p
              className={cn(
                "animate-fade-up mt-4 max-w-[540px] text-[16px] leading-[1.72] text-white/95 [text-shadow:0_1px_22px_rgba(14,32,16,0.24)] sm:mt-5 sm:text-[17px] sm:leading-[1.78] lg:mt-6 lg:max-w-[520px] lg:text-[18px]",
                isParticulier ? "max-lg:mx-auto lg:mx-0" : "hidden lg:block sm:max-w-[540px] sm:leading-[1.72]"
              )}
              style={{ animationDelay: "220ms" }}
            >
              {introText}
            </p>

            {isParticulier ? (
              <div
                className="animate-fade-up mt-5 max-lg:flex max-lg:justify-center sm:mt-6 lg:mt-7 lg:block"
                style={{ animationDelay: "280ms" }}
              >
                <GoogleRatingBadge
                  variant="hero"
                  compact
                  className="lg:self-start"
                />
              </div>
            ) : null}

            {isParticulier ? (
              <HeroPhoneBlock className="mt-7 hidden lg:block" />
            ) : (
              <a
                href={SITE_PHONE_HREF}
                aria-label={`Appeler Core Environnement au ${SITE_PHONE_DISPLAY}`}
                className="animate-fade-up btn btn-ghost-light mt-8 hidden w-full border-white/45 text-white sm:inline-flex sm:w-auto hover:border-white/60 lg:mt-9"
                style={{ animationDelay: "300ms" }}
              >
                {SITE_PHONE_DISPLAY}
              </a>
            )}
          </div>

          <div
            className={cn(
              "animate-fade-up order-2 w-full",
              isParticulier
                ? "max-lg:mt-1 lg:col-start-2 lg:row-start-1 lg:mt-0"
                : "-mt-1 max-lg:mt-4 lg:order-none lg:col-start-1 lg:row-start-1 lg:mt-0"
            )}
            style={{ animationDelay: "280ms" }}
          >
            <HeroOrderCard defaultAudience={heroOrderAudience} />
          </div>

          {isParticulier ? (
            <HeroPhoneBlock className="order-3 mx-auto max-lg:mt-2 max-lg:text-center lg:hidden" />
          ) : null}
        </div>
      </div>
    </section>

    <VitrineHeroReassurance audience={heroOrderAudience} />
    </>
  )
}
