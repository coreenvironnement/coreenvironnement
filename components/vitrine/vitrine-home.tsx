"use client"

import { useEffect } from "react"

import { TestimonialsSection } from "@/components/testimonials-section"

import { VitrineOrderProvider, useVitrineOrder } from "./order-context"
import { VitrineOrderModal } from "./order-modal"
import { VitrineClientPortal } from "./vitrine-client-portal"
import {
  VitrineCompteProTeaser,
  VitrineEngagements,
  VitrineHowItWorks,
  VitrineServices,
} from "./vitrine-sections"
import { VitrineFaq } from "./vitrine-faq"
import { VitrineFinalCta } from "./vitrine-final-cta"
import { VitrineFooter } from "./vitrine-footer"
import { VitrineHeader } from "./vitrine-header"
import { VitrineHero } from "./vitrine-hero"

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
          Paiement reçu. Votre commande est confirmée — vous recevrez un e-mail de
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

function VitrineHomeInner({ orderParam }: { orderParam?: string }) {
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
        <VitrineHero />
        <VitrineServices />
        <VitrineEngagements />
        <VitrineHowItWorks />
        <VitrineClientPortal />
        <VitrineCompteProTeaser />
        <TestimonialsSection vitrine />
        <VitrineFaq />
        <VitrineFinalCta />
      </main>

      <VitrineFooter />
      <VitrineOrderModal />
    </div>
  )
}

export function VitrineHome({ orderParam }: { orderParam?: string }) {
  return (
    <VitrineOrderProvider>
      <VitrineHomeInner orderParam={orderParam} />
    </VitrineOrderProvider>
  )
}
