"use client"

import { TestimonialsSection } from "@/components/testimonials-section"
import { PROFESSIONNELS_HERO_VARIANT } from "@/lib/seo/landing-variants"

import { VitrineAudienceSwitch } from "./vitrine-audience-switch"
import { VitrineOrderProvider } from "./order-context"
import { VitrineOrderModal } from "./order-modal"
import { VitrineEngagements } from "./vitrine-engagements"
import { VitrineFaq } from "./vitrine-faq"
import { VitrineFinalCta } from "./vitrine-final-cta"
import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"
import { VitrineHero } from "./vitrine-hero"
import { VitrineHowItWorks } from "./vitrine-how-it-works"
import { VitrineServices } from "./vitrine-sections"

export function VitrineProfessionnelsHome() {
  return (
    <VitrineOrderProvider>
      <div className="vitrine-root min-h-screen">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[10px] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-brand-navy focus:shadow-md"
        >
          Aller au contenu principal
        </a>

        <VitrineHeader />
        <main id="contenu">
          <VitrineHero
            seoVariant={PROFESSIONNELS_HERO_VARIANT}
            heroOrderAudience="professionnel"
          />
          <TestimonialsSection vitrine proOnly />
          <VitrineServices />
          <VitrineEngagements />
          <VitrineHowItWorks />
          <VitrineFaq />
          <VitrineFinalCta />
          <VitrineAudienceSwitch mode="pro" />
        </main>
        <VitrineFooter />
        <VitrineOrderModal />
      </div>
    </VitrineOrderProvider>
  )
}
