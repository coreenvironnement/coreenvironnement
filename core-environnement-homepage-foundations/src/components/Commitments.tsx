import { useEffect, useRef, useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AlarmClockCheckIcon,
  ArrowRight01Icon,
  DashboardSpeed01Icon,
  Pdf01Icon,
  Recycle03Icon,
  SecurityCheckIcon,
  Tick02Icon,
  WeightScale01Icon,
} from "@hugeicons/core-free-icons";
import { cn } from "../utils/cn";

type IconType = typeof Recycle03Icon;

const STROKE = 1.7;

/* Palette CORE ENVIRONNEMENT */
const NAVY = "#183574";
const ACCENT = "#35A238";
const GREEN_DEEP = "#19752B";
const BLUE = "#269DD2";
const TEXT = "#172033";
const TEXT_2 = "#667085";
const BORDER = "#E3E9E6";

const STEP_META = [
  { num: "01", verb: "Intervenir" },
  { num: "02", verb: "Suivre" },
  { num: "03", verb: "Tracer" },
  { num: "04", verb: "Valoriser" },
];

/* ── Hooks ─────────────────────────────────────────────── */

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

/** Révélation douce à l'entrée dans le viewport (une seule fois). */
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

/* ── Sous-composants ───────────────────────────────────── */

function StepNode({
  icon,
  active,
  passed,
}: {
  icon: IconType;
  active: boolean;
  passed: boolean;
}) {
  return (
    <span
      className={cn(
        "relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border bg-white transition-[border-color,color,box-shadow,transform] duration-500 ease-out sm:h-[52px] sm:w-[52px]",
        active
          ? "scale-[1.04] shadow-[0_8px_20px_-12px_rgba(24,53,116,0.35)]"
          : "scale-100",
      )}
      style={{
        borderColor: active ? ACCENT : passed ? "#cddcd2" : BORDER,
        color: active ? GREEN_DEEP : NAVY,
      }}
    >
      <HugeiconsIcon icon={icon} size={21} strokeWidth={STROKE} />
    </span>
  );
}

function MicroLabel({ num, verb }: { num: string; verb: string }) {
  return (
    <p className="flex items-center gap-2 font-sans text-[11.5px] font-medium uppercase tracking-[0.2em]">
      <span style={{ color: ACCENT }}>{num}</span>
      <span aria-hidden="true" className="h-px w-4" style={{ backgroundColor: "#cddcd2" }} />
      <span style={{ color: TEXT_2 }}>{verb}</span>
    </p>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <HugeiconsIcon
        icon={Tick02Icon}
        size={15}
        strokeWidth={1.8}
        className="mt-[3px] shrink-0"
        color={ACCENT}
      />
      <span className="text-[14px] leading-snug sm:text-[14.5px]" style={{ color: "#3f4a5c" }}>
        {children}
      </span>
    </li>
  );
}

