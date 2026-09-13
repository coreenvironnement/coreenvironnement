import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  Recycle03Icon,
  Tick02Icon,
  TruckIcon,
} from "@hugeicons/core-free-icons";
import { cn } from "../utils/cn";

const NAVY = "#183574";
const GREEN = "#35A238";

const REASSURANCE = [
  "Intervention sous 24h*",
  "Suivi digital",
  "Traçabilité",
  "Toute l’Île-de-France",
];

const JOURNEY = ["Commande", "Livraison", "Collecte", "Valorisation"];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

function useReveal<T extends HTMLElement>(reduced: boolean) {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return { ref, shown };
}

export default function FinalCta({ onOrder }: { onOrder: () => void }) {
  const reduced = usePrefersReducedMotion();
  const { ref, shown } = useReveal<HTMLDivElement>(reduced);

  return (
    <section
      id="commander"
      aria-labelledby="final-cta-title"
      className="relative scroll-mt-[72px] overflow-hidden py-20 sm:py-24 lg:py-[7.5rem]"
      style={{ backgroundColor: NAVY }}
    >
      {/* Texture logistique : lignes horizontales très discrètes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 72px)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(75% 60% at 50% 0%, rgba(255,255,255,0.055) 0%, transparent 62%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
        }}
      />

      {/* Icône benne en filigrane, purement décorative */}
      <HugeiconsIcon
        icon={TruckIcon}
        size={420}
        strokeWidth={0.6}
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-[-6rem] text-white opacity-[0.045] lg:-right-16"
      />

      <div className="container-x relative">
        <div
          ref={ref}
          className="mx-auto flex max-w-[46rem] flex-col items-center text-center"
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "translateY(0)" : "translateY(18px)",
            transition: reduced
              ? "none"
              : "opacity 750ms cubic-bezier(0.22,1,0.36,1), transform 750ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <p className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: GREEN }}
            />
            <span className="font-sans text-[11.5px] font-medium uppercase tracking-[0.22em] text-white/70">
              Votre chantier, notre priorité
            </span>
          </p>

          <h2
            id="final-cta-title"
            className="mt-5 font-display text-[clamp(1.95rem,4.2vw,3rem)] font-bold leading-[1.11] tracking-[-0.034em] text-white"
          >
            Besoin d’une benne
            <span className="block">en Île-de-France ?</span>
          </h2>

          <p
            className="mt-5 max-w-[33rem] text-[15.5px] leading-[1.7] sm:mt-6 sm:text-[16.5px]"
            style={{ color: "rgba(255,255,255,0.68)" }}
          >
            Commandez votre benne en quelques minutes et laissez CORE ENVIRONNEMENT
            coordonner la suite, de la dépose jusqu’au traitement de vos déchets.
          </p>

          {/* CTA */}
          <div className="mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={onOrder}
              className="btn btn-accent group w-full px-7 sm:w-auto"
            >
              Commander une benne
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={18}
                strokeWidth={1.7}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </button>
            <a
              href="#contact"
              className="btn w-full border text-white transition-colors duration-300 hover:bg-white/[0.07] sm:w-auto"
              style={{ borderColor: "rgba(255,255,255,0.22)" }}
            >
              Nous contacter
            </a>
          </div>

          {/* Réassurance */}
          <ul className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5">
            {REASSURANCE.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={14}
                  strokeWidth={1.8}
                  className="shrink-0"
                  color={GREEN}
                />
                <span className="font-sans text-[13px] font-medium text-white/75">
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 font-sans text-[11.5px] text-white/55">
            *Selon disponibilités, hors week-ends et jours fériés.
          </p>

          {/* Parcours — fil conducteur discret */}
          <div
            aria-hidden="true"
            className="mt-12 w-full max-w-[34rem] pt-10"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            <ol className="flex items-center justify-between">
              {JOURNEY.map((step, i) => (
                <li
                  key={step}
                  className="relative flex flex-1 flex-col items-center"
                  style={{
                    opacity: shown ? 1 : 0,
                    transform: shown ? "translateY(0)" : "translateY(6px)",
                    transition: reduced
                      ? "none"
                      : `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${i * 90}ms`,
                  }}
                >
                  {i > 0 && (
                    <span
                      className="absolute right-1/2 top-[7px] hidden h-px w-full sm:block"
                      style={{
                        background:
                          i === JOURNEY.length - 1
                            ? "linear-gradient(90deg, rgba(53,162,56,0.5), rgba(53,162,56,0.9))"
                            : "rgba(255,255,255,0.16)",
                      }}
                    />
                  )}
                  <span
                    className={cn(
                      "relative z-10 h-3.5 w-3.5 rounded-full border-[1.5px] bg-[#183574]",
                    )}
                    style={{
                      borderColor: i === JOURNEY.length - 1 ? GREEN : "rgba(255,255,255,0.28)",
                      backgroundColor: i === JOURNEY.length - 1 ? GREEN : NAVY,
                    }}
                  />
                  <span className="mt-2.5 font-display text-[11.5px] font-medium tracking-[0.02em] text-white/60 sm:text-[12.5px]">
                    {step}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex items-center justify-center gap-1.5 font-sans text-[11px] text-white/50">
              <HugeiconsIcon
                icon={Recycle03Icon}
                size={13}
                strokeWidth={1.8}
                color="rgba(255,255,255,0.4)"
              />
              De la commande à la valorisation, un seul interlocuteur.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
