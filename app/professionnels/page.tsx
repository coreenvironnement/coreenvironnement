import type { Metadata } from "next"
import Link from "next/link"

import { TestimonialsSection } from "@/components/testimonials-section"
import { VitrineAudienceSwitch } from "@/components/vitrine/vitrine-audience-switch"
import { VitrineFaq } from "@/components/vitrine/vitrine-faq"
import { VitrineFinalCta } from "@/components/vitrine/vitrine-final-cta"
import { VitrineClientPortal } from "@/components/vitrine/vitrine-client-portal"
import { VitrineEngagements } from "@/components/vitrine/vitrine-engagements"
import { VitrineHowItWorks } from "@/components/vitrine/vitrine-how-it-works"
import {
  VitrineCompteProTeaser,
  VitrineServices,
} from "@/components/vitrine/vitrine-sections"
import { VitrinePublicShell } from "@/components/vitrine/vitrine-public-shell"
import { professionnelsPage } from "@/lib/cdc/contenu-vitrine"
import { publicPageMetadata } from "@/lib/seo/public-page"

export const metadata: Metadata = publicPageMetadata(
  "Professionnels — location de benne et déchets en Île-de-France",
  "Services, engagements et commande pour entreprises et artisans. CORE ENVIRONNEMENT : bennes, conformité et suivi de chantier en IDF.",
  "/professionnels"
)

export default function ProfessionnelsPage() {
  return (
    <VitrinePublicShell>
      <section className="border-b border-brand-border bg-brand-bg-alt py-12 sm:py-16">
        <div className="container-x max-w-3xl">
          <p className="section-eyebrow">{professionnelsPage.eyebrow}</p>
          <h1 className="section-title mt-3 text-brand-navy">{professionnelsPage.titre}</h1>
          <p className="mt-5 text-[17px] leading-relaxed text-brand-muted sm:text-[18px]">
            {professionnelsPage.intro}
          </p>
          <p className="mt-6">
            <Link
              href="/pro"
              className="text-[15px] font-semibold text-brand-green hover:text-[#19752B]"
            >
              Compte professionnel (pré-lancement) →
            </Link>
          </p>
        </div>
      </section>

      <VitrineServices />
      <VitrineEngagements />
      <VitrineHowItWorks />
      <VitrineClientPortal />
      <VitrineCompteProTeaser />
      <TestimonialsSection vitrine />
      <VitrineFaq />
      <VitrineFinalCta />
      <VitrineAudienceSwitch mode="pro" />
    </VitrinePublicShell>
  )
}
