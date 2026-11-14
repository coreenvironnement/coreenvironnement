"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useLayoutEffect, useState } from "react"

import { hero } from "@/lib/cdc/contenu-vitrine"
import { SITE_IMAGES, buildHeroImageAlt } from "@/lib/media/site-images"
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
  const heroImageAlt = buildHeroImageAlt(localPage)

  return (
    <>
    <section
      id="accueil"
      className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden bg-transparent"
    >
        <div className={backdropLayerClass}>
        <div className="relative h-full min-h-0 w-full overflow-hidden">
          <div className="hero-bg-frame hero-bg-frame--mobile relative h-full w-full md:hidden">
            <Image
              src={SITE_IMAGES.hero.mobile}
              alt={heroImageAlt}
              fill
              priority
              sizes="100vw"
              className="z-0 object-cover object-center"
            />
            <div
              aria-hidden="true"
              className={cn(
                "hero-overlay",
                isParticulier ? "hero-overlay--particulier" : "hero-overlay--standard"
              )}
            />
          </div>
          <div className="hero-bg-frame hero-bg-frame--desktop relative hidden h-full w-full md:block">
            <Image
              src={SITE_IMAGES.hero.desktop}
              alt={heroImageAlt}
              fill
              priority
              sizes="100vw"
              className={cn(
                "z-0 object-cover",
                isParticulier ? "object-[62%_center]" : "object-[55%_center]"
              )}
            />
            <div
              aria-hidden="true"
              className={cn(
                "hero-overlay",
                isParticulier ? "hero-overlay--particulier" : "hero-overlay--standard"
              )}
            />
          </div>
        </div>
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
            {isParticulier ? (
              <div
                className="animate-fade-up mb-4 max-lg:flex max-lg:justify-center sm:mb-5 lg:mb-5 lg:block"
                style={{ animationDelay: "80ms" }}
              >
                <GoogleRatingBadge
                  variant="hero"
                  compact
                  className="lg:self-start"
                />
              </div>
            ) : null}

            <h1
              className={cn(
                "vitrine-h1 vitrine-h1--on-dark animate-fade-up mt-0 max-lg:text-center lg:text-left [text-shadow:0_1px_28px_rgba(14,32,16,0.32),0_2px_56px_rgba(14,32,16,0.16)]"
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
                "vitrine-section-intro vitrine-section-intro--on-dark animate-fade-up mt-4 max-w-[540px] text-white/95 [text-shadow:0_1px_22px_rgba(14,32,16,0.24)] sm:mt-5 lg:mt-6 lg:max-w-[520px]",
                isParticulier ? "max-lg:mx-auto lg:mx-0" : "max-lg:mx-auto lg:mx-0"
              )}
              style={{ animationDelay: "220ms" }}
            >
              {introText}
            </p>

            {!isParticulier ? (
              <a
                href={SITE_PHONE_HREF}
                aria-label={`Appeler Core Environnement au ${SITE_PHONE_DISPLAY}`}
                className="animate-fade-up btn btn-ghost-light mt-8 hidden w-full border-white/45 text-white sm:inline-flex sm:w-auto hover:border-white/60 lg:mt-9"
                style={{ animationDelay: "300ms" }}
              >
                {SITE_PHONE_DISPLAY}
              </a>
            ) : null}
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

        </div>
      </div>
    </section>

    <VitrineHeroReassurance audience={heroOrderAudience} />
    </>
  )
}
