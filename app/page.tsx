import { CheckCircle2, ShieldCheck, Truck } from "lucide-react"

import { OrderWidget } from "@/components/order-widget"

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-6rem)] overflow-hidden">
      {/* Fond premium discret */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_100%_80%_at_50%_-40%,color-mix(in_srgb,var(--brand-sky)_22%,transparent),transparent_55%),radial-gradient(ellipse_70%_60%_at_100%_50%,color-mix(in_srgb,var(--brand-green)_14%,transparent),transparent_50%)]"
        aria-hidden
      />

      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <section className="flex flex-col gap-14 lg:gap-20">
          {/* Hero */}
          <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-green-dark sm:text-sm">
              Bennes &amp; valorisation — Yvelines (78)
            </p>
            <h1 className="mt-4 text-balance bg-gradient-to-br from-primary via-primary to-brand-sky-soft bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              La solution locale pour vos chantiers.
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
              <strong className="font-semibold text-foreground">
                Nous prenons en charge
              </strong>{" "}
              la mise à disposition, le suivi terrain et l’enlèvement des
              bennes — vous pilotez votre chantier, nous assurons la logistique
              des déchets avec{" "}
              <span className="font-medium text-primary">
                une équipe experte et réactive sur le 78.
              </span>
            </p>
            <ul className="mx-auto mt-8 flex max-w-xl flex-col items-start gap-3 text-left sm:max-w-2xl">
              {[
                {
                  icon: Truck,
                  text: "Intervention rapide sur le 78 — créneaux serrés, priorité chantier.",
                },
                {
                  icon: ShieldCheck,
                  text: "Tarification directe et transparente — pas de surprise, devis clair après validation.",
                },
                {
                  icon: CheckCircle2,
                  text: "Traçabilité garantie — conformité et documents fournis avec chaque rotation.",
                },
              ].map(({ icon: Icon, text }) => (
                <li
                  key={text}
                  className="flex gap-3 rounded-2xl border border-primary/8 bg-card/60 px-4 py-3 shadow-sm shadow-primary/5 backdrop-blur-sm"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-sm leading-snug text-foreground sm:text-[0.95rem]">
                    {text}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-8 max-w-xl text-sm text-muted-foreground">
              Vous commandez directement auprès de Core Environnement — une
              équipe terrain qui centralise planification, enlèvement et suivi
              de bout en bout.
            </p>
          </div>

          {/* Widget */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-2xl">
            <OrderWidget />
          </div>
        </section>
      </main>
    </div>
  )
}