function Step({
  index,
  active,
  reached,
  icon,
  title,
  children,
  reduced,
  last = false,
}: {
  index: number;
  active: boolean;
  reached: boolean;
  icon: IconType;
  title: string;
  children: React.ReactNode;
  reduced: boolean;
  last?: boolean;
}) {
  const { ref, shown } = useReveal<HTMLLIElement>(reduced);
  const meta = STEP_META[index];

  return (
    <li
      ref={ref}
      data-step={index}
      className={cn(
        "relative flex gap-4 sm:gap-6",
        last ? "pb-0" : "pb-12 sm:pb-14 lg:pb-20",
      )}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(16px)",
        transition: reduced
          ? "none"
          : "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {/* Rail : nœud + fil conducteur à remplissage progressif */}
      <div className="relative flex w-11 shrink-0 flex-col items-center sm:w-[52px]">
        <StepNode icon={icon} active={active} passed={shown} />
        {!last && (
          <span aria-hidden="true" className="relative mt-2 w-px flex-1">
            <span className="absolute inset-0" style={{ backgroundColor: BORDER }} />
            <span
              className="absolute inset-x-0 top-0"
              style={{
                height: reached ? "100%" : "0%",
                background: `linear-gradient(180deg, ${ACCENT} 0%, #b6d5c0 100%)`,
                transition: reduced
                  ? "none"
                  : "height 800ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </span>
        )}
      </div>

      {/* Contenu éditorial */}
      <div
        className={cn("min-w-0 flex-1 pt-1 transition-opacity duration-500")}
        style={{ opacity: reduced ? 1 : undefined }}
      >
        <div className={cn("lg:transition-opacity lg:duration-500", !active && "lg:opacity-[0.62]")}>
          <MicroLabel num={meta.num} verb={meta.verb} />
          <h3
            className="mt-3 font-display text-[21px] font-semibold leading-[1.24] tracking-[-0.025em] sm:text-[25px]"
            style={{ color: NAVY }}
          >
            {title}
          </h3>
          {children}
        </div>
      </div>
    </li>
  );
}

/* ── Section ───────────────────────────────────────────── */

export default function Commitments() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const intro = useReveal<HTMLDivElement>(reduced);

  /* Étape dominante = celle proche du centre du viewport */
  useEffect(() => {
    const nodes = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!nodes || nodes.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const idx = Number((visible[0].target as HTMLElement).dataset.step);
          if (!Number.isNaN(idx)) setActive(idx);
        }
      },
      { rootMargin: "-42% 0px -42% 0px", threshold: 0 },
    );

    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="engagements"
      className="relative scroll-mt-[72px] overflow-hidden py-20 sm:py-24 lg:py-[7.5rem]"
      style={{ backgroundColor: "#F3F7F5" }}
    >
      {/* Profondeur minimale : filets et voile très légers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${BORDER}, transparent)` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-white/70 to-transparent"
      />

      <div className="container-x relative">
        <div className="lg:grid lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-16 xl:gap-24">
          {/* ── Colonne gauche : introduction sticky ── */}
          <div className="lg:relative">
            <div
              ref={intro.ref}
              className="lg:sticky lg:top-[124px]"
              style={{
                opacity: intro.shown ? 1 : 0,
                transform: intro.shown ? "translateY(0)" : "translateY(14px)",
                transition: reduced
                  ? "none"
                  : "opacity 700ms cubic-bezier(0.22,1,0.36,1), transform 700ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <p className="inline-flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: ACCENT }}
                />
                <span
                  className="font-sans text-[11.5px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: ACCENT }}
                >
                  Nos engagements
                </span>
              </p>

              <h2
                className="mt-5 font-display text-[clamp(1.8rem,3.4vw,2.6rem)] font-bold leading-[1.14] tracking-[-0.032em]"
                style={{ color: NAVY }}
              >
                Bien plus qu’une benne.
                <span className="block">Un suivi de bout en bout.</span>
              </h2>

              <p
                className="mt-5 max-w-[30rem] text-[15.5px] leading-[1.7] sm:mt-6 sm:text-[16.5px]"
                style={{ color: TEXT_2 }}
              >
                De la première dépose jusqu’au recyclage final, CORE ENVIRONNEMENT
                coordonne chaque étape pour vous offrir une gestion des déchets simple,
                transparente et conforme.
              </p>

              {/* Micro-signature */}
              <p
                className="mt-7 inline-flex items-center gap-2.5 rounded-full border bg-white/70 py-2 pl-3.5 pr-4 font-display text-[13px] font-semibold tracking-[-0.01em]"
                style={{ borderColor: BORDER, color: TEXT }}
              >
                <HugeiconsIcon
                  icon={Tick02Icon}
                  size={15}
                  strokeWidth={1.8}
                  color={ACCENT}
                />
                Un seul interlocuteur. Un suivi complet.
              </p>

              {/* Indicateur vertical de progression — desktop */}
              <div className="mt-11 hidden lg:block" aria-hidden="true">
                <div className="relative pl-7">
                  {/* Rail de base */}
                  <span
                    className="absolute left-[3px] top-[9px] bottom-[9px] w-px"
                    style={{ backgroundColor: "#dbe4df" }}
                  />
                  {/* Remplissage progressif */}
                  <span
                    className="absolute left-[3px] top-[9px] w-px"
                    style={{
                      height: `${(active / (STEP_META.length - 1)) * 100}%`,
                      background: `linear-gradient(180deg, ${ACCENT} 0%, #b6d5c0 100%)`,
                      transition: reduced
                        ? "none"
                        : "height 700ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                  <ol>
                    {STEP_META.map((s, i) => {
                      const isActive = active === i;
                      const isPassed = active > i;
                      return (
                        <li key={s.num} className="relative py-[9px]">
                          <span
                            className="absolute -left-7 top-1/2 h-[7px] w-[7px] -translate-y-1/2 rounded-full border transition-colors duration-500"
                            style={{
                              borderColor: isActive || isPassed ? ACCENT : "#cddcd2",
                              backgroundColor: isActive
                                ? ACCENT
                                : isPassed
                                  ? "#e6f3ea"
                                  : "#ffffff",
                            }}
                          />
                          <span
                            className="font-sans text-[11.5px] font-medium uppercase tracking-[0.18em] transition-colors duration-500"
                            style={{
                              color: isActive ? GREEN_DEEP : isPassed ? "#8b9a93" : "#aab5ae",
                            }}
                          >
                            {s.num} — {s.verb}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
            </div>
          </div>

          {/* ── Colonne droite : les 4 engagements ── */}
          <ol ref={listRef} className="mt-14 lg:mt-1.5">
            {/* 01 — INTERVENIR */}
            <Step
              index={0}
              active={active === 0}
              reached={active >= 1}
              icon={AlarmClockCheckIcon}
              title="Réactivité & intervention en 24h"
              reduced={reduced}
            >
              <p
                className="mt-3.5 max-w-[36rem] text-[14.5px] leading-[1.7] sm:text-[15.5px]"
                style={{ color: TEXT_2 }}
              >
                Une rotation à planifier ou une benne pleine à évacuer en urgence ?
                Notre service logistique assure une intervention rapide sur vos
                chantiers en Île-de-France.
              </p>

              {/* Séquence commande → intervention */}
              <div
                className="mt-6 flex flex-col gap-3 rounded-[18px] border bg-white p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
                style={{ borderColor: BORDER }}
              >
                <div className="min-w-0 flex-1">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.16em]"
                    style={{ color: "#9aa5a0" }}
                  >
                    Vous commandez
                  </p>
                  <p
                    className="mt-1.5 font-display text-[15.5px] font-semibold tracking-[-0.015em]"
                    style={{ color: TEXT }}
                  >
                    Commande avant midi
                  </p>
                </div>

                <span
                  aria-hidden="true"
                  className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full sm:inline-flex"
                  style={{ backgroundColor: "#eef6f1", color: GREEN_DEEP }}
                >
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={STROKE} />
                </span>
                <span
                  aria-hidden="true"
                  className="h-px w-full sm:hidden"
                  style={{ backgroundColor: BORDER }}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className="text-[11px] font-medium uppercase tracking-[0.16em]"
                    style={{ color: "#9aa5a0" }}
                  >
                    Nous intervenons
                  </p>
                  <p className="mt-1.5 flex items-baseline gap-2">
                    <span
                      className="font-display text-[19px] font-bold leading-none tracking-[-0.03em]"
                      style={{ color: ACCENT }}
                    >
                      24h
                    </span>
                    <span
                      className="font-display text-[15px] font-semibold tracking-[-0.015em]"
                      style={{ color: TEXT }}
                    >
                      dès le lendemain*
                    </span>
                  </p>
                </div>
              </div>

              <p className="mt-2.5 text-[12px] leading-relaxed" style={{ color: "#9aa5a0" }}>
                *Hors week-ends et jours fériés, selon disponibilités.
              </p>
            </Step>

            {/* 02 — SUIVRE */}
            <Step
              index={1}
              active={active === 1}
              reached={active >= 2}
              icon={DashboardSpeed01Icon}
              title="Transparence & suivi digital"
              reduced={reduced}
            >
              <p
                className="mt-3.5 max-w-[36rem] text-[14.5px] leading-[1.7] sm:text-[15.5px]"
                style={{ color: TEXT_2 }}
              >
                Fini les appels inutiles pour connaître l’avancée de vos collectes.
                Depuis votre espace client, suivez vos prestations et retrouvez vos
                documents 24h/24.
              </p>

              <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <Bullet>Suivi de l’avancée des prestations</Bullet>
                <Bullet>Bons d’intervention</Bullet>
                <Bullet>Bons de pesée</Bullet>
                <Bullet>Accès 24h/24</Bullet>
              </ul>

              {/* Mini-interface abstraite — simple preuve visuelle */}
              <div
                className="mt-6 overflow-hidden rounded-[18px] border bg-white"
                style={{ borderColor: BORDER }}
                aria-hidden="true"
              >
                <div
                  className="flex items-center gap-2 border-b px-4 py-2.5"
                  style={{ borderColor: BORDER, backgroundColor: "#FAFBFA" }}
                >
                  <span className="flex gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#dfe5e1" }} />
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#dfe5e1" }} />
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#dfe5e1" }} />
                  </span>
                  <span
                    className="ml-1 font-sans text-[10.5px] font-medium uppercase tracking-[0.16em]"
                    style={{ color: "#9aa5a0" }}
                  >
                    Espace client
                  </span>
                </div>

                <div className="divide-y" style={{ borderColor: BORDER }}>
                  <MiniRow
                    label="Statut"
                    value="Intervention programmée"
                    trailing={
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-display text-[11px] font-semibold"
                        style={{ backgroundColor: "rgba(38,157,210,0.08)", color: "#1a7aa8" }}
                      >
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: BLUE }} />
                        En cours
                      </span>
                    }
                  />
                  <MiniRow
                    label="Document"
                    value="Bon de pesée.pdf"
                    icon={Pdf01Icon}
                    trailing={
                      <HugeiconsIcon
                        icon={WeightScale01Icon}
                        size={16}
                        strokeWidth={STROKE}
                        color="#9aa5a0"
                      />
                    }
                  />
                  <MiniRow
                    label="Suivi"
                    value="Disponible"
                    trailing={
                      <span
                        className="inline-flex items-center gap-1.5 font-display text-[11.5px] font-semibold"
                        style={{ color: GREEN_DEEP }}
                      >
                        <HugeiconsIcon icon={Tick02Icon} size={14} strokeWidth={1.8} />
                        24h/24
                      </span>
                    }
                  />
                </div>
              </div>
            </Step>

            {/* 03 — TRACER */}
            <Step
              index={2}
              active={active === 2}
              reached={active >= 3}
              icon={SecurityCheckIcon}
              title="Conformité & traçabilité"
              reduced={reduced}
            >
              <p
                className="mt-3.5 max-w-[36rem] text-[14.5px] leading-[1.7] sm:text-[15.5px]"
                style={{ color: TEXT_2 }}
              >
                La gestion administrative des déchets peut être lourde. CORE
                ENVIRONNEMENT simplifie vos démarches et édite vos Bordereaux de Suivi
                de Déchets (BSD) à la demande.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-2.5 min-[520px]:grid-cols-3">
                <Pillar value="BSD" label="Édités à la demande" strong />
                <Pillar value="Traçabilité" label="Sur toute la chaîne" />
                <Pillar value="Documents" label="Réglementaires" />
              </div>

              <p
                className="mt-5 flex items-start gap-2.5 rounded-[14px] border px-4 py-3.5 text-[13.5px] leading-relaxed"
                style={{ borderColor: BORDER, backgroundColor: "#FAFBFA", color: "#3f4a5c" }}
              >
                <HugeiconsIcon
                  icon={SecurityCheckIcon}
                  size={16}
                  strokeWidth={STROKE}
                  className="mt-[2px] shrink-0"
                  color={NAVY}
                />
                Vos justificatifs sont centralisés pour faciliter le suivi de vos
                obligations.
              </p>
            </Step>

            {/* 04 — VALORISER */}
            <Step
              index={3}
              active={active === 3}
              reached={active === 3}
              icon={Recycle03Icon}
              title="+90 % de valorisation & recyclage"
              reduced={reduced}
              last
            >
              <div
                className="mt-5 overflow-hidden rounded-[20px] border"
                style={{
                  borderColor: "#d4e4d8",
                  background: "linear-gradient(135deg, #ffffff 0%, #f0f7f2 100%)",
                }}
              >
                <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:gap-7 sm:p-7">
                  <div className="shrink-0">
                    <p
                      className="flex items-start font-display font-bold leading-[0.88] tracking-[-0.05em]"
                      style={{ color: GREEN_DEEP }}
                    >
                      <span className="text-[1.5rem] leading-none sm:text-[1.7rem]">+</span>
                      <span className="text-[3.1rem] sm:text-[3.75rem]">90</span>
                      <span className="ml-1 mt-1 text-[1.5rem] leading-none sm:text-[1.7rem]">
                        %
                      </span>
                    </p>
                    <p
                      className="mt-2 font-sans text-[11.5px] font-medium uppercase tracking-[0.18em]"
                      style={{ color: ACCENT }}
                    >
                      Valorisation
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="hidden w-px self-stretch sm:block"
                    style={{ backgroundColor: "#d4e4d8" }}
                  />

                  <p
                    className="text-[14.5px] leading-[1.7] sm:text-[15px]"
                    style={{ color: "#3f4a5c" }}
                  >
                    Nous nous engageons à rediriger plus de 90 % des déchets collectés
                    vers des filières de tri et de valorisation agréées en
                    Île-de-France.
                  </p>
                </div>

                <div
                  className="flex flex-wrap items-center gap-x-3 gap-y-2 border-t px-5 py-3.5 sm:px-7"
                  style={{ borderColor: "#d4e4d8", backgroundColor: "rgba(255,255,255,0.6)" }}
                >
                  {["Gravats", "Bois", "Métaux", "DIB"].map((m, i) => (
                    <span key={m} className="flex items-center gap-3">
                      {i > 0 && (
                        <span
                          aria-hidden="true"
                          className="h-1 w-1 rounded-full"
                          style={{ backgroundColor: "#b9cfc0" }}
                        />
                      )}
                      <span
                        className="font-display text-[13px] font-semibold tracking-[-0.01em]"
                        style={{ color: NAVY }}
                      >
                        {m}
                      </span>
                    </span>
                  ))}
                </div>
              </div>

              <p
                className="mt-5 max-w-[34rem] text-[14.5px] leading-[1.7] sm:text-[15px]"
                style={{ color: TEXT_2 }}
              >
                Transformer les déchets en ressources et réduire l’empreinte
                environnementale des chantiers.
              </p>
            </Step>
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ── Éléments internes ─────────────────────────────────── */

function MiniRow({
  label,
  value,
  icon,
  trailing,
}: {
  label: string;
  value: string;
  icon?: IconType;
  trailing?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        {icon && (
          <HugeiconsIcon
            icon={icon}
            size={17}
            strokeWidth={STROKE}
            className="shrink-0"
            color={NAVY}
          />
        )}
        <div className="min-w-0">
          <p
            className="font-sans text-[10.5px] font-medium uppercase tracking-[0.16em]"
            style={{ color: "#9aa5a0" }}
          >
            {label}
          </p>
          <p
            className="mt-0.5 truncate font-display text-[13.5px] font-semibold tracking-[-0.01em]"
            style={{ color: TEXT }}
          >
            {value}
          </p>
        </div>
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </div>
  );
}

function Pillar({
  value,
  label,
  strong = false,
}: {
  value: string;
  label: string;
  strong?: boolean;
}) {
  return (
    <div
      className="rounded-[14px] border px-4 py-3.5"
      style={{
        borderColor: strong ? "#cddcd2" : BORDER,
        backgroundColor: strong ? "#f5faf7" : "#FAFBFA",
      }}
    >
      <p
        className="font-display text-[15px] font-bold tracking-[-0.02em]"
        style={{ color: strong ? GREEN_DEEP : NAVY }}
      >
        {value}
      </p>
      <p className="mt-1 text-[12.5px] leading-snug" style={{ color: TEXT_2 }}>
        {label}
      </p>
    </div>
  );
}

