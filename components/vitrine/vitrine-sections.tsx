import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon } from "@hugeicons/core-free-icons"

import { comptePro, services, servicesSection } from "@/lib/cdc/contenu-vitrine"

import { ServiceFlipCard } from "./service-flip-card"
import { VITRINE_ICON_STROKE } from "./icons"

export { VitrineEngagements } from "./vitrine-engagements"
export { VitrineHowItWorks } from "./vitrine-how-it-works"

export function VitrineServices() {
  return (
    <section id="services" className="bg-[#F3F7F5] py-16 sm:py-20 lg:py-[5.5rem]">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-eyebrow">Nos services</p>
          <h2 className="section-title mt-3">Une solution pour chaque besoin</h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-muted sm:text-base">
            {servicesSection.intro}
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6 lg:mt-12">
          {services.map((service, index) => (
            <ServiceFlipCard
              key={service.titre}
              service={service}
              index={index}
              featured={index === 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export function VitrineCompteProTeaser() {
  return (
    <section id="compte-pro" className="border-b border-brand-border bg-brand-navy py-16 text-white sm:py-20">
      <div className="container-x grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="section-eyebrow section-eyebrow--inverse text-brand-sky">Compte professionnel</p>
          <h2 className="mt-3 text-2xl sm:text-3xl">{comptePro.titre}</h2>
          <p className="mt-4 text-sm leading-relaxed text-white/85 sm:text-base">
            {comptePro.description}
          </p>
          <p className="mt-3 text-sm font-medium text-white/90">
            Abonnement {comptePro.abonnement}
          </p>
        </div>
        <div className="rounded-[var(--radius-card)] border border-white/10 bg-white/[0.05] p-6">
          <h3>{comptePro.reassurance.titre}</h3>
          <ul className="mt-4 space-y-3">
            {comptePro.reassurance.points.map((point) => (
              <li key={point} className="flex gap-2 text-sm text-white/88">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={16}
                  strokeWidth={VITRINE_ICON_STROKE}
                  className="mt-0.5 shrink-0 text-brand-green"
                  aria-hidden
                />
                {point}
              </li>
            ))}
          </ul>
          <Link href="/pro" className="btn btn-accent mt-6 inline-flex">
            Créer mon compte pro
          </Link>
        </div>
      </div>
    </section>
  )
}
