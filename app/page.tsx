import { CheckCircle2, ShieldCheck, Truck } from "lucide-react"

import { OrderWidget } from "@/components/order-widget"
import { TestimonialsSection } from "@/components/testimonials-section"

const reassurance = [
  {
    icon: Truck,
    title: "Réactivité 78",
    text: "Intervention rapide, créneaux serrés, priorité chantier.",
  },
  {
    icon: ShieldCheck,
    title: "Tarifs clairs",
    text: "Devis lisible après validation terrain, sans mauvaise surprise.",
  },
  {
    icon: CheckCircle2,
    title: "Traçabilité",
    text: "Conformité et documents fournis avec chaque rotation.",
  },
] as const

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)]">
      {/* Section 1 : promesse courte + widget remonté */}
      <section className="relative border-b border-border/30 bg-background">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% -15%, color-mix(in srgb, #38a234 14%, transparent), transparent 50%), radial-gradient(ellipse 60% 50% at 100% 0%, color-mix(in srgb, #1b418f 8%, transparent), transparent 45%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-4 sm:px-6 lg:pb-16 lg:pt-6 lg:px-8">
          <div className="mx-auto mb-8 max-w-2xl text-center lg:mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-navy">
              <span className="block sm:inline">
                Commandez une benne en 2 min. Intervention en moins de 24 h.
              </span>{" "}
              <span className="block sm:inline">Yvelines (78).</span>
            </p>
            <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[2.65rem] lg:leading-[1.12]">
              Benne livrée ou rotation terrain en moins de 24 h.
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
      <section className="border-b border-border/30 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-xl font-bold text-brand-navy sm:text-2xl">
            Pourquoi nous faire confiance
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
            Vous commandez directement auprès de Core Environnement, une équipe qui
            centralise planification, enlèvement et suivi de bout en bout.
          </p>
        </div>
      </section>

      <TestimonialsSection />
    </div>
  )
}
