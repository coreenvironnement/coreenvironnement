"use client"

import { useEffect } from "react"

import { TestimonialsSection } from "@/components/testimonials-section"

import { VitrineOrderProvider, useVitrineOrder } from "./order-context"
import { VitrineOrderModal } from "./order-modal"
import { VitrineAudienceSwitch } from "./vitrine-audience-switch"
import { VitrineParticulierConseils } from "./vitrine-particulier-conseils"
import { VitrineParticulierFaq } from "./vitrine-particulier-faq"
import { VitrineParticulierJourney } from "./vitrine-particulier-journey"
import { VitrineFinalCta } from "./vitrine-final-cta"
import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"
import { getDefaultSeoVariant, type SeoVariant } from "@/lib/seo/landing-variants"
import type { LocalPage } from "@/lib/seo/local-copy"
import { localPageToSeoVariant } from "@/lib/seo/local-pages"

import { VitrineHero } from "./vitrine-hero"
import { VitrineCityGuide } from "./vitrine-city-guide"
import { VitrineDepartmentGuide } from "./vitrine-department-guide"
import { VitrineLocalSeo } from "./vitrine-local-seo"
import { VitrineLocationHub } from "./vitrine-location-hub"
import { VitrineLongtailIntro } from "./vitrine-longtail-intro"
import { VitrineSeoPricingSection } from "./vitrine-seo-pricing-section"
import { LocalBreadcrumbs } from "@/components/seo/local-breadcrumbs"

function OrderBanner({ orderParam }: { orderParam?: string }) {
  const { openOrder } = useVitrineOrder()

  useEffect(() => {
    if (orderParam === "cancelled") {
      openOrder()
    }
  }, [orderParam, openOrder])

  if (orderParam === "success") {
    return (
      <div className="container-x relative z-20 -mb-6 pt-24">
        <p className="rounded-xl border border-brand-green/30 bg-brand-bg-alt px-4 py-3 text-center text-sm text-brand-navy">
          Paiement reçu. Votre commande est confirmée. Vous recevrez un e-mail de
          confirmation sous peu.
        </p>
      </div>
    )
  }

  if (orderParam === "cancelled") {
    return (
      <div className="container-x relative z-20 -mb-6 pt-24">
        <p className="rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-center text-sm text-brand-muted">
          Paiement annulé. Vous pouvez reprendre votre commande.
        </p>
      </div>
    )
  }

  return null
}

function VitrineHomeInner({
  orderParam,
  seoVariant,
  localSeoData,
  hubPage,
}: {
  orderParam?: string
  seoVariant: SeoVariant
  localSeoData?: LocalPage
  hubPage?: boolean
}) {
  return (
    <div className="vitrine-root min-h-screen">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[10px] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-navy focus:shadow-md"
      >
        Aller au contenu principal
      </a>

      <VitrineHeader />
      <OrderBanner orderParam={orderParam} />

      <main id="contenu">
        {localSeoData ? (
          <div className="relative z-20 pt-[7.25rem] sm:pt-[7.75rem]">
            <LocalBreadcrumbs page={localSeoData} />
          </div>
        ) : null}
        <VitrineHero seoVariant={seoVariant} compactTop={Boolean(localSeoData)} />
        {hubPage ? <VitrineLocationHub /> : null}
        {localSeoData?.type === "departement" ? (
          <VitrineDepartmentGuide page={localSeoData} />
        ) : null}
        {localSeoData?.type === "longtail" ? (
          <VitrineLongtailIntro page={localSeoData} />
        ) : null}
        <VitrineParticulierJourney />
        <VitrineParticulierConseils />
        <TestimonialsSection vitrine particulierOnly />
        <VitrineParticulierFaq />
        {localSeoData?.type === "ville" ? <VitrineCityGuide page={localSeoData} /> : null}
        {hubPage ? <VitrineSeoPricingSection showHubLink={false} /> : null}
        {localSeoData ? <VitrineLocalSeo seoVariant={seoVariant} /> : null}
        <VitrineAudienceSwitch mode="particulier" />
        <VitrineFinalCta />
      </main>

      <VitrineFooter />
      <VitrineOrderModal />
    </div>
  )
}

export function VitrineHome({
  orderParam,
  seoVariant,
  localSeoData,
  hubPage,
}: {
  orderParam?: string
  seoVariant?: SeoVariant
  localSeoData?: LocalPage
  hubPage?: boolean
}) {
  const variant = localSeoData
    ? localPageToSeoVariant(localSeoData)
    : (seoVariant ?? getDefaultSeoVariant())

  return (
    <VitrineOrderProvider>
      <VitrineHomeInner
        orderParam={orderParam}
        seoVariant={variant}
        localSeoData={localSeoData}
        hubPage={hubPage}
      />
    </VitrineOrderProvider>
  )
}
