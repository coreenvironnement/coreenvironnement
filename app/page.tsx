import { Activity, ShieldCheck, Truck } from "lucide-react"

import { OrderWidget } from "@/components/order-widget"
import { TestimonialsSection } from "@/components/testimonials-section"

const reassurance = [
  {
    icon: Truck,
    title: "Intervention sous 24 h",
    text: "Une fois votre commande passée, nous intervenons sous 24 h sur votre chantier dans la zone desservie : réactivité concrète, pas une promesse floue.",
  },
  {
    icon: ShieldCheck,
    title: "Tarifs clairs",
    text: "Tous nos forfaits sont affichés : vous voyez les prix avant de payer. Sinon, vous pouvez aussi recevoir un devis précis en moins de cinq minutes.",
  },
  {
    icon: Activity,
    title: "Suivi de commande",
    text: "Suivi de commande accessible pour suivre l’état de votre demande en direct, jusqu’à la levée ou l’échange sur place.",
  },
] as const

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)]">
      {/* Section 1 : promesse courte + widget remonté */}
      <section className="relative border-b border-brand-navy/10 bg-transparent">
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-4 sm:px-6 lg:pb-16 lg:pt-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-navy">
              <span className="block sm:inline">
                Commandez une benne en 2 min. Intervention en moins de 24 h.
              </span>{" "}
              <span className="block sm:inline">
                20&nbsp;km autour d’Élancourt · Yvelines (78).
              </span>
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
              Benne livrée ou enlèvement en moins de 24 h sur votre chantier.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              <strong className="font-semibold text-foreground">
                Core Environnement
              </strong>
              , c’est une équipe locale qui planifie, livre et enlève, sans surprise, avec
              des forfaits clairs sur le&nbsp;78.
            </p>
          </div>

          <div
            id="commande"
            className="mx-auto w-full max-w-xl scroll-mt-36 lg:max-w-2xl lg:scroll-mt-40"
          >
            <OrderWidget />
          </div>
        </div>
      </section>

      {/* Section 2 : réassurance — cartes scroll horizontal mobile */}
      <section className="border-b border-brand-navy/10 bg-secondary/50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-xl font-bold text-brand-navy sm:text-2xl">
            Réactivité, prix affichés et suivi de commande
          </h2>
          <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-sm px-4 pb-2 sm:-mx-0 sm:grid sm:grid-cols-3 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0">
            {reassurance.map((item) => (
              <div
                key={item.title}
                className="w-[82vw] max-w-[320px] shrink-0 snap-center rounded-2xl border border-primary/12 bg-muted/40 p-5 shadow-sm sm:w-auto sm:max-w-none sm:p-6"
              >
                <span className="flex size-11 items-center justify-center rounded-xl bg-primary/12 text-primary">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-semibold text-brand-navy">{item.title}</h3>
                <p className="mt-2 text-sm leading-snug text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted-foreground">
            Vous passez votre commande auprès de Core Environnement : planification du
            passage, enlèvements et suivi de bout en bout.
          </p>
        </div>
      </section>

      <TestimonialsSection />
    </div>
  )
}
