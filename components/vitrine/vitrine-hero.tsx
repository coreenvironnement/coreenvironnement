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

const H1_PRIX_HIGHLIGHT = "meilleur prix"

/** Met « meilleur prix » en vert CTA dans la ligne H1 (home + pages locales). */
function heroH1WithPrixHighlight(line: string) {
  const lower = line.toLowerCase()
  const idx = lower.indexOf(H1_PRIX_HIGHLIGHT)
  if (idx === -1) return line
  const end = idx + H1_PRIX_HIGHLIGHT.length
  return (
    <>
      {line.slice(0, idx)}
      <span className="font-semibold text-brand-green">{line.slice(idx, end)}</span>
      {line.slice(end)}
    </>
  )
}

export function VitrineHero({
  seoVariant,
  localPage,
  heroOrderAudience = "particulier",
}: VitrineHeroProps) {
  const backdropPinned = useHeroBackdropPinned()
  const backdropLayerClass = backdropPinned
    ? "pointer-events-none fixed inset-x-0 top-0 z-[1] h-[100svh] overflow-hidden"
    : "pointer-events-none absolute inset-0 overflow-hidden"

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
        <div aria-hidden="true" className="hero-overlay hero-overlay--mobile" />
      </div>
      <div className={cn(backdropLayerClass, "hidden md:block")}>
        <div className="hero-bg-frame hero-bg-frame--desktop relative h-full w-full">
          <Image
            src="/images/hero-paris-truck-desktop.png"
            alt={hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[55%_center]"
          />
        </div>
        <div aria-hidden="true" className="hero-overlay hero-overlay--desktop" />
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
        <div className="relative flex flex-col gap-8 max-lg:gap-7 lg:grid lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center lg:gap-12 xl:grid-cols-[440px_minmax(0,1fr)] xl:gap-14">
          <div className="relative order-1 mx-auto max-w-[760px] max-lg:text-center lg:order-none lg:col-start-2 lg:row-start-1 lg:mx-0 lg:max-w-none lg:text-left lg:pl-2 xl:pl-6">
            <div
              aria-hidden
              className="hero-readability-glow pointer-events-none absolute -inset-x-3 -inset-y-5 rounded-[1.25rem] md:-inset-x-10 md:-inset-y-12 md:rounded-[2rem] lg:hidden"
            />
            <h1
              className="animate-fade-up mt-0 text-[clamp(1.82rem,5.35vw,2.17rem)] leading-[1.1] text-white [text-shadow:0_1px_28px_rgba(14,32,16,0.28),0_2px_56px_rgba(14,32,16,0.14)] sm:text-[clamp(2.15rem,4.4vw,3.45rem)] sm:leading-[1.08]"
              style={{ animationDelay: "140ms" }}
            >
              <span className="block">{heroH1WithPrixHighlight(seoVariant.h1Line1)}</span>
              {seoVariant.h1Line2 ? (
                <span className="mt-1 block">{seoVariant.h1Line2}</span>
              ) : null}
            </h1>

            <p
              className="animate-fade-up mt-6 hidden max-w-[520px] text-[17px] leading-[1.84] text-white/95 [text-shadow:0_1px_22px_rgba(14,32,16,0.22)] lg:block sm:mt-6 sm:max-w-[540px] sm:text-[18px] sm:leading-[1.72]"
              style={{ animationDelay: "220ms" }}
            >
              {seoVariant.intro ?? hero.titre2}
            </p>

            <a
              href={SITE_PHONE_HREF}
              aria-label={`Appeler Core Environnement au ${SITE_PHONE_DISPLAY}`}
              className="animate-fade-up btn btn-ghost-light mt-8 hidden w-full border-white/45 text-white sm:inline-flex sm:w-auto hover:border-white/60 lg:mt-9"
              style={{ animationDelay: "300ms" }}
            >
              {SITE_PHONE_DISPLAY}
            </a>
          </div>

          <div
            className="animate-fade-up order-2 -mt-1 w-full max-lg:mt-4 lg:order-none lg:col-start-1 lg:row-start-1 lg:mt-0"
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
