import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Clock01Icon,
  MapPinIcon,
  Timer01Icon,
} from "@hugeicons/core-free-icons";

const STROKE = 1.7;

const REASSURANCE = [
  { icon: Clock01Icon, label: "Intervention 24h" },
  { icon: Timer01Icon, label: "Commande en 3 min" },
  { icon: MapPinIcon, label: "Toute l’Île-de-France" },
];

export default function Hero({ onOrder }: { onOrder: () => void }) {
  return (
    <section
      id="accueil"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-forest-950"
    >
      {/* ── Photographies : cadrage dédié mobile / desktop ── */}
      <img
        src="/images/hero-paris-truck-mobile.jpg"
        alt="Camion de CORE ENVIRONNEMENT transportant une benne, avec Paris et la Tour Eiffel en arrière-plan."
        className="absolute inset-0 h-full w-full scale-105 animate-zoom object-cover object-center md:hidden"
        loading="eager"
        fetchPriority="high"
      />
      <img
        src="/images/hero-paris-truck-desktop.jpg"
        alt="Camion de CORE ENVIRONNEMENT transportant une benne, avec Paris et la Tour Eiffel en arrière-plan."
        className="absolute inset-0 hidden h-full w-full scale-105 animate-zoom object-cover object-[55%_center] md:block"
        loading="eager"
        fetchPriority="high"
      />

      {/* ── Overlays : uniquement la densité nécessaire à la lisibilité ── */}
      {/* Mobile */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,19,13,0.72)_0%,rgba(7,19,13,0.38)_42%,rgba(7,19,13,0.62)_72%,rgba(7,19,13,0.85)_100%)] md:hidden"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,19,13,0.55)_0%,rgba(7,19,13,0.12)_45%,rgba(7,19,13,0.28)_100%)] md:hidden"
      />
      {/* Desktop : texte à gauche, image préservée à droite */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(8,22,15,0.88)_0%,rgba(8,22,15,0.68)_34%,rgba(8,22,15,0.28)_62%,rgba(8,22,15,0.30)_100%)] md:block"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(8,20,14,0.55)_0%,rgba(8,20,14,0)_26%,rgba(8,20,14,0)_70%,rgba(8,20,14,0.45)_100%)] md:block"
      />

      {/* ── Contenu ── */}
      <div className="container-x relative z-10 pb-20 pt-28 sm:pb-28 lg:pb-32 lg:pt-40">
        <div className="max-w-[760px] lg:max-w-[640px] xl:max-w-[680px]">
          {/* Pastille de contexte */}
          <div className="animate-fade-up" style={{ animationDelay: "60ms" }}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.07] py-1.5 pl-3 pr-4 text-[11px] font-medium uppercase tracking-[0.14em] text-white/85 backdrop-blur-md">
              <span className="relative flex h-[7px] w-[7px]">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-forest-300 opacity-70" />
                <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-forest-300" />
              </span>
              Gestion des déchets · Île-de-France
            </span>
          </div>

          {/* H1 */}
          <h1
            className="animate-fade-up mt-6 text-[clamp(2.05rem,6.2vw,2.55rem)] font-bold leading-[1.08] tracking-[-0.032em] text-white sm:mt-7 sm:text-[clamp(2.4rem,4.8vw,3.75rem)] lg:leading-[1.06]"
            style={{ animationDelay: "140ms" }}
          >
            Location de Benne en{" "}
            <span className="whitespace-nowrap text-forest-300">Île-de-France</span>{" "}
            : Intervention 24h &amp; Suivi Digital
          </h1>

          {/* Sous-titre — largeur contrôlée */}
          <p
            className="animate-fade-up mt-5 max-w-[34rem] text-[15.5px] leading-[1.65] text-white/80 sm:mt-6 sm:text-[17px]"
            style={{ animationDelay: "220ms" }}
          >
            <strong className="font-semibold text-white">CORE ENVIRONNEMENT</strong> :
            Partenaire de vos chantiers. Traçabilité et suivi digital de la première
            dépose jusqu’au recyclage de vos déchets sur toute l’Île-de-France.
          </p>

          {/* CTA */}
          <div
            className="animate-fade-up mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: "300ms" }}
          >
            <button
              type="button"
              onClick={onOrder}
              className="btn btn-light group w-full sm:w-auto"
            >
              Commander une benne
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                strokeWidth={STROKE}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
            <a href="#services" className="btn btn-ghost-light w-full sm:w-auto">
              Découvrir nos services
            </a>
          </div>

          {/* Réassurance — secondaire */}
          <ul
            className="animate-fade-up mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-12"
            style={{ animationDelay: "380ms" }}
          >
            {REASSURANCE.map((item, i) => (
              <li key={item.label} className="flex items-center">
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mr-7 hidden h-3.5 w-px bg-white/20 sm:block"
                  />
                )}
                <HugeiconsIcon
                  icon={item.icon}
                  size={17}
                  strokeWidth={STROKE}
                  className="mr-2.5 text-forest-200"
                />
                <span className="text-[13.5px] font-medium tracking-[0.01em] text-white/80">
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Indicateur de défilement — desktop */}
      <div
        aria-hidden="true"
        className="animate-fade-in absolute bottom-8 left-1/2 hidden -translate-x-1/2 lg:block"
        style={{ animationDelay: "600ms" }}
      >
        <div className="relative h-11 w-px overflow-hidden bg-white/20">
          <span className="animate-scroll-line absolute left-0 top-0 h-5 w-px bg-white/90" />
        </div>
      </div>
    </section>
  );
}
