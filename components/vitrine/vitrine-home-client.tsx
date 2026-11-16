"use client"

import { useEffect } from "react"

import { TestimonialsSection } from "@/components/testimonials-section"

import { VitrineOrderProvider, useVitrineOrder } from "./order-context"
import { VitrineOrderModal } from "./order-modal"
import { VitrineAudienceSwitch } from "./vitrine-audience-switch"
import { VitrineParticulierConseils } from "./vitrine-particulier-conseils"
import { VitrineParticulierFaq } from "./vitrine-particulier-faq"
import { VitrineParticulierJourney } from "./vitrine-particulier-journey"
import { VitrineParticulierPourquoi } from "./vitrine-particulier-pourquoi"
import { VitrineFinalCta } from "./vitrine-final-cta"
import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"
import { VitrineMobileActionBar } from "./vitrine-mobile-action-bar"
import type { SeoVariant } from "@/lib/seo/landing-variants"
import {
  buildParticulierFaqSectionTitle,
  type LocalPage,
} from "@/lib/seo/local-copy"

import { FloatingHelpBubble } from "./floating-help-bubble"
import { VitrineHero } from "./vitrine-hero"
import { VitrineCityGuide } from "./vitrine-city-guide"
import { VitrineDepartmentGuide } from "./vitrine-department-guide"
import { VitrineLocalSeo } from "./vitrine-local-seo"
import { VitrineEarlyLocalLinks } from "./vitrine-early-local-links"
import { VitrineParticulierIdfCommunes } from "./vitrine-particulier-idf-communes"
import { VitrineLocationHub } from "./vitrine-location-hub"
import { VitrineLongtailIntro } from "./vitrine-longtail-intro"
import { VitrineSeoPricingSection } from "./vitrine-seo-pricing-section"
import { GoogleReviewsReassurance } from "./google-reviews-reassurance"

function OrderBanner({ orderParam }: { orderParam?: string }) {
  const { openOrder } = useVitrineOrder()

  useEffect(() => {
    if (orderParam === "cancelled") {
      openOrder()
    }
  }, [orderParam, openOrder])

  if (orderParam === "success") {
    return (
      <div className="container-x relative z-20 -mb-6 pt-[calc(var(--vitrine-header-height)+0.75rem)]">
        <p className="rounded-xl border border-brand-green/30 bg-brand-bg-alt px-4 py-3 text-center text-sm text-brand-navy">
          Paiement reçu. Votre commande est confirmée. Vous recevrez un e-mail de
          confirmation sous peu.
        </p>
      </div>
    )
  }

  if (orderParam === "cancelled") {
    return (
      <div className="container-x relative z-20 -mb-6 pt-[calc(var(--vitrine-header-height)+0.75rem)]">
        <p className="rounded-xl border border-brand-border bg-brand-bg px-4 py-3 text-center text-sm text-brand-muted">
          Paiement annulé. Vous pouvez reprendre votre commande.
        </p>
      </div>
    )
  }

  return null
}

export function VitrineHomeClient({
  orderParam,
  seoVariant,
  localSeoData,
  hubPage,
  heroBackdrop,
}: {
  orderParam?: string
  seoVariant: SeoVariant
  localSeoData?: LocalPage
  hubPage?: boolean
  heroBackdrop: React.ReactNode
}) {
  const particulierHome = !localSeoData && !hubPage
  const faqTitle = buildParticulierFaqSectionTitle(localSeoData, {
    hubPage,
    particulierHome,
  })

  return (
    <VitrineOrderProvider>
      <div
        className={`vitrine-root vitrine--with-action-bar min-h-screen${particulierHome ? " vitrine--mobile-centered vitrine--particulier-home-desktop-centered" : ""}`}
      >
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[10px] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-navy focus:shadow-md"
        >
          Aller au contenu principal
        </a>

        <VitrineHeader />
        <OrderBanner orderParam={orderParam} />

        <main id="contenu" className="relative">
          <VitrineHero
            seoVariant={seoVariant}
            localPage={localSeoData}
            heroBackdrop={heroBackdrop}
          />
          {particulierHome ? <VitrineParticulierJourney /> : null}
          {particulierHome ? <VitrineParticulierPourquoi /> : null}
          {hubPage ? <VitrineEarlyLocalLinks mode="hub" /> : null}
          {localSeoData ? (
            <VitrineEarlyLocalLinks mode="local" page={localSeoData} />
          ) : null}
          {localSeoData ? <GoogleReviewsReassurance /> : null}
          {hubPage ? <VitrineLocationHub /> : null}
          {localSeoData?.type === "departement" ? (
            <VitrineDepartmentGuide page={localSeoData} />
          ) : null}
          {localSeoData?.type === "longtail" ? (
            <VitrineLongtailIntro page={localSeoData} />
          ) : null}
          {!particulierHome ? <VitrineParticulierJourney /> : null}
          <VitrineParticulierConseils />
          <TestimonialsSection vitrine particulierOnly />
          <VitrineParticulierFaq faqTitle={faqTitle} />
          {localSeoData?.type === "ville" ? (
            <VitrineCityGuide page={localSeoData} />
          ) : null}
          {hubPage ? <VitrineSeoPricingSection showHubLink={false} /> : null}
          {localSeoData ? <VitrineLocalSeo seoVariant={seoVariant} /> : null}
          <VitrineAudienceSwitch mode="particulier" />
          {particulierHome ? <VitrineParticulierIdfCommunes /> : null}
          <VitrineFinalCta />
        </main>

        <VitrineFooter />
        <VitrineOrderModal />
        <VitrineMobileActionBar />
        {particulierHome ? <FloatingHelpBubble hideBelowLg /> : null}
      </div>
    </VitrineOrderProvider>
  )
}